/**
 * Scène R3F du Hero : caméra pilotée par le scroll (state), lumière studio sans fichier externe,
 * grille blueprint, particules, faisceau de scan, bloom holographique.
 * Chargée dynamiquement (client uniquement) après le texte du Hero.
 * @hopsyder
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, Lightformer, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { House } from "./House";
import type { HeroState } from "./state";

const TARGET = new THREE.Vector3(0.4, 2.6, 0.4);
const TARGET_M = new THREE.Vector3(2.2, 1.2, 1.6);

/** Caméra : 0 vue normale → dolly → légère rotation → recul (vue éclatée) → retour. */
function CameraRig({ state, mobile }: { state: HeroState; mobile: boolean }) {
  const { camera } = useThree();
  // On amortit des coordonnées sphériques (angle, rayon) et non la position :
  // la caméra suit l'arc autour de la maison, sans jamais traverser la scène.
  const cur = useRef({ az: Math.PI / 4, r: mobile ? 58 : 44, el: 0.52 });
  useFrame((_, dt) => {
    // Rotation automatique 360° (bouton) : ~18 s par tour
    if (state.auto) state.yaw += dt * 0.35;
    const base = mobile ? 58 : 44;
    const r = base - state.dolly * 4 + state.pullback * 9;
    const az = Math.PI / 4 + state.orbit + state.yaw + state.mouse.x * 0.035; // ~45° + rotation scroll + 360° utilisateur
    const el = 0.52 - state.mouse.y * 0.02; // élévation (rad)
    const c = cur.current;
    c.az = THREE.MathUtils.damp(c.az, az, 6, dt);
    c.r = THREE.MathUtils.damp(c.r, r, 6, dt);
    c.el = THREE.MathUtils.damp(c.el, el, 6, dt);
    const T = mobile ? TARGET_M : TARGET;
    camera.position.set(T.x + c.r * Math.cos(c.el) * Math.sin(c.az), T.y + c.r * Math.sin(c.el), T.z + c.r * Math.cos(c.el) * Math.cos(c.az));
    camera.lookAt(mobile ? TARGET_M : TARGET);
  });
  return null;
}

/** Faisceau de scan : cadre lumineux fin qui parcourt la maison verticalement. */
function ScanBeam() {
  const ref = useRef<THREE.LineLoop>(null);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints([[-5.6, -4], [8.4, -4], [8.4, 4.4], [-5.6, 4.4]].map(([x, z]) => new THREE.Vector3(x, 0, z))), []);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: new THREE.Color(0.5, 2.4, 2.8), toneMapped: false, transparent: true }), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (Math.sin(clock.elapsedTime * 0.45) + 1) / 2;
    ref.current.position.y = 0.1 + t * 6.4;
    mat.opacity = 0.15 + Math.sin(t * Math.PI) * 0.55;
  });
  return <lineLoop ref={ref} geometry={geo} material={mat} />;
}

/** Respiration holographique très lente (glow de fond). */
function Ambient({ state }: { state: HeroState }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current) light.current.intensity = 22 + state.glow * 30 + Math.sin(clock.elapsedTime * 0.8) * 4;
  });
  return <pointLight ref={light} position={[2, 7, 4]} color="#67e8f9" distance={30} decay={1.6} />;
}

export default function Scene({ state, mobile, still = false, onReady }: { state: HeroState; mobile: boolean; still?: boolean; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause du rendu quand le Hero n'est plus à l'écran (batterie, perf)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        // Animations désactivées : rendu à la demande (image fixe)
        frameloop={still ? "demand" : visible ? "always" : "never"}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        shadows={!mobile}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 30, near: 0.5, far: 200, position: [30, 22, 30] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          onReady?.();
        }}
      >
        <CameraRig state={state} mobile={mobile} />

        {/* Éclairage studio généré (aucun HDR téléchargé) */}
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2.2} color="#cffafe" position={[0, 6, -9]} scale={[14, 4, 1]} />
          <Lightformer intensity={1.4} color="#93c5fd" position={[-8, 2, 4]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer intensity={1.2} color="#c4b5fd" position={[8, 3, 6]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer intensity={3} form="ring" color="#ffffff" position={[3, 9, 3]} scale={3} />
        </Environment>
        <ambientLight intensity={0.35} color="#bfe9ff" />
        <directionalLight position={[9, 14, 8]} intensity={1.6} color="#e0f7ff" castShadow={!mobile} shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
        <Ambient state={state} />

        <House state={state} mobile={mobile} />

        {/* Sol blueprint */}
        <Grid
          position={[0, -0.31, 0]}
          infiniteGrid
          cellSize={0.6}
          cellThickness={0.5}
          cellColor="#1e5a7a"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#38bdf8"
          fadeDistance={mobile ? 28 : 40}
          fadeStrength={1.6}
        />
        {!mobile && <ContactShadows position={[0, -0.3, 0]} opacity={0.45} scale={26} blur={2.6} far={8} frames={1} color="#020617" />}
        <ScanBeam />
        <Sparkles count={mobile ? 30 : 70} scale={[18, 9, 14]} position={[1, 4, 0]} size={2.2} speed={0.25} opacity={0.55} color="#a5f3fc" />

        {!mobile && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
            <Vignette eskil={false} offset={0.25} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
