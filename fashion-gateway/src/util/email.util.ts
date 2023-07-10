import nodemailer from "nodemailer";
import jade from "jade";
import fs from "fs";
import { conf } from "src/config";

export async function sendMail(params) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: conf.EMAIL_ACCOUNT, // generated ethereal user
      pass: conf.EMAIL_PWD, // generated ethereal password
    },
  });

  const emailTemplate = jade.compile(fs.readFileSync(params.template, "utf8"));

  const mailOptions = {
    from: conf.EMAIL_ACCOUNT,
    to: params.username,
    subject: params.subject,
    html: emailTemplate(params.objects),
  };

  await transporter.sendMail(mailOptions).then((err, res) => {
    //TODO handle error
  });
}
