import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ArrowLeft, Clock, GraduationCap, Zap } from "lucide-react";

import LossSurface3D from "@/components/viz/LossSurface3D";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { PlayControl } from "@/components/ui/PlayControl";
import { NeuralNet } from "@/components/viz/NeuralNet";
import { MatrixViz } from "@/components/viz/MatrixViz";
import { TrainingChart } from "@/components/viz/TrainingChart";
import { InteractiveDescent } from "@/components/lessons/InteractiveDescent";
import { InteractiveVector } from "@/components/lessons/InteractiveVector";
import { InteractiveMatrix } from "@/components/lessons/InteractiveMatrix";
import { InteractivePerceptron } from "@/components/lessons/InteractivePerceptron";
import { InteractiveActivation } from "@/components/lessons/InteractiveActivation";
import { InteractiveNetwork } from "@/components/lessons/InteractiveNetwork";
import { InteractiveForwardPass } from "@/components/lessons/InteractiveForwardPass";
import { InteractiveLoss } from "@/components/lessons/InteractiveLoss";
import { InteractiveBackprop } from "@/components/lessons/InteractiveBackprop";
import { InteractiveOptimizers } from "@/components/lessons/InteractiveOptimizers";
import { InteractiveLearningRates } from "@/components/lessons/InteractiveLearningRates";
import { InteractiveRegularization } from "@/components/lessons/InteractiveRegularization";
import { InteractiveDropout } from "@/components/lessons/InteractiveDropout";
import { InteractivePlayground } from "@/components/lessons/InteractivePlayground";
import { InteractiveDerivative } from "@/components/lessons/InteractiveDerivative";
import { InteractiveChainRule } from "@/components/lessons/InteractiveChainRule";
import { InteractiveImageTensors } from "@/components/lessons/InteractiveImageTensors";
import { InteractiveFilters } from "@/components/lessons/InteractiveFilters";
import { InteractiveConvolution } from "@/components/lessons/InteractiveConvolution";
import { InteractiveStride } from "@/components/lessons/InteractiveStride";
import { InteractivePooling } from "@/components/lessons/InteractivePooling";
import { InteractiveCNN } from "@/components/lessons/InteractiveCNN";
import { InteractiveObjectDetection } from "@/components/lessons/InteractiveObjectDetection";
import { InteractiveSegmentation } from "@/components/lessons/InteractiveSegmentation";
import { InteractiveTransferLearning } from "@/components/lessons/InteractiveTransferLearning";
import { InteractiveAdversarial } from "@/components/lessons/InteractiveAdversarial";
import { InteractiveTokenization } from "@/components/lessons/InteractiveTokenization";
import { InteractiveEmbeddings } from "@/components/lessons/InteractiveEmbeddings";
import { InteractiveRNN } from "@/components/lessons/InteractiveRNN";
import { InteractiveVanishingTime } from "@/components/lessons/InteractiveVanishingTime";
import { InteractiveLSTM } from "@/components/lessons/InteractiveLSTM";
import { InteractiveSeq2Seq } from "@/components/lessons/InteractiveSeq2Seq";
import { InteractiveAttention } from "@/components/lessons/InteractiveAttention";
import { InteractiveSelfAttention } from "@/components/lessons/InteractiveSelfAttention";
import { InteractivePositional } from "@/components/lessons/InteractivePositional";
import { InteractiveTransformer } from "@/components/lessons/InteractiveTransformer";
import { InteractiveGPT } from "@/components/lessons/InteractiveGPT";
import { InteractiveBERT } from "@/components/lessons/InteractiveBERT";
import { InteractiveLoRA } from "@/components/lessons/InteractiveLoRA";
import { InteractiveAutoencoder } from "@/components/lessons/InteractiveAutoencoder";
import { InteractiveVAE } from "@/components/lessons/InteractiveVAE";
import { InteractiveGAN } from "@/components/lessons/InteractiveGAN";
import { InteractiveForwardDiffusion } from "@/components/lessons/InteractiveForwardDiffusion";
import { InteractiveReverseDiffusion } from "@/components/lessons/InteractiveReverseDiffusion";
import { InteractiveUNet } from "@/components/lessons/InteractiveUNet";
import { InteractiveCFG } from "@/components/lessons/InteractiveCFG";
import { InteractiveStableDiffusion } from "@/components/lessons/InteractiveStableDiffusion";
import { InteractiveRLBasics } from "@/components/lessons/InteractiveRLBasics";
import { InteractiveQLearning } from "@/components/lessons/InteractiveQLearning";
import { InteractivePolicyGradient } from "@/components/lessons/InteractivePolicyGradient";
import { InteractiveActorCritic } from "@/components/lessons/InteractiveActorCritic";
import { InteractiveGNN } from "@/components/lessons/InteractiveGNN";
import { InteractiveFuture } from "@/components/lessons/InteractiveFuture";

