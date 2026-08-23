"use client";

import { useEffect, useState } from "react";
import { TeamCard, TeamMember } from "@/components/ui/TeamCard";
import { motion, type Variants } from "framer-motion";
import { Sparkles, Award, Compass, HeartHandshake } from "lucide-react";
import { useTheme } from "@/lib/themeContext";
import { cn } from "@/lib/utils";
import { DataStore, TeamMemberItem, LegacyHeadItem } from "@/lib/dataStore";

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamMemberItem[]>([]);
  const [legacyHeads, setLegacyHeads] = useState<LegacyHeadItem[]>([]);
  const { config } = useTheme();

  const loadData = () => {
    setTeamData(DataStore.getTeam());
    setLegacyHeads(DataStore.getLegacyHeads());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("csi_data_updated", loadData);
    return () => window.removeEventListener("csi_data_updated", loadData);
  }, []);

  // Split team by hierarchy
  const founders = teamData.filter(m => 
    m.position.toUpperCase().includes("CEO") || 
    m.position.toUpperCase().includes("COO") || 
    m.position.toUpperCase().includes("FOUNDER") ||
    m.position.toUpperCase().includes("PRESIDENT")
  );
  const core = teamData.filter(m => 
    !m.position.toUpperCase().includes("CEO") && 
    !m.position.toUpperCase().includes("COO") && 
    !m.position.toUpperCase().includes("FOUNDER") &&
    !m.position.toUpperCase().includes("PRESIDENT")
  );

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      {/* Ambient Background Glows */}
      <div className={cn("absolute top-0 left-0 w-full h-[500px] blur-[150px] pointer-events-none -z-10", config.glowClass1)} />
      <div className={cn("absolute top-1/3 right-0 w-[500px] h-[500px] blur-[150px] pointer-events-none -z-10", config.glowClass2)} />

      {/* Hero Section */}
      <section className="pt-32 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto text-center mb-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 inline-block mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            The Builders &amp; Innovators
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-sky-300 mb-6 drop-shadow-lg">
            Meet Our Team
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto rounded-full mb-6" />
          <p className="max-w-2xl mx-auto text-lg text-slate-300 font-light leading-relaxed">
            A collective of passionate engineers, designers, and innovators driving technological excellence at CSI_SRMCEM X D&apos;CODERS.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Founders Spotlight */}
        {founders.length > 0 && (
          <div className="mb-32">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200 mb-16 tracking-wide"
            >
              Executive Leadership
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-12 items-center">
              {founders.map((member, i) => (
                <motion.div 
                  key={member.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                  className="w-full max-w-[350px] transform hover:-translate-y-4 transition-transform duration-500"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur-2xl opacity-20 -z-10" />
                    <TeamCard member={member as any} className="w-full h-[450px]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Core Members Grid */}
        {core.length > 0 && (
          <div className="mb-32">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200 mb-16 tracking-wide"
            >
              Core Committee
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
              {core.map((member, i) => (
                <motion.div
                  key={member.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                  className="w-full max-w-[320px]"
                >
                  <TeamCard member={member as any} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* --- THE LEGACY OF LEADERSHIP SECTION --- */}
        {/* ========================================================================= */}
        <section className="pt-16 border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Honoring Our Roots
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              The Legacy of <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", config.gradientText)}>Leadership</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4 font-light">
              Every successful student organization is built not only by its present team, but also by the leaders who shaped its journey before them.
            </p>
            <p className="text-slate-400 text-base leading-relaxed">
              At <strong className="text-sky-300 font-semibold">CSI SRMCEM</strong>, the legacy of the club has been strengthened by the dedication, vision, and leadership of its former heads.
            </p>
          </div>

          {/* Former Heads Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {legacyHeads.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="p-8 md:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 backdrop-blur-xl shadow-2xl relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-sky-500/20 transition-colors" />
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
                      {index % 2 === 0 ? <Award className="w-6 h-6" /> : <HeartHandshake className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-400">
                        {leader.role} • {leader.tenure}
                      </span>
                      <h3 className="text-2xl font-extrabold text-white">{leader.name}</h3>
                    </div>
                  </div>
                  <p className="text-slate-300 text-base leading-relaxed font-light">
                    {leader.bio}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>{leader.highlight}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continuing the Journey Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto relative p-1 rounded-3xl bg-gradient-to-r from-sky-500/40 via-blue-500/40 to-indigo-600/40 shadow-[0_0_50px_rgba(56,189,248,0.2)]"
          >
            <div className="bg-slate-950/90 backdrop-blur-2xl rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden">
              <div className="max-w-3xl mx-auto">
                <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/30 mb-4 inline-block shadow-sm">
                  Continuing the Journey
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                  Building the Future on Strong Foundations
                </h3>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 font-light">
                  Their contributions remain a part of the story of <strong className="text-white font-medium">CSI SRMCEM</strong>. The current team continues to build upon the foundation created by the leaders who came before them, while working toward creating more opportunities for <strong className="text-sky-300 font-medium">technical learning, innovation, collaboration, and professional growth</strong>.
                </p>
                <div className="pt-6 border-t border-slate-800/80">
                  <p className="text-lg md:text-xl font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-blue-300">
                    &ldquo;Their leadership may belong to the past, but their legacy continues to inspire the future of CSI SRMCEM.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
