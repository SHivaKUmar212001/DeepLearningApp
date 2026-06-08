"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface Lesson { id: number; title: string; slug: string; difficulty: string; estimatedTime: string; }
interface Module { id: number; title: string; description: string; color: string; lessons: Lesson[]; }

const curriculum: Module[] = [
  { id: 1, title: "Foundations", description: "The core math and architecture behind neural networks.", color: "text-indigo-400", lessons: [
    { id: 1, title: "Scalars, Vectors, and Tensors", slug: "01-scalars-vectors-tensors", difficulty: "Beginner", estimatedTime: "5 mins" },
    { id: 2, title: "Matrices and Transformations", slug: "02-matrices-and-transformations", difficulty: "Beginner", estimatedTime: "12 mins" },
    { id: 3, title: "Dot Products and Projections", slug: "03-dot-products", difficulty: "Beginner", estimatedTime: "10 mins" },
    { id: 4, title: "Calculus and Derivatives", slug: "04-calculus-derivatives", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 5, title: "The Chain Rule", slug: "05-chain-rule", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 6, title: "What is a Neural Network?", slug: "06-what-is-a-neural-network", difficulty: "Beginner", estimatedTime: "10 mins" },
    { id: 7, title: "The Perceptron", slug: "07-the-perceptron", difficulty: "Beginner", estimatedTime: "8 mins" },
    { id: 8, title: "Activation Functions", slug: "08-activation-functions", difficulty: "Beginner", estimatedTime: "8 mins" },
    { id: 9, title: "Forward Propagation", slug: "09-forward-propagation", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 10, title: "Loss Functions", slug: "10-loss-functions", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 11, title: "Backpropagation", slug: "11-backpropagation", difficulty: "Intermediate", estimatedTime: "15 mins" },
    { id: 12, title: "Gradient Descent", slug: "12-gradient-descent", difficulty: "Intermediate", estimatedTime: "12 mins" },
    { id: 13, title: "Optimizers", slug: "13-optimizers", difficulty: "Intermediate", estimatedTime: "12 mins" },
    { id: 14, title: "Learning Rates and Scheduling", slug: "14-learning-rates", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 15, title: "Overfitting and Regularization", slug: "15-regularization", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 16, title: "Dropout and Batch Normalization", slug: "16-dropout-batchnorm", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 17, title: "Training your first MLP", slug: "17-training-mlp", difficulty: "Intermediate", estimatedTime: "12 mins" },
  ]},
  { id: 2, title: "Computer Vision", description: "Seeing the world through convolutions.", color: "text-cyan-400", lessons: [
    { id: 18, title: "Images as Tensors", slug: "18-images-as-tensors", difficulty: "Beginner", estimatedTime: "8 mins" },
    { id: 19, title: "Kernels and Filters", slug: "19-kernels-filters", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 20, title: "The Convolution Operation", slug: "20-convolution-operation", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 21, title: "Padding and Stride", slug: "21-padding-stride", difficulty: "Intermediate", estimatedTime: "8 mins" },
    { id: 22, title: "Pooling Layers", slug: "22-pooling-layers", difficulty: "Intermediate", estimatedTime: "8 mins" },
    { id: 23, title: "CNN Architectures", slug: "23-cnn-architectures", difficulty: "Advanced", estimatedTime: "15 mins" },
    { id: 24, title: "Object Detection Basics", slug: "24-object-detection", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 25, title: "Semantic Segmentation", slug: "25-semantic-segmentation", difficulty: "Advanced", estimatedTime: "10 mins" },
    { id: 26, title: "Transfer Learning", slug: "26-transfer-learning", difficulty: "Intermediate", estimatedTime: "8 mins" },
    { id: 27, title: "Adversarial Examples", slug: "27-adversarial-examples", difficulty: "Advanced", estimatedTime: "10 mins" },
  ]},
  { id: 3, title: "Sequence Models and NLP", description: "Understanding time and language.", color: "text-yellow-400", lessons: [
    { id: 28, title: "Text as Data: Tokenization", slug: "28-tokenization", difficulty: "Beginner", estimatedTime: "8 mins" },
    { id: 29, title: "Word Embeddings", slug: "29-word-embeddings", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 30, title: "Recurrent Neural Networks", slug: "30-rnns", difficulty: "Intermediate", estimatedTime: "12 mins" },
    { id: 31, title: "Vanishing Gradients in Time", slug: "31-vanishing-gradients-time", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 32, title: "LSTMs and GRUs", slug: "32-lstms-grus", difficulty: "Advanced", estimatedTime: "15 mins" },
    { id: 33, title: "Sequence to Sequence Models", slug: "33-seq2seq", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 34, title: "The Attention Mechanism", slug: "34-attention-mechanism", difficulty: "Intermediate", estimatedTime: "12 mins" },
    { id: 35, title: "Self-Attention", slug: "35-self-attention", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 36, title: "Positional Encoding", slug: "36-positional-encoding", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 37, title: "The Transformer Architecture", slug: "37-transformer-architecture", difficulty: "Advanced", estimatedTime: "15 mins" },
    { id: 38, title: "GPT and Decoder-only Models", slug: "38-gpt", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 39, title: "BERT and Encoder-only Models", slug: "39-bert", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 40, title: "Fine-tuning LLMs (LoRA)", slug: "40-lora", difficulty: "Advanced", estimatedTime: "10 mins" },
  ]},
  { id: 4, title: "Generative AI", description: "Creating new data from noise.", color: "text-emerald-400", lessons: [
    { id: 41, title: "Autoencoders", slug: "41-autoencoders", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 42, title: "Variational Autoencoders", slug: "42-vaes", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 43, title: "GANs", slug: "43-gans", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 44, title: "Diffusion: Forward Process", slug: "44-forward-diffusion", difficulty: "Advanced", estimatedTime: "10 mins" },
    { id: 45, title: "Diffusion: Reverse Process", slug: "45-reverse-diffusion", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 46, title: "U-Net Architectures", slug: "46-unet", difficulty: "Advanced", estimatedTime: "8 mins" },
    { id: 47, title: "Classifier-Free Guidance", slug: "47-cfg", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 48, title: "Latent Diffusion", slug: "48-latent-diffusion", difficulty: "Advanced", estimatedTime: "10 mins" },
  ]},
  { id: 5, title: "Advanced Topics", description: "Pushing the boundaries of learning.", color: "text-pink-400", lessons: [
    { id: 49, title: "Reinforcement Learning Basics", slug: "49-rl-basics", difficulty: "Beginner", estimatedTime: "8 mins" },
    { id: 50, title: "Q-Learning and DQN", slug: "50-q-learning", difficulty: "Intermediate", estimatedTime: "10 mins" },
    { id: 51, title: "Policy Gradients", slug: "51-policy-gradients", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 52, title: "Actor-Critic Models", slug: "52-actor-critic", difficulty: "Advanced", estimatedTime: "12 mins" },
    { id: 53, title: "Graph Neural Networks", slug: "53-gnns", difficulty: "Advanced", estimatedTime: "10 mins" },
    { id: 54, title: "The Future of Deep Learning", slug: "54-future-of-dl", difficulty: "Beginner", estimatedTime: "5 mins" },
  ]},
];

