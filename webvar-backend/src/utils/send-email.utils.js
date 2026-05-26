import nodemailer from "nodemailer"
const webvarSendMail = async ({
    to = "",
    subject = "no-reply",
    message = "<h1>Hello World</h1>"
}) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // no need for host/port when using 'service'
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: `"WebVar" <${process.env.EMAIL}>`,
            to,
            subject,
            html: message
        }

        const info = await transporter.sendMail(mailOptions)

        return info.accepted.length > 0
    } catch (error) {
        console.error("Error sending email:", error)
        return false
    }
}

export default webvarSendMail