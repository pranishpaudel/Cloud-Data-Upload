import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  otp,
}) => (
  <div>
    <h1>OTP for pshow signup</h1>
    <div>
      <p>
        Hi {firstName},<br />
        <br />
        Your OTP for pshow signup is {otp}. <br />
        <br />
        Thanks,
        <br />
        Pranish
      </p>
    </div>
  </div>
);
