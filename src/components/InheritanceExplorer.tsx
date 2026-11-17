import React, { useState } from 'react';
import { ArrowDown, GitBranch, Play } from 'lucide-react';

interface FleetResult {
  varName: string;
  className: string;
  output: string;
  mro: string;
}

export const InheritanceExplorer: React.FC = () => {
  const [useSuper, setUseSuper] = useState<boolean>(true);
  const [overrideMove, setOverrideMove] = useState<boolean>(true);
  const [fleetResults, setFleetResults] = useState<FleetResult[] | null>(null);

  const runPolymorphism = () => {
    const carOutput = overrideMove
      ? useSuper
        ? '電動車 Tesla (電力驅動) 靜音行駛中，剩餘電量 88%'
        : '電動車啟動！（缺少父類別 brand 屬性時無法顯示廠牌）'
      : '交通工具 Tesla 正在移動（沿用父類別 Vehicle.move）';

    const droneOutput = overrideMove
      ? useSuper
        ? '貨運無人機 Wing-X (電力驅動) 爬升至 50m 空域配送'
        : '貨運無人機升空！（缺少父類別 brand 屬性時無法顯示廠牌）'
      : '交通工具 Wing-X 正在移動（沿用父類別 Vehicle.move）';

    setFleetResults([
      {
        varName: 'ev',
        className: 'ElectricCar',
        output: carOutput,
        mro: 'ElectricCar → Vehicle → object',
      },
      {
        varName: 'drone',
        className: 'CargoDrone',
        output: droneOutput,
        mro: 'CargoDrone → Vehicle → object',
      },
    ]);
  };

  return (
    <section id="inheritance" className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              03. 類別繼承與多型（Inheritance &amp; Polymorphism）
            </h2>
            <p className="mt-2 text-base text-slate-600">
              子類別可以繼承父類別的共同屬性與方法，並透過{' '}
              <code className="rounded bg-slate-200/70 px-1.5 py-0.5 font-mono text-sm text-slate-800">
                super()
              </code>{' '}
              沿用初始化邏輯，或覆寫（Override）同名方法展現多型行為。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setUseSuper((v) => !v)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                useSuper
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              super().__init__()：{useSuper ? '已啟用' : '已停用'}
            </button>
            <button
              type="button"
              onClick={() => setOverrideMove((v) => !v)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                overrideMove
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              子類別覆寫 move()：{overrideMove ? '已覆寫（多型）' : '沿用父類別'}
            </button>
            <button
              type="button"
              onClick={runPolymorphism}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              執行多型測試
            </button>
          </div>
        </div>

        {/* Inheritance Hierarchy Tree */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {/* Parent Class */}
            <div className="rounded-xl border border-slate-300 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-900">
                  <GitBranch className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span>class Vehicle:</span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  父類別（Base / Parent Class）
                </span>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3.5 font-mono text-xs leading-6 text-slate-200">
                <code>{`class Vehicle:
    def __init__(self, brand):
        self.brand = brand
        self.power = "電力驅動"

    def move(self):
        return f"交通工具 {self.brand} 正在移動"`}</code>
              </pre>
            </div>

            <div className="flex justify-around py-1 text-slate-400">
              <div className="flex flex-col items-center gap-1 text-xs">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono">繼承 (Vehicle)</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-xs">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono">繼承 (Vehicle)</span>
              </div>
            </div>

            {/* Child Classes */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-indigo-200 bg-white p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-mono text-sm font-bold text-indigo-700">
                    class ElectricCar(Vehicle):
                  </span>
                  <span className="text-xs text-slate-500">子類別</span>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-200">
                  <code>{`def __init__(self, brand, kwh):
${useSuper ? '    super().__init__(brand)' : '    # 未呼叫 super().__init__'}
    self.kwh = kwh

${
  overrideMove
    ? `def move(self):
    return f"電動車 {self.brand} 靜音行駛"`
    : `# 未覆寫 move()，自動沿用 Vehicle.move`
}`}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-white p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-mono text-sm font-bold text-indigo-700">
                    class CargoDrone(Vehicle):
                  </span>
                  <span className="text-xs text-slate-500">子類別</span>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-200">
                  <code>{`def __init__(self, brand, alt):
${useSuper ? '    super().__init__(brand)' : '    # 未呼叫 super().__init__'}
    self.alt = alt

${
  overrideMove
    ? `def move(self):
    return f"無人機 {self.brand} 爬升至 {self.alt}m"`
    : `# 未覆寫 move()，自動沿用 Vehicle.move`
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Polymorphism Execution & MRO Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-display text-base font-semibold text-slate-900">
                多型迴圈模擬與方法解析順序（MRO）
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                把不同子類別的物件放進同一個串列，呼叫相同的{' '}
                <code className="font-mono text-xs text-slate-800">v.move()</code>{' '}
                介面，觀察 Python 如何依照 MRO 尋找對應方法。
              </p>

              <pre className="mt-3 rounded-lg bg-slate-900 p-3.5 font-mono text-xs leading-6 text-sky-200 overflow-x-auto">
                <code>{`fleet = [
    ElectricCar("Tesla", 88),
    CargoDrone("Wing-X", 50)
]
for v in fleet:
    print(v.move())`}</code>
              </pre>

              {fleetResults ? (
                <div className="mt-4 space-y-3">
                  {fleetResults.map((res) => (
                    <div
                      key={res.varName}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono text-slate-500">
                        <span>
                          {res.varName} ({res.className})
                        </span>
                        <span>MRO: {res.mro}</span>
                      </div>
                      <div className="mt-1.5 font-mono text-sm font-semibold text-slate-900">
                        {res.output}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  點擊右上角「執行多型測試」，觀察{' '}
                  <code className="font-mono">super()</code> 與方法覆寫的實際輸出結果。
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600">
              <div className="font-display font-semibold text-slate-900">
                什麼是 MRO（Method Resolution Order）？
              </div>
              <p className="mt-1.5">
                當你呼叫 <code className="font-mono text-xs text-slate-800">ev.move()</code>{' '}
                時，Python 會先檢查 <code className="font-mono text-xs text-slate-800">ElectricCar</code>{' '}
                自己有沒有定義 <code className="font-mono text-xs text-slate-800">move</code>；若沒有，才順著繼承鏈往上找{' '}
                <code className="font-mono text-xs text-slate-800">Vehicle</code>，最後到最頂層的{' '}
                <code className="font-mono text-xs text-slate-800">object</code>。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
