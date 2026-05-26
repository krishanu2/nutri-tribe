export default function MakhanaScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Makhana ball - main gradient (3D sphere look) */}
        <radialGradient id="mk1" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="35%" stopColor="#ecdfc4" />
          <stop offset="70%" stopColor="#d4b485" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
        {/* Makhana ball - slightly darker variant */}
        <radialGradient id="mk2" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5edd8" />
          <stop offset="40%" stopColor="#d8c09a" />
          <stop offset="80%" stopColor="#b89070" />
          <stop offset="100%" stopColor="#9a7250" />
        </radialGradient>
        {/* Makhana ball - shadow/back variant */}
        <radialGradient id="mk3" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e8d8b8" />
          <stop offset="55%" stopColor="#c0a07a" />
          <stop offset="100%" stopColor="#8a6850" />
        </radialGradient>
        {/* Bowl body gradient */}
        <linearGradient id="bowl-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c2a10" />
          <stop offset="25%" stopColor="#7d3627" />
          <stop offset="55%" stopColor="#9a4230" />
          <stop offset="80%" stopColor="#7d3627" />
          <stop offset="100%" stopColor="#5c2a10" />
        </linearGradient>
        {/* Bowl opening (inner dark ellipse) */}
        <radialGradient id="bowl-inner" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3d1a0c" />
          <stop offset="70%" stopColor="#4e2215" />
          <stop offset="100%" stopColor="#5c2a10" />
        </radialGradient>
        {/* Rim gold gradient */}
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f3a213" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#F2D57E" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffe08a" stopOpacity="1" />
          <stop offset="70%" stopColor="#F2D57E" stopOpacity="1" />
          <stop offset="100%" stopColor="#f3a213" stopOpacity="0.5" />
        </linearGradient>
        {/* Ground shadow */}
        <radialGradient id="gnd-shadow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#7d3627" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7d3627" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── GROUND SHADOW ── */}
      <ellipse cx="250" cy="472" rx="160" ry="18" fill="url(#gnd-shadow)" />

      {/* ── SCATTERED LOOSE MAKHANA (back layer) ── */}
      <circle cx="38" cy="420" r="26" fill="url(#mk3)" opacity="0.75" />
      <ellipse cx="30" cy="412" rx="5" ry="3.5" fill="#7a5c30" opacity="0.4" transform="rotate(-20 30 412)" />
      <circle cx="44" cy="408" r="3" fill="#7a5c30" opacity="0.35" />

      <circle cx="465" cy="410" r="30" fill="url(#mk3)" opacity="0.75" />
      <ellipse cx="456" cy="402" rx="5.5" ry="3.5" fill="#7a5c30" opacity="0.4" transform="rotate(-15 456 402)" />
      <circle cx="472" cy="398" r="3.5" fill="#7a5c30" opacity="0.35" />

      <circle cx="68" cy="370" r="22" fill="url(#mk2)" opacity="0.8" />
      <circle cx="60" cy="363" r="4" fill="#7a5c30" opacity="0.4" />
      <circle cx="75" cy="360" r="2.5" fill="#7a5c30" opacity="0.3" />

      <circle cx="442" cy="365" r="24" fill="url(#mk2)" opacity="0.8" />
      <circle cx="434" cy="357" r="4" fill="#7a5c30" opacity="0.4" />
      <circle cx="450" cy="354" r="3" fill="#7a5c30" opacity="0.3" />

      {/* ── BOWL BODY ── */}
      <path
        d="M 98 258 Q 75 360 82 398 Q 110 458 250 465 Q 390 458 418 398 Q 425 360 402 258 Z"
        fill="url(#bowl-body)"
      />
      {/* Bowl texture lines */}
      <path d="M 120 290 Q 100 370 110 410" stroke="#5c2a10" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M 380 290 Q 400 370 390 410" stroke="#5c2a10" strokeWidth="1.5" opacity="0.4" fill="none" />
      {/* Bowl base foot */}
      <ellipse cx="250" cy="462" rx="88" ry="14" fill="#4a2010" />
      <ellipse cx="250" cy="462" rx="88" ry="14" stroke="#f3a213" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Bowl inner shadow */}
      <ellipse cx="250" cy="258" rx="152" ry="32" fill="url(#bowl-inner)" />

      {/* ── MAKHANA IN BOWL (back rows) ── */}
      <circle cx="168" cy="238" r="36" fill="url(#mk2)" />
      <ellipse cx="157" cy="226" rx="6" ry="4" fill="#7a5c30" opacity="0.45" transform="rotate(-15 157 226)" />
      <circle cx="175" cy="222" r="3.5" fill="#7a5c30" opacity="0.35" />
      <circle cx="182" cy="234" r="4" fill="#7a5c30" opacity="0.3" />

      <circle cx="332" cy="238" r="36" fill="url(#mk2)" />
      <ellipse cx="320" cy="226" rx="6" ry="4" fill="#7a5c30" opacity="0.45" transform="rotate(-15 320 226)" />
      <circle cx="340" cy="222" r="3.5" fill="#7a5c30" opacity="0.35" />
      <circle cx="345" cy="234" r="4" fill="#7a5c30" opacity="0.3" />

      {/* Center top ball */}
      <circle cx="250" cy="225" r="40" fill="url(#mk1)" />
      <ellipse cx="237" cy="211" rx="7" ry="5" fill="#7a5c30" opacity="0.5" transform="rotate(-20 237 211)" />
      <circle cx="258" cy="207" r="4.5" fill="#7a5c30" opacity="0.4" />
      <circle cx="268" cy="220" r="5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="242" cy="213" rx="10" ry="7" fill="white" opacity="0.35" transform="rotate(-20 242 213)" />

      {/* ── BOWL RIM (gold) ── */}
      <ellipse cx="250" cy="258" rx="152" ry="32" stroke="url(#rim)" strokeWidth="4" fill="none" />
      <ellipse cx="250" cy="258" rx="149" ry="29" stroke="#F2D57E" strokeWidth="1" fill="none" opacity="0.35" />

      {/* ── MAKHANA SPILLING OUT (foreground) ── */}
      {/* Front left */}
      <circle cx="100" cy="320" r="42" fill="url(#mk1)" />
      <ellipse cx="86" cy="305" rx="7" ry="5" fill="#7a5c30" opacity="0.5" transform="rotate(-20 86 305)" />
      <circle cx="108" cy="300" r="4.5" fill="#7a5c30" opacity="0.4" />
      <circle cx="118" cy="315" r="5.5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="90" cy="306" rx="12" ry="8" fill="white" opacity="0.32" transform="rotate(-25 90 306)" />

      {/* Front center-left */}
      <circle cx="210" cy="340" r="44" fill="url(#mk1)" />
      <ellipse cx="195" cy="324" rx="7.5" ry="5" fill="#7a5c30" opacity="0.5" transform="rotate(-18 195 324)" />
      <circle cx="218" cy="318" r="5" fill="#7a5c30" opacity="0.4" />
      <circle cx="228" cy="333" r="6" fill="#7a5c30" opacity="0.35" />
      <circle cx="205" cy="342" r="4" fill="#7a5c30" opacity="0.3" />
      <ellipse cx="198" cy="325" rx="13" ry="9" fill="white" opacity="0.32" transform="rotate(-22 198 325)" />

      {/* Front center-right */}
      <circle cx="300" cy="338" r="42" fill="url(#mk1)" />
      <ellipse cx="286" cy="323" rx="7" ry="4.5" fill="#7a5c30" opacity="0.5" transform="rotate(-20 286 323)" />
      <circle cx="308" cy="317" r="4.5" fill="#7a5c30" opacity="0.4" />
      <circle cx="318" cy="331" r="5.5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="289" cy="324" rx="12" ry="8" fill="white" opacity="0.32" transform="rotate(-22 289 324)" />

      {/* Front right */}
      <circle cx="400" cy="322" r="40" fill="url(#mk1)" />
      <ellipse cx="387" cy="308" rx="6.5" ry="4.5" fill="#7a5c30" opacity="0.5" transform="rotate(-18 387 308)" />
      <circle cx="408" cy="303" r="4" fill="#7a5c30" opacity="0.4" />
      <circle cx="416" cy="318" r="5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="390" cy="309" rx="11" ry="7.5" fill="white" opacity="0.32" transform="rotate(-24 390 309)" />

      {/* ── LOTUS FLOWER DECORATION ── */}
      <path d="M 472 468 Q 478 400 462 335" stroke="#009846" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="474" cy="418" rx="32" ry="18" fill="#009846" opacity="0.75" transform="rotate(-25 474 418)" />
      <ellipse cx="455" cy="375" rx="22" ry="12" fill="#009846" opacity="0.6" transform="rotate(20 455 375)" />
      {/* Petals */}
      <ellipse cx="442" cy="318" rx="13" ry="32" fill="#9b59b6" opacity="0.9" transform="rotate(-22 442 318)" />
      <ellipse cx="455" cy="311" rx="13" ry="32" fill="#7c3aed" opacity="0.9" transform="rotate(-5 455 311)" />
      <ellipse cx="468" cy="318" rx="13" ry="32" fill="#9b59b6" opacity="0.9" transform="rotate(22 468 318)" />
      <ellipse cx="432" cy="328" rx="11" ry="26" fill="#ffd0e4" opacity="0.75" transform="rotate(-42 432 328)" />
      <ellipse cx="478" cy="328" rx="11" ry="26" fill="#ffd0e4" opacity="0.75" transform="rotate(42 478 328)" />
      {/* Lotus center */}
      <circle cx="455" cy="300" r="14" fill="#f3a213" />
      <circle cx="455" cy="300" r="5" fill="#FFD700" />
      {[[450, 294], [459, 293], [447, 298], [463, 297], [452, 303]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#ffe066" opacity="0.9" />
      ))}

      {/* ── SMALL LOOSE SEEDS ── */}
      {[[148, 400, 14], [275, 418, 12], [348, 408, 15], [418, 442, 11]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="url(#mk3)" opacity="0.65" />
          <circle cx={x - 3} cy={y - 3} r={2.5} fill="#7a5c30" opacity="0.35" />
        </g>
      ))}

      {/* ── GOLD SPARKLES ── */}
      {[
        [52, 200, 9],
        [130, 128, 11],
        [356, 110, 8],
        [488, 180, 10],
        [30, 320, 7],
      ].map(([x, y, r], i) => (
        <g key={i} opacity="0.7">
          <line x1={x} y1={y - r} x2={x} y2={y + r} stroke="#f3a213" strokeWidth="1.5" />
          <line x1={x - r} y1={y} x2={x + r} y2={y} stroke="#f3a213" strokeWidth="1.5" />
          <line x1={x - r * 0.7} y1={y - r * 0.7} x2={x + r * 0.7} y2={y + r * 0.7} stroke="#f3a213" strokeWidth="1" opacity="0.5" />
          <line x1={x + r * 0.7} y1={y - r * 0.7} x2={x - r * 0.7} y2={y + r * 0.7} stroke="#f3a213" strokeWidth="1" opacity="0.5" />
          <circle cx={x} cy={y} r="2.2" fill="#f3a213" />
        </g>
      ))}
    </svg>
  );
}
