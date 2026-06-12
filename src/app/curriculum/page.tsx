"use client";

import Link from "next/link";
import { ArrowRight, Clock, Brain, Eye, Cpu, Layers, Zap, type LucideIcon } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  isAvailable: boolean;
  slug?: string;
  difficulty: string;
  estimatedTime: string;
}

interface Module {
  id: number;
  title: string;
  tag: string;
  description: string;
  neon: string;
  glowColor: string;
  borderAccent: string;
  icon: LucideIcon;
  lessons: Lesson[];
}

const curriculum: Module[] = [
  {
    id: 1, title: "Foundations", tag: "Module 01", description: "The core math and architecture behind neural networks.",
    neon: "text-violet-400", glowColor: "violet", borderAccent: "from-violet-500/40", icon: Brain,
    lessons: [
      { id: 1, title: "Scalars, Vectors, & Tensors", isAvailable: true, slug: "01-scalars-vectors-tensors", difficulty: "Beginner", estimatedTime: "5 mins" },
      { id: 2, title: "Matrices & Transformations", isAvailable: true, slug: "02-matrices-and-transformations", difficulty: "Beginner", estimatedTime: "12 mins" },
      { id: 3, title: "Dot Products & Projections", isAvailable: true, slug: "03-dot-products", difficulty: "Beginner", estimatedTime: "10 mins" },
      { id: 4, title: "Calculus & Derivatives", isAvailable: true, slug: "04-calculus-derivatives", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 5, title: "The Chain Rule", isAvailable: true, slug: "05-chain-rule", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 6, title: "What is a Neural Network?", isAvailable: true, slug: "06-what-is-a-neural-network", difficulty: "Beginner", estimatedTime: "10 mins" },
      { id: 7, title: "The Perceptron", isAvailable: true, slug: "07-the-perceptron", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 8, title: "Activation Functions", isAvailable: true, slug: "08-activation-functions", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 9, title: "Forward Propagation", isAvailable: true, slug: "09-forward-propagation", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 10, title: "Loss Functions", isAvailable: true, slug: "10-loss-functions", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 11, title: "Backpropagation", isAvailable: true, slug: "11-backpropagation", difficulty: "Intermediate", estimatedTime: "15 mins" },
      { id: 12, title: "Gradient Descent", isAvailable: true, slug: "12-gradient-descent", difficulty: "Intermediate", estimatedTime: "12 mins" },
      { id: 13, title: "Optimizers", isAvailable: true, slug: "13-optimizers", difficulty: "Intermediate", estimatedTime: "12 mins" },
      { id: 14, title: "Learning Rates & Scheduling", isAvailable: true, slug: "14-learning-rates", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 15, title: "Overfitting & Regularization", isAvailable: true, slug: "15-regularization", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 16, title: "Dropout & Batch Normalization", isAvailable: true, slug: "16-dropout-batchnorm", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 17, title: "Training your first MLP", isAvailable: true, slug: "17-training-mlp", difficulty: "Intermediate", estimatedTime: "12 mins" },
    ],
  },
  {
    id: 2, title: "Computer Vision", tag: "Module 02", description: "Seeing the world through convolutions.",
    neon: "text-cyan-400", glowColor: "cyan", borderAccent: "from-cyan-500/40", icon: Eye,
    lessons: [
      { id: 18, title: "Images as Tensors", isAvailable: true, slug: "18-images-as-tensors", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 19, title: "Kernels & Filters", isAvailable: true, slug: "19-kernels-filters", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 20, title: "The Convolution Operation", isAvailable: true, slug: "20-convolution-operation", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 21, title: "Padding & Stride", isAvailable: true, slug: "21-padding-stride", difficulty: "Intermediate", estimatedTime: "8 mins" },
      { id: 22, title: "Pooling Layers", isAvailable: true, slug: "22-pooling-layers", difficulty: "Intermediate", estimatedTime: "8 mins" },
      { id: 23, title: "CNN Architectures", isAvailable: true, slug: "23-cnn-architectures", difficulty: "Advanced", estimatedTime: "15 mins" },
      { id: 24, title: "Object Detection Basics", isAvailable: true, slug: "24-object-detection", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 25, title: "Semantic Segmentation", isAvailable: true, slug: "25-semantic-segmentation", difficulty: "Advanced", estimatedTime: "10 mins" },
      { id: 26, title: "Transfer Learning", isAvailable: true, slug: "26-transfer-learning", difficulty: "Intermediate", estimatedTime: "8 mins" },
      { id: 27, title: "Adversarial Examples", isAvailable: true, slug: "27-adversarial-examples", difficulty: "Advanced", estimatedTime: "10 mins" },
    ],
  },
  {
    id: 3, title: "Sequence Models & NLP", tag: "Module 03", description: "Understanding time and language.",
    neon: "text-amber-400", glowColor: "amber", borderAccent: "from-amber-500/40", icon: Cpu,
    lessons: [
      { id: 28, title: "Text as Data: Tokenization", isAvailable: true, slug: "28-tokenization", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 29, title: "Word Embeddings", isAvailable: true, slug: "29-word-embeddings", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 30, title: "Recurrent Neural Networks", isAvailable: true, slug: "30-rnns", difficulty: "Intermediate", estimatedTime: "12 mins" },
      { id: 31, title: "Vanishing Gradients in Time", isAvailable: true, slug: "31-vanishing-gradients-time", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 32, title: "LSTMs & GRUs", isAvailable: true, slug: "32-lstms-grus", difficulty: "Advanced", estimatedTime: "15 mins" },
      { id: 33, title: "Sequence to Sequence Models", isAvailable: true, slug: "33-seq2seq", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 34, title: "The Attention Mechanism", isAvailable: true, slug: "34-attention-mechanism", difficulty: "Intermediate", estimatedTime: "12 mins" },
      { id: 35, title: "Self-Attention", isAvailable: true, slug: "35-self-attention", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 36, title: "Positional Encoding", isAvailable: true, slug: "36-positional-encoding", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 37, title: "The Transformer Architecture", isAvailable: true, slug: "37-transformer-architecture", difficulty: "Advanced", estimatedTime: "15 mins" },
      { id: 38, title: "GPT and Decoder-only Models", isAvailable: true, slug: "38-gpt", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 39, title: "BERT and Encoder-only Models", isAvailable: true, slug: "39-bert", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 40, title: "Fine-tuning LLMs (LoRA)", isAvailable: true, slug: "40-lora", difficulty: "Advanced", estimatedTime: "10 mins" },
    ],
  },
  {
    id: 4, title: "Generative AI", tag: "Module 04", description: "Creating new data from noise.",
    neon: "text-emerald-400", glowColor: "emerald", borderAccent: "from-emerald-500/40", icon: Layers,
    lessons: [
      { id: 41, title: "Autoencoders", isAvailable: true, slug: "41-autoencoders", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 42, title: "Variational Autoencoders", isAvailable: true, slug: "42-vaes", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 43, title: "GANs", isAvailable: true, slug: "43-gans", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 44, title: "Diffusion: Forward Process", isAvailable: true, slug: "44-forward-diffusion", difficulty: "Advanced", estimatedTime: "10 mins" },
      { id: 45, title: "Diffusion: Reverse Process", isAvailable: true, slug: "45-reverse-diffusion", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 46, title: "U-Net Architectures", isAvailable: true, slug: "46-unet", difficulty: "Advanced", estimatedTime: "8 mins" },
      { id: 47, title: "Classifier-Free Guidance", isAvailable: true, slug: "47-cfg", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 48, title: "Latent Diffusion", isAvailable: true, slug: "48-latent-diffusion", difficulty: "Advanced", estimatedTime: "10 mins" },
    ],
  },
  {
    id: 5, title: "Advanced Topics", tag: "Module 05", description: "Pushing the boundaries of learning.",
    neon: "text-pink-400", glowColor: "pink", borderAccent: "from-pink-500/40", icon: Zap,
    lessons: [
      { id: 49, title: "Reinforcement Learning Basics", isAvailable: true, slug: "49-rl-basics", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 50, title: "Q-Learning & DQN", isAvailable: true, slug: "50-q-learning", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 51, title: "Policy Gradients", isAvailable: true, slug: "51-policy-gradients", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 52, title: "Actor-Critic Models", isAvailable: true, slug: "52-actor-critic", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 53, title: "Graph Neural Networks", isAvailable: true, slug: "53-gnns", difficulty: "Advanced", estimatedTime: "10 mins" },
      { id: 54, title: "The Future of Deep Learning", isAvailable: true, slug: "54-future-of-dl", difficulty: "Beginner", estimatedTime: "5 mins" },
    ],
  },
];

