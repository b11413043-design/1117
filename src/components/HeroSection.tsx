import React, { useState } from 'react';
import { ArrowRight, Box, Layers } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="top"
      className="border-b border-slate-200 bg-white pt-10 pb-14 lg:pt-14 lg:pb-16"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-sm font-medium text-sky-700">
                Python 物件導向基礎 · 互動式視覺化教材
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-[1.15] [text-wrap:balance]">
                從一張設計藍圖，誕生無數個獨立運作的物件
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                在 Python 中，「類別（Class）」定義了資料結構與行為規範，而「物件（Object）」則是依據這張藍圖在記憶體中建立出來的真實個體。透過下方的即時記憶體模擬器，親自觀察{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-800">
                  __init__
                </code>
                、
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-800">
                  self
                </code>{' '}
                與繼承的運作方式。
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#sandbox"
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                >
                  進入互動實作場
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#concepts"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  拆解類別語法結構
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Layers className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  <span>Class（類別）＝ 設計藍圖</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  只佔用一份定義空間，規範物件應該具備哪些「屬性資料」與「方法功能」，本身還不是具體實體。
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Box className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Object（物件）＝ 實體個體</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  每次實例化都在記憶體取得獨立位址（如{' '}
                  <code className="font-mono text-xs text-slate-800">0x7F8A10</code>
                  ），保有各自互不干擾的狀態。
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_blueprint_to_object_1794895253426.jpg"
                  alt="工程藍圖化為兩台獨立無人機實體的技術插畫，象徵 Python 類別與物件實例化的關係"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full min-h-[280px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-50 p-8 text-center">
                  <Layers className="h-12 w-12 text-sky-600" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-semibold text-slate-800">
                    class Blueprint → Object Instances
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    單一類別藍圖可實例化出多個獨立記憶體物件
                  </p>
                </div>
              )}
              <div className="border-t border-slate-200 bg-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>圖解：右側兩台無人機共享左側同一份結構藍圖，但各自擁有獨立機身與電量狀態</span>
                <span className="font-mono text-slate-500">d1 is not d2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
