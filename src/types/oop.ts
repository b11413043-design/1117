export type BlueprintId = 'drone' | 'bank' | 'hero';

export type LearningStageId = 'init' | 'attributes' | 'methods' | 'encapsulation';

export interface LearningStage {
  id: LearningStageId;
  order: string;
  title: string;
  summary: string;
  keyInsight: string;
}

export interface BlueprintParam {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  placeholder?: string;
}

export interface BlueprintMethod {
  id: string;
  name: string;
  signature: string;
  description: string;
  paramLabel?: string;
  paramKey?: string;
  paramMin?: number;
  paramMax?: number;
  paramStep?: number;
  paramDefault?: number;
  paramUnit?: string;
}

export interface ClassBlueprint {
  id: BlueprintId;
  className: string;
  displayName: string;
  varPrefix: string;
  classAttrName: string;
  classAttrDefault: string | number;
  classAttrUnit?: string;
  classAttrDesc: string;
  privateAttrName: string;
  privateAttrLabel: string;
  constructorParams: BlueprintParam[];
  methods: BlueprintMethod[];
  gaugeKey: string;
  gaugeLabel: string;
  gaugeMax: number;
  gaugeUnit: string;
}

export interface ObjectInstance {
  id: string;
  varName: string;
  memoryAddress: string;
  blueprintId: BlueprintId;
  attributes: Record<string, string | number>;
  privateBalanceOrShield: number;
  statusText: string;
  createdAtStep: number;
}

export interface ExecutionLogEntry {
  id: string;
  code: string;
  output: string;
  note: string;
  targetInstanceId?: string;
  kind: 'instantiate' | 'method' | 'attribute' | 'error' | 'inspect';
}

export interface AnatomyPart {
  id: string;
  token: string;
  lineNumber: number;
  title: string;
  role: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  prompt: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
