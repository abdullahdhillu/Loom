// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  ContactShadows,
  Sphere,
  Box,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Play,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Video,
  Sparkles,
  Zap,
  Share2,
  BarChart3,
  Shield,
  Globe,
} from "lucide-react";

// Loading Screen Component (Exact replica of WorldQuant's loading)
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center"
      exit={{
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter"
      >
        Streamify
      </motion.div>

      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <motion.div
        className="mt-4 text-sm text-white/40 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {progress}%
      </motion.div>
    </motion.div>
  );
};

// 3D Components for Hero
function HeroSphere({
  position,
  color,
  scale = 1,
  distort = 0.4,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  distort?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function VideoCard3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Main Card */}
        <mesh>
          <boxGeometry args={[3.2, 2, 0.15]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        {/* Screen Glow */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[3, 1.8]} />
          <meshStandardMaterial
            color="#0f0f0f"
            emissive="#ff6b35"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Play Button Ring */}
        <mesh position={[0, 0, 0.12]}>
          <torusGeometry args={[0.4, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#ff6b35"
            emissive="#ff6b35"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#ff6b35"
            emissive="#ff6b35"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Decorative Lines */}
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[0.02, 2, 0.16]} />
          <meshStandardMaterial color="#ff6b35" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b35" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#533483" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />

      <HeroSphere
        position={[4, 1, -3]}
        color="#ff6b35"
        scale={1.2}
        distort={0.3}
      />
      <HeroSphere
        position={[-4, -1, -4]}
        color="#ff8c42"
        scale={0.8}
        distort={0.5}
      />
      <VideoCard3D />
      <Environment preset="city" />
    </>
  );
}

