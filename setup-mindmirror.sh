#!/bin/bash

# Create tailwind.config.js in project root
cat > tailwind.config.js << 'TAILWINDEOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#1a1a1a',
          100: '#121212',
          200: '#0a0a0a',
          300: '#050505',
        },
        violetAccent: '#8B5CF6',
        cyanAccent: '#06B6D4',
        glassLight: 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Montserrat',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '40px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-md': '0 8px 40px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.5)',
        'glow-sm': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 40px rgba(6, 182, 212, 0.2)',
        'glow-lg': '0 0 60px rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'glass-glow': 'glassGlow 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glassGlow: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(0deg, transparent 24%, rgba(139, 92, 246, 0.05) 25%, rgba(139, 92, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(139, 92, 246, 0.05) 75%, rgba(139, 92, 246, 0.05) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.05) 25%, rgba(6, 182, 212, 0.05) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.05) 75%, rgba(6, 182, 212, 0.05) 76%, transparent 77%, transparent)`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          '@apply bg-white/5 backdrop-blur-xl border border-white/10': {},
        },
        '.glass-dark': {
          '@apply bg-charcoal-100/60 backdrop-blur-xl border border-white/10': {},
        },
        '.glass-lg': {
          '@apply bg-charcoal-100/40 backdrop-blur-2xl border border-white/10 shadow-glass-lg': {},
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
TAILWINDEOF

echo "✅ Created tailwind.config.js"

# Create components directory
mkdir -p components

# Create components/GlassCard.tsx
cat > components/GlassCard.tsx << 'GLASSCARDEOF'
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  glow = true,
  onClick,
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`} onClick={onClick}>
      {/* Background Glow Effect */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violetAccent via-cyanAccent to-violetAccent rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:animate-glass-glow"></div>
      )}

      {/* Glass Surface */}
      <div className="relative bg-charcoal-100/60 backdrop-blur-xl border border-white/10 hover:border-white/20 p-8 rounded-2xl shadow-glass hover:shadow-glass-lg transition-all duration-300">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyanAccent font-semibold mb-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
GLASSCARDEOF

echo "✅ Created components/GlassCard.tsx"

# Create components/MindMirrorDashboard.tsx
cat > components/MindMirrorDashboard.tsx << 'DASHBOARDEOF'
import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Zap, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  category: 'ngo-alert' | 'civic-ai' | 'psychometric';
  options: string[];
}

interface CivicNode {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  lastUpdate: string;
}

