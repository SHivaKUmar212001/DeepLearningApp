"use client";

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

interface Lesson {
  id: number;
  title: string;
  isAvailable: boolean;
  slug?: string;
}

interface Module {
  id: number;
  title: string;
  color: string;
  lessons: Lesson[];
}

const curriculum: Module[] = [
  {
    id: 1, title: "Module 1: Foundations", color: "#6366f1",
    lessons: [
      { id: 1, title: "Scalars, Vectors, & Tensors", isAvailable: true, slug: "01-scalars-vectors-tensors" },
      { id: 2, title: "Matrices & Transformations", isAvailable: true, slug: "02-matrices-and-transformations" },
      { id: 3, title: "Dot Products & Projections", isAvailable: true, slug: "03-dot-products" },
      { id: 4, title: "Calculus & Derivatives", isAvailable: true, slug: "04-calculus-derivatives" },
      { id: 5, title: "The Chain Rule", isAvailable: true, slug: "05-chain-rule" },
      { id: 6, title: "What is a Neural Network?", isAvailable: true, slug: "06-what-is-a-neural-network" },
      { id: 7, title: "The Perceptron", isAvailable: true, slug: "07-the-perceptron" },
      { id: 8, title: "Activation Functions", isAvailable: true, slug: "08-activation-functions" },
      { id: 9, title: "Forward Propagation", isAvailable: true, slug: "09-forward-propagation" },
      { id: 10, title: "Loss Functions", isAvailable: true, slug: "10-loss-functions" },
      { id: 11, title: "Backpropagation", isAvailable: true, slug: "11-backpropagation" },
      { id: 12, title: "Gradient Descent", isAvailable: true, slug: "12-gradient-descent" },
      { id: 13, title: "Optimizers", isAvailable: true, slug: "13-optimizers" },
      { id: 14, title: "Learning Rates", isAvailable: true, slug: "14-learning-rates" },
      { id: 15, title: "Regularization", isAvailable: true, slug: "15-regularization" },
      { id: 16, title: "Dropout & BatchNorm", isAvailable: true, slug: "16-dropout-batchnorm" },
      { id: 17, title: "Training your first MLP", isAvailable: true, slug: "17-training-mlp" },
    ]
  },
  {
    id: 2, title: "Module 2: Computer Vision", color: "#06b6d4",
    lessons: [
      { id: 18, title: "Images as Tensors", isAvailable: true, slug: "18-images-as-tensors" },
      { id: 19, title: "Kernels & Filters", isAvailable: true, slug: "19-kernels-filters" },
      { id: 20, title: "The Convolution Operation", isAvailable: true, slug: "20-convolution-operation" },
      { id: 21, title: "Padding & Stride", isAvailable: true, slug: "21-padding-stride" },
      { id: 22, title: "Pooling Layers", isAvailable: true, slug: "22-pooling-layers" },
      { id: 23, title: "CNN Architectures", isAvailable: true, slug: "23-cnn-architectures" },
      { id: 24, title: "Object Detection", isAvailable: true, slug: "24-object-detection" },
      { id: 25, title: "Semantic Segmentation", isAvailable: true, slug: "25-semantic-segmentation" },
      { id: 26, title: "Transfer Learning", isAvailable: true, slug: "26-transfer-learning" },
      { id: 27, title: "Adversarial Examples", isAvailable: true, slug: "27-adversarial-examples" },
    ]
  },
  {
    id: 3, title: "Module 3: Sequence Models & NLP", color: "#f59e0b",
    lessons: [
      { id: 28, title: "Text as Data: Tokenization", isAvailable: true, slug: "28-tokenization" },
      { id: 29, title: "Word Embeddings", isAvailable: true, slug: "29-word-embeddings" },
      { id: 30, title: "RNNs", isAvailable: true, slug: "30-rnns" },
      { id: 31, title: "Vanishing Gradients in Time", isAvailable: true, slug: "31-vanishing-gradients-time" },
      { id: 32, title: "LSTMs & GRUs", isAvailable: true, slug: "32-lstms-grus" },
      { id: 33, title: "Seq2Seq Models", isAvailable: true, slug: "33-seq2seq" },
      { id: 34, title: "Attention Mechanism", isAvailable: true, slug: "34-attention-mechanism" },
      { id: 35, title: "Self-Attention", isAvailable: true, slug: "35-self-attention" },
      { id: 36, title: "Positional Encoding", isAvailable: true, slug: "36-positional-encoding" },
      { id: 37, title: "Transformer Architecture", isAvailable: true, slug: "37-transformer-architecture" },
      { id: 38, title: "GPT & Decoders", isAvailable: true, slug: "38-gpt" },
      { id: 39, title: "BERT & Encoders", isAvailable: true, slug: "39-bert" },
      { id: 40, title: "Fine-tuning (LoRA)", isAvailable: true, slug: "40-lora" },
    ]
  },
  {
    id: 4, title: "Module 4: Generative AI", color: "#10b981",
    lessons: [
      { id: 41, title: "Autoencoders", isAvailable: true, slug: "41-autoencoders" },
      { id: 42, title: "VAEs", isAvailable: true, slug: "42-vaes" },
      { id: 43, title: "GANs", isAvailable: true, slug: "43-gans" },
      { id: 44, title: "Diffusion: Forward", isAvailable: true, slug: "44-forward-diffusion" },
      { id: 45, title: "Diffusion: Reverse", isAvailable: true, slug: "45-reverse-diffusion" },
      { id: 46, title: "U-Net Architectures", isAvailable: true, slug: "46-unet" },
      { id: 47, title: "Classifier-Free Guidance", isAvailable: true, slug: "47-cfg" },
      { id: 48, title: "Latent Diffusion", isAvailable: true, slug: "48-latent-diffusion" },
    ]
  },
  {
    id: 5, title: "Module 5: Advanced Topics", color: "#f43f5e",
    lessons: [
      { id: 49, title: "RL Basics", isAvailable: true, slug: "49-rl-basics" },
      { id: 50, title: "Q-Learning & DQNs", isAvailable: true, slug: "50-q-learning" },
      { id: 51, title: "Policy Gradients", isAvailable: true, slug: "51-policy-gradients" },
      { id: 52, title: "Actor-Critic Models", isAvailable: true, slug: "52-actor-critic" },
      { id: 53, title: "Graph Neural Networks", isAvailable: true, slug: "53-gnns" },
      { id: 54, title: "The Future of Deep Learning", isAvailable: true, slug: "54-future-of-dl" },
    ]
  }
];

