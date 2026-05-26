'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

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
            FARMER 1 — LEFT, carrying basket, in water
        ══════════════════════════════════════════ */}
        <g opacity="0.94">
          {/* Ground shadow */}
          <ellipse cx="205" cy="316" rx="20" ry="4" fill="rgba(0,0,0,0.28)" />

          {/* Legs in water */}
          <path d="M197 318 L193 348" stroke="#e8d0a4" strokeWidth="8.5" strokeLinecap="round" fill="none" />
          <path d="M213 318 L216 348" stroke="#e8d0a4" strokeWidth="8.5" strokeLinecap="round" fill="none" />

          {/* Dhoti */}
          <path d="M188 300 C186 308 188 318 192 320 Q205 325 218 320 C222 318 224 308 222 300 Q214 298 205 298 Q196 298 188 300 Z"
            fill="#e8d0a4" />
          {/* Dhoti fold */}
          <path d="M205 298 Q205.5 308 206 318" stroke="#c4a060" strokeWidth="0.8" opacity="0.4" fill="none" />

          {/* Kurta body (tapered, not a rectangle) */}
          <path d="M192 300 C190 290 191 278 192 268 L218 268 C219 278 220 290 218 300 Q212 298 205 298 Q198 298 192 300 Z"
            fill="#5c3010" />
          {/* Kurta texture */}
          <path d="M198 268 Q198 280 198 298" stroke="#4a2010" strokeWidth="0.7" opacity="0.3" fill="none" />
          <path d="M212 268 Q212 280 212 298" stroke="#4a2010" strokeWidth="0.7" opacity="0.3" fill="none" />

          {/* Left arm swinging */}
          <motion.path d="M192 280 C180 290 174 306 172 322"
            stroke="#5c3010" strokeWidth="7" strokeLinecap="round" fill="none"
            animate={{ d:['M192 280 C180 290 174 306 172 322','M192 280 C183 292 180 308 180 325'] }}
            transition={{ duration:2.8, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
          <motion.circle cx="172" cy="322" r="4.5" fill="#6a3a18"
            animate={{ cx:[172,180], cy:[322,325] }}
            transition={{ duration:2.8, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />

          {/* Right arm raised (supporting basket) */}
          <path d="M218 278 L222 258" stroke="#5c3010" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="222" cy="257" r="4" fill="#6a3a18" />

          {/* Head */}
          <circle cx="205" cy="258" r="12" fill="#6a3a18" />
          <ellipse cx="193" cy="257" rx="3" ry="3.5" fill="#5a2e14" />

          {/* Turban — gold/amber */}
          <ellipse cx="205" cy="249" rx="15" ry="6.5" fill="#f3a213" />
          <ellipse cx="205" cy="246.5" rx="11" ry="4.5" fill="#D4AF37" />
          <path d="M194 249 Q205 244 216 249" stroke="#e8920f" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" />
          <circle cx="217" cy="249" r="3.5" fill="#f3a213" />

          {/* Basket on head */}
          <ellipse cx="205" cy="241" rx="10" ry="4.2" fill="#8B6914" opacity="0.92" />
          <path d="M196 241 Q205 233 214 241" stroke="#a07820" strokeWidth="3" fill="none" />
          {/* Makhana in basket */}
          {[[-3,-1],[0,-2],[3,-1]].map(([dx,dy],i)=>(
            <circle key={i} cx={205+dx} cy={237+dy} r="2.8" fill="#ecdfc4" opacity="0.88" />
          ))}

          {/* Lantern (held out) */}
          <motion.circle cx="174" cy="308" r="13" fill="url(#fs-lantern)"
            animate={{ opacity:[0.5,0.9,0.5], r:[12,15,12] }} transition={{ duration:1.6, repeat:Infinity }} />
          <motion.rect x="169" y="304" width="8" height="9" rx="2" fill="#f3a213"
            animate={{ opacity:[0.7,1,0.7] }} transition={{ duration:1.6, repeat:Infinity }} />
        </g>

        {/* ══════════════════════════════════════════
            FARMER 2 — CENTER, bent forward harvesting
        ══════════════════════════════════════════ */}
        <g opacity="0.94">
          <ellipse cx="392" cy="318" rx="22" ry="4.5" fill="rgba(0,0,0,0.25)" />

          {/* Legs */}
          <path d="M383 316 L380 350" stroke="#e8d0a4" strokeWidth="8.5" strokeLinecap="round" fill="none" />
          <path d="M400 318 L402 350" stroke="#e8d0a4" strokeWidth="8.5" strokeLinecap="round" fill="none" />

          {/* Dhoti */}
          <path d="M374 298 C372 306 374 316 378 320 Q392 325 406 320 C410 316 412 306 410 298 Q401 296 392 296 Q383 296 374 298 Z"
            fill="#e8d0a4" />
          <path d="M392 296 Q392.5 306 393 318" stroke="#c4a060" strokeWidth="0.8" opacity="0.4" fill="none" />

          {/* Upper body — bent forward ~35° */}
          <g transform="rotate(35, 392, 298)">
            {/* Kurta */}
            <path d="M378 298 C376 288 377 276 378 266 L406 266 C407 276 408 288 406 298 Q399 296 392 296 Q385 296 378 298 Z"
              fill="#3a6820" />
            <path d="M384 266 Q384 278 384 296" stroke="#2a5018" strokeWidth="0.7" opacity="0.3" fill="none" />
            <path d="M400 266 Q400 278 400 296" stroke="#2a5018" strokeWidth="0.7" opacity="0.3" fill="none" />

            {/* Right arm reaching into water */}
            <motion.path d="M406 278 C416 292 424 310 428 328"
              stroke="#3a6820" strokeWidth="7.5" strokeLinecap="round" fill="none"
              animate={{ d:['M406 278 C416 292 424 310 428 328','M406 278 C414 290 420 308 424 326'] }}
              transition={{ duration:1.8, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
            {/* Arm fades into water */}
            <motion.ellipse cx="427" cy="323" rx="5" ry="2.5" fill="rgba(14,34,53,0.6)"
              animate={{ cx:[427,423], opacity:[0.5,0.8,0.5] }}
              transition={{ duration:1.8, repeat:Infinity, repeatType:'reverse' }} />

            {/* Left arm — raised with basket */}
            <motion.path d="M378 278 C366 268 360 260 358 250"
              stroke="#3a6820" strokeWidth="7" strokeLinecap="round" fill="none"
              animate={{ d:['M378 278 C366 268 360 260 358 250','M378 278 C364 265 357 255 354 245'] }}
              transition={{ duration:1.8, repeat:Infinity, repeatType:'reverse', ease:'easeInOut', delay:0.4 }} />
            <circle cx="357" cy="250" r="4.5" fill="#6a3a18" />

            {/* Basket */}
            <ellipse cx="350" cy="243" rx="12" ry="5" fill="#7d3627" opacity="0.92" />
            <path d="M339 243 Q350 234 361 243" stroke="#9a4a30" strokeWidth="3" fill="none" />

            {/* Head */}
            <circle cx="392" cy="256" r="12" fill="#6a3a18" />
            <ellipse cx="380" cy="255" rx="3" ry="3.5" fill="#5a2e14" />

            {/* Turban — green */}
            <ellipse cx="392" cy="247" rx="15" ry="6.5" fill="#009846" />
            <ellipse cx="392" cy="244.5" rx="11" ry="4.5" fill="#007a38" />
            <path d="M381 247 Q392 242 403 247" stroke="#00b858" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
            <circle cx="404" cy="247" r="3.5" fill="#009846" />
          </g>
        </g>

        {/* ══════════════════════════════════════════
            FARMER 3 — RIGHT, upright, sorting harvest
        ══════════════════════════════════════════ */}
        <g opacity="0.94">
          <ellipse cx="582" cy="314" rx="20" ry="4" fill="rgba(0,0,0,0.25)" />

          {/* Legs */}
          <path d="M574 312 L571 348" stroke="#e8d0a4" strokeWidth="8.5" strokeLinecap="round" fill="none" />
          <path d="M590 312 L592 348" stroke="#e8d0a4" strokeWidth="8.5" strokeLinecap="round" fill="none" />

          {/* Dhoti */}
          <path d="M570 294 C568 302 570 312 574 316 Q582 320 590 316 C594 312 596 302 594 294 Q588 292 582 292 Q576 292 570 294 Z"
            fill="#e8d0a4" />
          <path d="M582 292 Q582.5 302 583 314" stroke="#c4a060" strokeWidth="0.8" opacity="0.4" fill="none" />

          {/* Kurta */}
          <path d="M574 294 C572 284 573 272 574 262 L590 262 C591 272 592 284 590 294 Q586 292 582 292 Q578 292 574 294 Z"
            fill="#5c3010" />
          <path d="M578 262 Q578 274 578 292" stroke="#4a2010" strokeWidth="0.7" opacity="0.3" fill="none" />
          <path d="M586 262 Q586 274 586 292" stroke="#4a2010" strokeWidth="0.7" opacity="0.3" fill="none" />

          {/* Right arm — holding pole horizontally */}
          <motion.path d="M590 274 C608 268 630 265 648 263"
            stroke="#5c3010" strokeWidth="7" strokeLinecap="round" fill="none"
            animate={{ d:['M590 274 C608 268 630 265 648 263','M590 274 C608 265 632 260 650 257'] }}
            transition={{ duration:2.4, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
          {/* Bamboo pole */}
          <motion.line x1="602" y1="268" stroke="#7d4a1a" strokeWidth="3.5" strokeLinecap="round"
            animate={{ x2:[656,658,652,656], y2:[210,205,214,210] }}
            transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }} />
          {/* Net/basket at pole end */}
          <motion.path d="M644 204 Q656 196 668 204 Q665 222 656 225 Q647 222 644 204 Z"
            fill="#7d3627" fillOpacity="0.88"
            animate={{ d:['M644 204 Q656 196 668 204 Q665 222 656 225 Q647 222 644 204 Z','M648 200 Q660 192 672 200 Q669 218 660 221 Q651 218 648 200 Z'] }}
            transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }} />

          {/* Left arm — balancing */}
          <motion.path d="M574 278 C560 288 554 302 552 318"
            stroke="#5c3010" strokeWidth="7" strokeLinecap="round" fill="none"
            animate={{ d:['M574 278 C560 288 554 302 552 318','M574 278 C562 290 558 305 558 322'] }}
            transition={{ duration:2.4, repeat:Infinity, repeatType:'reverse', ease:'easeInOut', delay:0.3 }} />
          <motion.circle cx="552" cy="318" r="4.5" fill="#6a3a18"
            animate={{ cx:[552,558], cy:[318,322] }}
            transition={{ duration:2.4, repeat:Infinity, repeatType:'reverse', ease:'easeInOut', delay:0.3 }} />

          {/* Head */}
          <circle cx="582" cy="252" r="12" fill="#6a3a18" />
          <ellipse cx="570" cy="251" rx="3" ry="3.5" fill="#5a2e14" />

          {/* Turban — amber */}
          <ellipse cx="582" cy="243" rx="15" ry="6.5" fill="#f3a213" />
          <ellipse cx="582" cy="240.5" rx="11" ry="4.5" fill="#D4AF37" />
          <path d="M571 243 Q582 238 593 243" stroke="#e8920f" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" />
          <circle cx="594" cy="243" r="3.5" fill="#f3a213" />
          {/* Turban tail */}
          <motion.path d="M594 243 Q598 252 595 260 Q593 267 596 274"
            stroke="#f3a213" strokeWidth="2.5" fill="none" strokeLinecap="round"
            animate={{ d:['M594 243 Q598 252 595 260 Q593 267 596 274','M594 243 Q600 252 597 260 Q595 267 598 274'] }}
            transition={{ duration:1.4, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
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
