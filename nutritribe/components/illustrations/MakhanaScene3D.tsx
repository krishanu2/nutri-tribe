'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
  MAKHANA BRASS KATORI — 3D bowl with real camera parallax.

  Design:
  - Wide, shallow brass katori (Indian bowl) — 2.5:1 width:height ratio
  - Warm brass material (metalness 0.78, gold color)
  - 12 makhana seeds inside (small, clustered near center) + 3 spilling right next to rim
  - Seeds: cream/off-white #f5f0e8, small radius ~0.14 units
  - Orbit ring: Saturn-style flat tilted ellipse, gold #c8860a, thin
  - Camera MOVES with mouse (real perspective depth shift)
  - On hover: camera slowly orbits for a "reveal" effect
*/
export default function MakhanaScene3D({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const w = mount.clientWidth || 480;
    renderer.setSize(w, w);
    mount.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 3.2, 4.8);
    camera.lookAt(0, 0, 0);

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xfff8e8, 0.58));

    const keyLight = new THREE.PointLight(0xf3a213, 70, 0, 1.5);
    keyLight.position.set(3.5, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffe8c0, 30, 0, 2);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xd0e8ff, 20, 0, 2);
    rimLight.position.set(-2, 0, -5);
    scene.add(rimLight);

    const centerGlow = new THREE.PointLight(0xf3a213, 4, 3, 2);
    centerGlow.position.set(0, 0.3, 0);
    scene.add(centerGlow);

    /* ── BOWL — wide shallow katori, ~2.5:1 width:height ── */
    const katoriProfile = [
      // Wider, shallower profile — walls flare out quickly like a katori
      [0.00, -0.42],  // center of flat base (raised from -0.55)
      [0.44, -0.41],  // base spreads
      [0.46, -0.35],  // foot ring bottom
      [0.40, -0.31],  // inner foot curve
      [0.64, -0.16],  // lower wall flares fast
      [0.90,  0.02],  // mid wall
      [1.08,  0.18],  // upper wall widens
      [1.18,  0.30],  // near rim
      [1.20,  0.36],  // rim lip
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const bowlMesh = new THREE.Mesh(
      new THREE.LatheGeometry(katoriProfile, 60),
      new THREE.MeshStandardMaterial({
        color: 0x7a4010,
        roughness: 0.42,
        metalness: 0.72,
        side: THREE.DoubleSide,
      }),
    );
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;

    // Gold rim
    const rimMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.20, 0.048, 14, 72),
      new THREE.MeshStandardMaterial({ color: 0xC8940A, roughness: 0.22, metalness: 0.82 }),
    );
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.36;

    // Inner base accent ring
    const baseRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.018, 8, 40),
      new THREE.MeshStandardMaterial({ color: 0xC8940A, roughness: 0.25, metalness: 0.78 }),
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -0.38;

    // Bowl engraving lines
    [0.04, 0.14].forEach(y => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.12 + y * 0.05, 0.012, 6, 52),
        new THREE.MeshStandardMaterial({ color: 0xC89B0A, roughness: 0.22, metalness: 0.85 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      scene.add(ring);
    });

    scene.add(bowlMesh, rimMesh, baseRing);

    /* ── SHADOW PLANE ── */
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.28 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.56;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    /* ── MAKHANA SEED BUILDER ──
       Seeds: small cream/off-white fox nuts, radius 0.14 units (~14-16px on screen).
       Inside seeds: radius 6-10px. Spill seeds: radius 8-12px.
    */
    const BALL_R = 0.14;
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,   // cream/off-white — fox nut color
      roughness: 0.92,
      metalness: 0.00,
    });
    const ballGeo = new THREE.SphereGeometry(BALL_R, 22, 22);
    const hlMat   = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 1, metalness: 0, transparent: true, opacity: 0.48,
    });
    const hlGeo   = new THREE.SphereGeometry(BALL_R, 8, 8);
    const spotMat = new THREE.MeshStandardMaterial({ color: 0x7a5030, roughness: 1, metalness: 0 });
    const spotGeo = new THREE.SphereGeometry(BALL_R, 6, 6);

    const makeBall = (scale: number): THREE.Group => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(ballGeo, ballMat);
      body.scale.setScalar(scale);
      body.castShadow = true;
      g.add(body);
      // Specular highlight — positions scaled proportionally to BALL_R
      const hl = new THREE.Mesh(hlGeo, hlMat);
      hl.scale.setScalar(scale * 0.24);
      hl.position.set(-scale * 0.103, scale * 0.110, scale * 0.140);
      g.add(hl);
      // 3 brown speckles on surface
      for (let i = 0; i < 3; i++) {
        const theta = 0.5 + i * 0.8;
        const phi   = i * 2.2;
        const spot  = new THREE.Mesh(spotGeo, spotMat);
        spot.scale.set(scale * 0.10, scale * 0.04, scale * 0.10);
        spot.position.set(
          scale * BALL_R * 0.97 * Math.sin(theta) * Math.cos(phi),
          scale * BALL_R * 0.97 * Math.cos(theta),
          scale * BALL_R * 0.97 * Math.sin(theta) * Math.sin(phi),
        );
        spot.lookAt(spot.position.clone().multiplyScalar(2));
        g.add(spot);
      }
      return g;
    };

    /* Seeds INSIDE the bowl — clustered near center, bowl rim is at r=1.20 */
    const insideDefs: [number, number, number, number][] = [
      [ 0.00,  0.08,  0.00, 1.00],  // center top
      [ 0.18,  0.04,  0.16, 0.98],
      [-0.20,  0.04,  0.12, 0.98],
      [ 0.08,  0.04, -0.22, 0.97],
      [-0.12,  0.04, -0.18, 0.97],
      [ 0.38, -0.02,  0.00, 0.96],
      [-0.36, -0.02,  0.08, 0.96],
      [ 0.00, -0.02,  0.36, 0.96],
      [ 0.24, -0.08,  0.24, 0.95],
      [-0.22, -0.08,  0.22, 0.95],
      [ 0.28, -0.14, -0.20, 0.94],
      [-0.26, -0.14, -0.18, 0.94],
    ];

    insideDefs.forEach(([x, y, z, s]) => {
      const b = makeBall(s);
      b.position.set(x, y, z);
      scene.add(b);
    });

    /* Seeds SPILLING — 3 seeds, RIGHT NEXT TO bowl edge, max 1.35 units from center.
       Bowl rim radius = 1.20, so 1.2× = 1.44 max. Keeping within 1.33 for snug look. */
    const spillDefs: [number, number, number, number][] = [
      [ 1.28, -0.50,  0.34, 1.00],  // XZ dist ≈ 1.32
      [-1.22, -0.50,  0.26, 1.00],  // XZ dist ≈ 1.25
      [ 0.44, -0.50, -1.18, 1.00],  // XZ dist ≈ 1.26
    ];
    spillDefs.forEach(([x, y, z, s]) => {
      const b = makeBall(s);
      b.position.set(x, y, z);
      scene.add(b);
    });

    /* ── ORBIT RING — Saturn-style: flat tilted ellipse, gold, thin stroke ── */
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xC8860A, transparent: true, opacity: 0.30 });
    const orbitRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.014, 6, 80), ringMat1);
    orbitRing1.rotation.x = Math.PI * 0.47;  // nearly horizontal — like Saturn's rings
    scene.add(orbitRing1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xC8860A, transparent: true, opacity: 0.16 });
    const orbitRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.10, 0.009, 6, 80), ringMat2);
    orbitRing2.rotation.x = Math.PI * 0.44;
    orbitRing2.rotation.z = Math.PI * 0.06;
    scene.add(orbitRing2);

    /* ── CAMERA PARALLAX STATE ── */
    let camX = 0, camY = 1.8;
    let orbitAngle = 0;
    let isHovered = false;
    const mouse = { x: 0, y: 0 };
    let floatT = 0;

    const onMouseMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mouse.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    const onMouseEnter = () => { isHovered = true;  mount.style.cursor = 'pointer'; };
    const onMouseLeave = () => { isHovered = false; orbitAngle = 0; mount.style.cursor = 'default'; };
    mount.addEventListener('mousemove',  onMouseMove);
    mount.addEventListener('mouseenter', onMouseEnter);
    mount.addEventListener('mouseleave', onMouseLeave);

    /* ── ANIMATION LOOP ── */
    const clock = new THREE.Clock();
    let frame: number;
    let glowTarget = 3;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const delta   = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      glowTarget = isHovered ? 16 : 3;
      centerGlow.intensity += (glowTarget - centerGlow.intensity) * delta * 4;

      const targetCamX = mouse.x * 0.62;
      const targetCamY = 1.8 - mouse.y * 0.32;
      camX += (targetCamX - camX) * 0.052;
      camY += (targetCamY - camY) * 0.052;

      if (isHovered) orbitAngle += delta * 0.38;
      const orbitX = Math.sin(orbitAngle) * 0.45;
      const orbitZ = 6.2 + (Math.cos(orbitAngle) - 1) * 0.28;

      camera.position.set(camX + orbitX, camY, orbitZ);
      camera.lookAt(0, 0, 0);

      /* Float animation */
      floatT += delta;
      const floatY = -0.10 * (0.5 - 0.5 * Math.cos((floatT / 3) * Math.PI * 2));
      bowlMesh.position.y = floatY;
      rimMesh.position.y  = 0.36 + floatY;
      baseRing.position.y = -0.38 + floatY;

      /* Orbit ring rotation */
      orbitRing1.rotation.z += delta * (Math.PI * 2 / 12);
      orbitRing2.rotation.z -= delta * (Math.PI * 2 / 18);

      /* Gentle bowl rotation */
      bowlMesh.rotation.y += delta * 0.12;
      rimMesh.rotation.y  += delta * 0.12;
      baseRing.rotation.y += delta * 0.12;

      /* Subtle bob for all seed groups */
      scene.children.forEach((obj, i) => {
        if (obj instanceof THREE.Group) {
          obj.position.y += Math.sin(elapsed * 0.7 + i * 0.5) * 0.0008;
        }
      });

      renderer.render(scene, camera);
    };
    tick();

    /* ── CLEANUP ── */
    return () => {
      cancelAnimationFrame(frame);
      mount.removeEventListener('mousemove',  onMouseMove);
      mount.removeEventListener('mouseenter', onMouseEnter);
      mount.removeEventListener('mouseleave', onMouseLeave);
      mount.style.cursor = 'default';
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      ballGeo.dispose(); ballMat.dispose();
      hlGeo.dispose();   hlMat.dispose();
      spotGeo.dispose(); spotMat.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className={className} style={{ aspectRatio: '1 / 1', width: '100%' }} />
  );
}
