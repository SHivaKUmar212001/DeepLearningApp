import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const moduleColors: Record<string, string> = {
  Foundations: "text-indigo-400",
  "Computer Vision": "text-cyan-400",
  "Sequence Models & NLP": "text-yellow-400",
  "Generative AI": "text-emerald-400",
  "Advanced Topics": "text-pink-400",
};

interface ArticlePreview {
  slug: string;
  title: string;
  excerpt: string;
  module: string;
  difficulty: string;
  estimatedTime: string;
}

const featured: ArticlePreview = {
  slug: "37-transformer-architecture",
  title: "The Transformer Architecture",
  excerpt:
    "Attention is all you need. Dive into multi-head self-attention, positional encoding, and why transformers dominate modern AI.",
  module: "Sequence Models & NLP",
  difficulty: "Advanced",
  estimatedTime: "15 mins",
};

const popular: ArticlePreview[] = [
  { slug: "01-scalars-vectors-tensors", title: "Scalars, Vectors, and Tensors", excerpt: "Before a computer can learn, it needs a language. Numbers arranged in structures called tensors.", module: "Foundations", difficulty: "Beginner", estimatedTime: "5 mins" },
  { slug: "08-activation-functions", title: "Activation Functions", excerpt: "Without activation functions, a neural network is just matrix multiplication. Non-linearities give networks their power.", module: "Foundations", difficulty: "Beginner", estimatedTime: "8 mins" },
  { slug: "11-backpropagation", title: "Backpropagation", excerpt: "The algorithm that makes learning possible. Trace gradients backward through a network and watch weights update.", module: "Foundations", difficulty: "Intermediate", estimatedTime: "15 mins" },
  { slug: "20-convolution-operation", title: "The Convolution Operation", excerpt: "Slide a kernel across an image and watch features emerge. The building block of every modern vision system.", module: "Computer Vision", difficulty: "Intermediate", estimatedTime: "10 mins" },
  { slug: "34-attention-mechanism", title: "The Attention Mechanism", excerpt: "How models learn to focus on what matters. Visualize attention weights and the breakthrough behind modern NLP.", module: "Sequence Models & NLP", difficulty: "Intermediate", estimatedTime: "12 mins" },
  { slug: "43-gans", title: "Generative Adversarial Networks", excerpt: "Two networks locked in competition. A generator creates, a discriminator judges. Watch them evolve together.", module: "Generative AI", difficulty: "Advanced", estimatedTime: "12 mins" },
];

function DifficultyTag({ level }: { level: string }) {
  const color = level === "Beginner" ? "text-emerald-400" : level === "Intermediate" ? "text-yellow-400" : "text-pink-400";
  return <span className={`text-xs font-medium ${color}`}>{level}</span>;
}

export default function Home() {
  return (
    <div className="animate-fade-in-up">
      {/* ── Hero ── */}
      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 lg:px-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl" style={{ textWrap: "balance" }}>
            Learn deep learning by building intuition
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
            54 interactive lessons from basic math to diffusion models.
            Every concept comes with a visualization you can manipulate.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lessons/01-scalars-vectors-tensors"
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-500 active:scale-[0.98]"
            >
              Start lesson 1
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]"
            >
              Browse all 54 lessons
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-8">
          <Link
            href={`/lessons/${featured.slug}`}
            className="group block rounded-lg surface-card p-7 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-zinc-500">
              <span className={moduleColors[featured.module]}>{featured.module}</span>
              <DifficultyTag level={featured.difficulty} />
              <span className="flex items-center gap-1"><Clock size={11} />{featured.estimatedTime}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100 transition-colors group-hover:text-teal-400 sm:text-2xl" style={{ textWrap: "balance" }}>
              {featured.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
              {featured.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 transition-colors group-hover:text-teal-300">
              Read lesson <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Popular lessons ── */}
      <section className="mx-auto max-w-[1200px] px-6 py-12 lg:px-8">
        <h2 className="mb-6 text-sm font-medium text-zinc-500">Popular lessons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {popular.map((article) => (
            <Link
              key={article.slug}
              href={`/lessons/${article.slug}`}
              className="group flex flex-col rounded-lg surface-card p-5"
            >
              <span className={`text-[11px] font-medium ${moduleColors[article.module]} mb-3`}>
                {article.module}
              </span>
              <h3 className="text-[15px] font-semibold text-zinc-200 transition-colors group-hover:text-teal-400 leading-snug">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-zinc-600">
                <DifficultyTag level={article.difficulty} />
                <span className="flex items-center gap-1"><Clock size={11} />{article.estimatedTime}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/curriculum" className="text-sm font-medium text-zinc-500 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5">
            View all 54 lessons <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
