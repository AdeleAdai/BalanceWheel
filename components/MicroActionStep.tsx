
import React from 'react';
import { WheelState } from '../types';

interface Props {
  state: WheelState;
  updateState: (updates: Partial<WheelState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const MicroActionStep: React.FC<Props> = ({ state, updateState, onNext, onPrev }) => {
  const handleActionChange = (field: string, val: any) => {
    updateState({ microAction: { ...state.microAction, [field]: val } });
  };

  const isComplete = state.microAction.what && state.microAction.when && state.microAction.check1 && state.microAction.check2;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">微行动设计 (Micro Action)</h2>
        <p className="text-slate-500 leading-relaxed">
          把宏大的愿望拆解为“本周内完成”且“小到不可能失败”的微行动。
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">💡 阿呆的举例</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">健康维度：</p>
              <p className="text-sm text-red-400 line-through mb-1">❌ 瘦20斤</p>
              <p className="text-sm text-green-600 font-bold">✅ 饭后散步10分钟</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-400 mb-1">成长维度：</p>
              <p className="text-sm text-red-400 line-through mb-1">❌ 读50本书</p>
              <p className="text-sm text-green-600 font-bold">✅ 睡前翻开书读1页</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">🎯 在 <span className="text-blue-500">“{state.leveragePoint}”</span> 领域，我的微行动是：</label>
            <input 
              type="text" 
              placeholder="具体做什么？"
              value={state.microAction.what}
              onChange={(e) => handleActionChange('what', e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">⏰ 执行时间与地点：</label>
            <input 
              type="text" 
              placeholder="具体的触点... (如：每天下班后在公园)"
              value={state.microAction.when}
              onChange={(e) => handleActionChange('when', e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
          </div>

          <div className="space-y-3 pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-1 relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={state.microAction.check1}
                  onChange={(e) => handleActionChange('check1', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-300 text-blue-500 focus:ring-blue-400"
                />
              </div>
              <span className="text-sm text-slate-600 leading-tight group-hover:text-slate-900 transition-colors">这个行动小到不需要意志力就能完成。</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-1 relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={state.microAction.check2}
                  onChange={(e) => handleActionChange('check2', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-slate-300 text-blue-500 focus:ring-blue-400"
                />
              </div>
              <span className="text-sm text-slate-600 leading-tight group-hover:text-slate-900 transition-colors">我已将其写入日程表或设为闹钟。</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 no-print">
        <button onClick={onPrev} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">返回修改领域</button>
        <button 
          disabled={!isComplete}
          onClick={onNext}
          className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2"
        >
          生成总结报告
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default MicroActionStep;
