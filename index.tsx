
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, RadarController, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend } from 'chart.js';

// --- 类型定义 ---
interface WheelState {
  step: number;
  dimensions: string[];
  currentScores: number[];
  visionScores: number[];
  reflections: {
    step1: string;
    step2: string;
    step3: string;
  };
  leveragePoint: string;
  microAction: {
    what: string;
    when: string;
    check1: boolean;
    check2: boolean;
  };
}

const DEFAULT_DIMENSIONS = [
  '事业发展', '家庭亲密', '身体健康', '财务状况', 
  '人际关系', '个人成长', '娱乐休闲', '心灵/精神'
];

// --- 基础组件 ---

const RadarChart: React.FC<{
  labels: string[];
  datasets: { label: string; data: number[]; color: string; fill?: boolean; borderDash?: number[] }[];
}> = ({ labels, datasets }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    Chart.register(RadarController, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.fill ? `${ds.color}44` : 'transparent',
          pointBackgroundColor: ds.color,
          borderWidth: 2,
          borderDash: ds.borderDash,
          fill: ds.fill ?? false,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, max: 10,
            ticks: { stepSize: 2, display: false },
            grid: { color: '#e2e8f0' },
            angleLines: { color: '#e2e8f0' },
            pointLabels: { font: { size: 13 }, color: '#64748b' }
          }
        },
        plugins: { legend: { display: datasets.length > 1, position: 'bottom' } }
      }
    });
    return () => chartInstance.current?.destroy();
  }, [labels, datasets]);

  return <div className="w-full aspect-square max-w-[400px] mx-auto py-6"><canvas ref={chartRef}></canvas></div>;
};

const ReflectionArea: React.FC<{ prompts: string[]; value: string; onChange: (v: string) => void }> = ({ prompts, value, onChange }) => (
  <div className="mt-8 space-y-4">
    <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200">
      <p className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-1.5"><span className="text-lg">👉</span> 深度觉察提问：</p>
      <ul className="space-y-2 text-slate-600 text-sm">{prompts.map((p, i) => <li key={i} className="pl-4 border-l-2 border-slate-300">{p}</li>)}</ul>
    </div>
    <div className="relative"><textarea value={value} onChange={e => onChange(e.target.value)} placeholder="跟随你的直觉记录..." className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-50 outline-none text-slate-700 leading-relaxed shadow-sm" /></div>
  </div>
);

// --- 步骤子组件 ---

