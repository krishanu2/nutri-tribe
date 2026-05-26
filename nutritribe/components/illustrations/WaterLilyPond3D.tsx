'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
  WaterLilyPond3D — overhead/angled Three.js pond scene.
  Shows the actual Euryale ferox (makhana) water lily environment:
  - Dark water surface with gentle ripples
  - Round floating lily pads (like Euryale ferox leaves)
  - Purple/violet water lily flowers (Euryale ferox inspired, NOT pink lotus)
  - Cream makhana seeds floating on the surface
  - Spiky seed pods (the actual makhana plant pods)
  - Expanding ripple rings
  Mouse: slight camera tilt. Auto: slow camera orbit.
*/
export default function WaterLilyPond3D({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    const w = mount.clientWidth || 600;
    const h = mount.clientHeight || Math.round(w * 0.60);
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071218, 0.08);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 80);
    camera.position.set(0, 5.5, 4.5);
    camera.lookAt(0, 0, 0);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x8090a8, 0.55));

    // Moon/dawn directional (cool blue from above)
    const moonLight = new THREE.DirectionalLight(0xb0c8e8, 0.8);
    moonLight.position.set(-2, 6, 2);
    scene.add(moonLight);

    // Warm amber horizon glow
    const dawnLight = new THREE.PointLight(0xf3a213, 12, 20, 1.5);
    dawnLight.position.set(5, 1, -6);
    scene.add(dawnLight);

    /* ── WATER SURFACE ── */
    // We'll animate vertex Y displacement for ripples
    const waterSeg = 48;
    const waterGeo = new THREE.PlaneGeometry(14, 14, waterSeg, waterSeg);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0d1f38,
      roughness: 0.05,
      metalness: 0.55,
      transparent: true,
      opacity: 0.92,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.receiveShadow = true;
    scene.add(water);

    // Store original vertex positions for ripple animation
    const posAttr = waterGeo.attributes.position;
    const origY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) origY[i] = posAttr.getY(i);

    /* ── LILY PADS ── */
    const padPositions: [number, number, number, number][] = [
      [-2.5, 0,  1.0, 0.9],
      [ 1.8, 0, -1.5, 0.75],
      [-0.8, 0,  2.8, 1.0],
      [ 3.0, 0,  0.8, 0.8],
      [-3.5, 0, -1.2, 0.65],
      [ 0.5, 0, -2.8, 0.85],
      [-1.8, 0, -0.4, 0.70],
      [ 2.5, 0,  2.8, 0.78],
    ];

    const padMat = new THREE.MeshStandardMaterial({
      color: 0x1a6b12,
      roughness: 0.88,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const padGeo = new THREE.CylinderGeometry(1, 1, 0.04, 32);

    const pads: { mesh: THREE.Mesh; origY: number; phaseOff: number }[] = [];
    padPositions.forEach(([x, y, z, scale]) => {
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.scale.set(scale, 1, scale);
      pad.position.set(x, 0.02, z);
      pad.rotation.y = Math.random() * Math.PI * 2;
      pad.castShadow = true;
      scene.add(pad);
      pads.push({ mesh: pad, origY: y + 0.02, phaseOff: Math.random() * Math.PI * 2 });
    });

    /* ── WATER LILY FLOWERS (purple/violet — Euryale ferox inspired) ── */
    const flowerPositions: [number, number, number][] = [
      [-2.5, 0.12,  1.0],
      [ 1.8, 0.12, -1.5],
      [-0.8, 0.12,  2.8],
      [ 0.5, 0.12, -2.8],
    ];

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,   // violet — water lily, NOT pink lotus
      roughness: 0.90,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });
    const petalGeo = new THREE.PlaneGeometry(0.26, 0.58);

    const centerMat = new THREE.MeshStandardMaterial({ color: 0xf3a213, roughness: 0.35, metalness: 0.25 });
    const centerGeo = new THREE.SphereGeometry(0.11, 10, 10);

    const flowers: { group: THREE.Group; phaseOff: number }[] = [];
    flowerPositions.forEach(([x, y, z]) => {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      // 8 petals arranged radially, slightly tilted up
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(Math.cos(angle) * 0.22, 0.04, Math.sin(angle) * 0.22);
        petal.rotation.set(-Math.PI / 5.5, angle, 0);
        grp.add(petal);
      }
      const center = new THREE.Mesh(centerGeo, centerMat);
      grp.add(center);
      scene.add(grp);
      flowers.push({ group: grp, phaseOff: Math.random() * Math.PI * 2 });
    });

    /* ── MAKHANA SEEDS floating on surface ── */
    const seedGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0xecdfc4, roughness: 0.90, metalness: 0 });

    const seedData: { mesh: THREE.Mesh; origPos: THREE.Vector3; phaseOff: number; driftAngle: number }[] = [];
    const seedPositions: [number, number, number][] = [
      [-1.2, 0.06,  0.5], [ 0.8, 0.06,  1.8], [-2.0, 0.06, -0.8],
      [ 2.2, 0.06, -0.3], [-0.3, 0.06,  1.4], [ 1.5, 0.06, -2.0],
      [-1.5, 0.06,  2.2], [ 3.0, 0.06,  1.5], [-3.2, 0.06, 0.2],
      [ 0.2, 0.06, -1.8], [ 2.8, 0.06, -1.5], [-2.8, 0.06, -2.0],
    ];
    seedPositions.forEach(([x, y, z]) => {
      const s = new THREE.Mesh(seedGeo, seedMat);
      s.position.set(x, y, z);
      s.castShadow = true;
      scene.add(s);
      seedData.push({
        mesh: s,
        origPos: new THREE.Vector3(x, y, z),
        phaseOff: Math.random() * Math.PI * 2,
        driftAngle: Math.random() * Math.PI * 2,
      });
    });

    /* ── SPIKY SEED PODS (Euryale ferox pods — the actual makhana plant) ── */
    const podGeo = new THREE.IcosahedronGeometry(0.22, 0);
    const podMat = new THREE.MeshStandardMaterial({ color: 0x2d5a1e, roughness: 0.95, metalness: 0 });
    const stemGeo = new THREE.CylinderGeometry(0.018, 0.022, 0.6, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x1a4a0a, roughness: 0.95 });

    const podPositions: [number, number, number][] = [
      [ 0.0, 0, -0.5],
      [-2.0, 0,  0.8],
      [ 2.5, 0,  1.8],
    ];
    const podData: { group: THREE.Group; origY: number; phaseOff: number }[] = [];
    podPositions.forEach(([x, , z]) => {
      const grp = new THREE.Group();
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = -0.28;
      grp.add(stem);
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.y = 0.08;
      // Slightly irregular scale to look organic
      pod.scale.set(0.9 + Math.random() * 0.2, 0.85 + Math.random() * 0.3, 0.9 + Math.random() * 0.2);
      grp.add(pod);
      grp.position.set(x, 0.12, z);
      scene.add(grp);
      podData.push({ group: grp, origY: 0.12, phaseOff: Math.random() * Math.PI * 2 });
    });

    /* ── RIPPLE RINGS ── */
    const rippleSources: [number, number][] = [[-1.5, 0.5], [1.8, -1.2], [0.2, 2.0]];
    const rippleRings: { ring: THREE.Mesh; t: number; period: number; cx: number; cz: number }[] = [];

    const rRingMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
    });
    rippleSources.forEach(([cx, cz], si) => {
      for (let r = 0; r < 3; r++) {
        const rGeo = new THREE.RingGeometry(0.01, 0.04, 32);
        rGeo.rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(rGeo, rRingMat.clone());
        ring.position.set(cx, 0.04, cz);
        scene.add(ring);
        rippleRings.push({ ring, t: (r / 3) + si * 0.7, period: 2.4 + si * 0.4, cx, cz });
      }
    });

    /* ── Mouse tracking ── */
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mouse.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };
    mount.addEventListener('mousemove', onMouseMove);

    /* ── Animation loop ── */
    const clock = new THREE.Clock();
    let frame: number;
    // Camera orbit state
    let camAngle = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      /* Water ripple displacement */
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const wave = Math.sin(x * 0.8 + elapsed * 1.2) * Math.sin(z * 0.8 + elapsed * 0.9) * 0.045;
        posAttr.setY(i, origY[i] + wave);
      }
      posAttr.needsUpdate = true;
      waterGeo.computeVertexNormals();

      /* Lily pads gentle bob */
      pads.forEach(({ mesh, origY: oy, phaseOff }) => {
        mesh.position.y = oy + Math.sin(elapsed * 0.5 + phaseOff) * 0.018;
      });

      /* Flowers gentle bloom sway */
      flowers.forEach(({ group, phaseOff }) => {
        group.children.forEach((child, i) => {
          if (i < 8) {
            (child as THREE.Mesh).rotation.x = -Math.PI / 5.5 + Math.sin(elapsed * 0.4 + phaseOff + i) * 0.06;
          }
        });
      });

      /* Seeds drift and bob */
      seedData.forEach(({ mesh, origPos, phaseOff, driftAngle }) => {
        mesh.position.y = origPos.y + Math.sin(elapsed * 0.55 + phaseOff) * 0.022;
        mesh.position.x = origPos.x + Math.sin(elapsed * 0.28 + driftAngle) * 0.06;
        mesh.position.z = origPos.z + Math.cos(elapsed * 0.22 + driftAngle) * 0.06;
      });

      /* Pods bob gently */
      podData.forEach(({ group, origY: oy, phaseOff }) => {
        group.position.y = oy + Math.sin(elapsed * 0.38 + phaseOff) * 0.015;
      });

      /* Ripple rings expand */
      rippleRings.forEach(({ ring, cx, cz, period }) => {
        const mat = ring.material as THREE.MeshBasicMaterial;
        const progress = (elapsed % period) / period;
        const scale = 0.2 + progress * 5.5;
        ring.position.set(cx, 0.04, cz);
        ring.scale.setScalar(scale);
        mat.opacity = Math.max(0, 0.5 * (1 - progress));
      });

      /* Camera slow orbit + mouse tilt */
      camAngle += delta * 0.018;
      const camR = 5.8;
      camera.position.x = Math.sin(camAngle) * camR * 0.35 + mouse.x * 0.5;
      camera.position.z = 4.5 + Math.cos(camAngle * 0.7) * 0.6;
      camera.position.y = 5.5 - mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frame);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '60vh', minHeight: 320, maxHeight: 520 }}
    />
  );
}
