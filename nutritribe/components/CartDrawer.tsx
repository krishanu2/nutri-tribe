'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';

const FREE_DELIVERY = 499;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQty, totalPrice, totalItems } = useCart();
  const delivery = totalPrice >= FREE_DELIVERY ? 0 : 49;
  const remaining = FREE_DELIVERY - totalPrice;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[970]"
            style={{ background: 'rgba(5,1,0,0.55)', backdropFilter: 'blur(5px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[980] flex flex-col w-full max-w-md"
            style={{ background: '#fdfbf7', borderLeft: '1px solid rgba(122,58,39,0.12)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-earthen-rust/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-earthen-rust" />
                <h2 className="font-display font-bold text-xl text-earthen-rust">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="w-6 h-6 rounded-full bg-sun-harvest flex items-center justify-center font-body font-bold text-[11px] text-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-earthen-rust/5 rounded-full transition-colors"
              >
                <X size={18} className="text-earthen-rust/50" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <ShoppingBag size={52} className="text-earthen-rust/15" />
                  <p className="font-body text-earthen-rust/40 text-sm">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="font-body font-bold text-sm px-6 py-3 rounded-full bg-sun-harvest text-white hover:brightness-110 transition-all"
                  >
                    <Link href="/products">Browse Products</Link>
                  </button>
                </div>
              ) : (
                <>
                  {/* Free delivery progress */}
                  <div className="bg-sacred-leaf/5 rounded-xl p-3 border border-sacred-leaf/15">
                    {totalPrice < FREE_DELIVERY ? (
                      <>
                        <p className="font-body text-xs text-sacred-leaf font-semibold mb-2">
                          Add ₹{remaining} more for FREE delivery!
                        </p>
                        <div className="h-1.5 bg-sacred-leaf/15 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-sacred-leaf rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalPrice / FREE_DELIVERY) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="font-body text-xs text-sacred-leaf font-semibold">
                        ✓ You&apos;ve unlocked FREE delivery!
                      </p>
                    )}
                  </div>

                  {/* Cart items */}
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.weight}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      className="flex gap-4 p-4 bg-white rounded-2xl border border-earthen-rust/8 shadow-sm"
                    >
                      {/* Colour thumbnail */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: item.color + '18', border: `2px solid ${item.color}30` }}
                      >
                        <div
                          className="w-7 h-7 rounded-full"
                          style={{ background: item.color + '70' }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-earthen-rust leading-tight">
                          {item.name}
                        </p>
                        <p className="font-body text-[11px] text-earthen-rust/45 mt-0.5">{item.weight}</p>
                        <div className="flex items-center justify-between mt-2">
                          {/* Qty control */}
                          <div className="flex items-center gap-0 border border-earthen-rust/20 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(item.productId, item.weight, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-earthen-rust/5 transition-colors"
                            >
                              <Minus size={10} className="text-earthen-rust" />
                            </button>
                            <span className="w-8 text-center font-body font-bold text-xs text-earthen-rust">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, item.weight, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-earthen-rust/5 transition-colors"
                            >
                              <Plus size={10} className="text-earthen-rust" />
                            </button>
                          </div>
                          <span className="font-display font-bold text-sm text-earthen-rust">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.weight)}
                        className="self-start p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2
                          size={13}
                          className="text-earthen-rust/25 group-hover:text-red-400 transition-colors"
                        />
                      </button>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Footer with totals + CTA */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-earthen-rust/10 bg-white space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-body text-sm text-earthen-rust/55">
                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-earthen-rust/55">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-sacred-leaf font-semibold' : ''}>
                      {delivery === 0 ? 'FREE' : `₹${delivery}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-lg text-earthen-rust pt-2 border-t border-earthen-rust/10">
                    <span>Total</span>
                    <span>₹{totalPrice + delivery}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-sun-harvest text-white font-body font-bold text-sm py-4 rounded-2xl hover:brightness-110 transition-all tracking-wide uppercase cursor-pointer"
                  >
                    Proceed to Checkout
                    <ArrowRight size={15} />
                  </motion.div>
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full text-center font-body text-[11px] text-earthen-rust/35 hover:text-earthen-rust/60 transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
