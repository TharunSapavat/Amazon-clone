const nodemailer = require('nodemailer');

const sendOrderConfirmation = async (toEmail, orderData) => {
    // 1. Create a transporter using environment variables
    // Debug check
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP_USER or SMTP_PASS is missing in .env');
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // 2. Format the order details for the email
    const itemsHtml = orderData.items.map(item => `
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br/>
            Quantity: ${item.quantity} | Price: ₹${item.price_at_purchase.toLocaleString('en-IN')}
        </div>
    `).join('');

    const mailOptions = {
        from: `"Amazon Clone" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Order Confirmation - ${orderData.internal_order_id}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #232f3e;">Thank you for your order!</h2>
                <p>Hi ${orderData.shipping_name},</p>
                <p>Your order has been placed successfully. Here are the details:</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; margin-bottom: 20px;">
                    <strong>Order ID:</strong> ${orderData.internal_order_id}<br/>
                    <strong>Total Amount:</strong> ₹${orderData.total_amount.toLocaleString('en-IN')}<br/>
                    <strong>Shipping to:</strong> ${orderData.shipping_address}
                </div>

                <h3>Order Summary</h3>
                ${itemsHtml}

                <p style="font-size: 12px; color: #777; margin-top: 30px;">
                    This is an automated email from your Amazon Clone project.
                </p>
            </div>
        `
    };

    // 3. Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ' + info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

module.exports = { sendOrderConfirmation };
