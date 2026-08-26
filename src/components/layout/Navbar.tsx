"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useTheme } from "@/lib/themeContext";
import { DataStore, EventItem } from "@/lib/dataStore";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "News", href: "/news" },
];

const categoryStyle: Record<string, string> = {
  upcoming: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  current: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  past: "bg-slate-800 text-slate-400 border-slate-700",
};
const categoryLabel: Record<string, string> = {
  upcoming: "✦ Upcoming",
  current: "● Live Now",
  past: "Past Event",
};
const hoverBorder: Record<string, string> = {
  upcoming: "hover:border-sky-500/50",
  current: "hover:border-emerald-500/50",
  past: "hover:border-slate-600",
};
const hoverGlow: Record<string, string> = {
  upcoming: "bg-sky-500/10",
  current: "bg-emerald-500/10",
  past: "bg-slate-700/10",
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { config } = useTheme();

  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const loadFeatured = async () => {
    const [allEvents, featuredIds] = await Promise.all([
      DataStore.getEvents(),
      DataStore.getFeaturedEventIds(),
    ]);
    const featured = featuredIds
      .map(id => allEvents.find(e => e.id === id))
      .filter(Boolean) as EventItem[];
    setFeaturedEvents(featured);
  };

  useEffect(() => {
    loadFeatured();
    window.addEventListener("csi_data_updated", loadFeatured);
    return () => window.removeEventListener("csi_data_updated", loadFeatured);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isOpen || !!selectedEvent) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, selectedEvent]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 w-full z-[110] px-4 sm:px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">

        {/* Top Left: 3 Logos (CSI - SRMCEM - D'CODERS) with no text */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 z-50 group">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-sky-500/20 blur-sm group-hover:bg-sky-500/40 transition-colors" />
            <img src="/csi-logo.png" alt="CSI Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full relative drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] bg-slate-950/40 p-0.5 border border-white/10 group-hover:border-sky-400/50 transition-all" />
          </div>
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-blue-500/20 blur-sm group-hover:bg-blue-500/40 transition-colors" />
            <img src="/srmcem-logo.png" alt="SRMCEM Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full relative drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] bg-slate-950/40 p-0.5 border border-white/10 group-hover:border-blue-400/50 transition-all" />
          </div>
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-cyan-500/20 blur-sm group-hover:bg-cyan-500/40 transition-colors" />
            <img src="/decoders-logo.png" alt="D'CODERS Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full relative drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] bg-slate-950/40 p-0.5 border border-white/10 group-hover:border-cyan-400/50 transition-all" />
          </div>
        </Link>

        {/* Top Middle: CSI_SRMCEM X D'CODERS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 hidden lg:block pointer-events-none">
          <h1 className={cn("text-lg md:text-xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text drop-shadow-lg bg-gradient-to-r whitespace-nowrap", config.gradientText)}>
            CSI_SRMCEM X D&apos;CODERS
          </h1>
        </div>

        {/* Top Right: Theme Switcher + Hamburger Menu */}
        <div className="flex items-center gap-3 z-50">
          <ThemeSwitcher />
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="w-11 h-11 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-sky-500/40 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Fancy Animated Full-Width Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%", transition: { delay: 0.2, duration: 0.4 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl overflow-y-auto overflow-x-hidden pt-24 sm:pt-28 pb-12 px-4 sm:px-6 flex flex-col justify-start md:justify-center items-center min-h-screen"
          >
            {/* Decorative Background Elements */}
            <div className={cn("absolute top-1/4 left-1/4 w-96 h-96 blur-[150px] rounded-full pointer-events-none", config.glowClass1)} />
            <div className={cn("absolute bottom-1/4 right-1/4 w-96 h-96 blur-[150px] rounded-full pointer-events-none", config.glowClass2)} />

            <div className="w-full max-w-4xl mx-auto my-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">

              {/* Left Side: Large Nav Links */}
              <div className="flex flex-col space-y-1.5 sm:space-y-3">
                {links.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5"
                      >
                        <span className={cn(
                          "text-2xl sm:text-3xl md:text-5xl font-black tracking-tight transition-all duration-300",
                          isActive ? cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText) : "text-slate-400 group-hover:text-white"
                        )}>
                          {link.name}
                        </span>
                        <ChevronRight className={cn(
                          "w-5 h-5 sm:w-7 sm:h-7 transition-all duration-300 opacity-0 -translate-x-4",
                          isActive ? "opacity-100 translate-x-0 text-sky-400" : "group-hover:opacity-100 group-hover:translate-x-0 text-slate-300"
                        )} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Side: Featured Highlights — dynamic from DataStore */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden md:flex flex-col justify-center space-y-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-lg">Featured Highlights</span>
                  <Link href="/events" onClick={() => setIsOpen(false)}
                    className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-mono">
                    All Events →
                  </Link>
                </div>

                {featuredEvents.length === 0 ? (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center">
                    <p className="text-slate-500 text-sm">No featured events set.</p>
                    <p className="text-slate-600 text-xs mt-1">Configure in Admin → Featured</p>
                  </div>
                ) : (
                  featuredEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => { setIsOpen(false); setSelectedEvent(event); }}
                      className={cn(
                        "bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer transition-all duration-300 text-left w-full",
                        hoverBorder[event.category] ?? "hover:border-sky-500/50"
                      )}
                    >
                      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", hoverGlow[event.category])} />
                      <span className={cn("px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block border", categoryStyle[event.category])}>
                        {categoryLabel[event.category]}
                      </span>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-1 relative z-10">{event.title}</h3>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2 relative z-10">{event.description}</p>
                      <span className="text-xs font-semibold text-sky-400 group-hover:text-sky-300 transition-colors relative z-10">
                        View Event Details →
                      </span>
                    </button>
                  ))
                )}
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Event Detail Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-md"
            />
            <motion.div
              key="nav-modal"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[171] w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-t-[32px] sm:rounded-[28px] shadow-[0_0_80px_rgba(56,189,248,0.15)]"
            >
              <button onClick={() => setSelectedEvent(null)} aria-label="Close"
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700">
                <X className="w-5 h-5" />
              </button>

              {/* Banner */}
              <div className="relative h-52 sm:h-64 w-full overflow-hidden rounded-t-[32px] sm:rounded-t-[28px]">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={cn("px-3 py-1 text-xs font-mono font-bold rounded-full uppercase tracking-wider border backdrop-blur-md", categoryStyle[selectedEvent.category])}>
                    {categoryLabel[selectedEvent.category]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 sm:p-9">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-5 tracking-tight leading-tight">
                  {selectedEvent.title}
                </h2>

                <div className="flex flex-wrap gap-3 mb-7">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                    <Calendar className="w-4 h-4 text-sky-400 shrink-0" />{selectedEvent.date}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                    <Clock className="w-4 h-4 text-sky-400 shrink-0" />{selectedEvent.time}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />{selectedEvent.location}
                  </div>
                </div>

                <div className="h-px bg-slate-800 mb-7" />

                <div className="mb-8">
                  <p className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">About this Event</p>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {selectedEvent.description || "No description provided."}
                  </p>
                </div>

                {selectedEvent.category !== "past" ? (
                  selectedEvent.registrationUrl ? (
                    <a href={selectedEvent.registrationUrl} target="_blank" rel="noopener noreferrer"
                      className="block w-full text-center py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all hover:scale-[1.02]">
                      Register Now →
                    </a>
                  ) : (
                    <div className="w-full text-center py-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 font-bold text-sm">
                      Registration link coming soon
                    </div>
                  )
                ) : (
                  <div className="w-full text-center py-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 font-bold text-sm">
                    Registration Closed
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