const SetupStep = ({ state, updateState, onNext }) => {
  const canAdd = state.dimensions.length < 10;
  const canRemove = state.dimensions.length > 6;
  
  const handleEdit = (i, val) => {
    const d = [...state.dimensions]; d[i] = val; updateState({ dimensions: d });
  };
  
  const handleRemove = (i) => {
    const d = state.dimensions.filter((_, idx) => idx !== i);
    const cs = state.currentScores.filter((_, idx) => idx !== i);
    const vs = state.visionScores.filter((_, idx) => idx !== i);
    updateState({ dimensions: d, currentScores: cs, visionScores: vs });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">第一步：定义你的生活维度</h2>
        <p className="text-slate-500 max-w-md mx-auto">你可以修改名字，或者增减数量（6-10个）。</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.dimensions.map((dim, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-all focus-within:border-blue-400">
            <span className="text-xs font-mono text-slate-300 w-4">{i + 1}</span>
            <input type="text" value={dim} onChange={e => handleEdit(i, e.target.value)} className="flex-1 text-sm outline-none font-medium bg-transparent" />
            {canRemove && (
              <button onClick={() => handleRemove(i)} className="text-slate-300 hover:text-red-400 px-2">×</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={onNext} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">确定，开始现状打分</button>
    </div>
  );
};

// --- 主应用组件 ---

const App: React.FC = () => {
  const [state, setState] = useState<WheelState>({
    step: 0,
    dimensions: [...DEFAULT_DIMENSIONS],
    currentScores: new Array(DEFAULT_DIMENSIONS.length).fill(5),
    visionScores: new Array(DEFAULT_DIMENSIONS.length).fill(5),
    reflections: { step1: '', step2: '', step3: '' },
    leveragePoint: '',
    microAction: { what: '', when: '', check1: false, check2: false },
  });

  const updateState = (updates: Partial<WheelState>) => setState(prev => ({ ...prev, ...updates }));
  const nextStep = () => {
    if (state.step === 1) updateState({ step: 2, visionScores: [...state.currentScores] });
    else updateState({ step: state.step + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => updateState({ step: Math.max(0, state.step - 1) });

  const progressPercentage = ((state.step + 1) / 6) * 100;

  const renderContent = () => {
    switch(state.step) {
      case 0: return <SetupStep state={state} updateState={updateState} onNext={nextStep} />;
      case 1: 
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-center text-slate-900">现状打分 (Current Reality)</h2>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              <RadarChart labels={state.dimensions} datasets={[{ label: '现状', data: state.currentScores, color: '#3b82f6', fill: true }]} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {state.dimensions.map((dim, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm"><span>{dim}</span><span className="font-bold text-blue-500">{state.currentScores[i]}</span></div>
                    <input type="range" min="0" max="10" value={state.currentScores[i]} onChange={e => {
                      const s = [...state.currentScores]; s[i] = parseInt(e.target.value); updateState({ currentScores: s });
                    }} className="w-full accent-blue-500" />
                  </div>
                ))}
              </div>
            </div>
            <ReflectionArea prompts={["你的第一感觉是什么？", "哪一个领域很久没关照了？"]} value={state.reflections.step1} onChange={v => updateState({ reflections: { ...state.reflections, step1: v } })} />
            <button onClick={nextStep} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700">描绘愿景</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-center text-slate-900">愿景描绘 (Future Vision)</h2>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-50">
              <RadarChart labels={state.dimensions} datasets={[{ label: '愿景', data: state.visionScores, color: '#f97316', fill: true }]} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {state.dimensions.map((dim, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm"><span>{dim}</span><span className="font-bold text-orange-500">{state.visionScores[i]}</span></div>
                    <input type="range" min="0" max="10" value={state.visionScores[i]} onChange={e => {
                      const s = [...state.visionScores]; s[i] = parseInt(e.target.value); updateState({ visionScores: s });
                    }} className="w-full accent-orange-500" />
                  </div>
                ))}
              </div>
            </div>
            <ReflectionArea prompts={["假设时间到了，一切如愿，生活是怎样的？"]} value={state.reflections.step2} onChange={v => updateState({ reflections: { ...state.reflections, step2: v } })} />
            <div className="flex gap-4"><button onClick={prevStep} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl">返回</button><button onClick={nextStep} className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-bold">分析差距</button></div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <h2 className="text-3xl font-bold text-center text-slate-900">寻找杠杆点</h2>
             <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
               <RadarChart labels={state.dimensions} datasets={[
                 { label: '现状', data: state.currentScores, color: '#3b82f6', fill: true },
                 { label: '愿景', data: state.visionScores, color: '#f97316', fill: false, borderDash: [5, 5] }
               ]} />
               <div className="mt-8 border-t pt-6">
                 <p className="text-center font-bold mb-4">请选择一个核心改善领域：</p>
                 <div className="grid grid-cols-2 gap-3">
                   {state.dimensions.map((dim, i) => (
                     <button key={i} onClick={() => updateState({ leveragePoint: dim })} className={`p-4 rounded-xl border-2 transition-all font-bold ${state.leveragePoint === dim ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-50 text-slate-600'}`}>{dim}</button>
                   ))}
                 </div>
               </div>
             </div>
             <ReflectionArea prompts={["提升这个领域会对生活产生什么蝴蝶效应？"]} value={state.reflections.step3} onChange={v => updateState({ reflections: { ...state.reflections, step3: v } })} />
             <div className="flex gap-4"><button onClick={prevStep} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl">返回</button><button onClick={nextStep} disabled={!state.leveragePoint} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-30">设定微行动</button></div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-center text-slate-900">微行动设计</h2>
            <div className="bg-white p-8 rounded-3xl shadow-xl space-y-8 border">
              <div><label className="block text-sm font-bold mb-2">针对 {state.leveragePoint}，我的行动是：</label><input type="text" value={state.microAction.what} onChange={e => updateState({ microAction: { ...state.microAction, what: e.target.value } })} className="w-full p-4 border-2 rounded-xl focus:border-blue-400 outline-none" placeholder="例如：饭后散步10分钟" /></div>
              <div><label className="block text-sm font-bold mb-2 text-slate-800">执行时间与地点：</label><input type="text" value={state.microAction.when} onChange={e => updateState({ microAction: { ...state.microAction, when: e.target.value } })} className="w-full p-4 border-2 rounded-xl focus:border-blue-400 outline-none" placeholder="例如：每天 19:00" /></div>
              <div className="p-4 bg-blue-50/50 rounded-xl space-y-3">
                <label className="flex gap-2 items-center cursor-pointer"><input type="checkbox" checked={state.microAction.check1} onChange={e => updateState({ microAction: { ...state.microAction, check1: e.target.checked } })} className="w-5 h-5" /><span>行动足够小，不需要意志力</span></label>
                <label className="flex gap-2 items-center cursor-pointer"><input type="checkbox" checked={state.microAction.check2} onChange={e => updateState({ microAction: { ...state.microAction, check2: e.target.checked } })} className="w-5 h-5" /><span>我已为此设定了外部提醒</span></label>
              </div>
            </div>
            <div className="flex gap-4"><button onClick={prevStep} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl">返回</button><button onClick={nextStep} disabled={!state.microAction.what || !state.microAction.check1} className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100">生成报告</button></div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 text-center pb-20 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">生活平衡轮报告</h2>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-left">
              <RadarChart labels={state.dimensions} datasets={[
                { label: '现状', data: state.currentScores, color: '#3b82f6', fill: true },
                { label: '愿景', data: state.visionScores, color: '#f97316', fill: false, borderDash: [5, 5] }
              ]} />
              <div className="mt-10 space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">CORE LEVERAGE POINT</h4>
                  <p className="text-2xl font-black text-slate-900">{state.leveragePoint}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl border-l-4 border-green-500 shadow-sm">
                  <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">MICRO COMMITMENT</h4>
                  <p className="text-lg font-bold text-slate-800 leading-tight">{state.microAction.what}</p>
                  <p className="text-xs text-slate-500 mt-2 font-mono uppercase">{state.microAction.when}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center no-print">
              <button onClick={() => window.print()} className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                打印 / 保存 PDF 报告
              </button>
              <button onClick={() => updateState({ step: 0 })} className="text-slate-400 text-sm hover:underline">重新开始新的觉察</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-800 pb-20">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 no-print">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">阿</div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">阿呆的生命平衡轮</h1>
              <p className="text-[10px] text-slate-400 font-medium">DIGITAL COACH</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-xs font-black text-slate-900 tabular-nums uppercase tracking-widest">STEP {state.step + 1} / 6</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-50 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-orange-400 transition-all duration-700 ease-in-out" style={{ width: `${progressPercentage}%` }} />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 pt-12">
        {renderContent()}
      </main>
      <footer className="max-w-2xl mx-auto px-6 mt-10 text-center text-[10px] text-slate-300 uppercase tracking-widest no-print">
        Awareness is the first step towards change
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
