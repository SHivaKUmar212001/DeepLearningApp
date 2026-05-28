import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

const moduleColors: Record<string, { badge: string; accent: string }> = {
  Foundations: { badge: "bg-indigo-50 text-indigo-700 border-indigo-100", accent: "text-indigo-600" },
  "Computer Vision": { badge: "bg-cyan-50 text-cyan-700 border-cyan-100", accent: "text-cyan-600" },
  "Sequence Models & NLP": { badge: "bg-amber-50 text-amber-700 border-amber-100", accent: "text-amber-600" },
  "Generative AI": { badge: "bg-emerald-50 text-emerald-700 border-emerald-100", accent: "text-emerald-600" },
  "Advanced Topics": { badge: "bg-rose-50 text-rose-700 border-rose-100", accent: "text-rose-600" },
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
    excerpt: "Without activation functions, a neural network is just matrix multiplication. Learn how non-linearities give networks their power.",
    module: "Foundations",
    difficulty: "Beginner",
    estimatedTime: "8 mins",
    lessonNumber: 8,
  },
  {
    slug: "11-backpropagation",
    title: "Backpropagation",
    excerpt: "The algorithm that makes learning possible. Trace gradients backward through a network and watch weights update in real time.",
    module: "Foundations",
    difficulty: "Intermediate",
    estimatedTime: "15 mins",
    lessonNumber: 11,
  },
  {
    slug: "20-convolution-operation",
    title: "The Convolution Operation",
    excerpt: "Slide a kernel across an image and watch features emerge. The building block of every modern computer vision system.",
    module: "Computer Vision",
    difficulty: "Intermediate",
    estimatedTime: "10 mins",
    lessonNumber: 20,
  },
  {
    slug: "34-attention-mechanism",
    title: "The Attention Mechanism",
    excerpt: "How models learn to focus on what matters. Visualize attention weights and understand the breakthrough behind modern NLP.",
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

function DifficultyDot({ level }: { level: string }) {
  const color =
    level === "Beginner"
      ? "bg-emerald-400"
      : level === "Intermediate"
        ? "bg-amber-400"
        : "bg-rose-400";
  return <span className={`inline-block size-2 rounded-full ${color}`} />;
}

export default function Home() {
  return (
    <div className="animate-fade-in-up">
      {/* ── Hero ── */}
      <section className="border-b border-rose-100 bg-gradient-to-b from-rose-50/60 to-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-rose-400">
            Interactive Deep Learning
          </p>
          <h1 className="max-w-2xl text-[2.75rem] font-bold leading-[1.1] tracking-tight text-rose-950 sm:text-5xl lg:text-6xl">
            Learn deep learning by <em className="not-italic text-indigo-600">building</em> intuition
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-rose-700/80">
            54 interactive lessons from basic math to diffusion models.
            Every concept comes with a hands-on visualization you can play with.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lessons/01-scalars-vectors-tensors"
              className="inline-flex items-center gap-2 rounded-full bg-rose-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-800"
            >
              Start reading
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
            >
              Browse curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured article ── */}
      <section className="border-b border-rose-100">
        <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-400">
            <Sparkles size={14} />
            Featured
          </div>
          <Link
            href={`/lessons/${featured.slug}`}
            className="group block rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white p-8 transition-all hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 sm:p-10"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${moduleColors[featured.module]?.badge}`}>
                {featured.module}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-rose-400">
                <DifficultyDot level={featured.difficulty} />
                {featured.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-rose-400">
                <Clock size={12} />
                {featured.estimatedTime}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-rose-950 transition-colors group-hover:text-indigo-700 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-rose-600">
              {featured.excerpt}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-500">
              Read article <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Latest articles grid ── */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 lg:px-8">
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-rose-400">
          Popular lessons
        </h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-rose-100 bg-rose-100 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/lessons/${article.slug}`}
              className="group flex flex-col bg-white p-7 transition-colors hover:bg-rose-50/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${moduleColors[article.module]?.badge}`}>
                  {article.module}
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-rose-950 transition-colors group-hover:text-indigo-700">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-rose-500">
                {article.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-3 text-xs text-rose-400">
                <span className="flex items-center gap-1">
                  <DifficultyDot level={article.difficulty} />
                  {article.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {article.estimatedTime}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 transition-colors hover:text-indigo-600"
          >
            View all 54 lessons <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
