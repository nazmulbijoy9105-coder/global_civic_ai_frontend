'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { startAssessment, getSessionQuestions, submitAnswer, completeSession } from '../../lib/api';

const SCORE_MAP = { Always: 4, Sometimes: 3, Rarely: 2, Never: 1 };

export default function AssessmentPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [authLoading, isAuthenticated]);

  const handleStart = async () => {
    setStarting(true);
    setError(null);
    try {
      const s = await startAssessment(20);
      if (s.id) {
        setSession(s);
        const qs = await getSessionQuestions(s.id);
        if (Array.isArray(qs)) {
          setQuestions(qs);
          setCurrentIndex(s.current_index || 0);
        }
      }
    } catch (e) {
      setError('❌ Failed to start assessment. Please try again.');
      console.error(e);
    }
    setStarting(false);
  };

  const handleAnswer = async (answer) => {
    if (loading) return;
    setSelectedAnswer(answer);
    setLoading(true);
    setError(null);

    const score = SCORE_MAP[answer] || 2;
    const q = questions[currentIndex];

    try {
      await submitAnswer(session.id, q.id, answer, score);
      if (currentIndex + 1 >= questions.length) {
        const result = await completeSession(session.id);
        setCompleted(true);
        setReport(result);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      }
    } catch (e) {
      setError('❌ Failed to submit answer. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assessment...</p>
          </div>
        </div>
      </>
    );
  }

  if (completed && report) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete!</h1>
              <p className="text-gray-600 mb-8">You answered {questions.length} questions.</p>
              
              <div className="space-y-3">
                
                  href={`/report/${session.id}`}
                  className="block w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition duration-200"
                >
                  View Full Report
                </a>
                
                  href="/dashboard"
                  className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-6xl text-center mb-6">📝</div>
              
              <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
                Civic Awareness Assessment
              </h1>
              
              <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
                Answer 20 questions about civic rights, financial literacy, and social awareness. Our AI engine will analyze your responses and generate a personalized report tailored to your profile.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-teal-600 mb-1">20</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">10-15</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">🤖</div>
                  <div className="text-sm text-gray-600">AI Analysis</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">📄</div>
                  <div className="text-sm text-gray-600">PDF Report</div>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={starting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition duration-200 ${
                  starting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 active:scale-95'
                }`}
              >
                {starting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Starting...
                  </span>
                ) : (
                  'Start Assessment'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-6">
                Your responses are confidential and used only to generate your personalized report.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const options = q?.options ? q.options.split(',').map(opt => opt.trim()) : ['Always', 'Sometimes', 'Rarely', 'Never'];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-teal-600">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full uppercase tracking-wide">
                {q?.category || 'General'}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-tight">
              {q?.text_en || 'Loading...'}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={loading}
                  className={`w-full p-4 text-left rounded-lg border-2 transition duration-200 font-medium ${
                    selectedAnswer === opt
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-teal-300 hover:bg-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between text-xs text-gray-500">
              <span>Session: {session?.id?.slice(0, 8)}...</span>
              <span>{currentIndex + 1} of {questions.length} answered</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
