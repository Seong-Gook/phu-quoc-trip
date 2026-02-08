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

  // 날짜별로 데이터 그룹화
  const groupedData = tripData.reduce((acc: any, item: TripActivity) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(groupedData).sort();

  useEffect(() => {
    if (dates.length > 0) setActiveDay(dates[0]);

    // 스크롤 감지해서 현재 보고 있는 날짜 버튼 활성화
    const handleScroll = () => {
      for (const date of dates) {
        const element = document.getElementById(`date-${date}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveDay(date);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dates]);

  const scrollToDate = (date: string) => {
    setActiveDay(date);
    const element = document.getElementById(`date-${date}`);
    if (element) {
      // 상단 메뉴바 높이(약 80px)만큼 덜 스크롤해야 제목이 안 가려짐
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-gray-100 font-sans">

      {/* 1. 헤더 (제목 수정 완료) */}
      <header className="pt-12 pb-8 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 font-bold">
          푸꾸옥 쉐라톤 롱비치 여행
        </h1>
        <p className="text-[#d4af37] tracking-[0.3em] text-xs md:text-sm uppercase">
          Family Trip • Memorial 2026
        </p>
      </header>

      {/* 2. 상단 고정 내비게이션 (Sticky Nav) */}
      <nav className="sticky top-0 z-50 bg-[#0a1120]/90 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex justify-center space-x-2 md:space-x-4 py-3">
            {dates.map((date, index) => (
              <button
                key={date}
                onClick={() => scrollToDate(date)}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 font-medium ${activeDay === date
                    ? 'bg-[#d4af37] text-[#0a1120] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                Day {index + 1}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. 메인 타임라인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="relative">
          {/* 수직선 */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gray-800 via-[#d4af37]/30 to-gray-800" />

          {dates.map((date, index) => (
            <div key={date} id={`date-${date}`} className="mb-24 relative pl-12 md:pl-20">

              {/* 날짜 표시 (동그라미) */}
              <div className="absolute left-0 md:left-4 -translate-x-1/2 flex flex-col items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0a1120] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-xs md:text-sm shadow-lg z-10">
                  {index + 1}
                </div>
              </div>

              {/* 날짜 제목 */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-white font-bold">
                  Day {index + 1}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{date}</p>
              </div>

              {/* 해당 날짜의 일정들 */}
              <div className="space-y-12">
                {groupedData[date].map((item: TripActivity, i: number) => (
                  <div key={i} className="relative group">
                    {/* 타임라인 작은 점 */}
                    <div className="absolute -left-[3.4rem] md:-left-[5.4rem] top-2 w-2 h-2 bg-gray-500 rounded-full group-hover:bg-[#d4af37] group-hover:scale-150 transition-all duration-300" />

                    {/* 시간 및 제목 */}
                    <div className="mb-4">
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#d4af37]/10 text-[#d4af37] mb-2 border border-[#d4af37]/20">
                        {item.start} - {item.end}
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-[#d4af37] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* 사진 갤러리 */}
                    {item.images && item.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {item.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-[#d4af37]/10 transition-all">
                            <img
                              src={img}
                              alt={`Travel photo ${imgIdx}`}
                              className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
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

      {/* 푸터 */}
      <footer className="text-center py-10 text-gray-600 text-xs border-t border-gray-900 mt-20">
        <p>Created by Dad with ❤️</p>
      </footer>
    </div>
  );
}