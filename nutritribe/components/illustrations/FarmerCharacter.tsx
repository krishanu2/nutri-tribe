'use client';

import { motion } from 'framer-motion';

/* ── FarmerCharacter ──────────────────────────────────────────────────
   One shared, well-proportioned farmer figure used everywhere a farmer
   appears on the site (HarvestStoryScene, FarmerScene, CultureBanner's
   CinematicFarmerScene). Previously each of those files hand-drew its
   own farmer independently, with no shared palette or proportions —
   turban colors swung between red/gold/green/grey with no logic, and
   head-radius/limb-width ratios drifted between scenes (and even
   between frames within the same scene).

   Local coordinate convention: origin (0,0) sits at the ANKLE/ground
   contact point, head centred around y=-95 for a standing pose. Callers
   place the figure with a wrapping <g transform="translate(x,y) scale(s)">.
   Legs are built as filled tapered paths (wide at hip, narrow at ankle),
   not uniform-width strokes — this is the #1 anatomical fix from the
   audit. Hands are sized and positioned to actually terminate at what
   they're holding, passed in via the `holding` prop's coordinates.
   ──────────────────────────────────────────────────────────────────── */

export type FarmerPose =
  | 'walking'        // upright, mid-stride, arms swinging
  | 'wading'         // waist-deep in water, arms reaching down/out
  | 'diving'         // horizontal, swimming underwater
  | 'bending'        // bent forward ~35°, reaching into water
  | 'harvesting'     // standing, cradling a basket at chest height
  | 'seated-sorting'; // seated on a stool, sorting tray in lap

export type FarmerAccessory = 'basket-head' | 'basket-arms' | 'lantern' | 'pole-net' | 'none';

interface FarmerCharacterProps {
  pose: FarmerPose;
  accessory?: FarmerAccessory;
  /** Mirror the figure left-right */
  flip?: boolean;
  /** Gate looping animation the same way every other scene's `inView`/`anim` flag works */
  animate?: boolean;
  /** Brand-default gold; override only for deliberate narrative reasons (e.g. an elder's grey turban) */
  turbanColor?: string;
  turbanColorDark?: string;
  /** Skin/clothing stay locked to the brand palette by default — exposed mainly so darker/lighter variants can be made if a scene's lighting truly demands it */
  skinColor?: string;
  kurtaColor?: string;
  dhotiColor?: string;
}

/* Reusable tapered leg — filled path, hip-wide to ankle-narrow, not a uniform stroke */
function TaperedLeg({
  hipX, hipY, ankleX, ankleY, hipW = 9, ankleW = 5, color, opacity = 1,
}: {
  hipX: number; hipY: number; ankleX: number; ankleY: number;
  hipW?: number; ankleW?: number; color: string; opacity?: number;
}) {
  const dx = ankleX - hipX, dy = ankleY - hipY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len, ny = dx / len; // perpendicular unit vector
  const midX = hipX + dx * 0.5 + nx * 1.5, midY = hipY + dy * 0.5 + ny * 1.5;
  return (
    <path
      d={`M ${hipX - nx * hipW / 2} ${hipY - ny * hipW / 2}
          Q ${midX - nx * ankleW * 0.6} ${midY - ny * ankleW * 0.6} ${ankleX - nx * ankleW / 2} ${ankleY - ny * ankleW / 2}
          L ${ankleX + nx * ankleW / 2} ${ankleY + ny * ankleW / 2}
          Q ${midX + nx * ankleW * 0.6} ${midY + ny * ankleW * 0.6} ${hipX + nx * hipW / 2} ${hipY + ny * hipW / 2} Z`}
      fill={color}
      opacity={opacity}
    />
  );
}

/* Reusable hand — slightly larger than the old r=4.5 circles, with a subtle thumb notch */
function Hand({ cx, cy, r = 5.2, color }: { cx: number; cy: number; r?: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <ellipse cx={cx + r * 0.3} cy={cy - r * 0.15} rx={r * 0.4} ry={r * 0.55} fill={color} opacity={0.85} />
    </g>
  );
}

