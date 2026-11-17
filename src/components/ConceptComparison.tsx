import React, { useState } from 'react';
import { ANATOMY_PARTS } from '../data/oopCurriculum';

const CODE_LINES = [
  { line: 1, text: 'class Student:', partId: 'class-kw' },
  { line: 2, text: '    school = "Python Academy"', partId: 'class-attr' },
  { line: 3, text: '', partId: null },
  { line: 4, text: '    def __init__(self, name, score):', partId: 'init-method' },
  { line: 5, text: '        self.name = name', partId: 'self-param' },
  { line: 6, text: '        self.score = score', partId: 'self-param' },
  { line: 7, text: '', partId: null },
  { line: 8, text: '    def add_bonus(self, pts):', partId: 'instance-method' },
  { line: 9, text: '        self.score += pts', partId: 'instance-method' },
  { line: 10, text: '        return f"{self.name}: {self.score}分"', partId: 'instance-method' },
  { line: 11, text: '', partId: null },
  { line: 12, text: 's1 = Student("小華", 88)', partId: 'instantiation' },
];

export const ConceptComparison: React.FC = () => {
  const [activePartId, setActivePartId] = useState<string>(ANATOMY_PARTS[0].id);

  const activePart =
    ANATOMY_PARTS.find((p) => p.id === activePartId) ?? ANATOMY_PARTS[0];

  return (
    <section id="concepts" className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            01. 互動語法解剖：看懂每一行類別定義
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            點選左側程式碼片段或右側語法卡片，立即查看每個關鍵字與結構在 Python 執行時期扮演的角色。
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 text-xs text-slate-400">
              <span className="font-mono">student_blueprint.py</span>
              <span>點擊程式碼行切換說明</span>
            </div>
            <div className="flex-1 p-5 font-mono text-sm leading-7 overflow-x-auto">
              {CODE_LINES.map((item) => {
                const isInteractive = item.partId !== null;
                const isActive = item.partId === activePartId;

                if (!item.text) {
                  return (
                    <div key={item.line} className="flex items-center gap-4 px-2 h-6">
                      <span className="w-5 select-none text-right text-xs text-slate-600">
                        {item.line}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.line}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => item.partId && setActivePartId(item.partId)}
                    className={`flex w-full items-center gap-4 rounded px-2 py-0.5 text-left transition-colors ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/50'
                        : isInteractive
                          ? 'hover:bg-slate-800/80 text-slate-200 cursor-pointer'
                          : 'text-slate-400'
                    }`}
                  >
                    <span className="w-5 shrink-0 select-none text-right text-xs text-slate-500">
                      {item.line}
                    </span>
                    <span className="whitespace-pre">{item.text}</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-800 bg-slate-950/60 px-5 py-3.5 text-xs text-slate-300">
              提示：縮排（4 個空白）決定了哪些屬性與方法屬於這個{' '}
              <code className="text-sky-300">class Student</code> 區塊。
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {ANATOMY_PARTS.map((part) => {
                const selected = part.id === activePartId;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setActivePartId(part.id)}
                    className={`flex flex-col items-start rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                      selected
                        ? 'border-sky-600 bg-white shadow-sm'
                        : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2 text-xs">
                      <span
                        className={`font-medium ${
                          selected ? 'text-sky-700' : 'text-slate-500'
                        }`}
                      >
                        第 {part.lineNumber} 行 · {part.role}
                      </span>
                    </div>
                    <div className="mt-1 font-display text-sm font-semibold text-slate-900">
                      {part.title}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {activePart.title}
                </h3>
                <span className="font-mono text-xs text-sky-700">
                  {activePart.role}
                </span>
              </div>
              <div className="mt-3 rounded-lg bg-slate-900 px-3.5 py-2 font-mono text-xs text-sky-200 overflow-x-auto">
                {activePart.token}
              </div>
              <p className="mt-3.5 text-sm leading-relaxed text-slate-600">
                {activePart.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
