
import React, { useState, useCallback } from 'react';
import { WheelState, DEFAULT_DIMENSIONS } from './types';
import SetupStep from './components/SetupStep';
import RealityStep from './components/RealityStep';
import VisionStep from './components/VisionStep';
import LeverageStep from './components/LeverageStep';
import MicroActionStep from './components/MicroActionStep';
import SummaryStep from './components/SummaryStep';

const App: React.FC = () => {
  const [state, setState] = useState<WheelState>({
    step: 0,
    dimensions: [...DEFAULT_DIMENSIONS],
    currentScores: new Array(DEFAULT_DIMENSIONS.length).fill(5),
    visionScores: new Array(DEFAULT_DIMENSIONS.length).fill(5),
    reflections: {
      step1: '',
      step2: '',
      step3: '',
    },
    leveragePoint: '',
    microAction: {
      what: '',
      when: '',
      check1: false,
      check2: false,
    },
  });

  const nextStep = useCallback(() => {
    setState(prev => {
      const next = prev.step + 1;
      // UX Logic: When moving to Vision Step, sync default vision scores if they haven't been touched
      if (next === 2) {
        return { ...prev, step: next, visionScores: [...prev.currentScores] };
      }
      return { ...prev, step: next };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateState = useCallback((updates: Partial<WheelState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <SetupStep state={state} updateState={updateState} onNext={nextStep} />;
      case 1:
        return <RealityStep state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <VisionStep state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <LeverageStep state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <MicroActionStep state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <SummaryStep state={state} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  const progressPercentage = (state.step / 5) * 100;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 selection:bg-orange-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 no-print">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">阿</div>
            <h1 className="text-lg font-semibold tracking-tight">阿呆的生命平衡轮</h1>
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Step {state.step + 1} / 6
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-orange-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pt-10">
        <div className="transition-all duration-300 ease-in-out opacity-100 translate-y-0">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default App;
