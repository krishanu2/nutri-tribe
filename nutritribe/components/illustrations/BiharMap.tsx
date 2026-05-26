'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { feature as topoFeature } from 'topojson-client';
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
} from 'framer-motion';

type Stage = 0 | 1 | 2;

/* ── Stage metadata ── */
const STAGE_META = [
  {
    label: 'India', color: '#f3a213', stat: '28', statLabel: 'Indian states',
    sub: 'A nation of ancient wisdom — Bihar sits at its living, beating heart.',
  },
  {
    label: 'Bihar', color: '#7d3627', stat: '90%', statLabel: "of India's Makhana",
    sub: 'The Gangetic plains of Bihar have nurtured civilisations — and the finest Makhana — for millennia.',
  },
  {
    label: 'Mithila', color: '#009846', stat: '2,500+', statLabel: 'years of heritage',
    sub: 'Lily ponds, Madhubani art, and Makhana fields — this is where NutriTribe was born.',
  },
];

const EXIT_ORIGINS: Record<string, string> = {
  '0→1': '59% 39%',
  '1→2': '55% 43%',
  '1→0': '50% 50%',
  '2→1': '50% 50%',
};

/* Data URLs — local files in public/data/ */
const INDIA_TOPO_URL = '/data/india.json';
const BIHAR_GEO_URL  = '/data/bihar.json';

/* Helper — get district/state name from GeoJSON properties (handles multiple schemas).
   NAME_2 checked first so Bihar district features return the district name, not the state name. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getName = (props: any): string =>
  String(props?.NAME_2 || props?.name || props?.ST_NM || props?.DISTRICT ||
    props?.Dist_Name || props?.dtname || props?.NAME_1 || '');

/* ══════════════════════════════════════════════════
   STAGE 0 — India map (D3 + real TopoJSON data)
══════════════════════════════════════════════════ */
function IndiaMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    let cancelled = false;

    // Wait one frame for layout
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const W = svgEl.clientWidth || 380;
      const H = svgEl.clientHeight || 440;

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();
      svg.attr('viewBox', `0 0 ${W} ${H}`);

      // Background
      svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#e8f4f8');

      fetch(INDIA_TOPO_URL)
        .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); })
        .then(data => {
          if (cancelled) return;
          // Handle both TopoJSON (.objects) and plain GeoJSON (.features)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let geojson: any;
          if ((data as any).objects) {
            const key = Object.keys((data as any).objects)[0];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            geojson = topoFeature(data as any, (data as any).objects[key]);
          } else {
            geojson = data;
          }

          const proj = d3.geoMercator().fitSize([W - 20, H - 20], geojson);
          proj.translate([proj.translate()[0] + 10, proj.translate()[1] + 10]);
          const path = d3.geoPath().projection(proj);

          /* All states */
          svg.selectAll('.state')
            .data(geojson.features)
            .join('path')
            .attr('class', 'state')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('d', (d: any) => path(d) || '')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill', (d: any) =>
              /bihar/i.test(getName(d.properties)) ? '#8B4010' : '#ddd0b8')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill-opacity', (d: any) =>
              /bihar/i.test(getName(d.properties)) ? 0.92 : 1)
            .attr('stroke', '#a08060')
            .attr('stroke-width', 0.7);

          /* Bihar highlight glow + marker */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const biharFeat = geojson.features.find((f: any) =>
            /bihar/i.test(getName(f.properties)));
          if (biharFeat) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [cx, cy] = path.centroid(biharFeat as any);
            // Outer pulse rings
            [24, 16].forEach((r, i) => {
              svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r)
                .attr('fill', 'none').attr('stroke', '#EF9F27')
                .attr('stroke-width', 1.2).attr('opacity', 0.18 + i * 0.08);
            });
            // Filled dot
            svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 8)
              .attr('fill', '#EF9F27');
            svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 4)
              .attr('fill', 'white').attr('opacity', 0.6);
            // Label
            svg.append('text').attr('x', cx + 12).attr('y', cy + 5)
              .attr('fill', '#EF9F27').attr('font-size', 12).attr('font-weight', 'bold')
              .attr('font-family', 'sans-serif').text('BIHAR');
          }

          /* INDIA label */
          svg.append('text').attr('x', W - 10).attr('y', 18).attr('text-anchor', 'end')
            .attr('fill', '#7a5030').attr('fill-opacity', 0.5)
            .attr('font-size', 13).attr('font-weight', 'bold').attr('font-family', 'sans-serif')
            .attr('letter-spacing', 2).text('INDIA');

          setLoading(false);
        })
        .catch((err) => { console.error('Map data fetch failed:', err); if (!cancelled) { setLoading(false); setError(true); } });
    });

    return () => { cancelled = true; cancelAnimationFrame(raf); d3.select(svgRef.current).selectAll('*').remove(); };
  }, []);

  return (
    <div className="relative w-full h-full">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-amber-600 text-sm opacity-60">
          Map loading…
        </div>
      )}
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STAGE 1 — Bihar state map (D3 + real GeoJSON)
   All 38 districts; Mithila belt highlighted green.
