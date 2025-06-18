import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (receiver, subject, content) => {
    const mailOption = {
        from: process.env.EMAIL_USER,
        to: receiver,
        subject: subject,
        text: content
    }

    const result = await transporter.sendMail(mailOption);
}

export default sendEmail;