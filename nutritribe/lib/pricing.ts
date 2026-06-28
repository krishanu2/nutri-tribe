import { db } from '@/lib/db';

const FREE_DELIVERY = 499;
const DELIVERY_FEE = 49;

interface PricingItem {
  productId: number;
  quantity: number;
}

export class PricingError extends Error {}

export async function computeOrderTotals(items: PricingItem[], couponCode?: string | null) {
  const products = await db.product.findMany({
    where: { id: { in: items.map(i => i.productId) } },
  });
  const productsById = new Map(products.map(p => [p.id, p]));

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) throw new PricingError(`Product ${item.productId} not found`);
    if (item.quantity > product.stockQuantity) {
      throw new PricingError(`Insufficient stock for ${product.name}`);
    }
  }

  const subtotal = items.reduce(
    (sum, i) => sum + productsById.get(i.productId)!.price * i.quantity,
    0
  );
  const delivery = subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;

  let discount = 0;
  let appliedCoupon = null;
  let couponWasRejected = false;

  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: String(couponCode).trim().toUpperCase() } });
    const valid = !!coupon
      && coupon.active
      && (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date())
      && (coupon.maxUses == null || coupon.usedCount < coupon.maxUses)
      && subtotal >= coupon.minOrderValue;

    if (valid && coupon) {
      discount = coupon.type === 'PERCENT'
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);
      appliedCoupon = coupon;
    } else {
      couponWasRejected = true;
    }
  }

  const total = Math.max(0, subtotal + delivery - discount);

  return { subtotal, delivery, discount, total, coupon: appliedCoupon, couponWasRejected, productsById };
}
