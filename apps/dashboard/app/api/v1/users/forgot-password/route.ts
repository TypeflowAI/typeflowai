import { NextResponse } from "next/server";

import { prisma } from "@typeflowai/database";
import { sendForgotPasswordEmail } from "@typeflowai/lib/emails/emails";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!foundUser) {
      return NextResponse.json({ error: "No user with this email found" }, { status: 409 });
    }

    await sendForgotPasswordEmail(foundUser);
    return NextResponse.json({});
  } catch (e) {
    return NextResponse.json(
      {
        error: e.message,
        errorCode: e.code,
      },
      { status: 500 }
    );
  }
}