══════════════════════════════════════════════════ */
const MITHILA_DISTRICTS = [
  'sitamarhi', 'sheohar', 'muzaffarpur', 'darbhanga', 'madhubani',
  'supaul', 'saharsa', 'madhepura', 'purnia', 'araria', 'kishanganj',
  'vaishali', 'samastipur', 'begusarai', 'khagaria',
];

function BiharStateMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    let cancelled = false;

    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const W = svgEl.clientWidth || 380;
      const H = svgEl.clientHeight || 380;

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();
      svg.attr('viewBox', `0 0 ${W} ${H}`);
      svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#fdf8f0');

      fetch(BIHAR_GEO_URL)
        .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
        .then(geojson => {
          if (cancelled) return;

          const proj = d3.geoMercator().fitSize([W - 30, H - 50], geojson);
          proj.translate([proj.translate()[0] + 15, proj.translate()[1] + 20]);
          const path = d3.geoPath().projection(proj);

          /* Districts */
          svg.selectAll('.dist')
            .data(geojson.features)
            .join('path')
            .attr('class', 'dist')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('d', (d: any) => path(d) || '')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill', (d: any) => {
              const n = getName(d.properties).toLowerCase();
              return MITHILA_DISTRICTS.some(m => n.includes(m)) ? '#4a9e6b' : '#f5ede0';
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill-opacity', (d: any) => {
              const n = getName(d.properties).toLowerCase();
              return MITHILA_DISTRICTS.some(m => n.includes(m)) ? 0.65 : 1;
            })
            .attr('stroke', '#a08060')
            .attr('stroke-width', 0.55);

          /* MITHILA region label */
          const mithilaFeats = geojson.features.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (f: any) => MITHILA_DISTRICTS.some(m => getName(f.properties).toLowerCase().includes(m))
          );
          if (mithilaFeats.length > 0) {
            const centroid = d3.geoCentroid({ type: 'FeatureCollection', features: mithilaFeats });
            const [mx, my] = proj(centroid) || [W / 2, H * 0.3];
            svg.append('text').attr('x', mx).attr('y', my - 6)
              .attr('text-anchor', 'middle').attr('fill', '#1a5c38')
              .attr('font-size', 10).attr('font-weight', 'bold').attr('font-family', 'sans-serif')
              .text('MITHILA');
            svg.append('text').attr('x', mx).attr('y', my + 7)
              .attr('text-anchor', 'middle').attr('fill', '#1a5c38')
              .attr('font-size', 8).attr('font-family', 'sans-serif').attr('font-style', 'italic')
              .text('REGION');
          }

          /* City markers */
          const cities: { name: string; lonlat: [number,number]; color: string; r: number; capital: boolean }[] = [
            { name: 'Patna', lonlat: [85.1376, 25.5941], color: '#EF9F27', r: 7, capital: true },
            { name: 'Darbhanga', lonlat: [85.8909, 26.1524], color: '#EF9F27', r: 5, capital: false },
            { name: 'Muzaffarpur', lonlat: [85.3905, 26.1183], color: '#2d7a4f', r: 4, capital: false },
            { name: 'Sitamarhi', lonlat: [85.4885, 26.5903], color: '#2d7a4f', r: 4, capital: false },
            { name: 'Madhubani', lonlat: [86.0714, 26.3522], color: '#2d7a4f', r: 4, capital: false },
          ];

          cities.forEach(({ name, lonlat, color, r, capital }) => {
            const pt = proj(lonlat);
            if (!pt) return;
            const [cx, cy] = pt;
            if (capital) {
              svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r + 4)
                .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.5).attr('opacity', 0.35);
            }
            svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r).attr('fill', color);
            svg.append('text').attr('x', cx + r + 3).attr('y', cy + 4)
              .attr('fill', color).attr('font-size', capital ? 9 : 8)
              .attr('font-weight', capital ? 'bold' : 'normal').attr('font-family', 'sans-serif')
              .text(name);
          });

          /* Ganga river curved path */
          const gangaLon = [83.5, 84.5, 85.5, 86.5, 87.5, 88.0];
          const gangaLat = 25.4;
          const gangaPts = gangaLon.map(lon => proj([lon, gangaLat])).filter(Boolean) as [number, number][];
          if (gangaPts.length > 1) {
            const lineGen = d3.line<[number, number]>().x(d => d[0]).y(d => d[1]).curve(d3.curveCatmullRom);
            svg.append('path').attr('d', lineGen(gangaPts) || '')
              .attr('fill', 'none').attr('stroke', '#60a5fa').attr('stroke-width', 2.5).attr('opacity', 0.5);
            const mid = gangaPts[Math.floor(gangaPts.length / 2)];
            svg.append('text').attr('x', mid[0]).attr('y', mid[1] - 8)
              .attr('text-anchor', 'middle').attr('fill', '#60a5fa')
              .attr('font-size', 8).attr('font-style', 'italic').text('~ Ganga ~');
          }

          /* Neighbour labels */
          svg.append('text').attr('x', W / 2).attr('y', 14).attr('text-anchor', 'middle')
            .attr('fill', '#7d5030').attr('fill-opacity', 0.45).attr('font-size', 9).attr('font-family', 'sans-serif').text('NEPAL');
          svg.append('text').attr('x', W / 2).attr('y', H - 4).attr('text-anchor', 'middle')
            .attr('fill', '#7d5030').attr('fill-opacity', 0.4).attr('font-size', 8).attr('font-family', 'sans-serif').text('JHARKHAND');
          svg.append('text').attr('x', 10).attr('y', H / 2).attr('text-anchor', 'middle')
            .attr('fill', '#7d5030').attr('fill-opacity', 0.4).attr('font-size', 8).attr('font-family', 'sans-serif')
            .attr('transform', `rotate(-90,10,${H / 2})`).text('U.P.');
          svg.append('text').attr('x', W - 6).attr('y', H / 2).attr('text-anchor', 'middle')
            .attr('fill', '#7d5030').attr('fill-opacity', 0.4).attr('font-size', 8).attr('font-family', 'sans-serif')
            .attr('transform', `rotate(90,${W - 6},${H / 2})`).text('W. BENGAL');

          setLoading(false);
        })
        .catch((err) => { console.error('Map data fetch failed:', err); if (!cancelled) { setLoading(false); setError(true); } });
    });

    return () => { cancelled = true; cancelAnimationFrame(raf); d3.select(svgRef.current).selectAll('*').remove(); };
  }, []);

  return (
    <div className="relative w-full h-full">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-amber-700 text-sm opacity-60">Map loading…</div>
      )}
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STAGE 2 — Mithila map (D3, filtered Bihar districts)
══════════════════════════════════════════════════ */
const MITHILA_ZOOM_DISTRICTS = [
  'sitamarhi', 'sheohar', 'muzaffarpur', 'vaishali', 'darbhanga', 'madhubani',
  'supaul', 'saharsa', 'madhepura', 'samastipur', 'begusarai', 'khagaria',
];