const components = {
  LossSurface3D, Slider, Toggle, PlayControl, NeuralNet, MatrixViz, TrainingChart,
  InteractiveDescent, InteractiveVector, InteractiveMatrix, InteractivePerceptron,
  InteractiveActivation, InteractiveNetwork, InteractiveForwardPass, InteractiveLoss,
  InteractiveBackprop, InteractiveOptimizers, InteractiveLearningRates,
  InteractiveRegularization, InteractiveDropout, InteractivePlayground,
  InteractiveDerivative, InteractiveChainRule, InteractiveImageTensors,
  InteractiveFilters, InteractiveConvolution, InteractiveStride, InteractivePooling,
  InteractiveCNN, InteractiveObjectDetection, InteractiveSegmentation,
  InteractiveTransferLearning, InteractiveAdversarial, InteractiveTokenization,
  InteractiveEmbeddings, InteractiveRNN, InteractiveVanishingTime, InteractiveLSTM,
  InteractiveSeq2Seq, InteractiveAttention, InteractiveSelfAttention,
  InteractivePositional, InteractiveTransformer, InteractiveGPT, InteractiveBERT,
  InteractiveLoRA, InteractiveAutoencoder, InteractiveVAE, InteractiveGAN,
  InteractiveForwardDiffusion, InteractiveReverseDiffusion, InteractiveUNet,
  InteractiveCFG, InteractiveStableDiffusion, InteractiveRLBasics,
  InteractiveQLearning, InteractivePolicyGradient, InteractiveActorCritic,
  InteractiveGNN, InteractiveFuture,
};

function DifficultyBadge({ level }: { level: string }) {
  const style =
    level === "Beginner"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : level === "Intermediate"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-pink-500/10 text-pink-400 border-pink-500/20";
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>{level}</span>;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let fileContent = "";
  try {
    const filePath = path.join(process.cwd(), "content", "lessons", `${slug}.mdx`);
    fileContent = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { data: frontmatter, content } = matter(fileContent);

  return (
    <article className="animate-fade-in-up relative">
      {/* ── Ambient background glow ── */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/5 blur-[120px]" />

      {/* ── Back nav ── */}
      <div className="relative z-10 border-b border-white/[0.04]">
        <div className="mx-auto max-w-[820px] px-6 py-3">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-1.5 text-sm text-white/25 transition-colors hover:text-violet-400"
          >
            <ArrowLeft size={14} />
            All lessons
          </Link>
        </div>
      </div>

      {/* ── Article header ── */}
      <header className="relative z-10 mx-auto max-w-[820px] px-6 pt-12 pb-8">
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[3rem]">
          {frontmatter.title || "Lesson"}
        </h1>

        <div className="mt-7 flex flex-wrap items-center gap-4 text-sm">
          {frontmatter.difficulty && (
            <DifficultyBadge level={frontmatter.difficulty} />
          )}

          {frontmatter.estimatedTime && (
            <span className="flex items-center gap-1.5 text-white/25">
              <Clock size={14} />
              {frontmatter.estimatedTime}
            </span>
          )}

          {frontmatter.prereqs && (
            <span className="flex items-center gap-1.5 text-white/25">
              <GraduationCap size={14} />
              Prereqs: {frontmatter.prereqs}
            </span>
          )}
        </div>

        {/* Holographic divider */}
        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </header>

      {/* ── MDX content ── */}
      <div className="relative z-10 mx-auto max-w-[820px] px-6 pb-24">
        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-[1.625rem] prose-h2:mt-14 prose-h3:text-xl">
          <MDXRemote
            source={content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="relative z-10 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[820px] px-6 py-12 flex items-center justify-between">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 text-sm text-white/25 hover:text-violet-400 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to curriculum
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/15">
            <Zap size={12} />
            Interactive lesson
          </div>
        </div>
      </div>
    </article>
  );
}
