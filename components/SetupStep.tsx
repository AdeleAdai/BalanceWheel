
import React from 'react';
import { WheelState } from '../types';

interface Props {
  state: WheelState;
  updateState: (updates: Partial<WheelState>) => void;
  onNext: () => void;
}

const SetupStep: React.FC<Props> = ({ state, updateState, onNext }) => {
  const canAdd = state.dimensions.length < 10;
  const canRemove = state.dimensions.length > 6;

  const handleAdd = () => {
    if (canAdd) {
      const newDims = [...state.dimensions, `新维度 ${state.dimensions.length + 1}`];
      updateState({ 
        dimensions: newDims,
        currentScores: [...state.currentScores, 5],
        visionScores: [...state.visionScores, 5]
      });
    }
  };

  const handleRemove = (index: number) => {
    if (canRemove) {
      const newDims = state.dimensions.filter((_, i) => i !== index);
      const newCurrent = state.currentScores.filter((_, i) => i !== index);
      const newVision = state.visionScores.filter((_, i) => i !== index);
      updateState({ 
        dimensions: newDims, 
        currentScores: newCurrent, 
        visionScores: newVision 
      });
    }
  };

  const handleEdit = (index: number, val: string) => {
    const newDims = [...state.dimensions];
    newDims[index] = val;
    updateState({ dimensions: newDims });
  };

  const isValid = state.dimensions.length >= 6 && state.dimensions.length <= 10;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">第一步：定义你的生活维度</h2>
        <p className="text-slate-500 leading-relaxed">
          拿一张白纸，画一个大圆圈，像切蛋糕一样切分你的人生。默认这里有8块“蛋糕”，你可以修改它们的名字，或者增减数量（6-10个），让它完全属于你。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.dimensions.map((dim, i) => (
          <div key={i} className="group flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
            <span className="text-xs font-mono text-slate-300 w-4">{i + 1}</span>
            <input 
              type="text" 
              value={dim}
              onChange={(e) => handleEdit(i, e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none font-medium"
            />
            {canRemove && (
              <button 
                onClick={() => handleRemove(i)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
              </button>
            )}
          </div>
        ))}
        {canAdd && (
          <button 
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span className="text-sm font-medium">添加维度</span>
          </button>
        )}
      </div>

      {!isValid && (
        <p className="text-center text-xs text-red-400 font-medium">
          请保持在 6 至 10 个维度之间
        </p>
      )}

      <div className="pt-6">
        <button 
          disabled={!isValid}
          onClick={onNext}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          确定，开始现状打分
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default SetupStep;
