"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Clock, Sparkles, Zap, Brain, Eye, Cpu, Layers } from "lucide-react";

const ParticleField = dynamic(
  () => import("@/components/ui/ParticleField").then(m => m.ParticleField),
  { ssr: false }
);
const HolographicGrid = dynamic(
  () => import("@/components/ui/HolographicGrid").then(m => m.HolographicGrid),
  { ssr: false }
);

const moduleThemes: Record<string, { neon: string; glow: string; icon: React.ElementType }> = {
  Foundations: { neon: "text-violet-400", glow: "shadow-violet-500/20", icon: Brain },
  "Computer Vision": { neon: "text-cyan-400", glow: "shadow-cyan-500/20", icon: Eye },
  "Sequence Models & NLP": { neon: "text-amber-400", glow: "shadow-amber-500/20", icon: Cpu },
  "Generative AI": { neon: "text-emerald-400", glow: "shadow-emerald-500/20", icon: Layers },
  "Advanced Topics": { neon: "text-pink-400", glow: "shadow-pink-500/20", icon: Zap },
};

interface ArticlePreview {
  slug: string;
  title: string;
  excerpt: string;
  module: string;
  difficulty: string;
  estimatedTime: string;
  lessonNumber: number;
}

const featured: ArticlePreview = {
  slug: "37-transformer-architecture",
  title: "The Transformer Architecture",
  excerpt:
    "Attention is all you need — the model that changed everything. Dive deep into multi-head self-attention, positional encoding, and why transformers dominate modern AI.",
  module: "Sequence Models & NLP",
  difficulty: "Advanced",
  estimatedTime: "15 mins",
  lessonNumber: 37,
};

const latestArticles: ArticlePreview[] = [
  {
    slug: "01-scalars-vectors-tensors",
    title: "Scalars, Vectors, & Tensors",
    excerpt: "Before a computer can learn, it needs a language — numbers arranged in structures called tensors.",
    module: "Foundations",
    difficulty: "Beginner",
    estimatedTime: "5 mins",
    lessonNumber: 1,
  },
  {
    slug: "08-activation-functions",
    title: "Activation Functions",
    excerpt: "Without activation functions, a neural network is just matrix multiplication. Non-linearities give networks their power.",
    module: "Foundations",
    difficulty: "Beginner",
    estimatedTime: "8 mins",
    lessonNumber: 8,
  },
  {
    slug: "11-backpropagation",
    title: "Backpropagation",
    excerpt: "The algorithm that makes learning possible. Trace gradients backward through a network and watch weights update.",
    module: "Foundations",
    difficulty: "Intermediate",
    estimatedTime: "15 mins",
    lessonNumber: 11,
  },
  {
    slug: "20-convolution-operation",
    title: "The Convolution Operation",
    excerpt: "Slide a kernel across an image and watch features emerge. The building block of every modern vision system.",
    module: "Computer Vision",
    difficulty: "Intermediate",
    estimatedTime: "10 mins",
    lessonNumber: 20,
  },
  {
    slug: "34-attention-mechanism",
    title: "The Attention Mechanism",
    excerpt: "How models learn to focus on what matters. Visualize attention weights and the breakthrough behind modern NLP.",
    module: "Sequence Models & NLP",
    difficulty: "Intermediate",
    estimatedTime: "12 mins",
    lessonNumber: 34,
  },
  {
    slug: "43-gans",
    title: "Generative Adversarial Networks",
    excerpt: "Two networks locked in competition — a generator creates, a discriminator judges. Watch them evolve together.",
    module: "Generative AI",
    difficulty: "Advanced",
    estimatedTime: "12 mins",
    lessonNumber: 43,
  },
];

function DifficultyBadge({ level }: { level: string }) {
  const style =
    level === "Beginner"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : level === "Intermediate"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-pink-500/10 text-pink-400 border-pink-500/20";
  return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style}`}>{level}</span>;
}

export default function Home() {
  return (
    <div>
      {/* ══════ HERO — Cinematic intro with particles ══════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Particle canvas */}
        <div className="absolute inset-0 z-0">
          <ParticleField className="absolute inset-0" />
        </div>
        {/* Holographic grid floor */}
        <div className="absolute inset-0 z-0">
          <HolographicGrid className="absolute inset-0" />
        </div>
        {/* Radial ambient glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-24 lg:px-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-violet-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-300/80">
              Interactive Deep Learning
            </span>
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Enter the
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent neon-text">
              Neural Network
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/50">
            54 interactive lessons from basic math to diffusion models.
            Every concept comes with a hands-on visualization you can play with.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/lessons/01-scalars-vectors-tensors"
              className="group relative inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white overflow-hidden transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                Begin journey
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 rounded-full glass glass-hover px-7 py-3.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Browse curriculum
            </Link>
          </div>

          {/* Floating stats */}
          <div className="mt-16 flex flex-wrap gap-8 stagger-children">
            {[
              { n: "54", label: "Lessons" },
              { n: "5", label: "Modules" },
              { n: "100%", label: "Interactive" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-3xl font-bold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                  {s.n}
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-white/30">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FEATURED — Holographic card ══════ */}
      <section className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/60">
            <Sparkles size={14} className="animate-glow-pulse" />
            Featured Transmission
          </div>
          <Link
            href={`/lessons/${featured.slug}`}
            className="group relative block rounded-2xl glass glass-hover overflow-hidden p-8 sm:p-10"
          >
            {/* Background shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent animate-shimmer" />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
            <div className="absolute top-0 left-0 h-20 w-px bg-gradient-to-b from-violet-500/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-20 h-px bg-gradient-to-l from-cyan-500/50 to-transparent" />
            <div className="absolute bottom-0 right-0 h-20 w-px bg-gradient-to-t from-cyan-500/50 to-transparent" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                  {featured.module}
                </span>
                <DifficultyBadge level={featured.difficulty} />
                <span className="flex items-center gap-1 text-xs text-white/30">
                  <Clock size={12} />
                  {featured.estimatedTime}
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-violet-300 sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/40 group-hover:text-white/55 transition-colors">
                {featured.excerpt}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                Enter lesson
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════ GRID — Glassmorphism lesson cards ══════ */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
        <h2 className="mb-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          Popular Lessons
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {latestArticles.map((article) => {
            const theme = moduleThemes[article.module];
            const Icon = theme?.icon || Brain;
            return (
              <Link
                key={article.slug}
                href={`/lessons/${article.slug}`}
                className="group relative rounded-2xl glass glass-hover overflow-hidden p-6 flex flex-col"
              >
                {/* Top accent line */}
                <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${theme?.neon === "text-violet-400" ? "via-violet-500/40" : theme?.neon === "text-cyan-400" ? "via-cyan-500/40" : theme?.neon === "text-amber-400" ? "via-amber-500/40" : theme?.neon === "text-emerald-400" ? "via-emerald-500/40" : "via-pink-500/40"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="flex items-center gap-2 mb-4">
                  <Icon size={14} className={`${theme?.neon} opacity-60`} />
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme?.neon} opacity-60`}>
                    {article.module}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-white/90 transition-colors group-hover:text-white">
                  {article.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/30 group-hover:text-white/45 transition-colors">
                  {article.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/25">
                    <DifficultyBadge level={article.difficulty} />
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {article.estimatedTime}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-white/10 transition-all group-hover:text-violet-400 group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/30 hover:text-violet-400 transition-colors duration-300"
          >
            View all 54 lessons <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