export default function MindMirrorDashboard() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [seedingComplete, setSeedingComplete] = useState(true);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    {
      id: 'q1',
      question: 'How does the current agricultural data impact the decision-making latency for rural NGO workers?',
      category: 'ngo-alert',
      options: ['High Impact (0-2 hours)', 'Moderate (2-6 hours)', 'Minimal (6+ hours)', 'Unknown'],
    },
    {
      id: 'q2',
      question: 'What is the primary blocker in adopting AI-driven civic engagement in your region?',
      category: 'civic-ai',
      options: ['Data availability', 'Technical infrastructure', 'Trust & adoption', 'Regulatory clarity'],
    },
    {
      id: 'q3',
      question: 'How would you rate your organizational readiness for real-time collaborative decision-making?',
      category: 'psychometric',
      options: ['Fully Ready', 'Mostly Ready', 'In Progress', 'Planning Phase'],
    },
  ]);

  const [civicNodes, setCivicNodes] = useState<CivicNode[]>([
    { id: 'node-1', name: 'Rural NGO Network', status: 'active', lastUpdate: 'now' },
    { id: 'node-2', name: 'Agricultural Data Hub', status: 'active', lastUpdate: '2m ago' },
    { id: 'node-3', name: 'Civic Governance Layer', status: 'active', lastUpdate: '5m ago' },
    { id: 'node-4', name: 'Analytics Engine', status: 'idle', lastUpdate: '12m ago' },
  ]);

  const currentQuestion = questions[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx + 1) / questions.length) * 100;

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
    setTimeout(() => {
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setSelectedAnswer(null);
      }
    }, 400);
  };

  const activeNodesCount = civicNodes.filter(n => n.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-200 via-charcoal-100 to-charcoal-100 text-white font-sans p-4 md:p-8 selection:bg-cyanAccent/30">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-grid-pattern" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(139, 92, 246, 0.05) 25%, rgba(139, 92, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(139, 92, 246, 0.05) 75%, rgba(139, 92, 246, 0.05) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.05) 25%, rgba(6, 182, 212, 0.05) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.05) 75%, rgba(6, 182, 212, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight">
              MindMirror <span className="text-violetAccent font-medium">AI</span>
            </h1>
            <p className="text-gray-500 mt-3 tracking-widest uppercase text-xs md:text-[10px] font-medium">
              Cognitive Intelligence Dashboard
            </p>
          </div>

          {/* Status Bar */}
          <div className="text-right w-full md:w-auto">
            <span className="text-xs text-gray-500 block mb-2 font-medium">Seeding Status</span>
            <div className="h-2 w-full md:w-40 bg-charcoal-50 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-violetAccent via-cyanAccent to-violetAccent transition-all duration-500 ease-out animate-pulse-subtle"
                style={{ width: seedingComplete ? '100%' : '75%' }}
              ></div>
            </div>
            <span className="text-xs text-cyanAccent mt-2 block font-medium">
              {seedingComplete ? '✓ Complete' : 'In Progress'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Primary Assessment Section */}
        <div className="mb-12">
          <GlassCard
            title="Active Assessment"
            subtitle={`Question ${currentQuestionIdx + 1} of ${questions.length}`}
            glow
            className="min-h-[420px]"
          >
            <div className="space-y-8">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyanAccent to-violetAccent transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 font-medium">{progressPercent.toFixed(0)}% Complete</p>
              </div>

              {/* Question Display */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white">
                "{currentQuestion.question}"
              </h2>

              {/* Answer Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    className={`
                      w-full text-left p-4 rounded-lg border transition-all duration-300
                      ${selectedAnswer === option
                        ? 'bg-violetAccent/30 border-violetAccent text-white'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyanAccent/50 text-gray-100'
                      }
                      cursor-pointer font-medium text-sm md:text-base
                      active:scale-95 hover:scale-105
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`
                        w-2 h-2 rounded-full transition-all
                        ${selectedAnswer === option ? 'bg-violetAccent scale-150' : 'bg-gray-600'}
                      `}></span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {/* Category Badge */}
              <div className="pt-4 flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/30 font-medium">
                  {currentQuestion.category === 'ngo-alert' && '🌾 NGO Alert'}
                  {currentQuestion.category === 'civic-ai' && '🏛️ Civic AI'}
                  {currentQuestion.category === 'psychometric' && '🧠 Psychometric'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Civic AI Data Feed Integration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Active Nodes Card */}
          <GlassCard glow>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Civic Nodes</p>
                <p className="text-3xl font-light text-cyanAccent">{activeNodesCount}</p>
                <p className="text-xs text-gray-600 mt-1">Active nodes</p>
              </div>
              <Zap className="w-5 h-5 text-cyanAccent opacity-50" />
            </div>
          </GlassCard>

          {/* Total Questions Card */}
          <GlassCard glow>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Assessment</p>
                <p className="text-3xl font-light text-violetAccent">{currentQuestionIdx + 1}</p>
                <p className="text-xs text-gray-600 mt-1">of {questions.length} questions</p>
              </div>
              <AlertCircle className="w-5 h-5 text-violetAccent opacity-50" />
            </div>
          </GlassCard>

          {/* Response Rate Card */}
          <GlassCard glow>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Completion</p>
                <p className="text-3xl font-light text-cyanAccent">{progressPercent.toFixed(0)}%</p>
                <p className="text-xs text-gray-600 mt-1">In progress</p>
              </div>
              <TrendingUp className="w-5 h-5 text-cyanAccent opacity-50" />
            </div>
          </GlassCard>

          {/* System Health Card */}
          <GlassCard glow>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">System</p>
                <p className="text-3xl font-light text-violetAccent">98%</p>
                <p className="text-xs text-gray-600 mt-1">Uptime</p>
              </div>
              <BarChart3 className="w-5 h-5 text-violetAccent opacity-50" />
            </div>
          </GlassCard>
        </div>

        {/* Civic Nodes Network */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-4 ml-2">Network Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {civicNodes.map((node) => (
              <GlassCard key={node.id} glow={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{node.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Updated {node.lastUpdate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`
                      w-2.5 h-2.5 rounded-full animate-pulse
                      ${node.status === 'active' ? 'bg-cyanAccent' : node.status === 'idle' ? 'bg-gray-600' : 'bg-red-500'}
                    `}></span>
                    <span className="text-xs font-medium text-gray-400 capitalize">{node.status}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5">
        <p className="text-xs text-gray-600 tracking-widest uppercase">
          MindMirror AI · Cognitive Intelligence Platform · Global Civic AI Initiative
        </p>
      </footer>
    </div>
  );
}
DASHBOARDEOF

echo "✅ Created components/MindMirrorDashboard.tsx"

# Create app/dashboard directory if not exists
mkdir -p app/dashboard

# Create app/dashboard/page.tsx
cat > app/dashboard/page.tsx << 'PAGEEOF'
'use client';

import MindMirrorDashboard from '@/components/MindMirrorDashboard';

export default function DashboardPage() {
  return <MindMirrorDashboard />;
}
PAGEEOF

echo "✅ Created app/dashboard/page.tsx"

# Verify all files created
echo ""
echo "📋 Verifying files..."
ls -la tailwind.config.js
ls -la components/GlassCard.tsx
ls -la components/MindMirrorDashboard.tsx
ls -la app/dashboard/page.tsx

echo ""
echo "✅ All files created successfully!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m \"feat: add MindMirror glassmorphic dashboard\""
echo "3. git push origin main"
echo ""
echo "Then wait 2-3 minutes for Render to auto-deploy"
echo "Dashboard will be live at: https://global-civic-ai-frontend.onrender.com/dashboard"