const MAKHANA_POND_CITIES = ['darbhanga', 'madhubani', 'sitamarhi'];

function MithilaMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    let cancelled = false;

    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      const W = svgEl.clientWidth || 380;
      const H = svgEl.clientHeight || 400;

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();
      svg.attr('viewBox', `0 0 ${W} ${H}`);
      svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#fdf8f0');

      fetch(BIHAR_GEO_URL)
        .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
        .then(geojson => {
          if (cancelled) return;

          /* Filter to Mithila districts only */
          const mithilaGeo = {
            ...geojson,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            features: geojson.features.filter((f: any) => {
              const n = getName(f.properties).toLowerCase();
              return MITHILA_ZOOM_DISTRICTS.some(m => n.includes(m));
            }),
          };

          if (mithilaGeo.features.length === 0) { setLoading(false); setError(true); return; }

          const proj = d3.geoMercator().fitSize([W - 30, H - 70], mithilaGeo);
          proj.translate([proj.translate()[0] + 15, proj.translate()[1] + 30]);
          const path = d3.geoPath().projection(proj);

          /* Districts */
          svg.selectAll('.dist')
            .data(mithilaGeo.features)
            .join('path')
            .attr('class', 'dist')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('d', (d: any) => path(d) || '')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill', (d: any) => {
              const n = getName(d.properties).toLowerCase();
              if (n.includes('darbhanga')) return '#EF9F27';
              return '#f5ede0';
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill-opacity', (d: any) => {
              const n = getName(d.properties).toLowerCase();
              return n.includes('darbhanga') ? 0.55 : 1;
            })
            .attr('stroke', '#a08060')
            .attr('stroke-width', 0.65);

          /* Dotted Mithila boundary */
          svg.selectAll('.boundary')
            .data([mithilaGeo])
            .join('path')
            .attr('class', 'boundary')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('d', (d: any) => path(d) || '')
            .attr('fill', 'none')
            .attr('stroke', '#4a9e6b').attr('stroke-width', 2.2).attr('stroke-dasharray', '8,4');

          /* Makhana pond clusters over key districts */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mithilaGeo.features.forEach((f: any) => {
            const n = getName(f.properties).toLowerCase();
            if (!MAKHANA_POND_CITIES.some(m => n.includes(m))) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [cx, cy] = path.centroid(f as any);
            svg.append('ellipse')
              .attr('cx', cx).attr('cy', cy).attr('rx', 28).attr('ry', 14)
              .attr('fill', '#7ec8a0').attr('fill-opacity', 0.42)
              .attr('stroke', '#4a9e6b').attr('stroke-width', 1.2).attr('opacity', 0.85);
          });

          /* City markers */
          const cities = [
            { name: 'Darbhanga', lonlat: [85.8909, 26.1524] as [number, number], color: '#EF9F27', r: 6 },
            { name: 'Madhubani', lonlat: [86.0714, 26.3522] as [number, number], color: '#2d7a4f', r: 5 },
            { name: 'Sitamarhi', lonlat: [85.4885, 26.5903] as [number, number], color: '#2d7a4f', r: 5 },
            { name: 'Muzaffarpur', lonlat: [85.3905, 26.1183] as [number, number], color: '#2d7a4f', r: 4 },
            { name: 'Supaul', lonlat: [86.6117, 26.1239] as [number, number], color: '#2d7a4f', r: 4 },
          ];

          cities.forEach(({ name, lonlat, color, r }) => {
            const pt = proj(lonlat);
            if (!pt) return;
            const [cx, cy] = pt;
            svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r).attr('fill', color);
            svg.append('text').attr('x', cx + r + 4).attr('y', cy + 4)
              .attr('fill', color).attr('font-size', 9).attr('font-weight', 'bold')
              .attr('font-family', 'sans-serif').text(name);
          });

          /* Ganga at southern edge */
          const gangaY = H - 30;
          svg.append('path')
            .attr('d', `M ${W * 0.05} ${gangaY} Q ${W * 0.5} ${gangaY - 10} ${W * 0.95} ${gangaY}`)
            .attr('fill', 'none').attr('stroke', '#60a5fa').attr('stroke-width', 2.5).attr('opacity', 0.55);
          svg.append('text').attr('x', W / 2).attr('y', gangaY - 13)
            .attr('text-anchor', 'middle').attr('fill', '#60a5fa')
            .attr('font-size', 9).attr('font-style', 'italic').text('~ Ganga ~');

          /* Title + subtitle */
          svg.append('text').attr('x', W / 2).attr('y', H - 6)
            .attr('text-anchor', 'middle').attr('fill', '#f3a213')
            .attr('font-size', 12).attr('font-weight', 'bold').attr('font-style', 'italic')
            .attr('font-family', 'serif').text('Mithila — The Makhana Heartland');

          /* Neighbour labels */
          svg.append('text').attr('x', W / 2).attr('y', 15).attr('text-anchor', 'middle')
            .attr('fill', '#7d5030').attr('fill-opacity', 0.4).attr('font-size', 9).text('NEPAL');
          svg.append('text').attr('x', W / 2).attr('y', gangaY + 15).attr('text-anchor', 'middle')
            .attr('fill', '#7d5030').attr('fill-opacity', 0.35).attr('font-size', 8).text('SOUTH BIHAR');

          setLoading(false);
        })
        .catch((err) => { console.error('Map data fetch failed:', err); if (!cancelled) { setLoading(false); setError(true); } });
    });

    return () => { cancelled = true; cancelAnimationFrame(raf); d3.select(svgRef.current).selectAll('*').remove(); };
  }, []);

  return (
    <div className="relative w-full h-full">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-green-700 text-sm opacity-60">Map loading…</div>
      )}
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT — 3D tilt + cinematic zoom transitions
══════════════════════════════════════════════════ */
interface BiharMapProps { className?: string }

