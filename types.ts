
export interface WheelState {
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

export const DEFAULT_DIMENSIONS = [
  '事业发展', 
  '家庭亲密', 
  '身体健康', 
  '财务状况', 
  '人际关系', 
  '个人成长', 
  '娱乐休闲', 
  '心灵/精神'
];
