'use client';

/* ── NutriTribe Dual-Track Trust Bar ───────────────────────────────────
   Two opposing marquee tracks on a near-black background.
   Track 1 (→): brand promise badges
   Track 2 (←): nutritional / heritage stats
   Fixed "CERTIFIED" badge on the left, fade masks on both sides.
   ────────────────────────────────────────────────────────────────────── */

const TRACK_1 = [
  '100% Natural', 'Mithila Origin', 'No Preservatives', 'High Protein',
  'Farmer-Backed', 'Roasted Not Fried', 'Gluten Free', 'No MSG',
  '2,500 Years of Heritage', 'Bihar Certified', 'Cold-Packed Freshness', 'Non-GMO',
  '100% Natural', 'Mithila Origin', 'No Preservatives', 'High Protein',
  'Farmer-Backed', 'Roasted Not Fried', 'Gluten Free', 'No MSG',
  '2,500 Years of Heritage', 'Bihar Certified', 'Cold-Packed Freshness', 'Non-GMO',
];

const TRACK_2 = [
  '15g Protein / 100g', '0mg Cholesterol', '347 Kcal / 100g', 'Triple Hand-Sorted',
  '80% World Makhana from Bihar', 'Small-Batch Roasted', '10,000+ Farmers Supported',
  'Antioxidant Rich', 'Low Glycemic Index', 'Ayurvedic Superfood', 'Vegan Friendly', 'Keto Friendly',
  '15g Protein / 100g', '0mg Cholesterol', '347 Kcal / 100g', 'Triple Hand-Sorted',
  '80% World Makhana from Bihar', 'Small-Batch Roasted', '10,000+ Farmers Supported',
  'Antioxidant Rich', 'Low Glycemic Index', 'Ayurvedic Superfood', 'Vegan Friendly', 'Keto Friendly',
];

function MakhanaSep({ dim = false }: { dim?: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 30 30" fill="none"
      style={{ margin: '0 12px', flexShrink: 0, opacity: dim ? 0.35 : 0.65 }}
    >
      <circle cx="15" cy="15" r="13" fill="#f3a213" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

export default function TrustBar() {
  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        background: '#040100',
        borderTop: '1px solid rgba(243,162,19,0.14)',
        borderBottom: '1px solid rgba(243,162,19,0.14)',
      }}
    >
      {/* Ambient centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 100% at 50% 50%, rgba(243,162,19,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Left fixed badge */}
      <div
        className="absolute left-0 top-0 bottom-0 z-20 flex items-center gap-2 px-4"
        style={{
          background: 'linear-gradient(to right, #040100 60%, transparent)',
          borderRight: '1px solid rgba(243,162,19,0.1)',
          minWidth: 100,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <ellipse
              key={i} cx="10" cy="4" rx="2" ry="3.8" fill="#f3a213" opacity="0.55"
              transform={`rotate(${a} 10 10)`}
            />
          ))}
          <circle cx="10" cy="10" r="2.4" fill="#f3a213" />
        </svg>
        <div>
          <p className="font-body font-bold leading-none" style={{ fontSize: 7, letterSpacing: '0.32em', color: '#f3a213', opacity: 0.8, textTransform: 'uppercase' }}>
            Certified
          </p>
          <p className="font-body font-bold leading-none mt-0.5" style={{ fontSize: 6, letterSpacing: '0.26em', color: 'rgba(253,251,247,0.3)', textTransform: 'uppercase' }}>
            Premium
          </p>
        </div>
      </div>

      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 w-20 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #040100, transparent)' }}
      />
      {/* Left fade (over badge) */}
      <div
        className="absolute left-24 top-0 bottom-0 z-10 w-12 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #040100, transparent)' }}
      />

      {/* Mid-divider line */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: '50%', height: 1, background: 'rgba(243,162,19,0.07)' }}
      />

      {/* Tracks */}
      <div className="pl-28 py-[4px]">
        {/* Track 1 → */}
        <div className="overflow-hidden" style={{ height: 24 }}>
          <div className="flex animate-marquee items-center whitespace-nowrap" style={{ width: 'max-content' }}>
            {TRACK_1.map((item, i) => (
              <span key={i} className="flex items-center flex-shrink-0">
                <span
                  className="font-body font-semibold uppercase"
                  style={{ fontSize: 9, letterSpacing: '0.24em', color: 'rgba(253,251,247,0.6)' }}
                >
                  {item}
                </span>
                <MakhanaSep />
              </span>
            ))}
          </div>
        </div>

        {/* Track 2 ← */}
        <div className="overflow-hidden" style={{ height: 24 }}>
          <div className="flex animate-marquee-reverse items-center whitespace-nowrap" style={{ width: 'max-content' }}>
            {TRACK_2.map((item, i) => (
              <span key={i} className="flex items-center flex-shrink-0">
                <span
                  className="font-body font-semibold uppercase"
                  style={{ fontSize: 9, letterSpacing: '0.24em', color: 'rgba(243,162,19,0.65)' }}
                >
                  {item}
                </span>
                <MakhanaSep dim />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
