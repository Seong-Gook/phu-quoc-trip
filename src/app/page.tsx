"use client";

import React, { useState, useEffect } from 'react';
import tripData from '../../data/trip_data.json';

// --- 데이터 타입 정의 ---
interface TripActivity {
  date: string;
  start: string;
  end: string;
  title: string;
  images: string[];
}

export default function Home() {
  const [activeDay, setActiveDay] = useState<string>("");

  // 날짜별로 데이터 그룹화 (Day 1, Day 2...)
  const groupedData = tripData.reduce((acc: any, item: TripActivity) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(groupedData).sort();

  useEffect(() => {
    if (dates.length > 0) setActiveDay(dates[0]);
  }, []);

  const scrollToDate = (date: string) => {
    setActiveDay(date);
    const element = document.getElementById(`date-${date}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a1120] text-gray-100 font-sans">
      {/* [사이드바 수정]
        - hidden: 기본적으로 숨김 (모바일)
        - lg:block: 큰 화면(PC/태블릿)에서는 보임
        - 데스크톱 모드로 보면 lg 조건이 충족되어 보일 것입니다.
      */}
      <aside className="hidden lg:block w-80 fixed h-full bg-[#0d1626] border-r border-gray-800 p-6 overflow-y-auto z-10">
        <h1 className="text-2xl font-bold text-[#d4af37] mb-2 tracking-widest">SHERATON</h1>
        <p className="text-xs text-gray-500 mb-10 tracking-[0.2em]">PHU QUOC • MEMORIAL</p>

        <nav className="space-y-6">
          {dates.map((date, index) => (
            <div key={date}>
              <button
                onClick={() => scrollToDate(date)}
                className={`text-lg font-serif mb-3 block transition-colors ${activeDay === date ? 'text-[#d4af37]' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Day {index + 1} <span className="text-sm text-gray-600 ml-2">({date.slice(5)})</span>
              </button>

              {/* 사이드바 세부 일정 (현재 보고 있는 날짜만 펼치기) */}
              {activeDay === date && (
                <ul className="border-l border-gray-800 ml-3 pl-4 space-y-3">
                  {groupedData[date].map((item: TripActivity, i: number) => (
                    <li key={i} className="text-sm text-gray-400 hover:text-gray-200">
                      • {item.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 lg:ml-80 p-4 md:p-10">
        <header className="mb-20 text-center lg:text-left mt-10 lg:mt-0">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">The Journey</h2>
          <p className="text-[#d4af37] tracking-widest text-sm">FAMILY TRIP 2026</p>
        </header>

        <div className="max-w-4xl mx-auto relative">
          {/* 타임라인 수직선 */}
          <div className="absolute left-4 md:left-9 top-0 bottom-0 w-px bg-gray-800" />

          {dates.map((date, index) => (
            <div key={date} id={`date-${date}`} className="mb-24 relative">
              {/* 날짜 헤더 */}
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-[#0d1626] border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold z-10 text-xs md:text-lg">
                  {index + 1}
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl md:text-3xl font-serif text-white">Day {index + 1}</h3>
                  <p className="text-[#d4af37] text-sm tracking-wider">{date}</p>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="space-y-12 pl-12 md:pl-24">
                {groupedData[date].map((item: TripActivity, i: number) => (
                  <div key={i} className="relative group">
                    {/* 타임라인 점 */}
                    <div className="absolute -left-[3.2rem] md:-left-[6.2rem] top-2 w-3 h-3 bg-gray-600 rounded-full border-2 border-[#0a1120] group-hover:bg-[#d4af37] transition-colors" />

                    {/* 텍스트 내용 (여기가 안 나오던 부분 수정!) */}
                    <div className="mb-4">
                      <div className="flex items-center text-[#d4af37] text-sm font-medium mb-1">
                        <span className="mr-2">🕒</span>
                        {item.start} - {item.end}
                      </div>
                      <h4 className="text-xl md:text-2xl font-medium text-white">
                        {item.title || "이동 및 휴식"} {/* 제목이 없으면 기본 텍스트 출력 */}
                      </h4>
                    </div>

                    {/* 사진 갤러리 (모바일 최적화 적용) */}
                    {item.images && item.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {item.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-800">
                            <img
                              src={img}
                              alt={`${item.title} photo ${imgIdx}`}
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}