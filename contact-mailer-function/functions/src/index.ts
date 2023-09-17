import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as cors from "cors";

// eslint-disable-next-line object-curly-spacing
const corsHandler = cors({ origin: true });

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAILUSER,
    pass: process.env.GMAILPASSWORD,
  },
});

exports.sendNodeMail = functions.https.onRequest(
  (req: functions.Request, res: functions.Response) => {
    corsHandler(req, res, () => {
      const body = req.body;
      const toHostMailData = {
        from: body.email,
        to: "jin.watanabe.6g@gmail.com",
        subject: `【お問い合わせ】${body.name}様からのお問い合わせ`,
        text: `${body.message}`,
        html: `
      <p>お問い合わせ内容</p>
      <p>お名前：${body.name}</p>
      <p>メールアドレス：${body.email}</p>
      <p>お問い合わせ内容：${body.content}</p>
      `,
      };

      return transporter.sendMail(toHostMailData, (error, info) => {
        if (error) {
          console.log(error);
          res.send("error");
        } else {
          console.log("Message sent: " + info.response);
          res.send("success");
        }
      });
    });
  }
);