function DifficultyBadge({ level }: { level: string }) {
  const style =
    level === "Beginner" ? "text-emerald-400" : level === "Intermediate" ? "text-amber-400" : "text-pink-400";
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block size-1.5 rounded-full ${level === "Beginner" ? "bg-emerald-400" : level === "Intermediate" ? "bg-amber-400" : "bg-pink-400"}`} />
      <span className={`text-[11px] font-medium ${style}`}>{level}</span>
    </span>
  );
}

export default function CurriculumPage() {
  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-[1200px] px-6 py-12 sm:py-16 lg:px-8">
      {/* Header */}
      <header className="mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/60">
            Deep learning roadmap
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Curri<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">culum</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/40">
          54 lessons across 5 modules. Start anywhere — every lesson is self-contained
          with interactive visualizations built in.
        </p>
      </header>

      {/* Module sections */}
      <div className="space-y-12">
        {curriculum.map((mod) => {
          const Icon = mod.icon;
          return (
            <section key={mod.id} className="relative">
              {/* Module header card */}
              <div className="glass rounded-2xl overflow-hidden">
                {/* Top accent */}
                <div className={`h-px bg-gradient-to-r ${mod.borderAccent} via-transparent to-transparent`} />

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={18} className={`${mod.neon} opacity-70`} />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/25">
                      {mod.tag}
                    </span>
                  </div>
                  <h2 className={`text-2xl font-bold tracking-tight ${mod.neon}`}>
                    {mod.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/35">{mod.description}</p>

                  {/* Lesson list */}
                  <div className="mt-6 divide-y divide-white/[0.04]">
                    {mod.lessons.map((lesson, idx) => (
                      <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.slug}`}
                        className="group flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-lg transition-all duration-300 hover:bg-white/[0.03]"
                      >
                        <span className="hidden w-7 shrink-0 text-right text-xs font-mono tabular-nums text-white/15 sm:block">
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] font-medium text-white/70 transition-colors group-hover:text-white">
                            {lesson.title}
                          </h3>
                        </div>

                        <div className="hidden items-center gap-4 sm:flex">
                          <DifficultyBadge level={lesson.difficulty} />
                          <span className="flex items-center gap-1 text-[11px] text-white/20">
                            <Clock size={11} />
                            {lesson.estimatedTime}
                          </span>
                        </div>

                        <ArrowRight
                          size={14}
                          className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-violet-400 group-hover:translate-x-0.5"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
