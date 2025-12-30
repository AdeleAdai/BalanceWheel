
import React from 'react';

interface ReflectionAreaProps {
  prompts: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const ReflectionArea: React.FC<ReflectionAreaProps> = ({ prompts, value, onChange, placeholder }) => {
  return (
    <div className="mt-8 space-y-4">
      <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200">
        <p className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-1.5">
          <span className="text-lg">👉</span> 深度觉察提问：
        </p>
        <ul className="space-y-2 text-slate-600 leading-relaxed text-sm">
          {prompts.map((p, i) => (
            <li key={i} className="pl-4 border-l-2 border-slate-300">{p}</li>
          ))}
        </ul>
      </div>
      
      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "这里是你的自由书写空间，不需要逐一回答，请跟随你的直觉记录..."}
          className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-700 leading-relaxed placeholder:text-slate-300 shadow-sm"
        />
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-300 pointer-events-none font-mono">
          REFLECTIVE WRITING
        </div>
      </div>
    </div>
  );
};

export default ReflectionArea;
