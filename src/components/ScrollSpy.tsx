"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Palmtree } from "lucide-react";

interface SubItem {
    id: string;
    label: string;
}

interface ScrollSpyItem {
    id: string;
    label: string;
    subItems: SubItem[];
}

interface ScrollSpyProps {
    items: ScrollSpyItem[];
}

export default function ScrollSpy({ items }: ScrollSpyProps) {
    const [activeId, setActiveId] = useState<string>("");

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
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -70% 0px",
                threshold: 0
            }
        );

        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    return (
        <div className="hidden xl:flex fixed top-0 left-0 h-screen w-96 bg-sheraton-navy border-r border-sheraton-gold/20 z-[60] flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-10 border-b border-sheraton-gold/10">
                <div className="flex items-center gap-4 mb-3">
                    <Palmtree className="text-sheraton-gold w-10 h-10" />
                    <span className="font-playfair text-3xl font-bold tracking-[0.1em] text-sheraton-gold uppercase">Sheraton</span>
                </div>
                <p className="text-[11px] uppercase font-bold tracking-[0.4em] text-slate-400 opacity-60">
                    Phu Quoc • Digital Concierge
                </p>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                {items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <div key={item.id} className="flex flex-col gap-2">
                            <button
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group ${isActive ? "bg-sheraton-gold/15 border border-sheraton-gold/40 shadow-[0_0_20px_rgba(196,166,97,0.1)]" : "hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                <span className={`font-playfair text-xl md:text-2xl tracking-wide transition-all ${isActive ? "text-sheraton-gold font-bold translate-x-1" : "text-white/70"
                                    }`}>
                                    {item.label}
                                </span>
                                <ChevronRight className={`w-5 h-5 transition-all ${isActive ? "text-sheraton-gold translate-x-1 opacity-100" : "opacity-0 -translate-x-2"
                                    }`} />
                            </button>

                            {/* Sub-items (Accordion) */}
                            <div className={`transition-all duration-700 ease-in-out overflow-hidden flex flex-col pl-6 gap-2 ${isActive ? "max-h-[500px] opacity-100 my-3" : "max-h-0 opacity-0"
                                }`}>
                                {item.subItems.map((sub, sIdx) => (
                                    <button
                                        key={sIdx}
                                        onClick={() => scrollToSection(sub.id)}
                                        className="flex items-start gap-4 py-3 px-5 rounded-xl hover:bg-sheraton-gold/10 text-left group/sub transition-all"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-sheraton-gold/40 mt-2.5 group-hover/sub:bg-sheraton-gold transition-colors flex-shrink-0" />
                                        <span className="text-base md:text-lg font-medium text-slate-300 group-hover/sub:text-white transition-colors leading-relaxed">
                                            {sub.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-10 border-t border-sheraton-gold/10 bg-sheraton-navy/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-px bg-sheraton-gold/40" />
                    <span className="text-[11px] uppercase font-bold tracking-[0.5em] text-sheraton-gold text-center opacity-80">
                        Memorial Record V.2026
                    </span>
                </div>
            </div>
        </div>
    );
}
