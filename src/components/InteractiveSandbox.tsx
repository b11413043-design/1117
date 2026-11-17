import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SkipForward,
  Trash2,
} from 'lucide-react';
import {
  CLASS_BLUEPRINTS,
  LEARNING_STAGES,
} from '../data/oopCurriculum';
import {
  BlueprintId,
  ExecutionLogEntry,
  LearningStageId,
  ObjectInstance,
} from '../types/oop';

function createInitialInstances(blueprintId: BlueprintId): ObjectInstance[] {
  if (blueprintId === 'drone') {
    return [
      {
        id: 'inst-1',
        varName: 'd1',
        memoryAddress: '0x7F8A10',
        blueprintId: 'drone',
        attributes: { name: 'Scout-Alpha', battery: 85, altitude: 20 },
        privateBalanceOrShield: 14,
        statusText: '懸停待命',
        createdAtStep: 1,
      },
      {
        id: 'inst-2',
        varName: 'd2',
        memoryAddress: '0x7F8B40',
        blueprintId: 'drone',
        attributes: { name: 'Cargo-Beta', battery: 60, altitude: 0 },
        privateBalanceOrShield: 42,
        statusText: '地面待機',
        createdAtStep: 2,
      },
    ];
  }
  if (blueprintId === 'bank') {
    return [
      {
        id: 'inst-1',
        varName: 'acc1',
        memoryAddress: '0x7F92C0',
        blueprintId: 'bank',
        attributes: { owner: '王小明', balance: 4500, tier: '薪轉帳戶' },
        privateBalanceOrShield: 0,
        statusText: '帳戶正常',
        createdAtStep: 1,
      },
      {
        id: 'inst-2',
        varName: 'acc2',
        memoryAddress: '0x7F93E8',
        blueprintId: 'bank',
        attributes: { owner: '林佳穎', balance: 7500, tier: '尊榮理財' },
        privateBalanceOrShield: 0,
        statusText: '帳戶正常',
        createdAtStep: 2,
      },
    ];
  }
  return [
    {
      id: 'inst-1',
      varName: 'h1',
      memoryAddress: '0x7FA104',
      blueprintId: 'hero',
      attributes: { name: '艾琳', hp: 120, job: '劍士' },
      privateBalanceOrShield: 18,
      statusText: '準備出征',
      createdAtStep: 1,
    },
    {
      id: 'inst-2',
      varName: 'h2',
      memoryAddress: '0x7FA288',
      blueprintId: 'hero',
      attributes: { name: '凱爾', hp: 90, job: '法師' },
      privateBalanceOrShield: 24,
      statusText: '冥想蓄力',
      createdAtStep: 2,
    },
  ];
}

function getInitialFormState(blueprintId: BlueprintId): Record<string, string | number> {
  const bp = CLASS_BLUEPRINTS[blueprintId];
  const state: Record<string, string | number> = {};
  bp.constructorParams.forEach((p) => {
    state[p.key] = p.defaultValue;
  });
  return state;
}

