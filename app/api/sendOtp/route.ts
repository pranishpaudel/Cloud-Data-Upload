import { EmailTemplate } from "@/components/email-template";
import prisma from "@/lib/db/db.config";
import { generateOTP } from "@/lib/otpGen";
import { NextResponse, NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { email } = await reqBody;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exists" },
        { status: 401 }
      );
    }
    if (user.isVerified) {
      return NextResponse.json(
        { message: "User is already verified" },
        { status: 401 }
      );
    }
    var fullName = user.name || "User";
    if (user) {
      fullName = user?.name;
    }
    const otp = generateOTP();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 2);
    const updatedOtp = await prisma.user.update({
      where: {
        email,
      },
      data: {
        otp: otp,
        otpExpires: expiryTime,
      },
    });

    const emailHtml = renderToStaticMarkup(
      EmailTemplate({ firstName: fullName, otp: otp })
    );

    const { data, error } = await resend.emails.send({
      from: "PShow <noreply@pranishpdl.ai>",
      to: ["pranishisop@gmail.com"],
      subject: "Otp verification",
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Otp sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
