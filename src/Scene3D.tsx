// @ts-nocheck
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Particle sphere with dual helix rings ──────────────────────────────────
function ParticleSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Points>(null);
  const ring2Ref = useRef<THREE.Points>(null);
  const coreRef  = useRef<THREE.Points>(null);
  const glowRef  = useRef<THREE.Mesh>(null);

  // ── core sphere particles
  const coreGeo = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r     = 1.05 + (Math.random() - 0.5) * 0.15;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // purple→cyan gradient based on y position
      const t = (pos[i * 3 + 1] / r + 1) / 2;
      col[i * 3]     = 0.424 + t * (0.0   - 0.424); // R: 108→0
      col[i * 3 + 1] = 0.388 + t * (0.898 - 0.388); // G: 99→229
      col[i * 3 + 2] = 1.0;                            // B always 1
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  // ── helix ring 1 (equatorial)
  const ring1Geo = useMemo(() => {
    const count = 320;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t     = (i / count) * Math.PI * 2;
      const tilt  = Math.sin(t * 3) * 0.18;
      pos[i * 3]     = Math.cos(t) * 1.38;
      pos[i * 3 + 1] = tilt;
      pos[i * 3 + 2] = Math.sin(t) * 1.38;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // ── helix ring 2 (tilted)
  const ring2Geo = useMemo(() => {
    const count = 260;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t     = (i / count) * Math.PI * 2;
      const tilt  = Math.cos(t * 2) * 0.22;
      pos[i * 3]     = Math.cos(t) * 1.55;
      pos[i * 3 + 1] = tilt;
      pos[i * 3 + 2] = Math.sin(t) * 1.55;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // ── circular texture for crisp particles
  const circleTex = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
    grad.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.12;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.y = -t * 0.55;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y =  t * 0.40;
      ring2Ref.current.rotation.z =  t * 0.15;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.8) * 0.04;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 2.2) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#6C63FF"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Core sphere particles */}
      <points ref={coreRef} geometry={coreGeo}>
        <pointsMaterial
          size={0.028}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          map={circleTex}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {/* Ring 1 — purple */}
      <points ref={ring1Ref} geometry={ring1Geo}>
        <pointsMaterial
          color="#8B7FFF"
          size={0.038}
          transparent
          opacity={0.85}
          sizeAttenuation
          map={circleTex}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {/* Ring 2 — cyan */}
      <points ref={ring2Ref} geometry={ring2Geo}>
        <pointsMaterial
          color="#00E5FF"
          size={0.032}
          transparent
          opacity={0.75}
          sizeAttenuation
          map={circleTex}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>

      {/* Tiny inner bright core */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>

      {/* Inner glow */}
      <pointLight color="#6C63FF" intensity={2.5} distance={4} />
      <pointLight color="#00E5FF" intensity={1.5} distance={3} position={[1.5, 0.5, 0]} />
    </group>
  );
}

// ── Floating ambient dust ──────────────────────────────────────────────────
function AmbientDust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#6C63FF"
        size={0.018}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Public component ───────────────────────────────────────────────────────
// accepts profileImg so it can be passed from App.tsx
export default function Scene3D({ profileImg }: { profileImg: string }) {
  return (
    <div
      style={{
        width: 340,
        height: 340,
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* ── outer ambient glow ── */}
      <div
        style={{
          position: "absolute",
          inset: -32,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(108,99,255,0.28) 0%,transparent 68%)",
          pointerEvents: "none",
          animation: "pulse 3s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* ── 3D Canvas — full square background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.3} />
          <AmbientDust />
          <ParticleSphere />
        </Canvas>
      </div>

      {/* ── Spinning gradient border ring ── */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#6C63FF,#00E5FF,#6C63FF,#00E5FF)",
          backgroundSize: "300% 300%",
          animation: "gradShift 4s ease infinite",
          zIndex: 2,
          padding: 3,
        }}
      >
        {/* white gap ring between gradient border and photo */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#0B0620",
          }}
        />
      </div>

      {/* ── Profile photo — foreground ── */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 3,
          boxShadow: "0 0 32px rgba(108,99,255,0.5), 0 0 64px rgba(0,229,255,0.15)",
        }}
      >
        <img
          src={profileImg}
          alt="Tharaka Vimukthi Bandara"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ── Subtle vignette overlay on the photo for depth ── */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 70% 30%, transparent 40%, rgba(11,6,32,0.35) 100%)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
