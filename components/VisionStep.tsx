
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

const VisionStep: React.FC<Props> = ({ state, updateState, onNext, onPrev }) => {
  const handleScoreChange = (index: number, val: number) => {
    const newScores = [...state.visionScores];
    newScores[index] = val;
    updateState({ visionScores: newScores });
  };

  const prompts = [
    "假设时间到了，一切如愿，请描述一下那天从早到晚，你度过了怎样完美的一天？",
    "在那个理想状态里，你成为了一个怎样的人？你身上多了哪些现在没有的品质？",
    "为什么达到这个状态对你如此重要？它满足了你内心深处的什么渴望？"
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">愿景描绘 (Future Vision)</h2>
        <p className="text-slate-500 leading-relaxed">
          现在，让我们把目光投向未来。为了达到你想要的状态，你希望各个维度是多少分？
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-orange-100 border border-orange-50 overflow-hidden">
        <RadarChart 
          labels={state.dimensions} 
          datasets={[{ label: '未来愿景', data: state.visionScores, color: '#f97316', fill: true }]} 
        />
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {state.dimensions.map((dim, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">{dim}</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">当前 {state.currentScores[i]} →</span>
                  <span className="text-xs font-mono font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{state.visionScores[i]}</span>
                </div>
              </div>
              <input 
                type="range" min="0" max="10" step="1"
                value={state.visionScores[i]}
                onChange={(e) => handleScoreChange(i, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          ))}
        </div>
      </div>

      <ReflectionArea 
        prompts={prompts} 
        value={state.reflections.step2}
        onChange={(val) => updateState({ reflections: { ...state.reflections, step2: val } })}
      />

      <div className="flex gap-4 no-print">
        <button 
          onClick={onPrev}
          className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          返回现状
        </button>
        <button 
          onClick={onNext}
          className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          对比寻找杠杆点
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default VisionStep;
