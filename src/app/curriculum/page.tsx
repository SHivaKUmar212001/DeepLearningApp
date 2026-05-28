import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const metadata = {
  title: "Curriculum | DeepDive",
};

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
  badgeClass: string;
  lessons: Lesson[];
}

const curriculum: Module[] = [
  {
    id: 1,
    title: "Foundations",
    tag: "Module 1",
    description: "The core math and architecture behind neural networks.",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
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
      { id: 13, title: "Optimizers (Momentum, RMSprop, Adam)", isAvailable: true, slug: "13-optimizers", difficulty: "Intermediate", estimatedTime: "12 mins" },
      { id: 14, title: "Learning Rates & Scheduling", isAvailable: true, slug: "14-learning-rates", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 15, title: "Overfitting & Regularization", isAvailable: true, slug: "15-regularization", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 16, title: "Dropout & Batch Normalization", isAvailable: true, slug: "16-dropout-batchnorm", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 17, title: "Training your first MLP", isAvailable: true, slug: "17-training-mlp", difficulty: "Intermediate", estimatedTime: "12 mins" },
    ],
  },
  {
    id: 2,
    title: "Computer Vision",
    tag: "Module 2",
    description: "Seeing the world through convolutions.",
    badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-100",
    lessons: [
      { id: 18, title: "Images as Tensors", isAvailable: true, slug: "18-images-as-tensors", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 19, title: "Kernels & Filters", isAvailable: true, slug: "19-kernels-filters", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 20, title: "The Convolution Operation", isAvailable: true, slug: "20-convolution-operation", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 21, title: "Padding & Stride", isAvailable: true, slug: "21-padding-stride", difficulty: "Intermediate", estimatedTime: "8 mins" },
      { id: 22, title: "Pooling Layers", isAvailable: true, slug: "22-pooling-layers", difficulty: "Intermediate", estimatedTime: "8 mins" },
      { id: 23, title: "CNN Architectures (LeNet, VGG, ResNet)", isAvailable: true, slug: "23-cnn-architectures", difficulty: "Advanced", estimatedTime: "15 mins" },
      { id: 24, title: "Object Detection Basics", isAvailable: true, slug: "24-object-detection", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 25, title: "Semantic Segmentation", isAvailable: true, slug: "25-semantic-segmentation", difficulty: "Advanced", estimatedTime: "10 mins" },
      { id: 26, title: "Transfer Learning", isAvailable: true, slug: "26-transfer-learning", difficulty: "Intermediate", estimatedTime: "8 mins" },
      { id: 27, title: "Adversarial Examples", isAvailable: true, slug: "27-adversarial-examples", difficulty: "Advanced", estimatedTime: "10 mins" },
    ],
  },
  {
    id: 3,
    title: "Sequence Models & NLP",
    tag: "Module 3",
    description: "Understanding time and language.",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
    lessons: [
      { id: 28, title: "Text as Data: Tokenization", isAvailable: true, slug: "28-tokenization", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 29, title: "Word Embeddings (Word2Vec)", isAvailable: true, slug: "29-word-embeddings", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 30, title: "Recurrent Neural Networks (RNNs)", isAvailable: true, slug: "30-rnns", difficulty: "Intermediate", estimatedTime: "12 mins" },
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
    id: 4,
    title: "Generative AI",
    tag: "Module 4",
    description: "Creating new data from noise.",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    lessons: [
      { id: 41, title: "Autoencoders", isAvailable: true, slug: "41-autoencoders", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 42, title: "Variational Autoencoders (VAEs)", isAvailable: true, slug: "42-vaes", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 43, title: "Generative Adversarial Networks (GANs)", isAvailable: true, slug: "43-gans", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 44, title: "Diffusion Models: Forward Process", isAvailable: true, slug: "44-forward-diffusion", difficulty: "Advanced", estimatedTime: "10 mins" },
      { id: 45, title: "Diffusion Models: Reverse Process", isAvailable: true, slug: "45-reverse-diffusion", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 46, title: "U-Net Architectures", isAvailable: true, slug: "46-unet", difficulty: "Advanced", estimatedTime: "8 mins" },
      { id: 47, title: "Classifier-Free Guidance", isAvailable: true, slug: "47-cfg", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 48, title: "Latent Diffusion (Stable Diffusion)", isAvailable: true, slug: "48-latent-diffusion", difficulty: "Advanced", estimatedTime: "10 mins" },
    ],
  },
  {
    id: 5,
    title: "Advanced Topics",
    tag: "Module 5",
    description: "Pushing the boundaries of learning.",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-100",
    lessons: [
      { id: 49, title: "Reinforcement Learning Basics", isAvailable: true, slug: "49-rl-basics", difficulty: "Beginner", estimatedTime: "8 mins" },
      { id: 50, title: "Q-Learning & Deep Q-Networks", isAvailable: true, slug: "50-q-learning", difficulty: "Intermediate", estimatedTime: "10 mins" },
      { id: 51, title: "Policy Gradients", isAvailable: true, slug: "51-policy-gradients", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 52, title: "Actor-Critic Models", isAvailable: true, slug: "52-actor-critic", difficulty: "Advanced", estimatedTime: "12 mins" },
      { id: 53, title: "Graph Neural Networks (GNNs)", isAvailable: true, slug: "53-gnns", difficulty: "Advanced", estimatedTime: "10 mins" },
      { id: 54, title: "The Future of Deep Learning", isAvailable: true, slug: "54-future-of-dl", difficulty: "Beginner", estimatedTime: "5 mins" },
    ],
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

export default function CurriculumPage() {
  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-[1200px] px-6 py-12 sm:py-16 lg:px-8">
      {/* Header */}
      <header className="mb-14 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-rose-400">
          Deep learning roadmap
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-rose-950 sm:text-5xl">
          Curriculum
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-rose-600">
          54 lessons across 5 modules. Start anywhere — every lesson is self-contained
          with interactive visualizations built in.
        </p>
      </header>

      {/* Module sections */}
      <div className="space-y-16">
        {curriculum.map((mod) => (
          <section key={mod.id}>
            {/* Module header */}
            <div className="mb-6 flex items-baseline gap-3 border-b border-rose-100 pb-4">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${mod.badgeClass}`}>
                {mod.tag}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-rose-950">
                {mod.title}
              </h2>
            </div>
            <p className="mb-6 text-sm text-rose-500">{mod.description}</p>

            {/* Lesson list */}
            <div className="divide-y divide-rose-50">
              {mod.lessons.map((lesson, idx) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug}`}
                  className="group flex items-center gap-4 py-4 transition-colors hover:bg-rose-50/50 rounded-lg px-3 -mx-3"
                >
                  {/* Number */}
                  <span className="hidden w-8 shrink-0 text-right text-sm font-medium tabular-nums text-rose-300 sm:block">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Title + meta */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-rose-950 transition-colors group-hover:text-indigo-700">
                      {lesson.title}
                    </h3>
                  </div>

                  {/* Metadata */}
                  <div className="hidden items-center gap-4 text-xs text-rose-400 sm:flex">
                    <span className="flex items-center gap-1.5">
                      <DifficultyDot level={lesson.difficulty} />
                      {lesson.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {lesson.estimatedTime}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-rose-200 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
