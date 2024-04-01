import { createServerClient } from "@supabase/ssr";
import crypto from "crypto";
import { cookies } from "next/headers";
import { authenticator } from "otplib";
import qrcode from "qrcode";

import { prisma } from "@typeflowai/database";

import { ENCRYPTION_KEY } from "../constants";
import { symmetricDecrypt, symmetricEncrypt } from "../crypto";
import { totpAuthenticatorCheck } from "../totp";
import { userCache } from "../user/cache";

export const setupTwoFactorAuth = async (
  userId: string,
  password: string
): Promise<{
  secret: string;
  keyUri: string;
  dataUri: string;
  backupCodes: string[];
}> => {
  // This generates a secret 32 characters in length. Do not modify the number of
  // bytes without updating the sanity checks in the enable and login endpoints.
  const secret = authenticator.generateSecret(20);

  // generate backup codes with 10 character length
  const backupCodes = Array.from(Array(10), () => crypto.randomBytes(5).toString("hex"));

  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user: supabaseUser },
  } = await supabaseServerClient.auth.getUser();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!supabaseUser || !user) {
    throw new Error("User not found");
  }

  if (user.identityProvider !== "email") {
    throw new Error("Third party login is already enabled");
  }

  const { data: isValidOldPassword, error: passwordError } = await supabaseServerClient.rpc(
    "verify_user_password",
    { password: password }
  );

  if (passwordError || !isValidOldPassword) {
    throw passwordError;
  }

  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key not found");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      backupCodes: symmetricEncrypt(JSON.stringify(backupCodes), ENCRYPTION_KEY),
      twoFactorEnabled: false,
      twoFactorSecret: symmetricEncrypt(secret, ENCRYPTION_KEY),
    },
  });

  const name = user.email || user.name || user.id.toString();
  const keyUri = authenticator.keyuri(name, "TypeflowAI", secret);
  const dataUri = await qrcode.toDataURL(keyUri);

  return { secret, keyUri, dataUri, backupCodes };
};

export const enableTwoFactorAuth = async (id: string, code: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.identityProvider !== "email") {
    throw new Error("Third party login is already enabled");
  }

  if (user.twoFactorEnabled) {
    throw new Error("Two factor authentication is already enabled");
  }

  if (!user.twoFactorSecret) {
    throw new Error("Two factor setup has not been completed");
  }

  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key not found");
  }

  const secret = symmetricDecrypt(user.twoFactorSecret, ENCRYPTION_KEY);
  if (secret.length !== 32) {
    throw new Error("Invalid secret");
  }

  const isValidCode = totpAuthenticatorCheck(code, secret);
  if (!isValidCode) {
    throw new Error("Invalid code");
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      twoFactorEnabled: true,
    },
  });

  userCache.revalidate({
    id,
  });

  return {
    message: "Two factor authentication enabled",
  };
};

type TDisableTwoFactorAuthParams = {
  code: string;
  password: string;
  backupCode?: string;
};

export const disableTwoFactorAuth = async (id: string, params: TDisableTwoFactorAuthParams) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.twoFactorEnabled) {
    throw new Error("Two factor authentication is not enabled");
  }

  if (user.identityProvider !== "email") {
    throw new Error("Third party login is already enabled");
  }

  const { code, password, backupCode } = params;

  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user: supabaseUser },
  } = await supabaseServerClient.auth.getUser();

  if (!supabaseUser || !user) {
    throw new Error("User not found");
  }

  const { data: isValidOldPassword, error: passwordError } = await supabaseServerClient.rpc(
    "verify_user_password",
    { password: password }
  );

  if (passwordError || !isValidOldPassword) {
    throw new Error("Incorrect password");
  }

  // if user has 2fa and using backup code
  if (user.twoFactorEnabled && backupCode) {
    if (!ENCRYPTION_KEY) {
      throw new Error("Encryption key not found");
    }

    if (!user.backupCodes) {
      throw new Error("Missing backup codes");
    }

    const backupCodes = JSON.parse(symmetricDecrypt(user.backupCodes, ENCRYPTION_KEY));

    // check if user-supplied code matches one
    const index = backupCodes.indexOf(backupCode.replaceAll("-", ""));
    if (index === -1) {
      throw new Error("Incorrect backup code");
    }

    // we delete all stored backup codes at the end, no need to do this here

    // if user has 2fa and NOT using backup code, try totp
  } else if (user.twoFactorEnabled) {
    if (!code) {
      throw new Error("Second factor required");
    }

    if (!user.twoFactorSecret) {
      throw new Error("Two factor setup has not been completed");
    }

    if (!ENCRYPTION_KEY) {
      throw new Error("Encryption key not found");
    }

    const secret = symmetricDecrypt(user.twoFactorSecret, ENCRYPTION_KEY);
    if (secret.length !== 32) {
      throw new Error("Invalid secret");
    }

    const isValidCode = totpAuthenticatorCheck(code, secret);
    if (!isValidCode) {
      throw new Error("Invalid code");
    }
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      backupCodes: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  userCache.revalidate({
    id,
  });

  return {
    message: "Two factor authentication disabled",
  };
};