export default function BiharMap({ className = '' }: BiharMapProps) {
  const [stage, setStage]         = useState<Stage>(0);
  const [prevStage, setPrevStage] = useState<Stage>(0);
  const [autoPlay, setAutoPlay]   = useState(true);
  const [flash, setFlash]         = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);
  const inView                    = useInView(containerRef, { once: true, margin: '-15% 0px' });

  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]),  { stiffness: 80, damping: 22 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-5,  5]), { stiffness: 80, damping: 22 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left - r.width  / 2) / r.width);
    my.set((e.clientY - r.top  - r.height / 2) / r.height);
  }, [mx, my]);
  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  useEffect(() => {
    if (!autoPlay || !inView) return;
    const t = setTimeout(() => {
      if (stage < 2) goTo((stage + 1) as Stage);
    }, 3500);
    return () => clearTimeout(t);
  });

  const goTo = (s: Stage) => {
    const isForward = s > stage;
    setPrevStage(stage);
    setStage(s);
    setAutoPlay(false);
    if (isForward) {
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
    }
  };

  const direction = stage > prevStage ? 'forward' : 'back';
  const transKey  = `${prevStage}→${stage}`;
  const origin    = EXIT_ORIGINS[transKey] ?? '50% 50%';
  const meta      = STAGE_META[stage];

  const variants = {
    enter:  direction === 'forward'
      ? { scale: 0.86, opacity: 0, filter: 'blur(3px)' }
      : { scale: 1.12, opacity: 0, filter: 'blur(3px)' },
    center: { scale: 1, opacity: 1, filter: 'blur(0px)' },
    exit:   direction === 'forward'
      ? { scale: 2.20, opacity: 0, filter: 'blur(3px)' }
      : { scale: 0.74, opacity: 0, filter: 'blur(3px)' },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative w-full max-w-2xl mx-auto select-none ${className}`}
    >
      {/* Stage stepper */}
      <div className="flex items-center justify-center gap-1 mb-5">
        {STAGE_META.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button onClick={() => goTo(i as Stage)} className="flex flex-col items-center gap-1.5 px-3 py-1.5">
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 relative"
                animate={{
                  backgroundColor: i <= stage ? meta.color : 'transparent',
                  borderColor:      i <= stage ? meta.color : meta.color + '38',
                  color:            i <= stage ? '#fff' : meta.color + '55',
                  boxShadow: i === stage
                    ? [`0 0 0 0px ${meta.color}55`, `0 0 0 6px ${meta.color}00`]
                    : '0 0 0 0px transparent',
                }}
                transition={{
                  duration: 0.35,
                  boxShadow: { duration: 1.5, repeat: i === stage ? Infinity : 0, ease: 'easeOut' },
                }}
              >
                {i + 1}
              </motion.div>
              <span className="font-body text-[10px] font-semibold"
                style={{ color: i <= stage ? meta.color : meta.color + '45' }}>
                {s.label}
              </span>
            </button>
            {i < 2 && (
              <motion.div className="h-px w-6 mx-0.5"
                animate={{ backgroundColor: i < stage ? meta.color : meta.color + '28' }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 3D tilt wrapper */}
      <motion.div style={{ rotateX: rotX, rotateY: rotY, perspective: 1000, transformStyle: 'preserve-3d' }}>
        <div className="relative rounded-2xl overflow-hidden bg-ivory-grain/80 shadow-card"
          style={{ aspectRatio: '4/3', border: `1px solid ${meta.color}22` }}>

          {/* Stage badge */}
          <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-full backdrop-blur-sm border"
            style={{ backgroundColor: meta.color + '18', borderColor: meta.color + '42', transform: 'translateZ(30px)' }}>
            <span className="font-body font-bold text-[10px] tracking-widest uppercase"
              style={{ color: meta.color }}>{meta.label}</span>
          </div>

          {/* Map content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              className="absolute inset-0 p-2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ transformOrigin: origin }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {stage === 0 && <IndiaMap />}
              {stage === 1 && <BiharStateMap />}
              {stage === 2 && <MithilaMap />}
            </motion.div>
          </AnimatePresence>

          {/* Golden flash */}
          <AnimatePresence>
            {flash && (
              <motion.div
                className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(circle, rgba(243,162,19,0.35) 0%, transparent 70%)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-3 left-1/2 z-20 flex gap-2.5"
            style={{ transform: 'translateX(-50%) translateZ(20px)' }}>
            {stage > 0 && (
              <button onClick={() => goTo((stage - 1) as Stage)}
                className="font-body font-semibold text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border backdrop-blur-sm"
                style={{ color: meta.color, borderColor: meta.color + '44', background: meta.color + '10' }}>
                ← {STAGE_META[stage - 1].label}
              </button>
            )}
            {stage < 2 && (
              <motion.button
                onClick={() => goTo((stage + 1) as Stage)}
                className="flex items-center gap-1.5 font-body font-semibold text-[10px] tracking-widest uppercase px-5 py-2 rounded-full border backdrop-blur-sm"
                style={{
                  color: STAGE_META[stage + 1].color,
                  borderColor: STAGE_META[stage + 1].color + '50',
                  background: STAGE_META[stage + 1].color + '12',
                }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Zoom to {STAGE_META[stage + 1].label}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            )}
          </div>

          {/* Stat chip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`stat-${stage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, delay: 0.18 }}
              className="absolute bottom-14 right-3 z-20 p-3 rounded-xl backdrop-blur-sm border text-right"
              style={{ background: '#fdfbf7f0', borderColor: meta.color + '30', transform: 'translateZ(35px)' }}
            >
              <p className="font-display font-bold text-xl leading-none" style={{ color: meta.color }}>{meta.stat}</p>
              <p className="font-body text-[10px] text-earthen-rust/55 mt-0.5 max-w-[110px]">{meta.statLabel}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Subtitle */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`sub-${stage}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.38 }}
          className="text-center font-body text-sm text-earthen-rust/55 mt-4 leading-relaxed px-4"
        >
          {meta.sub}
        </motion.p>
      </AnimatePresence>

      {/* Progress pills */}
      <div className="flex items-center justify-center gap-2.5 mt-4">
        {STAGE_META.map((s, i) => (
          <button key={s.label} onClick={() => goTo(i as Stage)}>
            <motion.div
              className="rounded-full"
              animate={{
                width: i === stage ? 24 : 8,
                height: 8,
                backgroundColor: i === stage ? meta.color : meta.color + '38',
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
