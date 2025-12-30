import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('EMAIL_USER and EMAIL_PASS are not set. Email sending will fail until they are configured.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password recommended
  },
});

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Missing "to" field' });
    }

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    const info = await transporter.sendMail({
      from,
      to,
      subject: subject || 'Task Notification',
      html: html || '',
    });

    res.json({ ok: true, info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ ok: false, error: String(error) });
  }
});

app.listen(PORT, () => console.log(`Email server listening on http://localhost:${PORT}`));
