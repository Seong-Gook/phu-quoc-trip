"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  ChevronRight,
  Palmtree,
  Compass,
  Navigation,
  X
} from "lucide-react";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("@/../components/Map"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-xl border border-sheraton-gold/20" />
});

// Sidebar Import
const ScrollSpy = dynamic(() => import("@/components/ScrollSpy"), { ssr: false });

interface TripItem {
  date: string;
  start_time: string;
  end_time: string;
  activity: string;
  images: string[];
}

export default function Home() {
  const [tripData, setTripData] = useState<TripItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Helper to enhance text (Resort -> Sheraton Resort)
  const enhanceText = (text: string) => {
    // 🛡️ [방어막 추가] 텍스트가 없으면 그냥 빈칸 반환 (에러 방지)
    if (!text) return "";

    if (text.includes("쉐라톤") || text.includes("Sheraton")) {
      return text.replace(/리조트/g, "리조트");
    }
    return text.replace(/리조트/g, "푸꾸옥 쉐라톤 롱비치 리조트");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        setTripData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load trip data:", err);
        setLoading(false);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Group data by date
  const groupedData = tripData.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, TripItem[]>);

  const dates = Object.keys(groupedData).sort();

  // HARDCODED SIDEBAR ITEMS
  const fixedSidebarItems = [
    {
      id: "day-1",
      label: "Day 1 (1/20)",
      subItems: [
        { id: "day-1-act-0", label: "공항버스로 인천공항 이동" },
        { id: "day-1-act-1", label: "인천공항 출국심사" },
        { id: "day-1-act-2", label: "푸꾸옥 출발" },
        { id: "day-1-act-3", label: "푸꾸옥 도착 출국심사" }
      ]
    },
    {
      id: "day-2",
      label: "Day 2 (1/21)",
      subItems: [
        { id: "day-2-act-0", label: "푸꾸옥 쉐라톤 조식" },
        { id: "day-2-act-1", label: "빈원더스 놀이공원" },
        { id: "day-2-act-2", label: "쉐라톤 롱비치 풀빌라/비치" },
        { id: "day-2-act-3", label: "그랜드월드" }
      ]
    },
    {
      id: "day-3",
      label: "Day 3 (1/22)",
      subItems: [
        { id: "day-3-act-0", label: "쉐라톤 롱비치 조식" },
        { id: "day-3-act-1", label: "혼똔섬 케이블카" },
        { id: "day-3-act-2", label: "혼똔섬 워터파크" },
        { id: "day-3-act-3", label: "선셋타운 석양감상" }
      ]
    },
    {
      id: "day-4",
      label: "Day 4 (1/23)",
      subItems: [
        { id: "day-4-act-0", label: "쉐라톤 롱비치 산책" },
        { id: "day-4-act-1", label: "생신파티" },
        { id: "day-4-act-2", label: "파라세일링 수영" },
        { id: "day-4-act-3", label: "마사지 및 킹콩마트" }
      ]
    },
    {
      id: "day-5",
      label: "Day 5 (1/24)",
      subItems: [
        { id: "day-5-act-0", label: "쉐라톤 롱비치 이용" },
        { id: "day-5-act-1", label: "호국사 관광" },
        { id: "day-5-act-2", label: "스파 이용" },
        { id: "day-5-act-3", label: "한국으로 출발" }
      ]
    }
  ];

  const daySummaries: Record<string, string> = {
    "2026-01-20": "✈️ 인천 출발 & 쉐라톤 체크인",
    "2026-01-21": "🎡 빈원더스 & 그랜드월드",
    "2026-01-22": "🚠 혼똔섬 케이블카 & 선셋타운",
    "2026-01-23": "🌴 리조트 힐링 & 킹콩마트",
    "2026-01-24": "🏯 호국사 & 굿바이 푸꾸옥",
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="min-h-screen selection:bg-sheraton-gold selection:text-sheraton-navy">
      {/* SIDEBAR */}
      <ScrollSpy items={fixedSidebarItems} />

      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 py-4 xl:pl-96 ${scrolled ? "bg-sheraton-navy/90 backdrop-blur-md border-b border-sheraton-gold/20 py-3" : "bg-transparent"
        }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Palmtree className="text-sheraton-gold w-5 h-5 md:w-6 md:h-6" />
            <span className="font-playfair text-lg md:text-xl font-bold tracking-widest text-sheraton-gold uppercase">Sheraton</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {dates.map((date, idx) => (
              <button
                key={date}
                onClick={() => scrollToSection(`day-${idx + 1}`)}
                className="text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] hover:text-sheraton-gold transition-colors font-medium whitespace-nowrap"
              >
                Day {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="xl:pl-96 transition-all duration-500">
        {/* Hero Section */}
        <section className="relative h-[100svh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=2070"
              alt="Sheraton Phu Quoc"
              className="w-full h-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-sheraton-navy/40 via-sheraton-navy/20 to-sheraton-navy" />
          </div>

          <div className="relative z-10 max-w-2xl w-full px-4">
            <div className="bg-sheraton-navy/70 backdrop-blur-2xl border border-white/10 p-6 md:p-12 rounded-[2rem] shadow-2xl transform transition-all duration-700">
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-8 md:w-12 h-px bg-sheraton-gold/50 self-center" />
                <Compass className="mx-3 md:mx-4 text-sheraton-gold w-6 h-6 md:w-8 md:h-8 animate-pulse" />
                <div className="w-8 md:w-12 h-px bg-sheraton-gold/50 self-center" />
              </div>

              <h1 className="font-playfair text-2xl md:text-5xl font-bold mb-6 md:mb-8 text-white text-center leading-tight">
                Sheraton <span className="hidden sm:inline">Phu Quoc</span><br />
                <span className="text-sheraton-gold">Mini Itinerary</span>
              </h1>

              <div className="space-y-0 text-left border-t border-b border-white/10">
                {dates.map((date, idx) => (
                  <button
                    key={date}
                    onClick={() => scrollToSection(`day-${idx + 1}`)}
                    className="w-full flex items-center gap-4 md:gap-6 py-3 md:py-4 px-2 md:px-4 hover:bg-sheraton-gold/10 transition-all group border-b border-white/5 last:border-0"
                  >
                    <div className="flex-shrink-0 text-amber-400 font-bold tracking-tighter text-xs md:text-sm uppercase font-sans">
                      Day {idx + 1}
                    </div>
                    <div className="flex-1 text-white font-bold text-xs md:text-base group-hover:text-sheraton-gold transition-colors line-clamp-1">
                      {enhanceText(daySummaries[date]) || "Special Moments"}
                    </div>
                    <ChevronRight className="w-4 h-4 text-sheraton-gold/40 group-hover:text-sheraton-gold group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>

              <p className="mt-6 md:mt-8 text-center text-slate-400 font-sans tracking-widest uppercase text-[9px] md:text-[10px] opacity-60">
                Phu Quoc Island • January 2026
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          {dates.map((date, dayIdx) => {
            const dayActivities = groupedData[date];

            return (
              <section key={date} id={`day-${dayIdx + 1}`} className="mb-24 md:mb-32 scroll-mt-24">
                <div className="flex flex-col items-center mb-12 md:mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                    Day <span className="text-sheraton-gold">{dayIdx + 1}</span>
                  </h2>
                  <div className="flex items-center gap-3 md:gap-4 text-slate-400 tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs font-semibold">
                    <Calendar className="w-4 h-4 text-sheraton-gold" />
                    {date}
                  </div>
                  <div className="w-16 md:w-24 h-1 bg-sheraton-gold/30 mt-4 md:mt-6 rounded-full" />
                </div>

                <div className="space-y-16 md:space-y-24 relative">
                  <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sheraton-gold/40 via-sheraton-gold/10 to-transparent transform md:-translate-x-1/2 hidden sm:block" />

                  {dayActivities.map((item, actIdx) => (
                    <div
                      key={actIdx}
                      id={`day-${dayIdx + 1}-act-${actIdx}`}
                      className={`relative flex flex-col md:flex-row gap-8 md:gap-12 items-start scroll-mt-24 ${actIdx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      <div className="absolute left-0 md:left-1/2 top-0 transform -translate-y-1/2 md:-translate-x-1/2 z-10 hidden sm:block">
                        <div className="w-3 md:w-4 h-3 md:h-4 bg-sheraton-navy border-2 border-sheraton-gold rounded-full shadow-[0_0_15px_rgba(196,166,97,0.5)]" />
                      </div>

                      <div className="flex-1 w-full group">
                        <div className="bg-slate-900/40 backdrop-blur-sm border border-white/5 p-6 md:p-8 rounded-2xl hover:border-sheraton-gold/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                          <div className="flex items-center gap-3 text-sheraton-gold mb-4 group-hover:translate-x-1 transition-transform">
                            <Clock className="w-3 md:w-4 h-3 md:h-4" />
                            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">
                              {item.start_time} - {item.end_time}
                            </span>
                          </div>

                          <h3 className="font-playfair text-xl md:text-3xl font-bold mb-6 text-white group-hover:text-sheraton-gold transition-colors duration-300">
                            {enhanceText(item.activity)}
                          </h3>

                          {item.images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
                              {item.images.slice(0, 10).map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="aspect-[4/3] relative overflow-hidden rounded-xl bg-slate-800 cursor-pointer group/img"
                                  onClick={() => setSelectedImage(img)}
                                >
                                  <img
                                    src={img}
                                    alt={item.activity}
                                    loading="lazy"
                                    className="object-cover w-full h-full transition-transform duration-1000 group-hover/img:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                      <ChevronRight className="w-5 h-5 text-white rotate-[-45deg] translate-x-0.5 translate-y-[-0.5px]" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {item.images.length > 10 && (
                                <div className="aspect-[4/3] flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl text-sheraton-gold italic">
                                  <Camera className="w-6 h-6 mb-2" />
                                  <span className="text-[10px] uppercase font-bold tracking-tighter">+{item.images.length - 10} More Photos</span>
                                </div>
                              )}
                            </div>
                          )}

                          {!item.images.length && (
                            <div className="mt-8 py-8 md:py-10 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl text-slate-500 italic">
                              <Camera className="w-4 md:w-5 h-4 md:h-5 mb-2 opacity-50" />
                              <span className="text-[10px] md:text-xs uppercase tracking-widest font-medium text-center px-4">Memorable moments without photos</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 hidden md:block" />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Map Section */}
          <section className="mt-32 md:mt-48 pt-24 md:pt-32 border-t border-sheraton-gold/20">
            <div className="flex flex-col items-center text-center mb-12 md:mb-16">
              <div className="bg-sheraton-gold/10 p-3 md:p-4 rounded-full mb-6">
                <Navigation className="text-sheraton-gold w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-4">Basecamp Location</h2>
              <p className="text-slate-400 text-sm md:text-base flex items-center gap-2 italic font-sans max-w-sm px-4 text-center">
                {enhanceText("Sheraton Phu Quoc Long Beach 리조트, Ganh Dau, Phu Quoc Island, Vietnam")}
              </p>
            </div>
            <div className="px-2 md:px-0">
              <Map />
            </div>
          </section>
        </div>

        <footer className="py-16 md:py-20 border-t border-white/5 text-center">
          <div className="flex justify-center gap-2 items-center mb-6">
            <Palmtree className="text-sheraton-gold/40 w-5 h-5" />
            <div className="w-6 md:w-8 h-px bg-sheraton-gold/20" />
            <Palmtree className="text-sheraton-gold/40 w-5 h-5" />
          </div>
          <p className="font-playfair text-sheraton-gold tracking-[0.3em] md:tracking-[0.5em] uppercase text-[10px] md:text-xs mb-2 px-6">Sheraton Phu Quoc Family Trip</p>
          <p className="text-slate-600 text-[9px] md:text-[10px] uppercase tracking-widest font-bold font-sans">© 2026 MEMORIAL RECORD</p>
        </footer>
      </div>

      {/* IMAGE LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[110]"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-8 h-8 text-white" />
          </button>
          <div
            className="relative max-w-7xl max-h-full w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500"
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite alternate ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: forwards;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-95 {
          animation-name: zoom-in;
        }
      `}</style>
    </main>
  );
}
