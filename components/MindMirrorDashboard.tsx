'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
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

const BACKEND_URL = 'https://tunai-backend.onrender.com';

export default function MindMirrorDashboard() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [seedingComplete, setSeedingComplete] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Fallback questions (used if API fails)
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

  // FETCH QUESTIONS FROM BACKEND
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/questions`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Questions fetched from backend:', data);
          
          // Handle both array and object responses
          const questionsArray = Array.isArray(data) ? data : data.questions || [];
          if (questionsArray.length > 0) {
            setQuestions(questionsArray);
          }
        } else {
          console.warn('⚠️ Backend returned status:', response.status);
        }
      } catch (error) {
        console.warn('⚠️ Backend unavailable, using fallback questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // FETCH CIVIC NODES FROM BACKEND
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/nodes`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Civic nodes fetched from backend:', data);
          
          const nodesArray = Array.isArray(data) ? data : data.nodes || [];
          if (nodesArray.length > 0) {
            setCivicNodes(nodesArray);
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch nodes from backend:', error);
      }
    };

    fetchNodes();
  }, []);

  const currentQuestion = questions[currentQuestionIdx] || questions[0];
  const progressPercent = questions.length > 0 ? ((currentQuestionIdx + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = async (option: string) => {
    setSelectedAnswer(option);
    
    // SUBMIT ANSWER TO BACKEND
    try {
      const response = await fetch(`${BACKEND_URL}/api/assessment/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: option,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        console.log('✅ Answer submitted to backend successfully');
      } else {
        console.warn('⚠️ Backend submission returned:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to submit answer to backend:', error);
    }

    setTimeout(() => {
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setSelectedAnswer(null);
      }
    }, 400);
  };

  const activeNodesCount = civicNodes.filter(n => n.status === 'active').length;

  if (!currentQuestion) {
    return <div className="text-white text-center p-8">Loading dashboard...</div>;
  }

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
            {loading && <p className="text-xs text-cyanAccent mt-2">Loading data from backend...</p>}
          </div>

          {/* Status Bar */}
          <div className="text-right w-full md:w-auto">
            <span className="text-xs text-gray-500 block mb-2 font-medium">Backend Status</span>
            <div className="h-2 w-full md:w-40 bg-charcoal-50 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-violetAccent via-cyanAccent to-violetAccent transition-all duration-500 ease-out animate-pulse-subtle"
                style={{ width: seedingComplete ? '100%' : '75%' }}
              ></div>
            </div>
            <span className="text-xs text-cyanAccent mt-2 block font-medium">
              {seedingComplete ? '✓ Connected' : 'Connecting...'}
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
          MindMirror AI · Cognitive Intelligence Platform · Backend: {BACKEND_URL}
        </p>
      </footer>
    </div>
  );
}