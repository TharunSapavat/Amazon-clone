const { Resend } = require('resend');

const sendOrderConfirmation = async (toEmail, orderData) => {
    // 1. Initialize Resend with API Key
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY is missing in .env. Email will not be sent.');
        return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 2. Format the order details for the email
    const itemsHtml = orderData.items.map(item => `
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br/>
            Quantity: ${item.quantity} | Price: ₹${item.price_at_purchase.toLocaleString('en-IN')}
        </div>
    `).join('');

    // 3. Send the email via Resend API
    try {
        const { data, error } = await resend.emails.send({
            from: 'Amazon Clone <noreply@amazon.tharun06.dev>', // Default sender for unverified domains
            to: [toEmail],
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
        });

        if (error) {
            console.error('❌ Resend Error:', error);
            return false;
        }

        console.log('✅ Email sent via Resend: ' + data.id);
        return true;
    } catch (error) {
        console.error('❌ Critical Error sending email info:', error);
        return false;
    }
};

module.exports = { sendOrderConfirmation };