// Navigation Component (Exact WorldQuant style)
const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <motion.a
          href="#"
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Streamify
          </span>
        </motion.a>

        <div className="hidden md:flex items-center gap-10">
          {["Platform", "Solutions", "Company", "Careers"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-white/60 hover:text-white transition-colors duration-300 relative group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-orange-500 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <motion.button
            className="text-sm text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Sign In
          </motion.button>
          <motion.button
            className="group px-6 py-3 rounded-full bg-white text-black text-sm font-medium flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-t border-white/10"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {["Platform", "Solutions", "Company", "Careers"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg text-white/80 hover:text-white"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <button className="text-white/60 hover:text-white text-left">
                  Sign In
                </button>
                <button className="w-full py-4 rounded-full bg-white text-black font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero Section (Exact WorldQuant layout)
const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center bg-[#0a0a0a] overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <HeroScene />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/50 z-10 pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-20"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Now in Public Beta
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-8"
          >
            Record Videos that
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Pull the Future Forward
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="text-xl md:text-2xl text-white/50 max-w-2xl mb-12 leading-relaxed"
          >
            AI-powered video creation. 3D animations. Instant sharing. We
            deliver more than tools—we create the infrastructure for video
            storytelling at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              className="group px-8 py-4 rounded-full bg-white text-black font-medium flex items-center gap-3 hover:bg-orange-500 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              Start Recording
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Demo
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-xs text-white/30 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
};

// Ethos Section (Exact WorldQuant sticky scroll style)
const EthosSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.5], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.75], [0, -50]);
  const y4 = useTransform(scrollYProgress, [0.75, 1], [0, -50]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0.3]);
  const opacity2 = useTransform(
    scrollYProgress,
    [0.25, 0.45, 0.5],
    [0.3, 1, 0.3],
  );
  const opacity3 = useTransform(
    scrollYProgress,
    [0.5, 0.7, 0.75],
    [0.3, 1, 0.3],
  );
  const opacity4 = useTransform(scrollYProgress, [0.75, 0.95, 1], [0.3, 1, 1]);

  const scale1 = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const scale2 = useTransform(scrollYProgress, [0.25, 0.5], [1, 0.95]);
  const scale3 = useTransform(scrollYProgress, [0.5, 0.75], [1, 0.95]);
  const scale4 = useTransform(scrollYProgress, [0.75, 1], [1, 0.95]);

  const cards = [
    {
      number: "01 / 04",
      title: "Instant Creation",
      subtitle: "Speed wins.",
      description:
        "Record, edit, and share in seconds. Our AI handles the heavy lifting—transcriptions, chapters, and highlights—so you can focus on your message.",
      icon: Zap,
      y: y1,
      opacity: opacity1,
      scale: scale1,
    },
    {
      number: "02 / 04",
      title: "3D Storytelling",
      subtitle: "Vision matters.",
      description:
        "Break free from flat videos. Build immersive 3D environments, animated backgrounds, and spatial experiences that captivate your audience.",
      icon: Video,
      y: y2,
      opacity: opacity2,
      scale: scale2,
    },
    {
      number: "03 / 04",
      title: "AI Intelligence",
      subtitle: "Intelligence scales.",
      description:
        "Smart transcripts, sentiment analysis, and viewer insights. Understand exactly how your content resonates and optimize in real-time.",
      icon: Sparkles,
      y: y3,
      opacity: opacity3,
      scale: scale3,
    },
    {
      number: "04 / 04",
      title: "Global Reach",
      subtitle: "Connection drives growth.",
      description:
        "Instant sharing across all platforms. Real-time collaboration with teams worldwide. Break down barriers and amplify your voice everywhere.",
      icon: Globe,
      y: y4,
      opacity: opacity4,
      scale: scale4,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0a0a0a]"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Sticky */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">
                  Our Ethos
                </h2>
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold text-white">
                    Creation matters.
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-white/30">
                    Speed wins.
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-white/50 leading-relaxed max-w-md"
              >
                Our comprehensive video platform shifts the odds. With
                infrastructure that works. With AI that understands. With the
                right tools—pushing you forward, not under.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-white/30 text-sm"
              >
                This isn't just recording. It's complete video storytelling, at
                the speed modern business demands.
              </motion.p>
            </div>

            {/* Right Content - Scrolling Cards */}
            <div className="relative h-[500px]">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  style={{
                    y: card.y,
                    opacity: card.opacity,
                    scale: card.scale,
                  }}
                  className="absolute inset-0"
                >
                  <div className="h-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <card.icon className="w-8 h-8 text-orange-500" />
                        <span className="text-sm font-mono text-white/30">
                          {card.number}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xl text-orange-400 mb-6">
                        {card.subtitle}
                      </p>
                      <p className="text-white/50 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-white/30 text-sm mt-8">
                      <div className="w-12 h-[1px] bg-white/20" />
                      <span>Scroll to explore</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Portfolio/Features Grid (Exact WorldQuant style)
const PortfolioSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const features = [
    {
      title: "AI Video Studio",
      subtitle: "Professional recording, reimagined.",
      description:
        "Noise cancellation, auto-framing, and studio-quality lighting in any environment.",
      color: "from-orange-500/20 to-amber-500/20",
      icon: Video,
    },
    {
      title: "3D Canvas",
      subtitle: "Spatial storytelling platform.",
      description:
        "Build immersive 3D backgrounds and animations that make your content stand out.",
      color: "from-blue-500/20 to-cyan-500/20",
      icon: Share2,
    },
    {
      title: "Smart Analytics",
      subtitle: "Precision insights for engagement.",
      description:
        "Understand viewer behavior with AI-powered heatmaps and sentiment analysis.",
      color: "from-violet-500/20 to-purple-500/20",
      icon: BarChart3,
    },
    {
      title: "Enterprise Security",
      subtitle: "Advanced protection for your content.",
      description:
        "End-to-end encryption, SSO, and compliance tools for organizations.",
      color: "from-emerald-500/20 to-teal-500/20",
      icon: Shield,
    },
  ];

  return (
    <section
      id="platform"
      ref={containerRef}
      className="relative py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div style={{ y }} className="mb-20">
          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">
            Our Platform
          </h2>
          <p className="text-4xl md:text-6xl font-bold text-white max-w-3xl">
            Our tools don't just capture video.
            <span className="text-white/30">
              {" "}
              They define the future of communication.
            </span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
              />
              <div className="relative p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-500 h-full min-h-[320px] flex flex-col justify-between">
                <div>
                  <feature.icon className="w-10 h-10 text-white/40 mb-6 group-hover:text-orange-500 transition-colors duration-300" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-white/60 mb-4">
                    {feature.subtitle}
                  </p>
                  <p className="text-white/40 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm text-orange-400">Learn more</span>
                  <ArrowUpRight className="w-4 h-4 text-orange-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Marquee Section (Exact WorldQuant style)
const MarqueeSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
      <div ref={scrollRef} className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-12 px-6"
        >
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-12">
              {[
                "AI-Powered",
                "3D Ready",
                "Instant Share",
                "4K Recording",
                "Team Sync",
                "Analytics",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-6">
                  <span className="text-4xl md:text-6xl font-bold text-white/10 hover:text-white/30 transition-colors duration-300 cursor-default">
                    {text}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-orange-500/30" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { value: "10M+", label: "Videos Created" },
    { value: "500K+", label: "Active Creators" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" },
  ];

  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center md:text-left"
            >
              <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/40 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section (Exact WorldQuant style)
const CTASection = () => {
  return (
    <section className="relative py-40 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-orange-500/5" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1]">
            Ready to Redefine
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Video Creation?
            </span>
          </h2>

          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
            Join the creators and teams who are already pulling the future
            forward with Streamify.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="group px-10 py-5 rounded-full bg-white text-black font-semibold text-lg flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>

            <motion.button
              className="px-10 py-5 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Talk to Sales
            </motion.button>
          </div>

          <p className="mt-8 text-sm text-white/30">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer (Exact WorldQuant style)
const Footer = () => {
  const links = {
    Product: ["Features", "Pricing", "Integrations", "API", "Security"],
    Company: ["About", "Blog", "Careers", "Press", "Contact"],
    Resources: [
      "Documentation",
      "Help Center",
      "Community",
      "Templates",
      "Webinars",
    ],
    Legal: ["Privacy", "Terms", "Cookie Policy", "Licenses"],
  };

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-6 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">
                Streamify
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              The infrastructure for modern video storytelling. AI-powered.
              3D-ready. Instantly shared.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "YouTube", "GitHub"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300 text-xs font-medium"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {social[0]}
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-sm text-white/40 hover:text-white transition-colors duration-300 block"
                      whileHover={{ x: 2 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            © 2026 Streamify. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <main className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden selection:bg-orange-500/30">
        <Navbar scrolled={scrolled} />
        <HeroSection />
        <EthosSection />
        <MarqueeSection />
        <PortfolioSection />
        <StatsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
