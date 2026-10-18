import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rmnrr333@gmail.com';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'NOVA MARKET <onboarding@resend.dev>';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  providerConfigured: boolean;
}

export async function sendInquiryNotificationToAdmin({
  inquiryId,
  name,
  email,
  category,
  subject,
  orderNumber,
  message,
}: {
  inquiryId: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  orderNumber?: string | null;
  message: string;
}): Promise<SendEmailResult> {
  if (!resend) {
    return {
      success: false,
      error: 'RESEND_API_KEY is not configured in environment variables.',
      providerConfigured: false,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `[NOVA MARKET INQUIRY #${inquiryId.slice(-6)}] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h2 style="color: #09090b; font-size: 20px; margin-bottom: 16px;">New Customer Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #71717a; width: 140px;">Inquiry ID:</td><td style="color: #09090b; font-weight: 600;">${inquiryId}</td></tr>
            <tr><td style="padding: 8px 0; color: #71717a;">Client Name:</td><td style="color: #09090b;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #71717a;">Client Email:</td><td style="color: #09090b;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #71717a;">Category:</td><td style="color: #09090b;">${category}</td></tr>
            ${orderNumber ? `<tr><td style="padding: 8px 0; color: #71717a;">Order Number:</td><td style="color: #09090b;">${orderNumber}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #71717a;">Subject:</td><td style="color: #09090b;">${subject}</td></tr>
          </table>
          <div style="background-color: #f4f4f5; padding: 16px; border-radius: 6px; font-size: 14px; color: #18181b; line-height: 1.6; white-space: pre-wrap;">
${message}
          </div>
          <p style="font-size: 12px; color: #a1a1aa; margin-top: 24px;">NOVA MARKET Automated Dispatch Concierge</p>
        </div>
      `,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        providerConfigured: true,
      };
    }

    return {
      success: true,
      messageId: data?.id,
      providerConfigured: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unknown network error sending email',
      providerConfigured: true,
    };
  }
}

export async function sendCustomerInquiryConfirmation({
  name,
  email,
  subject,
}: {
  name: string;
  email: string;
  subject: string;
}): Promise<SendEmailResult> {
  if (!resend) {
    return {
      success: false,
      error: 'RESEND_API_KEY is not configured in environment variables.',
      providerConfigured: false,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Inquiry Received: ${subject} — NOVA MARKET`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 22px; font-weight: 500; color: #09090b;">Thank you for reaching out, ${name}.</h1>
          <p style="color: #52525b; font-size: 14px; line-height: 1.6;">
            We have safely received your dispatch regarding "<strong>${subject}</strong>". A member of our client concierge team will review your message and respond within 24 business hours.
          </p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
            NOVA MARKET • Objects of permanence • San Francisco & Tokyo
          </div>
        </div>
      `,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        providerConfigured: true,
      };
    }

    return {
      success: true,
      messageId: data?.id,
      providerConfigured: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to send customer confirmation email',
      providerConfigured: true,
    };
  }
}

/**
 * Day 4 Transactional Emails for Orders & Admin Notifications
 */

export async function sendOrderConfirmationEmail({
  orderNumber,
  customerEmail,
  customerName,
  total,
  items,
  shippingAddress,
}: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}): Promise<SendEmailResult> {
  if (!resend) {
    return {
      success: false,
      error: 'RESEND_API_KEY not configured.',
      providerConfigured: false,
    };
  }

  try {
    const itemsHtml = items
      .map(
        (i) =>
          `<tr>
            <td style="padding: 8px 0; color: #18181b;">${i.quantity} × ${i.name}</td>
            <td style="padding: 8px 0; text-align: right; color: #09090b; font-weight: 600;">$${(i.price * i.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('');

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: customerEmail,
      subject: `Order Confirmation #${orderNumber} — NOVA MARKET`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h1 style="color: #09090b; font-size: 22px; font-weight: 500; margin-bottom: 8px;">Thank you for your order, ${customerName}.</h1>
          <p style="color: #52525b; font-size: 14px; margin-bottom: 24px;">
            We are preparing your items with mindful care. Your order reference is <strong>#${orderNumber}</strong>.
          </p>

          <div style="border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 16px 0; margin-bottom: 20px;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              ${itemsHtml}
              <tr style="border-top: 1px dashed #e4e4e7;">
                <td style="padding-top: 12px; font-weight: 600;">Total Charged:</td>
                <td style="padding-top: 12px; text-align: right; font-weight: 700; font-size: 16px; color: #09090b;">$${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 12px; color: #71717a; margin-bottom: 4px;">Destination Delivery Address:</p>
          <p style="font-size: 13px; color: #18181b; margin-top: 0;">${shippingAddress}</p>

          <p style="font-size: 12px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #f4f4f5; padding-top: 16px;">
            NOVA MARKET • Objects of Permanence
          </p>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message, providerConfigured: true };
    return { success: true, messageId: data?.id, providerConfigured: true };
  } catch (err: any) {
    return { success: false, error: err.message, providerConfigured: true };
  }
}

export async function sendAdminNewOrderAlert({
  orderNumber,
  total,
  customerEmail,
  itemCount,
}: {
  orderNumber: string;
  total: number;
  customerEmail: string;
  itemCount: number;
}): Promise<SendEmailResult> {
  if (!resend) {
    return {
      success: false,
      error: 'RESEND_API_KEY not configured.',
      providerConfigured: false,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `[NOVA MARKET SALE] Order #${orderNumber} ($${total.toFixed(2)})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <h2 style="color: #09090b;">New Customer Order Placed</h2>
          <p><strong>Order Number:</strong> #${orderNumber}</p>
          <p><strong>Customer:</strong> ${customerEmail}</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          <p><strong>Total Items:</strong> ${itemCount}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders">Review in Admin Dashboard</a></p>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message, providerConfigured: true };
    return { success: true, messageId: data?.id, providerConfigured: true };
  } catch (err: any) {
    return { success: false, error: err.message, providerConfigured: true };
  }
}
