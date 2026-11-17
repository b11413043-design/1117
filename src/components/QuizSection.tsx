import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/oopCurriculum';

export const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const question = QUIZ_QUESTIONS[currentIndex];
  const chosenIndex = selectedAnswers[question.id];
  const hasAnswered = chosenIndex !== undefined;
  const isCorrect = chosenIndex === question.correctIndex;

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = QUIZ_QUESTIONS.reduce(
    (acc, q) => (selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc),
    0
  );

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: idx }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
  };

  return (
    <section id="quiz" className="bg-white py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              04. 隨堂實戰測驗：檢驗你的類別觀念
            </h2>
            <p className="mt-2 text-base text-slate-600">
              透過 5 道常見的 Python 物件導向陷阱題，確認自己已經掌握{' '}
              <code className="font-mono text-sm text-slate-800">self</code>、屬性遮蔽與{' '}
              <code className="font-mono text-sm text-slate-800">super()</code>。
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 tabular-nums">
            <span>
              第 {currentIndex + 1} / {QUIZ_QUESTIONS.length} 題 · 已作答 {answeredCount} 題 · 答對{' '}
              <strong className="font-semibold text-slate-900">{correctCount}</strong> 題
            </span>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                重新作答
              </button>
            )}
          </div>
        </div>

        {/* Question navigation tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const active = idx === currentIndex;
            const ans = selectedAnswers[q.id];
            const solved = ans !== undefined;
            const right = ans === q.correctIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : solved
                      ? right
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-rose-200 bg-rose-50 text-rose-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                第 {idx + 1} 題 · {q.topic}
              </button>
            );
          })}
        </div>

        {/* Quiz Card */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start rounded-xl border border-slate-200 bg-slate-50/70 p-6">
          <div className="lg:col-span-6">
            <div className="text-xs font-semibold text-sky-700">
              測驗主題 · {question.topic}
            </div>
            <h3 className="mt-1.5 font-display text-lg font-semibold text-slate-900">
              {question.prompt}
            </h3>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs leading-6 text-slate-100">
              <code>{question.code}</code>
            </pre>
          </div>

          <div className="lg:col-span-6 space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = chosenIndex === idx;
              const isRightOpt = idx === question.correctIndex;

              let optStyle =
                'border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50/40';
              if (hasAnswered) {
                if (isRightOpt) {
                  optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                } else if (isSelected && !isRightOpt) {
                  optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                } else {
                  optStyle = 'border-slate-200 bg-white/60 text-slate-500';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3.5 text-left text-sm font-medium transition-colors ${optStyle}`}
                >
                  <span className="font-mono">{opt}</span>
                  {hasAnswered && isRightOpt && (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  )}
                  {hasAnswered && isSelected && !isRightOpt && (
                    <XCircle
                      className="h-4 w-4 shrink-0 text-rose-600"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}

            {hasAnswered && (
              <div
                className={`mt-4 rounded-xl border p-4 text-sm leading-relaxed ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <div className="font-semibold">
                  {isCorrect ? '✓ 回答正確！' : '✕ 再確認一下觀念：'}
                </div>
                <p className="mt-1 text-slate-700">{question.explanation}</p>
                {currentIndex < QUIZ_QUESTIONS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((i) => i + 1)}
                    className="mt-3 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    前往下一題
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
