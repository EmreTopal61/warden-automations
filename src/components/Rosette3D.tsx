import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RosetteParams } from './rosetteParams';
import { DEFAULT_PARAMS } from './rosetteParams';

// Banknot ve tapu kâğıtlarındaki guilloche rozetinin üç boyutlu hali.
// Dış halka: bir torusun etrafına sarılan 16 iplik (torus düğümü); her biri formdaki bir soruya karşılık gelir.
// İç çiçek: faz kaydırmalı 10 hipotrokoid. Ziyaretçinin cevapları deseni yeniden şekillendirir.

const OUTER = 16;
const OUTER_SEG = 1024;
const INNER = 10;
const INNER_SEG = 640;
const TOTAL = OUTER * OUTER_SEG + INNER * INNER_SEG;
const TAU = Math.PI * 2;

const C_INK = new THREE.Color('#151A27');
const C_GREEN = new THREE.Color('#3E6E5E');
const C_GUILLOCHE = new THREE.Color('#6F8F80');
const C_STAMP = new THREE.Color('#5B3BA6');
const C_STAMP_OLD = new THREE.Color('#9A86CF');

function fillPositions(p: RosetteParams, out: Float32Array) {
  let k = 0;
  const R = 2.0;
  for (let i = 0; i < OUTER; i++) {
    const phase = (i / OUTER) * TAU;
    for (let s = 0; s < OUTER_SEG; s++) {
      const t = (s / OUTER_SEG) * TAU;
      const env = 1 + p.depth * 0.55 * Math.sin(p.lobes * t + p.seed * TAU);
      const a = (0.42 + p.swell * 0.35) * env;
      const phi = p.winds * t + phase;
      const rr = R + a * Math.cos(phi);
      out[k++] = rr * Math.cos(t);
      out[k++] = rr * Math.sin(t);
      out[k++] = a * Math.sin(phi);
    }
  }
  const petals = p.lobes + 3;
  for (let j = 0; j < INNER; j++) {
    const phase = (j / INNER) * (TAU / petals);
    for (let s = 0; s < INNER_SEG; s++) {
      const t = (s / INNER_SEG) * TAU;
      const r = 0.92 + (0.3 + p.depth * 0.12) * Math.cos(petals * (t + phase) + p.seed * TAU);
      out[k++] = r * Math.cos(t);
      out[k++] = r * Math.sin(t);
      out[k++] = 0.22 * Math.sin(petals * (t + phase) * 0.5 + p.seed * TAU);
    }
  }
}

function fillColors(marked: number, sealed: boolean, out: Float32Array) {
  const c = new THREE.Color();
  let k = 0;
  for (let i = 0; i < OUTER; i++) {
    for (let s = 0; s < OUTER_SEG; s++) {
      const t = (s / OUTER_SEG) * TAU;
      if (sealed || i < marked) {
        // en yeni işaret en koyu mürekkep
        c.copy(sealed || i === marked - 1 ? C_STAMP : C_STAMP_OLD);
      } else {
        // gökkuşağı baskı: mürekkep halka boyunca yeşile döner
        c.copy(C_INK).lerp(C_GREEN, 0.5 + 0.5 * Math.sin(t + i * 0.2));
      }
      out[k++] = c.r;
      out[k++] = c.g;
      out[k++] = c.b;
    }
  }
  for (let j = 0; j < INNER; j++) {
    for (let s = 0; s < INNER_SEG; s++) {
      c.copy(sealed ? C_STAMP : C_GUILLOCHE);
      out[k++] = c.r;
      out[k++] = c.g;
      out[k++] = c.b;
    }
  }
}

function buildIndex(): Uint32Array {
  const idx = new Uint32Array(TOTAL * 2);
  let k = 0;
  let base = 0;
  const strand = (seg: number) => {
    for (let s = 0; s < seg; s++) {
      idx[k++] = base + s;
      idx[k++] = base + ((s + 1) % seg);
    }
    base += seg;
  };
  for (let i = 0; i < OUTER; i++) strand(OUTER_SEG);
  for (let j = 0; j < INNER; j++) strand(INNER_SEG);
  return idx;
}

function RosetteLines({
  params,
  sealed,
  reduced,
  tiltWithScroll,
}: {
  params: RosetteParams;
  sealed: boolean;
  reduced: boolean;
  tiltWithScroll: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const drawn = useRef(reduced ? 1 : 0);
  const settled = useRef(false);

  const { geometry, target } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(TOTAL * 3);
    fillPositions(DEFAULT_PARAMS, pos);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TOTAL * 3), 3));
    g.setIndex(new THREE.BufferAttribute(buildIndex(), 1));
    if (!reduced) g.setDrawRange(0, 0);
    return { geometry: g, target: new Float32Array(TOTAL * 3) };
  }, [reduced]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    fillPositions(params, target);
    settled.current = false;
    if (reduced) {
      (geometry.attributes.position.array as Float32Array).set(target);
      geometry.attributes.position.needsUpdate = true;
      settled.current = true;
    }
  }, [params, target, geometry, reduced]);

  useEffect(() => {
    fillColors(params.marked, sealed, geometry.attributes.color.array as Float32Array);
    geometry.attributes.color.needsUpdate = true;
  }, [params.marked, sealed, geometry]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const total = geometry.index!.count;

    // açılışta desen, gravür tezgâhındaki gibi iplik iplik basılır
    if (drawn.current < 1) {
      drawn.current = Math.min(1, drawn.current + d / 2.4);
      const e = 1 - Math.pow(1 - drawn.current, 3);
      geometry.setDrawRange(0, Math.floor((total * e) / 2) * 2);
    }

    if (!settled.current) {
      const pos = geometry.attributes.position.array as Float32Array;
      const k = 1 - Math.exp(-d * 4.5);
      let maxDiff = 0;
      for (let i = 0; i < pos.length; i++) {
        const diff = target[i] - pos[i];
        pos[i] += diff * k;
        const ad = diff < 0 ? -diff : diff;
        if (ad > maxDiff) maxDiff = ad;
      }
      geometry.attributes.position.needsUpdate = true;
      if (maxDiff < 0.0005) settled.current = true;
    }

    const g = group.current;
    if (!g || reduced) return;
    const scrollTilt = tiltWithScroll ? Math.min(window.scrollY / window.innerHeight, 1.2) * 0.35 : 0;
    const follow = Math.min(1, d * 3);
    g.rotation.z += d * 0.06;
    g.rotation.x += (-0.78 - scrollTilt + pointer.current.y * 0.12 - g.rotation.x) * follow;
    g.rotation.y += (pointer.current.x * 0.22 - g.rotation.y) * follow;
  });

  return (
    <group ref={group} rotation={[-0.78, 0, 0.3]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.92} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export interface Rosette3DProps {
  params: RosetteParams;
  sealed?: boolean;
  tiltWithScroll?: boolean;
  className?: string;
  label: string;
}

export default function Rosette3D({ params, sealed = false, tiltWithScroll = false, className, label }: Rosette3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // canvas yalnızca görünür alana yaklaşınca kurulur, ekran dışındayken çizim durur
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '160px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} role="img" aria-label={label} className={className}>
      {mounted && (
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0, 0, 8.8], fov: 36 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.Fog('#E6EAE3', 7.0, 11.8);
          }}
        >
          <RosetteLines params={params} sealed={sealed} reduced={reduced} tiltWithScroll={tiltWithScroll} />
        </Canvas>
      )}
    </div>
  );
}
