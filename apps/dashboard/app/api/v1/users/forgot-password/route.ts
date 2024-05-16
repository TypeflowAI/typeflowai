import { prisma } from "@typeflowai/database";
import { sendForgotPasswordEmail } from "@typeflowai/email";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!foundUser) {
      return Response.json({ error: "No user with this email found" }, { status: 409 });
    }

    await sendForgotPasswordEmail(foundUser);
    return Response.json({});
  } catch (e) {
    return Response.json(
      {
        error: e.message,
        errorCode: e.code,
      },
      { status: 500 }
    );
  }
}
