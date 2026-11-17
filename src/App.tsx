/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConceptComparison } from './components/ConceptComparison';
import { HeroSection } from './components/HeroSection';
import { InheritanceExplorer } from './components/InheritanceExplorer';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { Navbar } from './components/Navbar';
import { QuizSection } from './components/QuizSection';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <ConceptComparison />
        <InteractiveSandbox />
        <InheritanceExplorer />
        <QuizSection />
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>Python 物件實驗室 · 互動式類別與物件教學平台</span>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#concepts" className="hover:text-slate-900 transition-colors">
              核心概念
            </a>
            <a href="#sandbox" className="hover:text-slate-900 transition-colors">
              互動實作場
            </a>
            <a href="#inheritance" className="hover:text-slate-900 transition-colors">
              繼承與多型
            </a>
            <a href="#quiz" className="hover:text-slate-900 transition-colors">
              隨堂測驗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
