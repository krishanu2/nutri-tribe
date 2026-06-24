import { Resend } from 'resend';
import { OrderStatus, Ticket } from '@prisma/client';

interface OrderForEmail {
  orderId: string;
  email: string;
  customerName: string;
  total: number;
  trackingNumber?: string | null;
}

const STATUS_COPY: Record<OrderStatus, { subject: string; message: string }> = {
  PENDING: {
    subject: 'Order received',
    message: 'We\'ve received your order and will confirm it shortly.',
  },
  CONFIRMED: {
    subject: 'Order confirmed',
    message: 'Your order has been confirmed and is being prepared.',
  },
  PROCESSING: {
    subject: 'Order is being processed',
    message: 'Your order is being packed and will be shipped soon.',
  },
  SHIPPED: {
    subject: 'Order shipped',
    message: 'Your order is on its way!',
  },
  DELIVERED: {
    subject: 'Order delivered',
    message: 'Your order has been delivered. We hope you enjoy it!',
  },
  CANCELLED: {
    subject: 'Order cancelled',
    message: 'Your order has been cancelled.',
  },
};

export async function sendOrderStatusEmail(order: OrderForEmail, status: OrderStatus) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email] Skipping order status email (RESEND_API_KEY not set) — ${order.orderId} → ${status}`);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'orders@nutritribe.in';
  const copy = STATUS_COPY[status];

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: order.email,
    subject: `${copy.subject} — ${order.orderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #7d3627;">
        <h2 style="color: #7d3627;">Hi ${order.customerName.split(' ')[0]},</h2>
        <p>${copy.message}</p>
        <p style="background: #fdfbf7; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <strong>Order ID:</strong> ${order.orderId}<br />
          <strong>Status:</strong> ${status}<br />
          ${order.trackingNumber ? `<strong>Tracking Number:</strong> ${order.trackingNumber}<br />` : ''}
          <strong>Total:</strong> ₹${order.total}
        </p>
        <p>Thank you for shopping with NutriTribe!</p>
      </div>
    `,
  });
}

const ISSUE_LABELS: Record<Ticket['issueType'], string> = {
  DAMAGED: 'Damaged Product',
  WRONG_ITEM: 'Wrong Item Received',
  MISSING_ITEM: 'Item Missing from Order',
  QUALITY_ISSUE: 'Quality Issue',
  OTHER: 'Other',
};

export async function sendTicketConfirmationEmail(ticket: Ticket) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email] Skipping ticket confirmation email (RESEND_API_KEY not set) — ${ticket.orderRef}`);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'orders@nutritribe.in';

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: ticket.email,
    subject: `We've received your report — ${ticket.orderRef}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #7d3627;">
        <h2 style="color: #7d3627;">Hi ${ticket.customerName.split(' ')[0]},</h2>
        <p>We've received your report about order <strong>${ticket.orderRef}</strong> and our team will get back to you within 24 hours.</p>
        <p style="background: #fdfbf7; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <strong>Ticket ID:</strong> ${ticket.id}<br />
          <strong>Issue:</strong> ${ISSUE_LABELS[ticket.issueType]}<br />
          <strong>Order ID:</strong> ${ticket.orderRef}
        </p>
        <p>Thank you for your patience — we'll make this right.</p>
      </div>
    `,
  });
}
