const nodemailer = require('nodemailer');

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const sendConfirmationEmail = async (userEmail, bookingDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Extract details for clarity
    const { transportation, hotels } = bookingDetails;

    let transportHtml = '';
    if (transportation) {
        transportHtml = `
        <h3>Transportation Details</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <th>Mode</th>
                <th>From</th>
                <th>To</th>
                <th>Start Date</th>
                <th>End Date</th>
            </tr>
            <tr>
                <td>${escapeHtml(transportation.mode_of_transportation)}</td>
                <td>${escapeHtml(transportation.start_point)}</td>
                <td>${escapeHtml(transportation.end_point)}</td>
                <td>${transportation.start_date ? escapeHtml(new Date(transportation.start_date).toLocaleDateString()) : ''}</td>
                <td>${transportation.end_date ? escapeHtml(new Date(transportation.end_date).toLocaleDateString()) : ''}</td>
            </tr>
        </table>
        `;
    }

    // Format hotel info if present
    let hotelHtml = '';
    if (hotels && hotels.length > 0) {
        hotelHtml = `
        <h3>Hotel Details</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Location</th>
            </tr>
            ${hotels.map(hotel => `
                <tr>
                    <td>${escapeHtml(hotel.type_of_hotel)}</td>
                    <td>${escapeHtml(hotel.start_date)}</td>
                    <td>${escapeHtml(hotel.end_date)}</td>
                    <td>${escapeHtml(hotel.location)}</td>
                </tr>
            `).join('')}
        </table>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Your TripThreads Booking Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; color: #222;">
                <h2 style="color:rgb(0, 0, 0);">Thank you for booking with TripThreads!</h2>
                <p>Dear Traveler,</p>
                <p>Your booking has been confirmed. Here are your booking details:</p>
                ${transportHtml}
                ${hotelHtml}
                <p style="margin-top:2rem;">We hope you have a wonderful journey!</p>
                <p>Best regards,<br/>TripThreads Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

module.exports = {
    sendConfirmationEmail
};