const ROOT_NODE = { width: 188, height: 92 };
const MODULE_NODE = { width: 168, height: 168 };
const LESSON_NODE = { width: 176, height: 64 };

function MindmapCanvas() {
  const router = useRouter();
  const { fitView } = useReactFlow();
  
  const [activeModuleId, setActiveModuleId] = useState<number | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const saved = window.sessionStorage.getItem("activeMindmapModule");
    return saved ? parseInt(saved, 10) : null;
  });
  const prefersReducedMotion = useReducedMotion();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    if (activeModuleId === null) {
      // CLOVER VIEW (Top Level)
      newNodes.push({
        id: "root",
        position: { x: -ROOT_NODE.width / 2, y: -ROOT_NODE.height / 2 },
        data: { label: "Deep Learning" },
        style: { 
          background: "#4c0519", color: "white", fontWeight: "bold", fontSize: "20px",
          borderRadius: "28px", width: ROOT_NODE.width, height: ROOT_NODE.height,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 18px 40px -18px rgba(76, 5, 25, 0.72)"
        }
      });

      const numModules = curriculum.length;
      const moduleRadius = 285;

      curriculum.forEach((mod, modIdx) => {
        const modId = `mod-${mod.id}`;
        const modAngle = (modIdx / numModules) * 2 * Math.PI - (Math.PI / 2);
        const modX = Math.cos(modAngle) * moduleRadius - MODULE_NODE.width / 2;
        const modY = Math.sin(modAngle) * moduleRadius - MODULE_NODE.height / 2;
        
        newNodes.push({
          id: modId,
          position: { x: modX, y: modY },
          data: { label: mod.title, moduleId: mod.id },
          style: { 
            background: "white", color: mod.color, fontWeight: "bold", fontSize: "18px",
            border: `3px solid ${mod.color}`, borderRadius: "50%",
            width: MODULE_NODE.width, height: MODULE_NODE.height, display: "flex", alignItems: "center", justifyContent: "center",
            textAlign: "center", cursor: "pointer",
            padding: "18px",
            boxShadow: `0 18px 38px -24px ${mod.color}`
          }
        });

        newEdges.push({
          id: `e-root-${modId}`,
          source: "root",
          target: modId,
          type: "default",
          animated: !prefersReducedMotion,
          style: { stroke: mod.color, strokeWidth: 2.5, opacity: 0.55 }
        });
      });

    } else {
      // MODULE DRILL-DOWN VIEW
      const mod = curriculum.find(m => m.id === activeModuleId);
      if (!mod) return;

      const modId = `mod-${mod.id}`;

      // Root module at center
      newNodes.push({
        id: modId,
        position: { x: -MODULE_NODE.width / 2, y: -MODULE_NODE.height / 2 },
        data: { label: mod.title },
        style: { 
          background: mod.color, color: "white", fontWeight: "bold", fontSize: "21px",
          border: `4px solid white`, borderRadius: "50%",
          width: MODULE_NODE.width, height: MODULE_NODE.height, display: "flex", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "18px", boxShadow: `0 18px 38px -18px ${mod.color}99`
        }
      });

      // Lessons radiate out in a 360 circle
      const numLessons = mod.lessons.length;
      const lessonRadius = 360;
      const angleStep = (2 * Math.PI) / numLessons;

      mod.lessons.forEach((lesson, lIdx) => {
        const lessonId = `lesson-${lesson.id}`;
        const lessonAngle = (lIdx * angleStep) - (Math.PI / 2);
        
        // Minor jitter
        const radiusJitter = Math.sin(lIdx * 123.456) * 40;
        
        const lessonX = Math.cos(lessonAngle) * (lessonRadius + radiusJitter) - LESSON_NODE.width / 2;
        const lessonY = Math.sin(lessonAngle) * (lessonRadius + radiusJitter) - LESSON_NODE.height / 2;
        
        newNodes.push({
          id: lessonId,
          position: { x: lessonX, y: lessonY },
          data: { 
            label: `${lIdx + 1}. ${lesson.title}`, // Local numbering starting from 1
            slug: lesson.slug
          },
          style: { 
            background: "white", color: "#4c0519", border: `2px solid ${mod.color}`,
            borderRadius: "14px", fontSize: "13px", fontWeight: "650",
            cursor: "pointer", width: LESSON_NODE.width, minHeight: LESSON_NODE.height, padding: "12px", textAlign: "center",
            boxShadow: "0 12px 30px -24px rgba(76, 5, 25, 0.65)"
          }
        });

        newEdges.push({
          id: `e-${modId}-${lessonId}`,
          source: modId,
          target: lessonId,
          type: "default",
          style: { stroke: mod.color, strokeWidth: 1.8, opacity: 0.55 }
        });
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);

    // Give react flow a tick to process nodes before fitting view
    setTimeout(() => {
      fitView({ padding: activeModuleId === null ? 0.3 : 0.22, duration: prefersReducedMotion ? 0 : 650 });
    }, 120);

  }, [activeModuleId, setNodes, setEdges, fitView, prefersReducedMotion]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (activeModuleId === null && node.data.moduleId) {
      // Zoom into module
      const mId = node.data.moduleId as number;
      setActiveModuleId(mId);
      sessionStorage.setItem('activeMindmapModule', mId.toString());
    } else if (node.data.slug) {
      // Navigate to lesson
      router.push(`/lessons/${node.data.slug}`);
    }
  }, [activeModuleId, router]);

  return (
    <>
      <ReactFlow
        className="deepdive-flow"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={1.7}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#fbcfe8" />
        <Controls />
        <MiniMap nodeStrokeColor="#fbcfe8" nodeColor="#fff0f5" maskColor="rgba(255, 240, 245, 0.7)" />
      </ReactFlow>

      {/* Navigation Overlay */}
      {activeModuleId !== null && (
        <button 
          onClick={() => {
            setActiveModuleId(null);
            sessionStorage.removeItem('activeMindmapModule');
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#0d0d20] text-white/90 rounded-full shadow-lg border border-white/[0.08] font-bold hover:bg-[#111128] transition-colors flex items-center gap-2 z-50"
        >
          <ArrowLeft size={18} />
          Back to Modules
        </button>
      )}
    </>
  );
}

export function CurriculumMindmap() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlowProvider>
        <MindmapCanvas />
      </ReactFlowProvider>
    </div>
  );
}
