const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email provider
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password',  // Replace with your email password or an app-specific password
        },
    });

    let info = await transporter.sendMail({
        from: '"Event Management" <your-email@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
}

module.exports = { sendEmail };
