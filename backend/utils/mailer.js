const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (userEmail, bookingDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Booking Confirmation',
        text: `Thank you for your booking!\n\nHere are your booking details:\n${JSON.stringify(bookingDetails, null, 2)}\n\nWe hope you have a great experience!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

module.exports = sendConfirmationEmail;