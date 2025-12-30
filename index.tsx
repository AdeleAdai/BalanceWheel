
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

// --- 步骤组件 ---

const SetupStep = ({ state, updateState, onNext }) => {
  const canAdd = state.dimensions.length < 10;
  const handleEdit = (i, val) => {
    const d = [...state.dimensions]; d[i] = val; updateState({ dimensions: d });
  };
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-900">第一步：定义你的生活维度</h2>
        <p className="text-slate-500">你可以修改它们的名字，或者增减数量（6-10个）。</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.dimensions.map((dim, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100">
            <input type="text" value={dim} onChange={e => handleEdit(i, e.target.value)} className="flex-1 text-sm outline-none font-medium" />
          </div>
        ))}
      </div>
      <button onClick={onNext} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">确定，开始现状打分</button>
    </div>
  );
};

// --- 主程序 ---

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

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const nextStep = () => {
    if (state.step === 1) updateState({ step: 2, visionScores: [...state.currentScores] });
    else updateState({ step: state.step + 1 });
    window.scrollTo(0, 0);
  };
  const prevStep = () => updateState({ step: Math.max(0, state.step - 1) });

  const renderContent = () => {
    switch(state.step) {
      case 0: return <SetupStep state={state} updateState={updateState} onNext={nextStep} />;
      case 1: 
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">现状打分 (Current Reality)</h2>
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
            <button onClick={nextStep} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">描绘愿景</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">愿景描绘 (Future Vision)</h2>
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
            <ReflectionArea prompts={["假设一切如愿，完美的一天是怎样的？"]} value={state.reflections.step2} onChange={v => updateState({ reflections: { ...state.reflections, step2: v } })} />
            <div className="flex gap-4"><button onClick={prevStep} className="flex-1 py-4 bg-slate-100 rounded-2xl">返回</button><button onClick={nextStep} className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl font-bold">分析差距</button></div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
             <h2 className="text-3xl font-bold text-center">寻找杠杆点</h2>
             <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
               <RadarChart labels={state.dimensions} datasets={[
                 { label: '现状', data: state.currentScores, color: '#3b82f6', fill: true },
                 { label: '愿景', data: state.visionScores, color: '#f97316', fill: false, borderDash: [5, 5] }
               ]} />
               <div className="mt-8 border-t pt-6">
                 <p className="text-center font-bold mb-4">请选择一个核心改善领域：</p>
                 <div className="grid grid-cols-2 gap-3">
                   {state.dimensions.map((dim, i) => (
                     <button key={i} onClick={() => updateState({ leveragePoint: dim })} className={`p-3 rounded-xl border-2 transition-all ${state.leveragePoint === dim ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>{dim}</button>
                   ))}
                 </div>
               </div>
             </div>
             <button onClick={nextStep} disabled={!state.leveragePoint} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-30">设定微行动</button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">微行动设计</h2>
            <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6">
              <div><label className="block text-sm font-bold mb-2">针对 {state.leveragePoint}，我的行动是：</label><input type="text" value={state.microAction.what} onChange={e => updateState({ microAction: { ...state.microAction, what: e.target.value } })} className="w-full p-4 border rounded-xl" placeholder="例如：饭后散步10分钟" /></div>
              <div><label className="block text-sm font-bold mb-2">执行时间/地点：</label><input type="text" value={state.microAction.when} onChange={e => updateState({ microAction: { ...state.microAction, when: e.target.value } })} className="w-full p-4 border rounded-xl" placeholder="例如：每天19:00" /></div>
              <label className="flex gap-2 items-center"><input type="checkbox" checked={state.microAction.check1} onChange={e => updateState({ microAction: { ...state.microAction, check1: e.target.checked } })} /><span>行动足够小，不需要意志力</span></label>
            </div>
            <button onClick={nextStep} disabled={!state.microAction.what || !state.microAction.check1} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">生成报告</button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 text-center pb-20">
            <h2 className="text-4xl font-black">生活平衡轮报告</h2>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-left">
              <RadarChart labels={state.dimensions} datasets={[
                { label: '现状', data: state.currentScores, color: '#3b82f6', fill: true },
                { label: '愿景', data: state.visionScores, color: '#f97316', fill: false, borderDash: [5, 5] }
              ]} />
              <div className="mt-10 space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-500">
                  <h4 className="text-sm text-slate-400 font-bold uppercase mb-2">核心杠杆点</h4>
                  <p className="text-2xl font-black">{state.leveragePoint}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl border-l-4 border-green-500">
                  <h4 className="text-sm text-slate-400 font-bold uppercase mb-2">微行动承诺</h4>
                  <p className="text-xl font-bold">{state.microAction.what}</p>
                  <p className="text-sm text-slate-500 mt-2">{state.microAction.when}</p>
                </div>
              </div>
            </div>
            <button onClick={() => window.print()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold no-print">打印/保存 PDF</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center no-print">
        <h1 className="font-bold">阿呆的生命平衡轮</h1>
        <span className="text-xs text-slate-400 uppercase tracking-widest">Step {state.step + 1} / 6</span>
      </header>
      <main className="max-w-2xl mx-auto px-6 pt-10">
        {renderContent()}
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
