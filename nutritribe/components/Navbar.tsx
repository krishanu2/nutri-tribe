'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const NAV = [
  { label: 'Home',        href: '/',          short: 'Home'    },
  { label: 'Products',    href: '/products',  short: 'Shop'    },
  { label: 'Our Story',   href: '/our-story', short: 'Story'   },
  { label: 'The Makhana', href: '/makhana',   short: 'Learn'   },
  { label: 'Contact',     href: '/contact',   short: 'Contact' },
];

/* tiny makhana ball for gamification dots */
function MakhBall({ size = 8 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <defs>
        <radialGradient id="mnb" cx="35%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#fdfbf7"/>
          <stop offset="45%" stopColor="#e8d4a8"/>
          <stop offset="100%" stopColor="#b8916a"/>
        </radialGradient>
      </defs>
      <circle cx="10" cy="10" r="9" fill="url(#mnb)"/>
      <circle cx="7"  cy="7"  r="2.5" fill="white" fillOpacity="0.55"/>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const [pillHover, setPillHover]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [visited, setVisited]         = useState<Set<string>>(new Set());
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname  = usePathname();

  /* track visited pages — gamification */
  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('nt-visited') || '[]');
      const arr = stored.includes(pathname) ? stored : [...stored, pathname];
      const next = new Set(arr);
      setVisited(next);
      localStorage.setItem('nt-visited', JSON.stringify(arr));
    } catch { /* ignore */ }
  }, [pathname]);

  /* scroll detection */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* mouse near top → reveal pill */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (e.clientY < 80) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setPillVisible(true);
      } else if (!pillHover) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setPillVisible(false), 1800);
      }
    };
    window.addEventListener('mousemove', fn);
    return () => { window.removeEventListener('mousemove', fn); if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [pillHover]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = mobileOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mobileOpen]);

  /* pill stays if hovered */
  const onPillEnter = () => { if (hideTimer.current) clearTimeout(hideTimer.current); setPillHover(true); setPillVisible(true); };
  const onPillLeave = () => { setPillHover(false); hideTimer.current = setTimeout(() => setPillVisible(false), 1800); };

  const showFull = !scrolled;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          FULL BAR — visible only when at top of page
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFull && (
          <motion.nav
            key="fullbar"
            className="fixed left-0 right-0 z-[900]"
            style={{ top: 38 }}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y: -80, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glass bar */}
            <div
              className="mx-auto flex items-center justify-between px-6"
              style={{
                height: 68,
                background: 'rgba(7,1,0,0.75)',
                backdropFilter: 'blur(22px)',
                borderBottom: '1px solid rgba(243,162,19,0.09)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
              }}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(243,162,19,0.2) 0%, transparent 70%)', transform: 'scale(2)' }} />
                  <div className="relative w-40 h-12">
                    <Image src="/logo.png" alt="NutriTribe" fill className="object-contain object-left"
                      style={{ filter: 'brightness(0) invert(1)' }} priority />
                  </div>
                </div>
                <div className="hidden xl:block border-l pl-3" style={{ borderColor: 'rgba(243,162,19,0.2)' }}>
                  <p className="font-body font-bold text-[7px] tracking-[0.35em] uppercase" style={{ color: 'rgba(243,162,19,0.55)' }}>From Mithila, Bihar</p>
                  <p className="font-display text-[11px] italic" style={{ color: 'rgba(253,251,247,0.4)' }}>Snack Bold. Live Rooted.</p>
                </div>
              </Link>

              {/* Centre pill group */}
              <div className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(243,162,19,0.1)' }}>
                {NAV.map((link) => {
                  const active = pathname === link.href;
                  const seen   = visited.has(link.href);
                  return (
                    <Link key={link.href} href={link.href} className="relative px-4 py-1.5 rounded-full group">
                      {active && (
                        <motion.div layoutId="full-active" className="absolute inset-0 rounded-full"
                          style={{ background: 'rgba(243,162,19,0.12)', border: '1px solid rgba(243,162,19,0.2)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                      )}
                      <span className="relative z-10 font-body font-medium text-[13px] tracking-wide transition-colors duration-200"
                        style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.58)' }}>
                        {link.label}
                      </span>
                      {/* Visited dot gamification */}
                      {seen && !active && (
                        <motion.div className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                          <div className="w-1 h-1 rounded-full" style={{ background: '#f3a213', opacity: 0.5 }} />
                        </motion.div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Right */}
              <div className="hidden md:flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                  style={{ background: 'rgba(243,162,19,0.07)', border: '1px solid rgba(243,162,19,0.14)' }}>
                  <ShoppingBag size={13} style={{ color: '#f3a213' }} />
                  <span className="font-body text-[11px] font-semibold" style={{ color: 'rgba(243,162,19,0.7)' }}>0</span>
                </div>
                <Link href="/products">
                  <motion.div
                    className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-bold text-[12px] tracking-wide cursor-none"
                    style={{ background: '#f3a213', color: '#050100' }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={12} />
                    <motion.div className="absolute inset-0"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }} />
                  </motion.div>
                </Link>
              </div>

              {/* Mobile hamburger */}
              <motion.button className="md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setMobileOpen(true)} whileTap={{ scale: 0.9 }} aria-label="Menu">
                {[0,1,2].map(i => (
                  <span key={i} className="block w-6 h-0.5 rounded-full" style={{ background: 'rgba(253,251,247,0.75)' }} />
                ))}
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          HINT LINE — pulsing amber strip at very top
          tells user the nav is there, hover to reveal
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {scrolled && !pillVisible && (
          <motion.div
            key="hintline"
            className="fixed top-0 left-0 right-0 z-[901] flex items-center justify-center"
            style={{ height: 4 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Full width dim base */}
            <div className="absolute inset-0" style={{ background: 'rgba(243,162,19,0.1)' }} />
            {/* Pulsing centre glow */}
            <motion.div
              className="absolute"
              style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, transparent, #f3a213, transparent)' }}
              animate={{ opacity: [0.3, 0.9, 0.3], x: ['-20%', '20%', '-20%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Centre tooltip hint */}
            <motion.div
              className="relative flex items-center gap-1.5 px-3 py-0.5 rounded-full"
              style={{ marginTop: 2, background: 'rgba(7,1,0,0.8)', border: '1px solid rgba(243,162,19,0.2)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f3a213' }}
                animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="font-body text-[8px] tracking-[0.25em] uppercase" style={{ color: 'rgba(243,162,19,0.7)' }}>
                hover to navigate
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          LIVING PILL — springs down when mouse nears top
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {scrolled && pillVisible && (
          /* Centering wrapper */
          <div className="fixed top-0 left-0 right-0 z-[900] flex justify-center pointer-events-none"
            style={{ paddingTop: 10 }}>
            <motion.div
              key="pill"
              className="pointer-events-auto"
              initial={{ y: -70, opacity: 0, scale: 0.88 }}
              animate={{ y: 0,   opacity: 1, scale: 1   }}
              exit={{   y: -70, opacity: 0, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onMouseEnter={onPillEnter}
              onMouseLeave={onPillLeave}
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: '0 0 0 1px rgba(243,162,19,0.18), 0 0 20px rgba(243,162,19,0.12)', borderRadius: 100 }} />

              {/* Pill body */}
              <motion.div
                className="flex items-center gap-1 px-2 py-1.5 rounded-full relative"
                style={{
                  background: 'rgba(7,1,0,0.94)',
                  backdropFilter: 'blur(28px)',
                  border: '1px solid rgba(243,162,19,0.22)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
                animate={{ scale: [1, 1.003, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Animated gradient border sweep */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                  style={{ opacity: 0.6 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(243,162,19,0.15) 50%, transparent 100%)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
                  />
                </motion.div>

                {/* Logo mark */}
                <Link href="/" className="flex items-center shrink-0 mr-1">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden"
                    style={{ background: 'rgba(243,162,19,0.1)', border: '1px solid rgba(243,162,19,0.2)' }}>
                    <Image src="/logo.png" alt="NT" fill className="object-contain p-0.5"
                      style={{ filter: 'brightness(0) invert(1)' }} />
                  </div>
                </Link>

                <div className="w-px h-4 shrink-0" style={{ background: 'rgba(243,162,19,0.15)' }} />

                {/* Nav links */}
                {NAV.map((link) => {
                  const active = pathname === link.href;
                  const seen   = visited.has(link.href);
                  return (
                    <Link key={link.href} href={link.href} className="relative group">
                      <motion.div
                        className="relative px-3 py-1.5 rounded-full flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {active && (
                          <motion.div layoutId="pill-active"
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'rgba(243,162,19,0.12)', border: '1px solid rgba(243,162,19,0.25)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                        )}
                        <span className="relative z-10 font-body font-medium text-[12px] whitespace-nowrap transition-colors duration-150"
                          style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.6)' }}>
                          {link.short}
                        </span>
                        {/* Gamification: makhana ball for visited pages */}
                        {seen && (
                          <motion.div
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
                          >
                            <MakhBall size={5} />
                          </motion.div>
                        )}
                        {/* Hover: mini makhana pops up */}
                        <motion.div
                          className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none"
                          initial={{ opacity: 0, y: 4, scale: 0.5 }}
                          whileHover={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MakhBall size={10} />
                        </motion.div>
                      </motion.div>
                    </Link>
                  );
                })}

                <div className="w-px h-4 shrink-0" style={{ background: 'rgba(243,162,19,0.15)' }} />

                {/* Shop CTA */}
                <Link href="/products">
                  <motion.div
                    className="relative overflow-hidden flex items-center gap-1.5 px-4 py-1.5 rounded-full font-body font-bold text-[11px] tracking-wide cursor-none"
                    style={{ background: '#f3a213', color: '#050100' }}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingBag size={11} />
                    <span>Shop</span>
                    <motion.div className="absolute inset-0"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }} />
                  </motion.div>
                </Link>

                {/* Mobile hamburger inside pill */}
                <button className="md:hidden ml-1 p-1.5 rounded-full flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  onClick={() => setMobileOpen(true)} aria-label="Menu">
                  {[0,1,2].map(i => (
                    <span key={i} className="block w-4 h-0.5 rounded-full" style={{ background: 'rgba(253,251,247,0.6)' }} />
                  ))}
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          MOBILE DRAWER
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-[950]"
              style={{ background: 'rgba(5,1,0,0.8)', backdropFilter: 'blur(10px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />

            <motion.div className="fixed top-0 right-0 bottom-0 z-[960] w-[80vw] max-w-xs flex flex-col"
              style={{ background: 'linear-gradient(160deg, #120601, #0a0200)', borderLeft: '1px solid rgba(243,162,19,0.12)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(243,162,19,0.1)' }}>
                <div className="relative w-32 h-10" style={{ filter: 'brightness(0) invert(1)' }}>
                  <Image src="/logo.png" alt="NutriTribe" fill className="object-contain object-left" />
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={18} style={{ color: 'rgba(253,251,247,0.4)' }} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 flex flex-col px-6 pt-8 gap-0.5">
                {NAV.map((link, i) => {
                  const active = pathname === link.href;
                  const seen = visited.has(link.href);
                  return (
                    <motion.div key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.06 }}>
                      <Link href={link.href}
                        className="flex items-center justify-between py-4 border-b group"
                        style={{ borderColor: 'rgba(243,162,19,0.07)' }}>
                        <div className="flex items-center gap-3">
                          {seen && <MakhBall size={8} />}
                          <span className="font-display text-2xl font-bold"
                            style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.75)' }}>
                            {link.label}
                          </span>
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#f3a213' }} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="px-6 pb-10">
                <Link href="/products" onClick={() => setMobileOpen(false)}
                  className="block w-full text-center font-body font-bold text-sm py-4 rounded-full tracking-widest uppercase"
                  style={{ background: '#f3a213', color: '#050100' }}>
                  Shop Now
                </Link>
                <p className="text-center font-body text-[9px] mt-4 tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(243,162,19,0.28)' }}>
                  Snack Bold. Live Rooted.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
