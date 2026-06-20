'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import FarmerCharacter from './FarmerCharacter';

type DawnPhase = 'night' | 'pre-dawn' | 'harvest-dawn';

export default function FarmerScene({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [phase, setPhase] = useState<DawnPhase>('night');

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase('pre-dawn'),     1800);
    const t2 = setTimeout(() => setPhase('harvest-dawn'), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  const isDawn    = phase === 'pre-dawn' || phase === 'harvest-dawn';
  const isHarvest = phase === 'harvest-dawn';

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      <svg viewBox="0 0 800 460" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%' }}>
        <defs>
          {/* Sky phases */}
          <linearGradient id="fs-sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#04060e" />
            <stop offset="55%"  stopColor="#0c1128" />
            <stop offset="100%" stopColor="#181028" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="fs-sky-dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#08040c" />
            <stop offset="40%"  stopColor="#1c0a04" />
            <stop offset="72%"  stopColor="#5c1a04" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#8a2e06" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="fs-sky-harvest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0e0504" />
            <stop offset="35%"  stopColor="#2c0e04" />
            <stop offset="65%"  stopColor="#7a2008" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0.5" />
          </linearGradient>
          {/* Water */}
          <linearGradient id="fs-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0e2235" />
            <stop offset="100%" stopColor="#060f18" />
          </linearGradient>
          {/* Ground */}
          <linearGradient id="fs-gnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a5814" />
            <stop offset="100%" stopColor="#1a2e06" />
          </linearGradient>
          {/* Sun glow */}
          <radialGradient id="fs-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f3a213" stopOpacity="1" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
          </radialGradient>
          {/* Moon glow */}
          <radialGradient id="fs-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#d4c87a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4c87a" stopOpacity="0" />
          </radialGradient>
          {/* Lantern glow */}
          <radialGradient id="fs-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f3a213" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
          </radialGradient>
          {/* Pond clip */}
          <clipPath id="fs-pond-clip">
            <path d="M0 310 Q200 296 400 308 Q600 320 800 308 L800 460 L0 460 Z" />
          </clipPath>
        </defs>

        {/* ── SKY (crossfading phases) ── */}
        <motion.rect width="800" height="310" fill="url(#fs-sky-night)"
          animate={{ opacity: phase === 'night' ? 1 : 0 }} transition={{ duration: 2.5 }} />
        <motion.rect width="800" height="310" fill="url(#fs-sky-dawn)"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'pre-dawn' ? 1 : 0 }} transition={{ duration: 2.5 }} />
        <motion.rect width="800" height="310" fill="url(#fs-sky-harvest)"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHarvest ? 1 : 0 }} transition={{ duration: 3 }} />

        {/* Sun rising on horizon */}
        <motion.g animate={isHarvest ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 2.5 }}>
          <circle cx="96" cy="292" r="14" fill="#f3a213" opacity="0.9" />
          <circle cx="96" cy="292" r="32" fill="url(#fs-sun)" opacity="0.88" />
          <circle cx="96" cy="292" r="60" fill="url(#fs-sun)" opacity="0.3" />
        </motion.g>

        {/* Sun rays when harvest dawn */}
        {isHarvest && [0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
          const rad = a*Math.PI/180;
          return (
            <motion.line key={i}
              x1={96+36*Math.cos(rad)} y1={292+36*Math.sin(rad)}
              x2={96+54*Math.cos(rad)} y2={292+54*Math.sin(rad)}
              stroke="#f3a213" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"
              initial={{ opacity:0 }} animate={{ opacity:[0.2,0.5,0.2] }}
              transition={{ duration:2.5, repeat:Infinity, delay:i*0.05 }} />
          );
        })}

        {/* Crescent moon (fades with dawn) */}
        <motion.g animate={isDawn ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 2 }}>
          <circle cx="698" cy="48" r="20" fill="url(#fs-moon)" />
          <circle cx="698" cy="48" r="15" fill="#d4c87a" opacity="0.85" />
          <circle cx="704" cy="44" r="12" fill="#0c1128" />
        </motion.g>

        {/* Stars */}
        {[[60,38],[140,22],[240,55],[310,28],[430,48],[475,16],[545,40],[680,26],[745,52],[378,72],[510,30],[195,18],[620,44]].map(([x,y],i)=>(
          <motion.circle key={i} cx={x} cy={y} r={i%3===0?2:1.5} fill="white"
            animate={inView ? { opacity: isHarvest ? [0.08,0.04,0.08] : [0.62,0.12,0.62] } : { opacity:0 }}
            transition={{ duration: 2+i%4*0.5, repeat:Infinity, ease:'easeInOut', delay:i*0.28 }} />
        ))}

        {/* Fireflies (night phase only) */}
        {inView && !isDawn && [[215,188],[328,175],[465,182],[522,192],[370,168],[680,180]].map(([x,y],i)=>(
          <motion.circle key={i} cx={x} cy={y} r="2" fill="#f3a213"
            animate={{ opacity:[0,0.88,0], x:[0,i%2===0?5:-5,0], y:[0,-8,0] }}
            transition={{ duration:2.8+i*0.5, repeat:Infinity, delay:i*0.62 }} />
        ))}

        {/* ── LANDSCAPE ── */}
        {/* Distant hills */}
        <path d="M0 238 Q120 188 240 210 Q360 232 480 192 Q600 158 720 192 Q760 202 800 186 L800 310 L0 310 Z"
          fill="#1e3008" opacity="0.88" />
        <path d="M0 258 Q80 228 180 248 Q300 268 420 238 Q540 212 680 242 Q740 254 800 238 L800 318 L0 318 Z"
          fill="#2c4210" opacity="0.68" />

        {/* Ground plane */}
        <path d="M0 310 Q200 296 400 308 Q600 320 800 308 L800 460 L0 460 Z" fill="url(#fs-gnd)" />

        {/* Ground mist */}
        {inView && (
          <motion.rect x="0" y="300" width="800" height="22" fill="rgba(220,200,170,0.055)"
            animate={{ opacity:[0.38,0.82,0.38], x:[-5,5,-5] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }} />
        )}

        {/* ── LOTUS POND ── */}
        <path d="M0 310 Q200 296 400 308 Q600 320 800 308 L800 460 L0 460 Z" fill="url(#fs-water)" />
        {/* Second layer */}
        <ellipse cx="400" cy="340" rx="360" ry="38" fill="#0d1f32" opacity="0.65" />

        {/* Caustic shimmer lines */}
        {inView && [320,348,368,390,412,435].map((y,i)=>(
          <motion.path key={i}
            d={`M${60+i*20} ${y} Q${200+i*10} ${y-5} ${350+i*15} ${y} Q${500+i*10} ${y+5} ${700-i*15} ${y}`}
            stroke="rgba(243,162,19,0.22)" strokeWidth="1.5" fill="none"
            animate={{ opacity:[0.08,0.38,0.08] }}
            transition={{ duration:3+i*0.4, repeat:Infinity, ease:'easeInOut', delay:i*0.48 }} />
        ))}

        {/* Sun reflection on water */}
        <motion.ellipse cx="96" cy="378" rx="55" ry="10" fill="rgba(243,162,19,0.18)"
          animate={isHarvest?{opacity:1}:{opacity:0}} transition={{duration:2.5}} />
        <motion.ellipse cx="96" cy="398" rx="34" ry="6" fill="rgba(243,162,19,0.12)"
          animate={isHarvest?{opacity:1}:{opacity:0}} transition={{duration:2.5, delay:0.3}} />

        {/* Water ripples around farmers */}
        {inView && [[205,342],[390,345],[580,347]].map(([cx,cy],i)=>(
          [0,1].map(j=>(
            <motion.ellipse key={`r-${i}-${j}`} cx={cx} cy={cy} fill="none"
              stroke="rgba(120,190,230,0.28)" strokeWidth="1.2"
              initial={{ rx:14, ry:5, opacity:0.5 }}
              animate={{ rx:[14+j*18,46+j*22], ry:[5+j*3,14+j*5], opacity:[0.4,0] }}
              transition={{ duration:2.8, repeat:Infinity, delay:j*0.95+i*0.3 }} />
          ))
        ))}

        {/* ── LOTUS PADS (kidney shapes) ── */}
        {[
          [155,362,46,18],[315,388,40,16],[505,374,50,19],[690,392,36,15],[80,408,34,13],[430,400,30,12],
        ].map(([x,y,rx,ry],i)=>(
          <motion.g key={i} animate={inView?{y:[0,0.5,0]}:{}} transition={{duration:3+i*0.4,repeat:Infinity,ease:'easeInOut',delay:i*0.3}}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#1a7a12" opacity="0.84" />
            <line x1={x} y1={y-ry+1} x2={x} y2={y+ry-1} stroke="#156010" strokeWidth="0.8" opacity="0.35" />
          </motion.g>
        ))}

        {/* Lotus stems */}
        {[[158,358,158,328],[318,382,318,348],[508,368,508,332]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#009846" strokeWidth="2.5" />
        ))}

        {/* Lotus flowers */}
        {[[158,322,1],[318,342,0.9],[508,326,1.1]].map(([x,y,s],i)=>(
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            {[0,45,90,135,180,225,270,315].map((a,j)=>(
              <g key={j} transform={`rotate(${a})`}>
                <motion.ellipse cx="0" cy={-9} rx="3.5" ry="8"
                  fill={j%2===0?'#9b59b6':'#ff9ab8'} opacity="0.88"
                  animate={inView?{cy:[-9,-11,-9]}:{}}
                  transition={{duration:3.2+j*0.2,repeat:Infinity,ease:'easeInOut',delay:i*0.3+j*0.1}} />
              </g>
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#f3a213" />
            <circle cx="0" cy="0" r="2.2" fill="#D4AF37" />
          </g>
        ))}

        {/* Makhana pods floating */}
        {[[260,332,9],[312,320,7],[452,342,8],[494,327,6]].map(([x,y,r],i)=>(
          <motion.g key={i} animate={inView?{y:[0,-4,0]}:{}} transition={{duration:3.5+i*0.4,repeat:Infinity,ease:'easeInOut',delay:i*0.4}}>
            <circle cx={x} cy={y} r={r} fill="#ecdfc4" opacity="0.86" />
            <circle cx={x-r*0.3} cy={y-r*0.3} r={r*0.35} fill="white" fillOpacity="0.5" />
          </motion.g>
        ))}

        {/* ── BACKGROUND VILLAGE ── */}
        <g opacity="0.38">
          {[[685,268,28,22],[720,272,20,16]].map(([x,y,w,h],i)=>(
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="#3a1a08" rx="1"/>
              <polygon points={`${x-2},${y} ${x+w/2},${y-14} ${x+w+2},${y}`} fill="#2a1008"/>
            </g>
          ))}
        </g>

        {/* ══════════════════════════════════════════
            FARMER 1 — LEFT, carrying basket on head, in water
        ══════════════════════════════════════════ */}
        <g opacity="0.94" transform="translate(205, 348) scale(0.92)">
          <FarmerCharacter pose="wading" accessory="basket-head" animate={inView} />
          {/* Lantern (held out) */}
          <motion.circle cx="-34" cy="-40" r="13" fill="url(#fs-lantern)"
            animate={{ opacity: [0.5, 0.9, 0.5], r: [12, 15, 12] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <motion.rect x="-39" y="-44" width="8" height="9" rx="2" fill="#f3a213"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.6, repeat: Infinity }} />
        </g>

        {/* ══════════════════════════════════════════
            FARMER 2 — CENTER, bent forward harvesting
        ══════════════════════════════════════════ */}
        <g opacity="0.94" transform="translate(392, 350) scale(0.86)">
          <FarmerCharacter pose="bending" accessory="basket-arms" animate={inView} />
        </g>

        {/* ══════════════════════════════════════════
            FARMER 3 — RIGHT, upright, sorting harvest with a bamboo pole-net
        ══════════════════════════════════════════ */}
        <g opacity="0.94" transform="translate(582, 348) scale(0.92)">
          <FarmerCharacter pose="walking" animate={false} />
          {/* Bamboo pole + net, gripped where the raised right hand actually sits */}
          <motion.path d="M20 -52 C40 -58 62 -61 80 -63"
            stroke="#5c3010" strokeWidth="7" strokeLinecap="round" fill="none"
            animate={{ d: ['M20 -52 C40 -58 62 -61 80 -63', 'M20 -52 C40 -61 64 -66 82 -69'] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
          <motion.line x1="34" y1="-58" stroke="#7d4a1a" strokeWidth="3.5" strokeLinecap="round"
            animate={{ x2: [88, 90, 84, 88], y2: [-116, -121, -112, -116] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.path d="M76 -122 Q88 -130 100 -122 Q97 -104 88 -101 Q79 -104 76 -122 Z"
            fill="#7d3627" fillOpacity="0.88"
            animate={{ d: ['M76 -122 Q88 -130 100 -122 Q97 -104 88 -101 Q79 -104 76 -122 Z', 'M80 -126 Q92 -134 104 -126 Q101 -108 92 -105 Q83 -108 80 -126 Z'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        </g>

        {/* ── FOREGROUND REEDS ── */}
        {[[12,295],[28,290],[44,296],[756,292],[772,287],[788,293]].map(([x,y],i)=>(
          <motion.path key={i}
            d={`M ${x} ${y} Q ${x+2} ${y-22} ${x} ${y-34}`}
            stroke="#2a6a10" strokeWidth="3" strokeLinecap="round" fill="none"
            animate={{ d:[`M ${x} ${y} Q ${x+2} ${y-22} ${x} ${y-34}`,`M ${x} ${y} Q ${x+7} ${y-20} ${x+4} ${y-32}`] }}
            transition={{ duration:2.2+i*0.3, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
        ))}

        {/* Chimney smoke from distant village */}
        {inView && [0,1,2].map(i=>(
          <motion.circle key={i} cx={695+(i-1)*2} cy={268} r={2.5}
            fill="rgba(200,180,160,0.35)"
            initial={{ y:0, opacity:0, r:2.5 }}
            animate={{ y:[0,-18,-36], opacity:[0,0.28,0], r:[2.5,4.5,7.5] }}
            transition={{ duration:3.5, repeat:Infinity, delay:i*1.1, ease:'easeOut' }} />
        ))}

        {/* ── MADHUBANI BORDER (top + bottom) ── */}
        <rect x="0" y="0" width="800" height="3" fill="#f3a213" opacity="0.5" />
        {[...Array(20)].map((_,i)=>(
          <circle key={i} cx={20+i*40} cy="10" r="2.5" fill="#f3a213" opacity="0.35" />
        ))}
        <rect x="0" y="457" width="800" height="3" fill="#f3a213" opacity="0.5" />

        {/* ── LOCATION STAMP ── */}
        <rect x="18" y="406" width="188" height="44" rx="4"
          fill="rgba(5,1,0,0.72)" stroke="rgba(243,162,19,0.3)" strokeWidth="1" />
        <text x="112" y="424" textAnchor="middle" fontFamily="serif" fontSize="10"
          fill="#f3a213" opacity="0.9" letterSpacing="3">MITHILA</text>
        <text x="112" y="440" textAnchor="middle" fontFamily="serif" fontSize="8"
          fill="rgba(255,255,255,0.45)" letterSpacing="2">BIHAR · INDIA</text>

        {/* Dawn glow strip at horizon */}
        <motion.rect x="0" y="305" width="800" height="8"
          fill="rgba(243,162,19,0.05)"
          animate={isHarvest ? { opacity:1 } : { opacity:0 }}
          transition={{ duration:2.5 }} />
      </svg>
    </div>
  );
}
