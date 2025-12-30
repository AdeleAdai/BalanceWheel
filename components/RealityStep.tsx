
import React from 'react';
import { WheelState } from '../types';
import RadarChart from './RadarChart';
import ReflectionArea from './ReflectionArea';

interface Props {
  state: WheelState;
  updateState: (updates: Partial<WheelState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RealityStep: React.FC<Props> = ({ state, updateState, onNext, onPrev }) => {
  const handleScoreChange = (index: number, val: number) => {
    const newScores = [...state.currentScores];
    newScores[index] = val;
    updateState({ currentScores: newScores });
  };

  const prompts = [
    "你的第一感觉是什么？惊讶、难过，还是意料之中？",
    "看着刚才定义的这些词，哪一个是你很久没有好好关照过的了？",
    "在过去的一年里，哪个领域最让你感到滋养和快乐？",
    "如果它是你生活的车轮，走起来会是平稳的还是颠簸的？"
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">现状打分 (Current Reality)</h2>
        <p className="text-slate-500 leading-relaxed">
          想象圆心是0分（不满意），最外圈是10分（非常满意）。请凭直觉为当下的状态打分。
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <RadarChart 
          labels={state.dimensions} 
          datasets={[{ label: '当前现状', data: state.currentScores, color: '#3b82f6', fill: true }]} 
        />
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {state.dimensions.map((dim, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">{dim}</label>
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{state.currentScores[i]}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="1"
                value={state.currentScores[i]}
                onChange={(e) => handleScoreChange(i, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <ReflectionArea 
        prompts={prompts} 
        value={state.reflections.step1}
        onChange={(val) => updateState({ reflections: { ...state.reflections, step1: val } })}
      />

      <div className="flex gap-4 no-print">
        <button 
          onClick={onPrev}
          className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          返回修改
        </button>
        <button 
          onClick={onNext}
          className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          描绘愿景
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default RealityStep;