export const InteractiveSandbox: React.FC = () => {
  const [stageId, setStageId] = useState<LearningStageId>('init');
  const [blueprintId, setBlueprintId] = useState<BlueprintId>('drone');
  const blueprint = CLASS_BLUEPRINTS[blueprintId];

  const [instances, setInstances] = useState<ObjectInstance[]>(() =>
    createInitialInstances('drone')
  );
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('inst-1');
  const [classAttrValue, setClassAttrValue] = useState<number>(
    Number(CLASS_BLUEPRINTS.drone.classAttrDefault)
  );
  const [formValues, setFormValues] = useState<Record<string, string | number>>(() =>
    getInitialFormState('drone')
  );
  const [methodParamValues, setMethodParamValues] = useState<Record<string, number>>({
    fly: 20,
    deposit: 1000,
    withdraw: 1000,
    train: 2,
  });
  const [activeBinding, setActiveBinding] = useState<{
    methodName: string;
    instanceId: string;
    varName: string;
    memoryAddress: string;
  } | null>(null);
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([
    {
      id: 'init-log-1',
      code: 'd1 = Drone("Scout-Alpha", 85, 20)',
      output: '建立物件 d1 @ 0x7F8A10',
      note: '呼叫 __init__ 並將 self 綁定至 0x7F8A10，設定該物件獨立屬性。',
      targetInstanceId: 'inst-1',
      kind: 'instantiate',
    },
    {
      id: 'init-log-2',
      code: 'd2 = Drone("Cargo-Beta", 60, 0)',
      output: '建立物件 d2 @ 0x7F8B40',
      note: '同一個 Drone 藍圖再度配置全新記憶體，d1 與 d2 彼此完全獨立。',
      targetInstanceId: 'inst-2',
      kind: 'instantiate',
    },
  ]);

  const [demoStep, setDemoStep] = useState<number>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const nextCounterRef = useRef<number>(3);
  const bindingTimerRef = useRef<number | null>(null);

  const activeStage =
    LEARNING_STAGES.find((s) => s.id === stageId) ?? LEARNING_STAGES[0];
  const selectedInstance =
    instances.find((inst) => inst.id === selectedInstanceId) ?? instances[0] ?? null;

  useEffect(() => {
    return () => {
      if (bindingTimerRef.current) {
        window.clearTimeout(bindingTimerRef.current);
      }
    };
  }, []);

  const flashSelfBinding = (
    methodName: string,
    inst: ObjectInstance
  ) => {
    if (bindingTimerRef.current) {
      window.clearTimeout(bindingTimerRef.current);
    }
    setActiveBinding({
      methodName,
      instanceId: inst.id,
      varName: inst.varName,
      memoryAddress: inst.memoryAddress,
    });
    bindingTimerRef.current = window.setTimeout(() => {
      setActiveBinding(null);
    }, 1800);
  };

  const appendLog = (entry: Omit<ExecutionLogEntry, 'id'>) => {
    setLogs((prev) => [
      { ...entry, id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
      ...prev.slice(0, 7),
    ]);
  };

  const switchBlueprint = (nextId: BlueprintId) => {
    setBlueprintId(nextId);
    const bp = CLASS_BLUEPRINTS[nextId];
    const initial = createInitialInstances(nextId);
    setInstances(initial);
    setSelectedInstanceId(initial[0].id);
    setClassAttrValue(Number(bp.classAttrDefault));
    setFormValues(getInitialFormState(nextId));
    setActiveBinding(null);
    setIsPlayingDemo(false);
    setDemoStep(0);
    nextCounterRef.current = 3;
    setLogs([
      {
        id: `switch-${Date.now()}`,
        code: `# 載入 ${bp.className} 類別藍圖，已預先建立 2 個實例`,
        output: `${initial[0].varName} (${initial[0].memoryAddress}), ${initial[1].varName} (${initial[1].memoryAddress})`,
        note: `已切換至 ${bp.displayName} 實驗模板，可自由新增物件或呼叫方法。`,
        kind: 'instantiate',
      },
    ]);
  };

  const handleReset = () => {
    switchBlueprint(blueprintId);
  };

  const handleInstantiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (instances.length >= 4) {
      appendLog({
        code: '# 實驗區最多同時顯示 4 個記憶體實例',
        output: '提示：請先移除其中一個舊物件，再建立新實例。',
        note: '為了保持視覺化記憶體區清晰，實作場最多容納 4 個並行物件。',
        kind: 'error',
      });
      return;
    }

    const idx = nextCounterRef.current;
    nextCounterRef.current += 1;
    const varName = `${blueprint.varPrefix}${idx}`;
    const hexAddr = `0x7F${(0x8c00 + idx * 0x148).toString(16).toUpperCase()}`;

    const sanitizedAttrs: Record<string, string | number> = {};
    blueprint.constructorParams.forEach((p) => {
      const raw = formValues[p.key];
      if (p.type === 'number') {
        sanitizedAttrs[p.key] = Number(raw) || Number(p.defaultValue);
      } else {
        const text = String(raw || '').trim();
        sanitizedAttrs[p.key] = text || `${p.defaultValue}-${idx}`;
      }
    });

    const newInst: ObjectInstance = {
      id: `inst-${Date.now()}`,
      varName,
      memoryAddress: hexAddr,
      blueprintId,
      attributes: sanitizedAttrs,
      privateBalanceOrShield: idx * 7,
      statusText: '剛完成初始化',
      createdAtStep: idx,
    };

    const argsList = blueprint.constructorParams
      .map((p) =>
        p.type === 'number'
          ? sanitizedAttrs[p.key]
          : `"${sanitizedAttrs[p.key]}"`
      )
      .join(', ');

    setInstances((prev) => [...prev, newInst]);
    setSelectedInstanceId(newInst.id);
    flashSelfBinding('__init__', newInst);
    appendLog({
      code: `${varName} = ${blueprint.className}(${argsList})`,
      output: `建立物件 ${varName} @ ${hexAddr}`,
      note: `__init__ 將傳入的引數綁定到 self (${hexAddr})，不影響既有的其他物件。`,
      targetInstanceId: newInst.id,
      kind: 'instantiate',
    });
  };

  const handleRemoveInstance = (id: string) => {
    if (instances.length <= 1) return;
    const target = instances.find((i) => i.id === id);
    const remaining = instances.filter((i) => i.id !== id);
    setInstances(remaining);
    if (selectedInstanceId === id && remaining.length > 0) {
      setSelectedInstanceId(remaining[0].id);
    }
    if (target) {
      appendLog({
        code: `del ${target.varName}`,
        output: `釋放參考 ${target.varName} (${target.memoryAddress})`,
        note: '當物件不再有任何變數參考時，Python 垃圾回收機制（GC）會收回該記憶體空間。',
        kind: 'attribute',
      });
    }
  };

  const invokeMethod = (inst: ObjectInstance, methodId: string) => {
    const paramVal = methodParamValues[methodId] ?? 0;
    flashSelfBinding(methodId, inst);

    if (blueprintId === 'drone') {
      if (methodId === 'fly') {
        const currentAlt = Number(inst.attributes.altitude);
        const currentBat = Number(inst.attributes.battery);
        const cost = Math.max(5, Math.round(paramVal * 0.6));
        if (currentBat < cost) {
          appendLog({
            code: `${inst.varName}.fly(${paramVal})`,
            output: `警示：電量僅剩 ${currentBat}%，無法執行爬升！`,
            note: `方法內檢查 self.battery (${currentBat}%) 不足，保護狀態不被扣成負數。`,
            targetInstanceId: inst.id,
            kind: 'error',
          });
          return;
        }
        const nextAlt = currentAlt + paramVal;
        if (nextAlt > classAttrValue) {
          appendLog({
            code: `${inst.varName}.fly(${paramVal})`,
            output: `攔截：目標高度 ${nextAlt}m 超出 Drone.max_altitude (${classAttrValue}m)`,
            note: `方法讀取類別屬性 Drone.max_altitude (${classAttrValue}m) 進行安全限高檢查。`,
            targetInstanceId: inst.id,
            kind: 'error',
          });
          return;
        }
        const nextBat = Math.max(0, currentBat - cost);
        setInstances((prev) =>
          prev.map((item) =>
            item.id === inst.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, altitude: nextAlt, battery: nextBat },
                  privateBalanceOrShield: item.privateBalanceOrShield + 1,
                  statusText: `飛行高度 ${nextAlt}m`,
                }
              : item
          )
        );
        appendLog({
          code: `${inst.varName}.fly(${paramVal})  # 等同 Drone.fly(${inst.varName}, ${paramVal})`,
          output: `${inst.attributes.name} 爬升至 ${nextAlt}m（電量剩餘 ${nextBat}%）`,
          note: `self 指向 ${inst.varName} (${inst.memoryAddress})，僅更新該物件的 altitude 與 battery。`,
          targetInstanceId: inst.id,
          kind: 'method',
        });
      } else if (methodId === 'charge') {
        setInstances((prev) =>
          prev.map((item) =>
            item.id === inst.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, altitude: 0, battery: 100 },
                  statusText: '已降落並充飽電',
                }
              : item
          )
        );
        appendLog({
          code: `${inst.varName}.charge()`,
          output: `${inst.attributes.name} 降落充電完成：battery = 100%`,
          note: `charge(self) 重設了 ${inst.varName} 的實例屬性，其他無人機狀態維持不變。`,
          targetInstanceId: inst.id,
          kind: 'method',
        });
      }
    } else if (blueprintId === 'bank') {
      const currentBal = Number(inst.attributes.balance);
      if (methodId === 'deposit') {
        const nextBal = Math.min(10000, currentBal + paramVal);
        setInstances((prev) =>
          prev.map((item) =>
            item.id === inst.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, balance: nextBal },
                  statusText: `剛存入 ${paramVal} 元`,
                }
              : item
          )
        );
        appendLog({
          code: `${inst.varName}.deposit(${paramVal})`,
          output: `${inst.attributes.owner} 存入 ${paramVal} 元，餘額：${nextBal} 元`,
          note: `self 綁定至 ${inst.varName} (${inst.memoryAddress})，精準累加該帳戶的 self.balance。`,
          targetInstanceId: inst.id,
          kind: 'method',
        });
      } else if (methodId === 'withdraw') {
        if (paramVal > currentBal) {
          setInstances((prev) =>
            prev.map((item) =>
              item.id === inst.id
                ? {
                    ...item,
                    privateBalanceOrShield: item.privateBalanceOrShield + 1,
                    statusText: '餘額不足遭拒',
                  }
                : item
            )
          );
          appendLog({
            code: `${inst.varName}.withdraw(${paramVal})`,
            output: `交易失敗：餘額 ${currentBal} 元不足以提領 ${paramVal} 元`,
            note: '封裝檢查阻止了非法負數餘額的產生，保護資料一致性。',
            targetInstanceId: inst.id,
            kind: 'error',
          });
          return;
        }
        const nextBal = currentBal - paramVal;
        setInstances((prev) =>
          prev.map((item) =>
            item.id === inst.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, balance: nextBal },
                  statusText: `剛提領 ${paramVal} 元`,
                }
              : item
          )
        );
        appendLog({
          code: `${inst.varName}.withdraw(${paramVal})`,
          output: `${inst.attributes.owner} 提領 ${paramVal} 元，餘額：${nextBal} 元`,
          note: `self.balance 減少 ${paramVal}，另一位戶頭的餘額完全不受影響。`,
          targetInstanceId: inst.id,
          kind: 'method',
        });
      }
    } else if (blueprintId === 'hero') {
      const currentHp = Number(inst.attributes.hp);
      if (methodId === 'train') {
        const hpCost = paramVal * 8;
        if (currentHp <= hpCost) {
          appendLog({
            code: `${inst.varName}.train(${paramVal})`,
            output: `體力警示：${inst.attributes.name} 生命值過低 (${currentHp} HP)，建議先呼叫 heal()`,
            note: '方法內的條件判斷確保角色不會因為特訓而生命值歸零。',
            targetInstanceId: inst.id,
            kind: 'error',
          });
          return;
        }
        const nextHp = currentHp - hpCost;
        setInstances((prev) =>
          prev.map((item) =>
            item.id === inst.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, hp: nextHp },
                  privateBalanceOrShield: item.privateBalanceOrShield + paramVal * 2,
                  statusText: `特訓 ${paramVal} 小時完成`,
                }
              : item
          )
        );
        appendLog({
          code: `${inst.varName}.train(${paramVal})`,
          output: `${inst.attributes.name} 特訓 ${paramVal} 小時，消耗 ${hpCost} HP（目前 ${nextHp} HP）`,
          note: `self 綁定至 ${inst.varName}，同時更新了實例的隱藏熟練度與生命值。`,
          targetInstanceId: inst.id,
          kind: 'method',
        });
      } else if (methodId === 'heal') {
        setInstances((prev) =>
          prev.map((item) =>
            item.id === inst.id
              ? {
                  ...item,
                  attributes: { ...item.attributes, hp: 150 },
                  statusText: '生命值已完全恢復',
                }
              : item
          )
        );
        appendLog({
          code: `${inst.varName}.heal()`,
          output: `${inst.attributes.name} 恢復至滿血狀態（150 HP）`,
          note: `heal(self) 只作用於 ${inst.varName} (${inst.memoryAddress}) 本身。`,
          targetInstanceId: inst.id,
          kind: 'method',
        });
      }
    }
  };

  const handleClassAttrChange = (nextVal: number) => {
    setClassAttrValue(nextVal);
    appendLog({
      code: `${blueprint.className}.${blueprint.classAttrName} = ${nextVal}`,
      output: `類別屬性更新：所有 ${blueprint.className} 實例同步讀取 ${nextVal}${blueprint.classAttrUnit ?? ''}`,
      note: '類別屬性存在於 Class 本身，修改它會即時影響所有共享這份藍圖的物件。',
      kind: 'attribute',
    });
  };

  const handleTestPrivateAccess = (inst: ObjectInstance) => {
    appendLog({
      code: `print(${inst.varName}.${blueprint.privateAttrName})`,
      output: `AttributeError: '${blueprint.className}' object has no attribute '${blueprint.privateAttrName}'`,
      note: `Python 會對雙底線開頭的私有屬性進行名稱修飾（Name Mangling，改名為 _${blueprint.className}${blueprint.privateAttrName}），防止外部意外篡改。`,
      targetInstanceId: inst.id,
      kind: 'error',
    });
  };

  const handleIdentityCheck = () => {
    if (instances.length < 2) return;
    const first = instances[0];
    const second = instances[1];
    appendLog({
      code: `print(${first.varName} is ${second.varName}, type(${first.varName}) is type(${second.varName}))`,
      output: 'False  True',
      note: `${first.varName} (${first.memoryAddress}) 與 ${second.varName} (${second.memoryAddress}) 是不同記憶體物件（is 為 False），但出自同一個 ${blueprint.className} 類別（type 相同）。`,
      kind: 'inspect',
    });
  };

  // Step-by-step guided trace playback
  const stepLabels = useMemo(
    () => [
      `1. 定義類別 ${blueprint.className} 並設定類別屬性 ${blueprint.classAttrName} = ${classAttrValue}`,
      `2. 實例化 ${instances[0]?.varName ?? 'obj1'}，執行 __init__ 寫入專屬記憶體`,
      `3. 透過 ${instances[0]?.varName ?? 'obj1'} 呼叫方法，觀察 self 指標自動綁定`,
      `4. 驗證多物件隔離性：修改其中一個物件不影響另一個物件`,
    ],
    [blueprint.className, blueprint.classAttrName, classAttrValue, instances]
  );

  const runDemoStep = (stepIndex: number) => {
    const normalized = stepIndex % 4;
    setDemoStep(normalized);
    if (normalized === 0) {
      setStageId('init');
      appendLog({
        code: `class ${blueprint.className}:  # 載入類別藍圖`,
        output: `藍圖註冊完成：${blueprint.classAttrName} = ${classAttrValue}${blueprint.classAttrUnit ?? ''}`,
        note: '步驟 1：Python 先建立類別物件作為設計藍圖，尚未產生任何實例。',
        kind: 'inspect',
      });
    } else if (normalized === 1 && instances[0]) {
      setStageId('init');
      setSelectedInstanceId(instances[0].id);
      flashSelfBinding('__init__', instances[0]);
      appendLog({
        code: `${instances[0].varName} = ${blueprint.className}(...)`,
        output: `配置記憶體 ${instances[0].memoryAddress} 並執行 __init__(self)`,
        note: `步驟 2：${instances[0].varName} 誕生，__init__ 將初始資料寫入該記憶體區塊。`,
        targetInstanceId: instances[0].id,
        kind: 'instantiate',
      });
    } else if (normalized === 2 && instances[0]) {
      setStageId('methods');
      setSelectedInstanceId(instances[0].id);
      invokeMethod(instances[0], blueprint.methods[0].id);
    } else if (normalized === 3) {
      setStageId('attributes');
      handleIdentityCheck();
    }
  };

  useEffect(() => {
    if (!isPlayingDemo) return;
    const timer = window.setInterval(() => {
      setDemoStep((prev) => {
        const next = (prev + 1) % 4;
        runDemoStep(next);
        return next;
      });
    }, 2400);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayingDemo, blueprintId, instances.length]);

  const generatedCode = useMemo(() => {
    const attrLines = `    ${blueprint.classAttrName} = ${classAttrValue}`;
    const initArgs = blueprint.constructorParams.map((p) => p.key).join(', ');
    const initBody = blueprint.constructorParams
      .map((p) => `        self.${p.key} = ${p.key}`)
      .join('\n');

    const instLines = instances
      .map((inst) => {
        const vals = blueprint.constructorParams
          .map((p) =>
            p.type === 'number'
              ? inst.attributes[p.key]
              : `"${inst.attributes[p.key]}"`
          )
          .join(', ');
        return `${inst.varName} = ${blueprint.className}(${vals})  # @ ${inst.memoryAddress}`;
      })
      .join('\n');

    return `class ${blueprint.className}:\n${attrLines}  # 類別屬性\n\n    def __init__(self, ${initArgs}):\n${initBody}\n        self.${blueprint.privateAttrName} = 0  # 私有封裝屬性\n\n    def ${blueprint.methods[0].name}(self${blueprint.methods[0].paramKey ? `, ${blueprint.methods[0].paramKey}` : ''}):\n        ...\n\n# 目前記憶體中的實例\n${instLines}`;
  }, [blueprint, classAttrValue, instances]);

  return (
    <section id="sandbox" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              02. 類別與物件互動實作場
            </h2>
            <p className="mt-2 text-base text-slate-600">
              親手建立物件實例、修改類別與實例屬性，並即時觀察記憶體位址與{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">
                self
              </code>{' '}
              指標的動態綁定。
            </p>
          </div>

          {/* Blueprint selector & playback controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="選擇範例類別"
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
            >
              {(Object.keys(CLASS_BLUEPRINTS) as BlueprintId[]).map((id) => {
                const bp = CLASS_BLUEPRINTS[id];
                const active = id === blueprintId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => switchBlueprint(id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {bp.displayName}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlayingDemo((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              >
                {isPlayingDemo ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    暫停示範
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    自動示範
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlayingDemo(false);
                  runDemoStep(demoStep + 1);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
                單步前進
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                重設實驗
              </button>
            </div>
          </div>
        </div>

        {/* Progressive Stage Tabs */}
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEARNING_STAGES.map((stage) => {
            const active = stage.id === stageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setStageId(stage.id)}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                  active
                    ? 'border-sky-600 bg-sky-50/60'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    active ? 'text-sky-700' : 'text-slate-500'
                  }`}
                >
                  {stage.order}
                </span>
                <span className="mt-1 font-display text-sm font-semibold text-slate-900">
                  {stage.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-slate-600">
                  {stage.summary}
                </span>
              </button>
            );
          })}
        </div>

        {/* Two-Zone Sandbox Layout: Left Interactive Stage (62%) / Right Control Deck (38%) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* LEFT ZONE: Visual Stage + Memory Heap + Live Code & Output */}
          <div className="lg:col-span-7 space-y-6">
            {/* Blueprint + Memory Heap Visualizer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    執行階段視覺化 · {stepLabels[demoStep]}
                  </div>
                  <h3 className="mt-0.5 font-display text-lg font-semibold text-slate-900">
                    類別藍圖與記憶體實例區（Heap）
                  </h3>
                </div>
                <div className="font-mono text-xs text-slate-600 tabular-nums">
                  活躍實例數：{instances.length} / 4
                </div>
              </div>

              {/* Class Blueprint Box */}
              <div className="mt-5 rounded-xl border border-sky-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-sky-700">
                      class {blueprint.className}:
                    </span>
                    <span className="text-xs text-slate-500">· 設計藍圖（記憶體中僅此一份）</span>
                  </div>
                  {activeBinding && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 font-mono text-xs font-medium text-amber-800 border border-amber-200">
                      執行 {activeBinding.methodName}(self={activeBinding.varName} @{' '}
                      {activeBinding.memoryAddress})
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                    <div className="font-medium text-slate-500">
                      類別屬性（全體實例共享）
                    </div>
                    <div className="mt-1 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                      {blueprint.className}.{blueprint.classAttrName} = {classAttrValue}
                      {blueprint.classAttrUnit ?? ''}
                    </div>
                    <div className="mt-1 text-slate-500">{blueprint.classAttrDesc}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                    <div className="font-medium text-slate-500">
                      藍圖定義的方法（Methods）
                    </div>
                    <div className="mt-1.5 space-y-1 font-mono text-slate-800">
                      {blueprint.methods.map((m) => {
                        const running = activeBinding?.methodName === m.id;
                        return (
                          <div
                            key={m.id}
                            className={`rounded px-2 py-0.5 transition-colors ${
                              running
                                ? 'bg-amber-100 text-amber-900 font-semibold'
                                : 'text-slate-700'
                            }`}
                          >
                            {m.signature}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Heap Instances */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">
                    記憶體中的物件實例（點選卡片切換操作目標）
                  </span>
                  <span className="font-mono">每個物件皆有獨立 id() 位址</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {instances.map((inst) => {
                    const isSelected = inst.id === selectedInstance?.id;
                    const isSelfBound = activeBinding?.instanceId === inst.id;
                    const gaugeVal = Number(inst.attributes[blueprint.gaugeKey] ?? 0);
                    const gaugePct = Math.max(
                      0,
                      Math.min(100, Math.round((gaugeVal / blueprint.gaugeMax) * 100))
                    );

                    return (
                      <div
                        key={inst.id}
                        onClick={() => setSelectedInstanceId(inst.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedInstanceId(inst.id);
                          }
                        }}
                        className={`rounded-xl border bg-white p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                          isSelfBound
                            ? 'border-amber-500 ring-2 ring-amber-200'
                            : isSelected
                              ? 'border-sky-600 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-bold text-slate-900">
                                {inst.varName}
                              </span>
                              <span className="font-mono text-xs text-slate-500 tabular-nums">
                                id: {inst.memoryAddress}
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-emerald-700 font-medium">
                              ● {inst.statusText}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isSelfBound && (
                              <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-800">
                                self 指向此處
                              </span>
                            )}
                            {instances.length > 1 && (
                              <button
                                type="button"
                                aria-label={`移除物件 ${inst.varName}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveInstance(inst.id);
                                }}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Instance Attributes */}
                        <div className="mt-3 space-y-1.5 font-mono text-xs">
                          {Object.entries(inst.attributes).map(([k, v]) => (
                            <div
                              key={k}
                              className="flex items-center justify-between text-slate-700"
                            >
                              <span className="text-slate-500">self.{k}</span>
                              <span className="font-semibold text-slate-900 tabular-nums">
                                {typeof v === 'string' ? `"${v}"` : v}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between text-slate-500 border-t border-slate-100 pt-1.5">
                            <span>共享 {blueprint.classAttrName}</span>
                            <span className="font-medium text-sky-700 tabular-nums">
                              {classAttrValue}
                              {blueprint.classAttrUnit ?? ''}
                            </span>
                          </div>
                          {stageId === 'encapsulation' && (
                            <div className="flex items-center justify-between rounded bg-slate-50 px-2 py-1 text-slate-600">
                              <span className="inline-flex items-center gap-1">
                                <Lock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                                {blueprint.privateAttrName}
                              </span>
                              <span className="tabular-nums font-medium">
                                {inst.privateBalanceOrShield}（受保護）
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Visual Gauge */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{blueprint.gaugeLabel}</span>
                            <span className="font-mono font-semibold tabular-nums">
                              {gaugeVal} {blueprint.gaugeUnit}
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full transition-all duration-200 ${
                                gaugePct <= 25
                                  ? 'bg-rose-500'
                                  : gaugePct <= 50
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-600'
                              }`}
                              style={{ width: `${gaugePct}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Method Actions */}
                        <div className="mt-3.5 flex flex-wrap gap-2 pt-1">
                          {blueprint.methods.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInstanceId(inst.id);
                                invokeMethod(inst, m.id);
                              }}
                              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 transition-colors whitespace-nowrap shrink-0"
                            >
                              .{m.name}({m.paramKey ? methodParamValues[m.id] ?? m.paramDefault : ''})
                            </button>
                          ))}
                          {stageId === 'encapsulation' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestPrivateAccess(inst);
                              }}
                              className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 font-mono text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0"
                            >
                              硬存取私有屬性
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Generated Python Code + Interactive Execution Console */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-100">
                <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                  <span className="font-mono">即時對應 Python 程式碼</span>
                  <span>同步更新</span>
                </div>
                <pre className="overflow-x-auto font-mono text-xs leading-6 text-slate-200">
                  <code>{generatedCode}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-100">
                <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                  <span className="font-mono">執行紀錄與終端輸出</span>
                  <span>最新紀錄在最上方</span>
                </div>
                <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5 text-xs"
                    >
                      <div className="font-mono text-sky-300">&gt;&gt;&gt; {log.code}</div>
                      <div
                        className={`mt-1 flex items-start gap-1.5 font-mono ${
                          log.kind === 'error' ? 'text-rose-300' : 'text-emerald-300'
                        }`}
                      >
                        {log.kind === 'error' ? (
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        )}
                        <span>{log.output}</span>
                      </div>
                      <div className="mt-1 text-slate-400 leading-relaxed">{log.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT ZONE: Control & Concept Deck */}
          <div className="lg:col-span-5 space-y-5">
            {/* Contextual Concept Callout */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-5">
              <div className="text-xs font-semibold text-sky-800">
                {activeStage.order} · 核心觀念提點
              </div>
              <h3 className="mt-1 font-display text-base font-semibold text-slate-900">
                {activeStage.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {activeStage.keyInsight}
              </p>
            </div>

            {/* Instantiate New Object Form */}
            <form
              onSubmit={handleInstantiate}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  建立新物件實例（呼叫 __init__）
                </h3>
                <span className="font-mono text-xs text-slate-500">
                  {blueprint.className}(...)
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {blueprint.constructorParams.map((param) => (
                  <div key={param.key}>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <label htmlFor={`param-${param.key}`}>{param.label}</label>
                      {param.type === 'number' && (
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {formValues[param.key]} {param.unit ?? ''}
                        </span>
                      )}
                    </div>
                    {param.type === 'text' && (
                      <input
                        id={`param-${param.key}`}
                        type="text"
                        value={String(formValues[param.key] ?? '')}
                        placeholder={param.placeholder}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [param.key]: e.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
                      />
                    )}
                    {param.type === 'number' && (
                      <input
                        id={`param-${param.key}`}
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={Number(formValues[param.key] ?? param.defaultValue)}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [param.key]: Number(e.target.value),
                          }))
                        }
                        className="mt-2 w-full accent-sky-600 cursor-pointer"
                      />
                    )}
                    {param.type === 'select' && (
                      <select
                        id={`param-${param.key}`}
                        value={String(formValues[param.key] ?? param.defaultValue)}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [param.key]: e.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
                      >
                        {param.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  建立實例並配置記憶體
                </button>
              </div>
            </form>

            {/* Object Inspector & Class Attribute Controller */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    物件方法操作與屬性比較
                  </h3>
                  {selectedInstance && (
                    <span className="font-mono text-xs text-sky-700 font-semibold">
                      已選取：{selectedInstance.varName}
                    </span>
                  )}
                </div>

                {/* Method parameter controls */}
                <div className="mt-4 space-y-4">
                  {blueprint.methods
                    .filter((m) => m.paramKey)
                    .map((m) => (
                      <div key={m.id} className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                          <label htmlFor={`method-param-${m.id}`}>
                            {m.paramLabel}
                          </label>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums">
                            {methodParamValues[m.id] ?? m.paramDefault} {m.paramUnit ?? ''}
                          </span>
                        </div>
                        <input
                          id={`method-param-${m.id}`}
                          type="range"
                          min={m.paramMin}
                          max={m.paramMax}
                          step={m.paramStep}
                          value={methodParamValues[m.id] ?? m.paramDefault}
                          onChange={(e) =>
                            setMethodParamValues((prev) => ({
                              ...prev,
                              [m.id]: Number(e.target.value),
                            }))
                          }
                          className="mt-2 w-full accent-sky-600 cursor-pointer"
                        />
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500">{m.description}</span>
                          {selectedInstance && (
                            <button
                              type="button"
                              onClick={() => invokeMethod(selectedInstance, m.id)}
                              className="rounded-md bg-slate-900 px-3 py-1.5 font-mono text-xs font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                            >
                              執行 {selectedInstance.varName}.{m.name}()
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Class attribute slider */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <label htmlFor="class-attr-slider">
                    修改類別屬性：{blueprint.className}.{blueprint.classAttrName}
                  </label>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">
                    {classAttrValue} {blueprint.classAttrUnit ?? ''}
                  </span>
                </div>
                <input
                  id="class-attr-slider"
                  type="range"
                  min={blueprintId === 'drone' ? 40 : blueprintId === 'bank' ? 1 : 1}
                  max={blueprintId === 'drone' ? 200 : blueprintId === 'bank' ? 10 : 10}
                  step={blueprintId === 'drone' ? 10 : blueprintId === 'bank' ? 0.5 : 1}
                  value={classAttrValue}
                  onChange={(e) => handleClassAttrChange(Number(e.target.value))}
                  className="mt-2 w-full accent-sky-600 cursor-pointer"
                />
                <p className="mt-1 text-xs text-slate-500">
                  調整此數值會立刻反映在上方所有實例卡片的「共享 {blueprint.classAttrName}」欄位。
                </p>
              </div>

              {/* Identity comparison button */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-600">
                  驗證兩個實例是否為相同記憶體物件
                </span>
                <button
                  type="button"
                  disabled={instances.length < 2}
                  onClick={handleIdentityCheck}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  測試 {instances[0]?.varName ?? 'a'} is {instances[1]?.varName ?? 'b'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
