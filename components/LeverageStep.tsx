
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

const LeverageStep: React.FC<Props> = ({ state, updateState, onNext, onPrev }) => {
  const prompts = [
    "看到这个打分对比，你有什么发现？哪些领域差距最大？",
    "如果只选择一个领域在明年优先改善，你会选哪个？为什么？",
    "想象一下，如果这个领域的得分从现状提高到了愿景分，它会对你生活的其他领域（比如事业、家庭）产生什么积极影响？"
  ];

  const datasets = [
    { label: '现状 (Current)', data: state.currentScores, color: '#3b82f6', fill: true },
    { label: '愿景 (Vision)', data: state.visionScores, color: '#f97316', fill: false, borderDash: [5, 5] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">寻找杠杆点 (Gap & Leverage)</h2>
        <p className="text-slate-500 leading-relaxed">
          不要试图同时提升所有低分项。我们需要找到那个能撬动全局的‘杠杆点’。
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <RadarChart 
          labels={state.dimensions} 
          datasets={datasets} 
        />
        
        <div className="mt-8 border-t border-slate-100 pt-8">
          <h3 className="text-lg font-bold text-slate-800 text-center mb-6">🎯 请选择 1 个你最想在接下来改善的领域：</h3>
          <div className="grid grid-cols-2 gap-3">
            {state.dimensions.map((dim, i) => (
              <label 
                key={i} 
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${state.leveragePoint === dim ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <input 
                  type="radio" 
                  name="leverage" 
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  checked={state.leveragePoint === dim}
                  onChange={() => updateState({ leveragePoint: dim })}
                />
                <span className={`text-sm font-bold ${state.leveragePoint === dim ? 'text-blue-700' : 'text-slate-600'}`}>{dim}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <ReflectionArea 
        prompts={prompts} 
        value={state.reflections.step3}
        onChange={(val) => updateState({ reflections: { ...state.reflections, step3: val } })}
      />

      <div className="flex gap-4 no-print">
        <button onClick={onPrev} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">返回修改愿景</button>
        <button 
          disabled={!state.leveragePoint}
          onClick={onNext}
          className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2"
        >
          制定微行动
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default LeverageStep;
