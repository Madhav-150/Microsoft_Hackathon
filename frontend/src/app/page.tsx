'use client';

import { useState } from 'react';
import { analyzeText, analyzeImage, submitFeedback, AnalysisResponse } from '@/lib/api';
import { Shield, FileText, Image as ImageIcon, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleAnalyzeText = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeText(inputText);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeImage(e.target.files[0]);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white pb-24 pt-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 opacity-90" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">PhishShield</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Your personal AI bodyguard against online scams. Detect threats in any language.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => { setActiveTab('text'); setResult(null); }}
              className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'text' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
            >
              <FileText className="w-5 h-5" /> Analyze Text
            </button>
            <button
              onClick={() => { setActiveTab('image'); setResult(null); }}
              className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'image' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
            >
              <ImageIcon className="w-5 h-5" /> Analyze Image
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Input Area */}
            {!result && (
              <div className="transition-all duration-300">
                {activeTab === 'text' ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Paste suspicious message here</label>
                    <textarea
                      className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-base bg-slate-50"
                      placeholder="e.g. 'URGENT: Your account has been suspended...'"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    <button
                      onClick={handleAnalyzeText}
                      disabled={loading || !inputText}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Text'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-indigo-50/30 transition-colors">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-indigo-100 p-4 rounded-full">
                        <ImageIcon className="w-12 h-12 text-indigo-600" />
                      </div>
                      <div className="text-slate-600">
                        <p className="font-medium">Click to upload a screenshot</p>
                        <p className="text-sm opacity-70">Supports JPG, PNG</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Area */}
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-xl border-l-8 shadow-sm ${result.riskLevel === 'Dangerous' ? 'bg-red-50 border-red-500' :
                    result.riskLevel === 'Suspicious' ? 'bg-amber-50 border-amber-500' :
                      'bg-green-50 border-green-500'
                  }`}>
                  <div className="flex items-start gap-4">
                    {result.riskLevel === 'Dangerous' && <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />}
                    {result.riskLevel === 'Suspicious' && <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />}
                    {result.riskLevel === 'Safe' && <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />}

                    <div>
                      <h2 className={`text-2xl font-bold ${result.riskLevel === 'Dangerous' ? 'text-red-700' :
                          result.riskLevel === 'Suspicious' ? 'text-amber-700' :
                            'text-green-700'
                        }`}>
                        {result.riskLevel} Case detected
                      </h2>
                      <p className="text-slate-600 mt-1 font-medium">Risk Score: {result.riskScore}/100</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" /> AI Explanation
                  </h3>
                  <p className="text-xl text-slate-800 leading-relaxed font-medium">
                    {result.explanation}
                  </p>
                  {result.detectedLanguage && result.detectedLanguage !== 'en' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-400">
                      Translated from: <span className="font-semibold text-slate-600 uppercase">{result.detectedLanguage}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    Analyze Another
                  </button>
                  <button
                    onClick={() => submitFeedback("demo-id", true)}
                    className="px-6 py-3 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Was this helpful?
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Analyzing content...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
