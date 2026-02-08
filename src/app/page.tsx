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

// ✨ [NEW] 여행의 핵심 하이라이트 정의 (여기서 수정하세요!)
const highlights = [
  { icon: "✈️", title: "설레는 출발", desc: "인천공항 -> 푸꾸옥 도착" },
  { icon: "🏨", title: "쉐라톤 입성", desc: "럭셔리 리조트 휴식 시작" },
  { icon: "🎡", title: "빈원더스 데이", desc: "놀이공원과 사파리 탐험" },
  { icon: "🌅", title: "선셋과 마무", desc: "아름다운 해변과 귀국" },
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

  // 스크롤 인터랙션 (기존과 동일)
  useEffect(() => {
    if (dates.length > 0 && !activeDay) setActiveDay(dates[0]);

    const handleScroll = () => {
      const navHeight = 120;
      for (const date of dates) {
        const element = document.getElementById(`date-${date}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 헤더 영역을 지나서 실제 일정이 화면 상단에 올 때 감지
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
      // 상단 헤더+메뉴 높이만큼 오프셋 계산
      const menuOffset = 160;
      const y = element.getBoundingClientRect().top + window.scrollY - menuOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-100 relative">

      {/* ✨ [NEW] 배경 이미지 레이어 (고정됨) */}
      <div className="fixed inset-0 z-[-1]">
        {/* 팁: public/images/bg-sheraton.jpg 파일을 넣으면 그 사진이 배경이 됩니다.
          지금은 임시로 온라인 이미지를 사용합니다.
        */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            // 여기에 여러분의 멋진 사진 경로를 넣으세요: url('/images/bg-sheraton.jpg')
            backgroundImage: `url('https://images.unsplash.com/photo-1582653291997-079a1c04c561?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />
        {/* 어두운 오버레이 (글씨 잘 보이게) */}
        <div className="absolute inset-0 bg-[#0a1120]/85 backdrop-blur-[2px]" />
      </div>


      {/* 1. 히어로 섹션 (제목 + 핵심 하이라이트) */}
      <header className="pt-24 pb-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#d4af37] tracking-[0.3em] text-sm font-medium mb-4 uppercase animate-fade-in-down">
            2026 Family Memorial Trip
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-12 font-bold leading-tight animate-fade-in-up">
            푸꾸옥 쉐라톤<br className="md:hidden" /> 롱비치 여행
          </h1>

          {/* ✨ [NEW] 핵심 하이라이트 오버뷰 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-gray-800/50 pt-10 animate-fade-in">
            {highlights.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#d4af37]/10 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform group-hover:bg-[#d4af37]/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  {item.icon}
                </div>
                <h3 className="text-white font-medium mb-1 text-base md:text-lg">{item.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 장식용 배경 요소 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      </header>


      {/* 2. 상단 고정 내비게이션 (Sticky Nav) */}
      <nav className="sticky top-0 z-50 bg-[#0a1120]/80 backdrop-blur-md border-b border-[#d4af37]/20 shadow-lg">
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
          {/* 수직선 (그라데이션 적용) */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />

          {dates.map((date, index) => (
            <div key={date} id={`date-${date}`} className="mb-32 relative pl-12 md:pl-24 scroll-mt-40">

              {/* 날짜 표시 (동그라미) */}
              <div className="absolute left-0 md:left-4 -translate-x-1/2 flex flex-col items-center">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0a1120] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-xs md:text-base shadow-[0_0_20px_rgba(212,175,55,0.3)] z-10">
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

              {/* 해당 날짜의 일정들 */}
              <div className="space-y-16">
                {groupedData[date].map((item: TripActivity, i: number) => (
                  <div key={i} className="relative group bg-[#111a2d]/40 p-6 rounded-2xl border border-gray-800/50 backdrop-blur-sm hover:border-[#d4af37]/30 transition-all duration-500 hover:bg-[#111a2d]/60 hover:shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
                    {/* 타임라인 작은 점 */}
                    <div className="absolute -left-[3.4rem] md:-left-[6.4rem] top-8 w-3 h-3 bg-gray-600 rounded-full border-2 border-[#0a1120] group-hover:bg-[#d4af37] group-hover:border-[#d4af37] group-hover:scale-150 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]" />

                    {/* 시간 및 제목 */}
                    <div className="mb-5">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#d4af37]/10 text-[#d4af37] mb-3 border border-[#d4af37]/20 shadow-sm">
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
                          <div key={imgIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-900/50 shadow-md group-hover:shadow-[#d4af37]/20 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                            <img
                              src={img}
                              alt={`Travel photo ${imgIdx}`}
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
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
      <footer className="text-center py-12 text-gray-500 text-sm border-t border-gray-800/50 mt-20 relative z-10 bg-[#0a1120]/80 backdrop-blur-md">
        <p className="mb-2">푸꾸옥 쉐라톤 롱비치 가족여행</p>
        <p className="opacity-70">Created with ❤️ by Dad • 2026</p>
      </footer>
    </div>
  );
}