const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        })
async function sendmail(to,meetingTitle,startTime) {   
        await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: `Reminder: ${meetingTitle} starts in 30 minutes`,
        html: `<h2>Your meeting "${meetingTitle}" starts at ${startTime}</h2>`
        })
}

module.exports={sendmail};
