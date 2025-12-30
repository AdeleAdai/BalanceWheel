
import React from 'react';
import { WheelState } from '../types';
import RadarChart from './RadarChart';

interface Props {
  state: WheelState;
  onPrev: () => void;
}

const SummaryStep: React.FC<Props> = ({ state, onPrev }) => {
  const handlePrint = () => {
    window.print();
  };

  const datasets = [
    { label: '现状 (Current)', data: state.currentScores, color: '#3b82f6', fill: true },
    { label: '愿景 (Vision)', data: state.visionScores, color: '#f97316', fill: false, borderDash: [5, 5] },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase mb-2">My Balance Sheet</div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">生活平衡轮报告</h2>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed italic">
          “平衡不是静止的，而是动态的调整。当你开始觉察，你就拿回了主动权。”
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 print-break-inside-avoid">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full">
             <RadarChart labels={state.dimensions} datasets={datasets} />
          </div>
          
          <div className="flex-1 space-y-8 w-full">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">CORE LEVERAGE POINT</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">🎯</div>
                <p className="text-2xl font-black text-slate-900">{state.leveragePoint}</p>
              </div>
            </div>

            <div className="space-y-4">
               <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">COMMITMENT PLAN</p>
               <div className="bg-slate-50 rounded-2xl p-6 border-l-4 border-green-500">
                  <p className="text-sm font-bold text-slate-400 mb-1">我的行动承诺：</p>
                  <p className="text-lg font-bold text-slate-800 leading-tight mb-4">{state.microAction.what}</p>
                  <p className="text-sm font-bold text-slate-400 mb-1">执行时间/地点：</p>
                  <p className="text-slate-600">{state.microAction.when}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">REALITY REFLECTION</h4>
            <p className="text-sm text-slate-600 leading-relaxed italic truncate-multiline line-clamp-4">“{state.reflections.step1 || '无记录'}”</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">VISION REFLECTION</h4>
            <p className="text-sm text-slate-600 leading-relaxed italic truncate-multiline line-clamp-4">“{state.reflections.step2 || '无记录'}”</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">GAP REFLECTION</h4>
            <p className="text-sm text-slate-600 leading-relaxed italic truncate-multiline line-clamp-4">“{state.reflections.step3 || '无记录'}”</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 no-print">
        <button 
          onClick={handlePrint}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-200 hover:scale-105 transition-all active:scale-95 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          保存 PDF / 打印我的报告
        </button>
        
        <button onClick={onPrev} className="text-slate-400 text-sm hover:text-slate-600 transition-colors underline underline-offset-4">
          返回微调行动方案
        </button>
      </div>

      <div className="text-center pt-10 text-slate-300 no-print">
         <p className="text-xs italic">由 阿呆数字化教练 提供觉察引导 · {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default SummaryStep;