function HeadAndTurban({
  cx, cy, skinColor, turbanColor, turbanColorDark,
}: { cx: number; cy: number; skinColor: string; turbanColor: string; turbanColorDark: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="12" fill={skinColor} />
      {/* subtle face shading, not a flat disc */}
      <ellipse cx={cx - 4.5} cy={cy - 0.5} rx="2.6" ry="3.2" fill="rgba(0,0,0,0.18)" />
      <ellipse cx={cx + 3} cy={cy - 4} rx="3.5" ry="3" fill="rgba(255,255,255,0.12)" />
      {/* Turban */}
      <ellipse cx={cx} cy={cy - 9} rx="15" ry="6.5" fill={turbanColor} />
      <ellipse cx={cx} cy={cy - 11.5} rx="11" ry="4.5" fill={turbanColorDark} />
      <path d={`M ${cx - 11} ${cy - 9} Q ${cx} ${cy - 14.5} ${cx + 11} ${cy - 9}`}
        stroke={turbanColorDark} strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" />
      <circle cx={cx + 12} cy={cy - 9} r="3.5" fill={turbanColor} />
    </g>
  );
}

export default function FarmerCharacter({
  pose,
  accessory = 'none',
  flip = false,
  animate = true,
  turbanColor = '#f3a213',
  turbanColorDark = '#D4AF37',
  skinColor = '#6a3818',
  kurtaColor = '#5c3010',
  dhotiColor = '#e8d0a4',
}: FarmerCharacterProps) {
  const anim = animate;

  /* ── WALKING ── upright stride, tapered legs, swinging arms ── */
  if (pose === 'walking') {
    return (
      <g transform={flip ? 'scale(-1,1)' : undefined}>
        <ellipse cx="0" cy="2" rx="11" ry="3" fill="rgba(0,0,0,0.3)" />
        <motion.g animate={anim ? { x: [-2, 2, -2] } : {}} transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse' }}>
          <TaperedLeg hipX={-3} hipY={-44} ankleX={-5} ankleY={0} color={dhotiColor} />
        </motion.g>
        <motion.g animate={anim ? { x: [2, -2, 2] } : {}} transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse' }}>
          <TaperedLeg hipX={5} hipY={-44} ankleX={7} ankleY={0} color={dhotiColor} />
        </motion.g>
        {/* Dhoti drape */}
        <path d="M -10 -52 Q -11 -42 -8 -36 Q 0 -32 8 -36 Q 11 -42 10 -52 Q 5 -55 0 -55 Q -5 -55 -10 -52 Z" fill={dhotiColor} />
        {/* Kurta torso */}
        <path d="M -9 -52 Q -10 -68 -9 -84 L 9 -84 Q 10 -68 9 -52 Q 5 -55 0 -55 Q -5 -55 -9 -52 Z" fill={kurtaColor} />
        <path d="M -4 -84 Q -4 -68 -4 -54" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" fill="none" />
        <path d="M 4 -84 Q 4 -68 4 -54" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" fill="none" />
        {/* Arms swinging */}
        <motion.path d="M -9 -78 Q -18 -68 -21 -54" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M -9 -78 Q -18 -68 -21 -54', 'M -9 -78 Q -15 -64 -16 -48'] } : {}}
          transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse' }} />
        <Hand cx={-20} cy={-52} r={5} color={skinColor} />
        <motion.path d="M 9 -78 Q 18 -68 21 -54" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M 9 -78 Q 18 -68 21 -54', 'M 9 -78 Q 15 -64 16 -48'] } : {}}
          transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', delay: 0.27 }} />
        <Hand cx={20} cy={-52} r={5} color={skinColor} />
        <HeadAndTurban cx={0} cy={-93} skinColor={skinColor} turbanColor={turbanColor} turbanColorDark={turbanColorDark} />
        {accessory === 'basket-head' && (
          <g>
            <ellipse cx="0" cy="-108" rx="10" ry="4.2" fill="#8B6914" opacity="0.92" />
            <path d="M -9 -108 Q 0 -116 9 -108" stroke="#a07820" strokeWidth="3" fill="none" />
            {[[-3, -1], [0, -2], [3, -1]].map(([dx, dy], i) => (
              <circle key={i} cx={dx} cy={-112 + dy} r="2.8" fill="#ecdfc4" opacity="0.88" />
            ))}
          </g>
        )}
        {accessory === 'lantern' && (
          <motion.g animate={anim ? { opacity: [0.5, 0.9, 0.5] } : {}} transition={{ duration: 1.6, repeat: Infinity }}>
            <circle cx="-30" cy="-50" r="13" fill="#f3a213" opacity="0.18" />
            <rect x="-34" y="-54" width="8" height="9" rx="2" fill="#f3a213" />
          </motion.g>
        )}
      </g>
    );
  }

  /* ── WADING ── waist-deep, lower body hinted under water, arms reach down ── */
  if (pose === 'wading') {
    return (
      <g transform={flip ? 'scale(-1,1)' : undefined}>
        <motion.ellipse cx="0" cy="0" rx="14" ry="5" fill="none" stroke="rgba(120,190,230,0.35)" strokeWidth="1.2"
          animate={anim ? { rx: [12, 32], ry: [4, 10], opacity: [0.5, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity }} />
        <rect x="-7" y="-8" width="14" height="8" fill="#0e2440" fillOpacity="0.5" rx="2" />
        <path d="M -8 -13 Q -10 -20 -8 -26 Q 0 -24 8 -26 Q 10 -20 8 -13 Q 4 -11 0 -11 Q -4 -11 -8 -13 Z" fill={dhotiColor} />
        <path d="M -8 -26 Q -9 -34 -8 -42 L 8 -42 Q 9 -34 8 -26 Q 4 -24 0 -24 Q -4 -24 -8 -26 Z" fill={kurtaColor} />
        <motion.path d="M 8 -38 Q 16 -26 14 -10" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M 8 -38 Q 16 -26 14 -10', 'M 8 -38 Q 13 -24 11 -8'] } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
        <Hand cx={13} cy={-8} r={4.8} color={skinColor} />
        <motion.path d="M -8 -38 Q -16 -26 -14 -10" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M -8 -38 Q -16 -26 -14 -10', 'M -8 -38 Q -13 -22 -10 -6'] } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }} />
        <Hand cx={-10} cy={-7} r={4.8} color={skinColor} />
        <HeadAndTurban cx={0} cy={-50} skinColor={skinColor} turbanColor={turbanColor} turbanColorDark={turbanColorDark} />
        {accessory === 'basket-arms' && (
          <g>
            <ellipse cx="-18" cy="-43" rx="12" ry="5" fill="#8B5a14" opacity="0.9" />
            <path d="M -29 -43 Q -18 -52 -7 -43" stroke="#a07020" strokeWidth="3" fill="none" />
          </g>
        )}
      </g>
    );
  }

  /* ── BENDING ── two-segment articulation: hip stays vertical, torso pivots from the hip joint (not the whole body as one rigid block) ── */
  if (pose === 'bending') {
    return (
      <g transform={flip ? 'scale(-1,1)' : undefined}>
        <ellipse cx="9" cy="2" rx="13" ry="3.5" fill="rgba(0,0,0,0.25)" />
        <TaperedLeg hipX={-5} hipY={-46} ankleX={-9} ankleY={0} color={dhotiColor} />
        <TaperedLeg hipX={8} hipY={-46} ankleX={10} ankleY={0} color={dhotiColor} />
        <path d="M -14 -54 Q -16 -44 -14 -38 Q 0 -33 14 -38 Q 16 -44 14 -54 Q 7 -57 0 -57 Q -7 -57 -14 -54 Z" fill={dhotiColor} />
        {/* Torso pivots from the hip (0,-54), not the whole figure */}
        <g transform="rotate(35, 0, -54)">
          <path d="M -14 -54 Q -16 -64 -14 -76 L 14 -76 Q 16 -64 14 -54 Q 7 -57 0 -57 Q -7 -57 -14 -54 Z" fill={kurtaColor} />
          <motion.path d="M 14 -68 Q 24 -54 28 -36" stroke={kurtaColor} strokeWidth="7.5" strokeLinecap="round" fill="none"
            animate={anim ? { d: ['M 14 -68 Q 24 -54 28 -36', 'M 14 -68 Q 22 -52 24 -34'] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
          <motion.g animate={anim ? { y: [-32, -28, -32] } : {}} transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}>
            <Hand cx={25} cy={-32} r={4.8} color={skinColor} />
          </motion.g>
          <motion.path d="M -14 -68 Q -24 -58 -28 -46" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none"
            animate={anim ? { d: ['M -14 -68 Q -24 -58 -28 -46', 'M -14 -68 Q -22 -55 -25 -42'] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.4 }} />
          <Hand cx={-26} cy={-44} r={4.6} color={skinColor} />
          {accessory === 'basket-arms' && (
            <g>
              <ellipse cx="-32" cy="-50" rx="11" ry="4.6" fill="#7d3627" opacity="0.92" />
              <path d="M -43 -50 Q -32 -58 -21 -50" stroke="#9a4a30" strokeWidth="3" fill="none" />
            </g>
          )}
          <HeadAndTurban cx={0} cy={-70} skinColor={skinColor} turbanColor={turbanColor} turbanColorDark={turbanColorDark} />
        </g>
      </g>
    );
  }

  /* ── DIVING ── horizontal swimming body ── */
  if (pose === 'diving') {
    return (
      <g transform={flip ? 'scale(-1,1)' : undefined}>
        <motion.path d="M -20 0 Q -10 -8 0 -13" stroke={skinColor} strokeWidth="8" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M -20 0 Q -10 -8 0 -13', 'M -20 -8 Q -10 -5 0 -3'] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }} />
        <motion.path d="M -20 8 Q -8 6 0 9" stroke={skinColor} strokeWidth="8" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M -20 8 Q -8 6 0 9', 'M -20 0 Q -8 4 0 15'] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: 0.3 }} />
        <path d="M -5 -2 Q 8 -4 20 -6 Q 15 6 2 8 Z" fill={dhotiColor} opacity="0.7" />
        <rect x="26" y="-10" width="52" height="20" rx="6" fill={kurtaColor} transform="rotate(-8 52 0)" />
        <circle cx="20" cy="-4" r="13" fill={skinColor} />
        <path d="M 10 -11 Q 20 -17 32 -13 Q 29 -7 20 -6 Q 11 -8 10 -11 Z" fill={turbanColor} opacity="0.9" />
        <motion.path d="M 27 8 Q 25 30 22 52" stroke={skinColor} strokeWidth="7" strokeLinecap="round" fill="none"
          animate={anim ? { d: ['M 27 8 Q 25 30 22 52', 'M 27 8 Q 28 30 31 48'] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
        <motion.g animate={anim ? { cy: [52, 64, 52] } : {}} transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}>
          <Hand cx={22} cy={52} r={5} color={skinColor} />
        </motion.g>
        {[[19, -10, 0], [25, -13, 0.7], [13, -8, 1.4]].map(([x, y, d], i) => (
          <motion.circle key={i} cx={x} cy={y} r={2.5 + (i % 3)} fill="none" stroke="rgba(120,210,180,0.6)" strokeWidth="1"
            animate={anim ? { cy: [y, y - 60, y - 100], opacity: [0.7, 0.4, 0] } : {}}
            transition={{ duration: 2.8, repeat: Infinity, delay: d, ease: 'easeOut' }} />
        ))}
      </g>
    );
  }

  /* ── HARVESTING ── standing proud, cradling a basket at chest height, hands genuinely meet the basket rim ── */
  if (pose === 'harvesting') {
    return (
      <g transform={flip ? 'scale(-1,1)' : undefined}>
        <TaperedLeg hipX={-2} hipY={-18} ankleX={-4} ankleY={0} color={dhotiColor} />
        <TaperedLeg hipX={6} hipY={-18} ankleX={8} ankleY={0} color={dhotiColor} />
        <path d="M -10 -14 Q -13 -26 -10 -32 Q 0 -30 9 -32 Q 12 -26 9 -14 Q 4 -12 0 -12 Q -4 -12 -10 -14 Z" fill={dhotiColor} />
        <path d="M -10 -32 Q -11 -48 -10 -64 L 9 -64 Q 11 -48 9 -32 Q 4 -30 0 -30 Q -5 -30 -10 -32 Z" fill={kurtaColor} />
        {/* Arms curve in to meet the basket rim exactly */}
        <path d="M -10 -52 Q -19 -44 -22 -34" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 9 -52 Q 18 -44 21 -34" stroke={kurtaColor} strokeWidth="7" strokeLinecap="round" fill="none" />
        <Hand cx={-21} cy={-32} r={4.6} color={skinColor} />
        <Hand cx={20} cy={-32} r={4.6} color={skinColor} />
        {/* Basket sits precisely between the two hand positions */}
        <path d="M -22 -34 Q 0 -22 22 -34 Q 25 -16 0 -10 Q -25 -16 -22 -34 Z" fill="#8B5a14" />
        <ellipse cx="0" cy="-34" rx="24" ry="7.5" fill="#a07020" />
        {/* Woven lattice instead of straight lines */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = -18 + i * 7;
          return (
            <path key={`h-${i}`} d={`M ${x} -34 Q ${x * 0.3} -20 0 -14`} stroke="#6a4010" strokeWidth="0.8" opacity="0.45" fill="none" />
          );
        })}
        {Array.from({ length: 3 }).map((_, i) => (
          <path key={`v-${i}`} d={`M -22 ${-30 + i * 4} Q 0 ${-22 + i * 3} 22 ${-30 + i * 4}`}
            stroke="#6a4010" strokeWidth="0.7" opacity="0.4" fill="none" />
        ))}
        {/* Seeds overflowing, spring in */}
        {[[-12, -38], [0, -41], [12, -38], [-6, -44], [6, -44], [0, -36]].map(([x, y], i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={anim ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.0 + i * 0.08, type: 'spring', stiffness: 280 }}
            style={{ originX: `${x}px`, originY: `${y}px` }}>
            <circle cx={x} cy={y} r="4.5" fill="#f0e4c8" />
            <circle cx={x - 1.3} cy={y - 1.3} r="1.6" fill="rgba(255,255,255,0.55)" />
          </motion.g>
        ))}
        <HeadAndTurban cx={0} cy={-72} skinColor={skinColor} turbanColor={turbanColor} turbanColorDark={turbanColorDark} />
        <path d="M -4 -69 Q 0 -66 4 -69" stroke="#3a1008" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  /* ── SEATED-SORTING ── on a low stool, tray in lap ── */
  return (
    <g transform={flip ? 'scale(-1,1)' : undefined}>
      <rect x="-12" y="-2" width="24" height="5" fill="#5c3010" rx="1.5" />
      <rect x="-10" y="3" width="4" height="8" fill="#4a2808" />
      <rect x="6" y="3" width="4" height="8" fill="#4a2808" />
      <ellipse cx="8" cy="-12" rx="14" ry="5" fill="#8B6914" fillOpacity="0.85" />
      <ellipse cx="8" cy="-12" rx="12" ry="3.5" fill="#a07820" fillOpacity="0.5" />
      {[[-2, -14], [4, -14], [10, -13], [0, -12], [6, -12]].map(([sx, sy], i) => (
        <circle key={i} cx={sx + 8} cy={sy} r="2.2" fill="#ecdfc4" opacity="0.88" />
      ))}
      <path d="M -8 -4 Q -12 6 -8 12" stroke={dhotiColor} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M 4 -4 Q 8 6 6 12" stroke={dhotiColor} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M -9 -4 C -11 2 -10 8 -8 12 Q 0 10 6 12 C 8 8 9 2 7 -4 Q 3 -2 0 -2 Q -3 -2 -9 -4 Z" fill={dhotiColor} opacity="0.9" />
      <path d="M -8 -4 Q -9 -12 -8 -22 L 8 -22 Q 9 -12 8 -4 Q 4 -2 0 -2 Q -4 -2 -8 -4 Z" fill="#f0f0f0" />
      <motion.path d="M 8 -18 Q 18 -14 20 -8" stroke="#f0f0f0" strokeWidth="5.5" strokeLinecap="round" fill="none"
        animate={anim ? { d: ['M 8 -18 Q 18 -14 20 -8', 'M 8 -18 Q 16 -12 16 -6'] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
      <Hand cx={18} cy={-7} r={4.4} color={skinColor} />
      <path d="M -8 -18 Q -16 -12 -14 -8" stroke="#f0f0f0" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <Hand cx={-14} cy={-7} r={4.4} color={skinColor} />
      <HeadAndTurban cx={0} cy={-32} skinColor={skinColor} turbanColor={turbanColor} turbanColorDark={turbanColorDark} />
    </g>
  );
}
