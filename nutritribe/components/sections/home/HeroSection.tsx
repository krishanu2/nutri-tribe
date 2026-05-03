'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import MakhanaScene from '@/components/illustrations/MakhanaScene';

/* ── Magnetic CTA ─────────────────────────────────────────── */
function MagneticLink({ children, href, primary }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 22 });
  const sy = useSpring(my, { stiffness: 300, damping: 22 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.3);
    my.set((e.clientY - r.top - r.height / 2) * 0.3);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy, ...(primary ? { background: '#f3a213' } : {}) }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden inline-flex items-center gap-2 px-9 py-4 rounded-full font-body font-bold text-sm tracking-[0.1em] uppercase cursor-none ${
        primary
          ? 'text-[#050100]'
          : 'border border-white/20 text-white/80 hover:text-white hover:border-white/40'
      }`}
    >
      <span className="relative z-10">{children}</span>
      {primary && (
        <motion.div className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} />
      )}
    </motion.a>
  );
}

/* ── Floating Ball — separate component for legal hook usage ── */
const floatBalls = [
  { top: '14%', left: '4%',  size: 52, o: 0.13, dur: 3.4, delay: 0,   d: 0.5 },
  { top: '70%', left: '3%',  size: 34, o: 0.10, dur: 4.2, delay: 0.8, d: 0.3 },
  { top: '22%', left: '91%', size: 44, o: 0.11, dur: 3.8, delay: 0.4, d: 0.7 },
  { top: '66%', left: '89%', size: 56, o: 0.12, dur: 3.1, delay: 1.1, d: 0.5 },
  { top: '86%', left: '46%', size: 28, o: 0.09, dur: 4.6, delay: 0.6, d: 0.4 },
  { top: '9%',  left: '54%', size: 22, o: 0.10, dur: 3.9, delay: 1.4, d: 0.6 },
  { top: '48%', left: '95%', size: 18, o: 0.08, dur: 5.1, delay: 0.2, d: 0.2 },
];

function FloatBall({ b, i, mouseX, mouseY }: {
  b: typeof floatBalls[0]; i: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const px = useSpring(useTransform(mouseX, [0,1], [-18*b.d, 18*b.d]), { stiffness: 35, damping: 14 });
  const py = useSpring(useTransform(mouseY, [0,1], [-12*b.d, 12*b.d]), { stiffness: 35, damping: 14 });
  const id = `hb-${i}`;
  return (
    <motion.div className="absolute pointer-events-none" style={{ top: b.top, left: b.left, x: px, y: py }}>
      <motion.div animate={{ y: [0,-14,0] }} transition={{ repeat: Infinity, duration: b.dur, delay: b.delay, ease: 'easeInOut' }}>
        <svg width={b.size} height={b.size} viewBox="0 0 60 60" fill="none" aria-hidden>
          <defs>
            <radialGradient id={id} cx="33%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#fdfbf7" />
              <stop offset="40%" stopColor="#e8d4a8" />
              <stop offset="100%" stopColor="#b8916a" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="30" r="28" fill={`url(#${id})`} opacity={b.o} />
          <ellipse cx="22" cy="23" rx="5" ry="3.5" fill="#8a6840" opacity={b.o*2} transform="rotate(-20 22 23)" />
          <circle cx="35" cy="20" r="3" fill="#8a6840" opacity={b.o*1.8} />
          <ellipse cx="23" cy="22" rx="6" ry="4" fill="white" opacity={b.o*1.6} transform="rotate(-30 23 22)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ── Word-rise reveal ─────────────────────────────────────── */
function WordRise({ text, delay=0, className, color }: { text: string; delay?: number; className?: string; color?: string }) {
  return (
    <span className={className} style={{ display: 'inline', color }}>
      {text.split(' ').map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.22,1,0.36,1] }}
          >{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.01 });
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotX = useSpring(useTransform(mouseY,[0,1],[5,-5]), { stiffness: 55, damping: 18 });
  const rotY = useSpring(useTransform(mouseX,[0,1],[-6,6]), { stiffness: 55, damping: 18 });

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);
  const onLeave = useCallback(() => { mouseX.set(0.5); mouseY.set(0.5); }, [mouseX, mouseY]);

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 90% at 60% 40%, #1c0c04 0%, #0a0200 55%, #030100 100%)',
        paddingTop: 0, /* override the globals.css first-child rule */
      }}
    >
      {/* ── GIANT LOGO WATERMARK — behind everything ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.025 }}
        aria-hidden
      >
        <div className="relative" style={{ width: '70vw', height: '35vw', maxWidth: 900, maxHeight: 400 }}>
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

      {/* Amber glow behind illustration */}
      <motion.div className="absolute pointer-events-none"
        style={{ right: '-5%', top: '5%', width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(243,162,19,0.14) 0%, transparent 68%)' }}
        animate={{ scale:[1,1.08,1], opacity:[0.7,1,0.7] }}
        transition={{ duration: 7, repeat: Infinity }} />

      {/* Green accent — bottom left */}
      <div className="absolute pointer-events-none"
        style={{ left:'-8%', bottom:'0%', width:'38vw', height:'38vw', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,152,70,0.07) 0%, transparent 70%)' }} />

      {/* Floating makhana balls */}
      {floatBalls.map((b,i) => <FloatBall key={i} b={b} i={i} mouseX={mouseX} mouseY={mouseY} />)}

      {/* Top hair line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background:'linear-gradient(90deg,transparent,rgba(243,162,19,0.4),transparent)' }} />

      {/* ── GRID ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* ── LEFT ── */}
          <div>
            {/* NutriTribe logo — prominent brand identity at top of hero */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mb-8"
            >
              <div className="relative" style={{ width: 200, height: 56 }}>
                <Image
                  src="/logo.png"
                  alt="NutriTribe"
                  fill
                  className="object-contain object-left"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  priority
                />
              </div>
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity:0, y:16 }} animate={isInView?{opacity:1,y:0}:{}}
              transition={{ duration:0.6, delay:0.1 }}
              className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full"
              style={{ background:'rgba(243,162,19,0.08)', border:'1px solid rgba(243,162,19,0.2)' }}
            >
              {/* Lotus icon */}
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                {[0,45,90,135,180,225,270,315].map((a,i)=>(
                  <ellipse key={i} cx="10" cy="4" rx="2.5" ry="5" fill="#f3a213" opacity="0.55"
                    transform={`rotate(${a} 10 10)`} />
                ))}
                <circle cx="10" cy="10" r="2.5" fill="#f3a213" opacity="0.8" />
              </svg>
              <span className="font-body font-bold text-[10px] tracking-[0.28em] uppercase"
                style={{ color:'rgba(243,162,19,0.75)' }}>
                From the Lotus Ponds of Mithila, Bihar
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display font-bold leading-[1.06] mb-6"
              style={{ fontSize:'clamp(40px, 5.4vw, 84px)' }}>
              {isInView && (
                <>
                  <WordRise text="India's Ancient" delay={0.12} className="block text-white" />
                  <WordRise text="Superfood," delay={0.3} className="block italic" color="#f3a213" />
                  <WordRise text="Reimagined." delay={0.48} className="block text-white" />
                </>
              )}
            </h1>

            {/* Ornament */}
            <motion.div
              initial={{ opacity:0, scaleX:0 }} animate={isInView?{opacity:1,scaleX:1}:{}}
              transition={{ duration:0.7, delay:0.9 }}
              className="flex items-center gap-3 mb-6 origin-left"
            >
              <div className="h-px w-12" style={{ background:'linear-gradient(90deg,transparent,rgba(243,162,19,0.4))' }} />
              {[0,1].map(k=>(
                <svg key={k} width="9" height="9" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="13" fill="#f3a213" opacity="0.7" />
                  <circle cx="10" cy="11" r="2.5" fill="#7d3627" opacity="0.4" />
                  <ellipse cx="11" cy="11" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 11 11)" />
                </svg>
              ))}
              <div className="h-px w-8" style={{ background:'rgba(243,162,19,0.3)' }} />
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity:0, y:14 }} animate={isInView?{opacity:1,y:0}:{}}
              transition={{ duration:0.7, delay:1.0 }}
              className="font-body text-base mb-10 leading-[1.95] max-w-md"
              style={{ color:'rgba(253,251,247,0.5)' }}
            >
              Sourced from the sacred wetlands of Mithila, Bihar — triple-sorted by hand,
              roasted never fried. Clean. Premium. Rooted in 2,000 years of tradition.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:14 }} animate={isInView?{opacity:1,y:0}:{}}
              transition={{ duration:0.7, delay:1.15 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <MagneticLink href="/products" primary>Shop the Collection</MagneticLink>
              <MagneticLink href="/our-story">Our Story →</MagneticLink>
            </motion.div>

            {/* Trust tags */}
            <motion.div
              initial={{ opacity:0 }} animate={isInView?{opacity:1}:{}}
              transition={{ duration:0.8, delay:1.35 }}
              className="flex flex-wrap gap-x-7 gap-y-2.5"
            >
              {['100% Natural','No Preservatives','15g Protein / 100g','Gluten Free'].map(tag=>(
                <div key={tag} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ background:'#f3a213' }} />
                  <span className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{ color:'rgba(243,162,19,0.45)' }}>{tag}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: 3D illustration ── */}
          <motion.div
            initial={{ opacity:0, scale:0.88, y:24 }}
            animate={isInView?{opacity:1,scale:1,y:0}:{}}
            transition={{ duration:1.1, delay:0.2, ease:[0.22,1,0.36,1] }}
            className="relative flex items-center justify-center"
            style={{ perspective:900 }}
          >
            {/* Decorative ring */}
            <div className="absolute rounded-full" style={{ width:'88%', aspectRatio:'1', border:'1px solid rgba(243,162,19,0.08)' }} />
            <div className="absolute rounded-full" style={{ width:'70%', aspectRatio:'1', border:'1px solid rgba(243,162,19,0.05)' }} />

            {/* Glow */}
            <div className="absolute rounded-full" style={{ width:'75%', aspectRatio:'1',
              background:'radial-gradient(circle, rgba(243,162,19,0.11) 0%, transparent 72%)' }} />

            {/* 3D tilt wrapper */}
            <motion.div
              style={{ rotateX:rotX, rotateY:rotY, transformStyle:'preserve-3d' }}
              className="relative w-full flex items-center justify-center"
            >
              <motion.div
                animate={{ y:[0,-12,0] }}
                transition={{ repeat:Infinity, duration:4.5, ease:'easeInOut' }}
                className="w-full max-w-[500px] mx-auto"
                style={{ transformStyle:'preserve-3d', transform:'translateZ(28px)' }}
              >
                <MakhanaScene className="w-full h-full drop-shadow-2xl" />
              </motion.div>

              {/* Stat chips */}
              <motion.div
                initial={{ opacity:0, x:28, y:-10 }} animate={isInView?{opacity:1,x:0,y:0}:{}}
                transition={{ delay:1.1, duration:0.6 }}
                className="absolute top-4 right-0 lg:-right-6 px-4 py-3 rounded-2xl"
                style={{ background:'rgba(7,1,0,0.85)', border:'1px solid rgba(243,162,19,0.2)', backdropFilter:'blur(16px)', transform:'translateZ(50px)' }}
              >
                <p className="font-display font-bold text-2xl leading-none" style={{ color:'#f3a213' }}>15g</p>
                <p className="font-body text-[10px] mt-0.5 tracking-wide" style={{ color:'rgba(253,251,247,0.45)' }}>Protein / 100g</p>
              </motion.div>

              <motion.div
                initial={{ opacity:0, x:-28, y:10 }} animate={isInView?{opacity:1,x:0,y:0}:{}}
                transition={{ delay:1.25, duration:0.6 }}
                className="absolute bottom-8 left-0 lg:-left-6 px-4 py-3 rounded-2xl"
                style={{ background:'rgba(243,162,19,0.9)', transform:'translateZ(40px)' }}
              >
                <p className="font-display font-bold text-2xl leading-none text-[#050100]">2000+</p>
                <p className="font-body text-[10px] mt-0.5 tracking-wide text-[#050100]/60">Years of Heritage</p>
              </motion.div>

              <motion.div
                initial={{ opacity:0, scale:0.8 }} animate={isInView?{opacity:1,scale:1}:{}}
                transition={{ delay:1.4, duration:0.5 }}
                className="absolute bottom-20 right-0 lg:-right-4 px-3 py-2 rounded-xl"
                style={{ background:'rgba(0,152,70,0.88)', border:'1px solid rgba(255,255,255,0.1)', transform:'translateZ(60px)' }}
              >
                <p className="font-body font-bold text-[10px] text-white tracking-widest uppercase">Direct from Bihar</p>
              </motion.div>
            </motion.div>

            {/* Brand watermark ring */}
            <div className="absolute bottom-0 right-8 opacity-[0.06] pointer-events-none select-none">
              <p className="font-display font-bold text-8xl italic tracking-tighter" style={{ color:'#f3a213' }}>NT</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SCROLLING BOTTOM TICKER ── */}
      <div className="absolute bottom-14 left-0 right-0 overflow-hidden pointer-events-none">
        <motion.div className="flex gap-14 whitespace-nowrap"
          animate={{ x:['0%','-50%'] }} transition={{ duration:24, repeat:Infinity, ease:'linear' }}>
          {[...Array(2)].flatMap(()=>
            ['100% Natural','Mithila Origin','No Preservatives','High Protein','Farmer-Backed','Roasted Not Fried','Gluten Free']
              .map((t,i)=>(
                <span key={`${t}-${i}`} className="font-body text-[9px] tracking-[0.35em] uppercase shrink-0 flex items-center gap-4"
                  style={{ color:'rgba(243,162,19,0.18)' }}>
                  {t}<span style={{ color:'rgba(243,162,19,0.1)' }}>◆</span>
                </span>
              ))
          )}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity:0 }} animate={isInView?{opacity:1}:{}} transition={{ delay:1.8 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
      >
        <motion.div animate={{ y:[0,7,0] }} transition={{ repeat:Infinity, duration:1.7 }}>
          <ChevronDown size={16} style={{ color:'rgba(243,162,19,0.4)' }} />
        </motion.div>
      </motion.div>

      {/* Bottom wave into rust section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none" className="w-full" style={{ height:50 }}>
          <path d="M0 50 Q360 10 720 30 Q1080 50 1440 15 L1440 50 Z" fill="#7d3627" />
        </svg>
      </div>
    </section>
  );
}
