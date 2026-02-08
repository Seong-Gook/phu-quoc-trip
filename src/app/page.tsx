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

// ✨ [수정됨] 5일간의 여정 요약 (여기 내용을 수정하면 화면에 반영됩니다!)
const journeySummary = [
  { day: "Day 1", title: "설레는 출발", desc: "인천 ✈️ 푸꾸옥" },
  { day: "Day 2", title: "리조트 힐링", desc: "수영 & 호캉스" },
  { day: "Day 3", title: "빈원더스", desc: "놀이공원 & 사파리" },
  { day: "Day 4", title: "남부 투어", desc: "선셋 타운 & 해변" },
  { day: "Day 5", title: "컴백 홈", desc: "푸꾸옥 ✈️ 인천" },
];

export default function Home() {
  const [activeDay, setActiveDay] = useState<string>("");

  // 날짜별 데이터 그룹화
  const groupedData = tripData.reduce((acc: any, item: TripActivity) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(groupedData).sort();

  // 스크롤 인터랙션
  useEffect(() => {
    if (dates.length > 0 && !activeDay) setActiveDay(dates[0]);

    const handleScroll = () => {
      const navHeight = 120;
      for (const date of dates) {
        const element = document.getElementById(`date-${date}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= navHeight && rect.top <= navHeight + 400) {
            setActiveDay(date);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dates, activeDay]);

  const scrollToDate = (date: string) => {
    setActiveDay(date);
    const element = document.getElementById(`date-${date}`);
    if (element) {
      const menuOffset = 160;
      const y = element.getBoundingClientRect().top + window.scrollY - menuOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-100 relative selection:bg-[#d4af37] selection:text-black">

      {/* ✨ [수정됨] 배경 이미지 (bg-sheraton.jpg 사용) */}
      <div className="fixed inset-0 z-[-1]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            // 꾹꾹이님이 넣으신 파일을 바라보도록 수정했습니다!
            backgroundImage: `url('/images/bg-sheraton.jpg')`
          }}
        />
        {/* 사진이 너무 밝을까봐 어둡게 눌러주는 막 (투명도 70%) */}
        <div className="absolute inset-0 bg-[#0a1120]/70 backdrop-blur-[2px]" />
      </div>

      {/* 1. 히어로 섹션 (제목 + 여정 흐름도) */}
      <header className="pt-24 pb-16 px-4 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[#d4af37] tracking-[0.3em] text-xs md:text-sm font-bold mb-4 uppercase animate-fade-in-down">
            2026 Family Memorial Trip
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-12 font-bold leading-tight animate-fade-in-up drop-shadow-2xl">
            푸꾸옥 쉐라톤<br className="md:hidden" /> 롱비치 여행
          </h1>

          {/* ✨ [NEW] 5일간의 여정 흐름도 (화살표 연결) */}
          <div className="mt-16 relative">
            {/* 데스크톱용 가로 연결선 */}
            <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent -z-10"></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
              {journeySummary.map((item, index) => (
                <div key={index} className="relative flex flex-col items-center group w-full md:w-auto">

                  {/* 모바일용 세로 연결선 (마지막 아이템 제외) */}
                  {index < journeySummary.length - 1 && (
                    <div className="md:hidden absolute top-12 bottom-[-2rem] w-0.5 bg-[#d4af37]/30"></div>
                  )}

                  {/* 날짜 원형 뱃지 */}
                  <button
                    onClick={() => dates[index] && scrollToDate(dates[index])}
                    className="w-12 h-12 rounded-full bg-[#0a1120] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:bg-[#d4af37] group-hover:text-black transition-all duration-300 z-10 cursor-pointer"
                  >
                    {index + 1}
                  </button>

                  {/* 텍스트 정보 */}
                  <div className="mt-4 text-center bg-[#0a1120]/60 p-3 rounded-lg backdrop-blur-sm border border-gray-700/50 w-40 hover:border-[#d4af37]/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>

                  {/* 데스크톱용 화살표 (오른쪽) */}
                  {index < journeySummary.length - 1 && (
                    <div className="hidden md:block absolute top-5 -right-[50%] transform translate-x-1/2 text-[#d4af37]/50 text-xl">
                      ➤
                    </div>
                  )}
                  {/* 모바일용 화살표 (아래쪽) */}
                  {index < journeySummary.length - 1 && (
                    <div className="md:hidden absolute -bottom-6 text-[#d4af37]/50 text-xl rotate-90 z-10">
                      ➤
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>


      {/* 2. 상단 고정 내비게이션 */}
      <nav className="sticky top-0 z-50 bg-[#0a1120]/85 backdrop-blur-md border-b border-[#d4af37]/20 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-start md:justify-center space-x-2 md:space-x-4 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide mask-image-edges">
            {dates.map((date, index) => (
              <button
                key={date}
                onClick={() => scrollToDate(date)}
                className={`px-5 py-2.5 rounded-full text-sm md:text-base transition-all duration-300 font-medium flex-shrink-0 ${activeDay === date
                    ? 'bg-[#d4af37] text-[#0a1120] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105'
                    : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                  }`}
              >
                Day {index + 1}
              </button>
            ))}
          </div>
        </div>
      </nav>


      {/* 3. 메인 타임라인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-20">
        <div className="relative">
          {/* 수직선 */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />

          {dates.map((date, index) => (
            <div key={date} id={`date-${date}`} className="mb-32 relative pl-12 md:pl-24 scroll-mt-40">

              {/* 날짜 표시 */}
              <div className="absolute left-0 md:left-4 -translate-x-1/2 flex flex-col items-center">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0a1120] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-xs md:text-base shadow-[0_0_20px_rgba(212,175,55,0.3)] z-10 bg-cover" style={{ backgroundImage: "url('/images/bg-sheraton.jpg')", backgroundBlendMode: "multiply", backgroundColor: "#000" }}>
                  {index + 1}
                </div>
              </div>

              {/* 날짜 제목 */}
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-serif text-white font-bold flex flex-col md:flex-row md:items-end md:gap-4">
                  <span>Day {index + 1}</span>
                  <span className="text-[#d4af37] text-base md:text-lg font-sans font-normal tracking-wider opacity-80 md:mb-1">{date}</span>
                </h2>
              </div>

              {/* 일정 리스트 */}
              <div className="space-y-16">
                {groupedData[date].map((item: TripActivity, i: number) => (
                  <div key={i} className="relative group bg-[#111a2d]/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md hover:border-[#d4af37]/50 transition-all duration-500 hover:bg-[#162032]/80 shadow-lg">

                    {/* 타임라인 점 */}
                    <div className="absolute -left-[3.4rem] md:-left-[6.4rem] top-8 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#0a1120] group-hover:bg-[#d4af37] group-hover:border-[#d4af37] group-hover:scale-150 transition-all duration-300" />

                    {/* 시간 및 제목 */}
                    <div className="mb-5">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#d4af37]/10 text-[#d4af37] mb-3 border border-[#d4af37]/20">
                        ⏰ {item.start} - {item.end}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* 사진 갤러리 */}
                    {item.images && item.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        {item.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-900 shadow-inner group-hover:shadow-[#d4af37]/10 transition-all duration-500">
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
      <footer className="text-center py-12 text-gray-500 text-sm border-t border-gray-800/50 mt-20 relative z-10 bg-[#0a1120]/90">
        <p className="mb-2">푸꾸옥 쉐라톤 롱비치 가족여행</p>
        <p className="opacity-70">Created with ❤️ by Dad • 2026</p>
      </footer>
    </div>
  );
}