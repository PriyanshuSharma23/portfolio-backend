const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ hello: "World" });
});

app.post("/contact", (req, res) => {
  if (
    req.body.name == null ||
    req.body.email == null ||
    req.body.message == null
  ) {
    res.status(400).json({
      error: "fill all details",
    });
    return;
  }

  let EMAIL = process.env.EMAIL;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  let email1 = transporter.sendMail({
    from: EMAIL,
    to: EMAIL,
    subject: "Contact Form",
    html: `
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `,
  });

  let email2 = transporter.sendMail({
    from: EMAIL,
    to: req.body.email,
    subject: "Contact Form",
    html: `
      <h3>Thank you for contacting me</h3>
      <p>I will get back to you soon</p>
    `,
  });

  Promise.all([email1, email2])
    .then(() => {
      console.log(`Email Sent!!`);
      res.json({ msg: "Emails sent" });
    })
    .catch((err) => {
      console.error(err);
      res.json({ msg: "Emails not sent" });
    });
});

const PORT = 5173;
app.listen(PORT, () => {
  console.log(`Server live at ${PORT}`);
});