function DifficultyTag({ level }: { level: string }) {
  const color = level === "Beginner" ? "text-emerald-400" : level === "Intermediate" ? "text-yellow-400" : "text-pink-400";
  return <span className={`text-[11px] font-medium ${color}`}>{level}</span>;
}

export default function CurriculumPage() {
  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-[1200px] px-6 py-12 sm:py-16 lg:px-8">
      <header className="mb-12 max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl" style={{ textWrap: "balance" }}>Curriculum</h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">54 lessons across 5 modules. Start anywhere; every lesson is self-contained with interactive visualizations.</p>
      </header>

      <div className="space-y-12">
        {curriculum.map((mod) => (
          <section key={mod.id}>
            <div className="mb-4 flex items-baseline gap-3 border-b border-white/[0.07] pb-3">
              <h2 className={`text-lg font-bold ${mod.color}`}>{mod.title}</h2>
              <span className="text-sm text-zinc-600">{mod.lessons.length} lessons</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {mod.lessons.map((lesson, idx) => (
                <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group flex items-center gap-4 py-3 px-2 -mx-2 rounded transition-colors hover:bg-white/[0.03]">
                  <span className="hidden w-6 shrink-0 text-right text-xs font-mono tabular-nums text-zinc-700 sm:block">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-zinc-300 transition-colors group-hover:text-zinc-100">{lesson.title}</h3>
                  </div>
                  <div className="hidden items-center gap-4 sm:flex">
                    <DifficultyTag level={lesson.difficulty} />
                    <span className="flex items-center gap-1 text-[11px] text-zinc-600"><Clock size={11} />{lesson.estimatedTime}</span>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-zinc-800 transition-all group-hover:text-teal-400 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
