"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Trash2, Plus, Calendar as CalendarIcon, Users, Image as ImageIcon, 
  Award, LayoutDashboard, LogOut, Newspaper, BarChart3, Download, Upload, 
  RotateCcw, Edit3, Check, X, Shield, Sparkles, ExternalLink, FileText, CheckCircle2
} from "lucide-react";
import { 
  DataStore, EventItem, TeamMemberItem, LegacyHeadItem, SubTeamItem, 
  CoreValueItem, NewsIssueItem, GalleryItem, ClubStats 
} from "@/lib/dataStore";
import { cn } from "@/lib/utils";

type ActiveTab = "dashboard" | "events" | "team" | "about" | "legacy" | "news" | "gallery" | "stats";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [notification, setNotification] = useState<string | null>(null);

  // Dynamic CMS States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [legacyHeads, setLegacyHeads] = useState<LegacyHeadItem[]>([]);
  const [subTeams, setSubTeams] = useState<SubTeamItem[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValueItem[]>([]);
  const [newsIssues, setNewsIssues] = useState<NewsIssueItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<ClubStats>({
    eventsHosted: "50+",
    activeMembers: "1k+",
    liveProjects: "10+",
    placementRate: "100%"
  });

  // Modal / Form States
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aboutSubTab, setAboutSubTab] = useState<"subteams" | "corevalues">("subteams");

  // Item Specific Form States
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({});
  const [teamForm, setTeamForm] = useState<Partial<TeamMemberItem> & { skillsText?: string }>({});
  const [legacyForm, setLegacyForm] = useState<Partial<LegacyHeadItem>>({});
  const [subTeamForm, setSubTeamForm] = useState<Partial<SubTeamItem> & { pointsText?: string }>({});
  const [coreValueForm, setCoreValueForm] = useState<Partial<CoreValueItem> & { pointsText?: string }>({});
  const [newsForm, setNewsForm] = useState<Partial<NewsIssueItem> & { topicsText?: string }>({});
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({});
  
  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Load from DataStore
  const reloadData = () => {
    setEvents(DataStore.getEvents());
    setTeam(DataStore.getTeam());
    setLegacyHeads(DataStore.getLegacyHeads());
    setSubTeams(DataStore.getSubTeams());
    setCoreValues(DataStore.getCoreValues());
    setNewsIssues(DataStore.getNewsIssues());
    setGallery(DataStore.getGallery());
    setStats(DataStore.getStats());
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = DataStore.getAdminPassword();
    if (password === storedPwd) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Invalid master password.");
      setPassword("");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    DataStore.saveAdminPassword(newPassword.trim());
    setNewPassword("");
    setShowPasswordChange(false);
    showToast("Password updated successfully!");
  };

  // --- EXPORT & IMPORT BACKUP --- //
  const handleExportBackup = () => {
    const backup = DataStore.exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csi_srmcem_decoders_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup exported successfully!");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (DataStore.importBackup(parsed)) {
          reloadData();
          showToast("Data backup restored successfully!");
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset all data to official defaults? This will erase custom additions.")) {
      DataStore.resetToDefaults();
      reloadData();
      showToast("Reset to official defaults complete!");
    }
  };

  // --- EVENTS CRUD --- //
  const openEventModal = (item?: EventItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setEventForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setEventForm({
        title: "",
        date: "",
        time: "",
        location: "SRMCEM Campus",
        category: "upcoming",
        color: "sky",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
        description: "",
        registrationUrl: "https://forms.google.com"
      });
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;
    let updated: EventItem[];
    if (modalMode === "edit" && editingId) {
      updated = events.map(ev => ev.id === editingId ? { ...ev, ...eventForm } as EventItem : ev);
    } else {
      const newItem: EventItem = {
        id: `evt-${Date.now()}`,
        title: eventForm.title || "Untitled Event",
        date: eventForm.date || "TBD",
        time: eventForm.time || "TBD",
        location: eventForm.location || "SRMCEM",
        category: (eventForm.category as any) || "upcoming",
        color: (eventForm.color as any) || "sky",
        image: eventForm.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
        description: eventForm.description || "",
        registrationUrl: eventForm.registrationUrl || ""
      };
      updated = [newItem, ...events];
    }
    setEvents(updated);
    DataStore.saveEvents(updated);
    setModalMode(null);
    showToast("Event saved successfully!");
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    DataStore.saveEvents(updated);
    showToast("Event deleted.");
  };

  // --- TEAM CRUD --- //
  const openTeamModal = (item?: TeamMemberItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setTeamForm({
        ...item,
        skillsText: item.skills.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setTeamForm({
        name: "",
        position: "CORE COMMITTEE MEMBER",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        bio: "",
        skillsText: "Development, Problem Solving",
        socials: { linkedin: "https://linkedin.com", github: "https://github.com", email: "" }
      });
    }
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.position) return;
    const skillsArray = (teamForm.skillsText || "")
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    let updated: TeamMemberItem[];
    if (modalMode === "edit" && editingId) {
      updated = team.map(m => m.id === editingId ? {
        ...m,
        ...teamForm,
        skills: skillsArray,
        socials: teamForm.socials || {}
      } as TeamMemberItem : m);
    } else {
      const newItem: TeamMemberItem = {
        id: `team-${Date.now()}`,
        name: teamForm.name || "",
        position: teamForm.position || "CORE COMMITTEE MEMBER",
        image: teamForm.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        bio: teamForm.bio || "",
        skills: skillsArray,
        socials: teamForm.socials || {}
      };
      updated = [...team, newItem];
    }
    setTeam(updated);
    DataStore.saveTeam(updated);
    setModalMode(null);
    showToast("Team member saved successfully!");
  };

  const handleDeleteTeam = (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    DataStore.saveTeam(updated);
    showToast("Team member removed.");
  };

  // --- LEGACY OF LEADERSHIP (HALL OF FAME) CRUD --- //
  const openLegacyModal = (item?: LegacyHeadItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setLegacyForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setLegacyForm({
        name: "",
        role: "President (2022-2023)",
        tenure: "2022-2023",
        placedAt: "Google",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "",
        highlight: "SDE @ Google • National Hackathons"
      });
    }
  };

  const handleSaveLegacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legacyForm.name || !legacyForm.bio) return;
    let updated: LegacyHeadItem[];
    if (modalMode === "edit" && editingId) {
      updated = legacyHeads.map(l => l.id === editingId ? { ...l, ...legacyForm } as LegacyHeadItem : l);
    } else {
      const newItem: LegacyHeadItem = {
        id: `legacy-${Date.now()}`,
        name: legacyForm.name || "",
        role: legacyForm.role || "Former Head",
        tenure: legacyForm.tenure || "Leadership & Guidance",
        placedAt: legacyForm.placedAt || "Top Tier Placement",
        image: legacyForm.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        bio: legacyForm.bio || "",
        highlight: legacyForm.highlight || "Mentorship & Leadership"
      };
      updated = [...legacyHeads, newItem];
    }
    setLegacyHeads(updated);
    DataStore.saveLegacyHeads(updated);
    setModalMode(null);
    showToast("Legacy Leader saved successfully!");
  };

  const handleDeleteLegacy = (id: string) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    const updated = legacyHeads.filter(l => l.id !== id);
    setLegacyHeads(updated);
    DataStore.saveLegacyHeads(updated);
    showToast("Legacy leader removed.");
  };

  // --- SUB-TEAMS (ECOSYSTEM) CRUD --- //
  const openSubTeamModal = (item?: SubTeamItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setSubTeamForm({
        ...item,
        pointsText: item.points.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setSubTeamForm({
        title: "",
        category: "Core Engineering",
        color: "sky",
        frontDesc: "",
        backDesc: "",
        pointsText: "Next.js & Cloud, AI Model Pipelines, Open Source Repositories"
      });
    }
  };

  const handleSaveSubTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTeamForm.title || !subTeamForm.frontDesc) return;
    const pointsArray = (subTeamForm.pointsText || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let updated: SubTeamItem[];
    if (modalMode === "edit" && editingId) {
      updated = subTeams.map(s => s.id === editingId ? {
        ...s,
        ...subTeamForm,
        points: pointsArray
      } as SubTeamItem : s);
    } else {
      const newItem: SubTeamItem = {
        id: `subteam-${Date.now()}`,
        title: subTeamForm.title || "New Sub-Team",
        category: subTeamForm.category || "Domain Wing",
        color: (subTeamForm.color as any) || "sky",
        frontDesc: subTeamForm.frontDesc || "",
        backDesc: subTeamForm.backDesc || subTeamForm.frontDesc || "",
        points: pointsArray.length > 0 ? pointsArray : ["Core Focus 1", "Core Focus 2", "Core Focus 3"]
      };
      updated = [...subTeams, newItem];
    }
    setSubTeams(updated);
    DataStore.saveSubTeams(updated);
    setModalMode(null);
    showToast("Sub-Team domain saved successfully!");
  };

  const handleDeleteSubTeam = (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-team?")) return;
    const updated = subTeams.filter(s => s.id !== id);
    setSubTeams(updated);
    DataStore.saveSubTeams(updated);
    showToast("Sub-team removed.");
  };

  // --- CORE VALUES CRUD --- //
  const openCoreValueModal = (item?: CoreValueItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setCoreValueForm({
        ...item,
        pointsText: item.points.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setCoreValueForm({
        title: "",
        category: "Guiding Principle",
        color: "sky",
        frontDesc: "",
        backDesc: "",
        pointsText: "Problem Solving, Real-World Mastery, Mentorship"
      });
    }
  };

  const handleSaveCoreValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreValueForm.title || !coreValueForm.frontDesc) return;
    const pointsArray = (coreValueForm.pointsText || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let updated: CoreValueItem[];
    if (modalMode === "edit" && editingId) {
      updated = coreValues.map(c => c.id === editingId ? {
        ...c,
        ...coreValueForm,
        points: pointsArray
      } as CoreValueItem : c);
    } else {
      const newItem: CoreValueItem = {
        id: `core-${Date.now()}`,
        title: coreValueForm.title || "New Value Pillar",
        category: coreValueForm.category || "Guiding Pillar",
        color: (coreValueForm.color as any) || "sky",
        frontDesc: coreValueForm.frontDesc || "",
        backDesc: coreValueForm.backDesc || coreValueForm.frontDesc || "",
        points: pointsArray.length > 0 ? pointsArray : ["Principle 1", "Principle 2", "Principle 3"]
      };
      updated = [...coreValues, newItem];
    }
    setCoreValues(updated);
    DataStore.saveCoreValues(updated);
    setModalMode(null);
    showToast("Core Value pillar saved successfully!");
  };

  const handleDeleteCoreValue = (id: string) => {
    if (!confirm("Are you sure you want to delete this core value pillar?")) return;
    const updated = coreValues.filter(c => c.id !== id);
    setCoreValues(updated);
    DataStore.saveCoreValues(updated);
    showToast("Core value pillar removed.");
  };

  // --- NEWS & MONTHLY GAZETTE CRUD --- //
  const openNewsModal = (item?: NewsIssueItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setNewsForm({
        ...item,
        topicsText: item.topics.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setNewsForm({
        volume: `Vol. 0${newsIssues.length + 1}`,
        month: "November",
        year: "2024",
        title: "CSI_SRMCEM X D'CODERS Monthly Gazette",
        description: "",
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=1000",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileSize: "5.0 MB",
        pageCount: 16,
        topicsText: "Hackathon, AI, DSA, Workshops",
        isCurrent: false
      });
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.pdfUrl) return;
    const topicsArray = (newsForm.topicsText || "")
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    let updated: NewsIssueItem[];
    if (modalMode === "edit" && editingId) {
      updated = newsIssues.map(n => {
        if (n.id === editingId) {
          return {
            ...n,
            ...newsForm,
            topics: topicsArray
          } as NewsIssueItem;
        }
        // If this one is marked current, unmark others
        if (newsForm.isCurrent) {
          return { ...n, isCurrent: false };
        }
        return n;
      });
    } else {
      const newItem: NewsIssueItem = {
        id: `news-${Date.now()}`,
        volume: newsForm.volume || "Vol. 01",
        month: newsForm.month || "Current",
        year: newsForm.year || "2024",
        title: newsForm.title || "Monthly Gazette",
        description: newsForm.description || "",
        coverImage: newsForm.coverImage || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=1000",
        pdfUrl: newsForm.pdfUrl || "",
        fileSize: newsForm.fileSize || "4.5 MB",
        pageCount: Number(newsForm.pageCount) || 12,
        topics: topicsArray,
        isCurrent: Boolean(newsForm.isCurrent)
      };

      if (newItem.isCurrent) {
        updated = [newItem, ...newsIssues.map(n => ({ ...n, isCurrent: false }))];
      } else {
        updated = [newItem, ...newsIssues];
      }
    }
    setNewsIssues(updated);
    DataStore.saveNewsIssues(updated);
    setModalMode(null);
    showToast("News Gazette edition saved!");
  };

  const handleSetCurrentNews = (id: string) => {
    const updated = newsIssues.map(n => ({
      ...n,
      isCurrent: n.id === id
    }));
    setNewsIssues(updated);
    DataStore.saveNewsIssues(updated);
    showToast("Current live edition updated!");
  };

  const handleDeleteNews = (id: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    const updated = newsIssues.filter(n => n.id !== id);
    setNewsIssues(updated);
    DataStore.saveNewsIssues(updated);
    showToast("News edition removed.");
  };

  // --- GALLERY CRUD --- //
  const openGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setGalleryForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setGalleryForm({
        title: "",
        detail: "",
        image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800&h=800",
        size: "small"
      });
    }
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.image) return;
    let updated: GalleryItem[];
    if (modalMode === "edit" && editingId) {
      updated = gallery.map(g => g.id === editingId ? { ...g, ...galleryForm } as GalleryItem : g);
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: galleryForm.title || "",
        detail: galleryForm.detail || "",
        image: galleryForm.image || "",
        size: (galleryForm.size as any) || "small"
      };
      updated = [newItem, ...gallery];
    }
    setGallery(updated);
    DataStore.saveGallery(updated);
    setModalMode(null);
    showToast("Gallery moment saved!");
  };

  const handleDeleteGallery = (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    DataStore.saveGallery(updated);
    showToast("Gallery item removed.");
  };

  // --- STATS UPDATE --- //
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveStats(stats);
    showToast("Homepage metrics saved successfully!");
  };

  // --- LOGIN VIEW --- //
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 blur-[160px] rounded-full -z-10" />
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-10 rounded-3xl w-full max-w-md shadow-2xl relative">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Admin Portal</h2>
          <p className="text-slate-400 text-sm text-center mb-8">
            CSI_SRMCEM X D&apos;CODERS Content Management
          </p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Master Password</label>
              <input 
                type="password" 
                placeholder="Enter master password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm font-mono"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
            >
              Sign In to CMS
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Helper Sidebar Tab button
  const SidebarTab = ({ id, label, icon: Icon, count }: { id: ActiveTab; label: string; icon: any; count?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setModalMode(null); }}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm text-left group",
        activeTab === id 
          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-bold" 
          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-sky-400")} />
        <span>{label}</span>
      </div>
      {typeof count === "number" && (
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full font-mono font-bold",
          activeTab === id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
        )}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Floating Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-sky-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================================================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 bg-slate-900/60 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl h-fit">
          <div className="mb-4 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block mb-1">
              Admin CMS Portal
            </span>
            <h2 className="text-xl font-extrabold text-white">
              CSI_SRMCEM X D&apos;CODERS
            </h2>
          </div>
          
          <div className="space-y-1">
            <SidebarTab id="dashboard" label="Overview" icon={LayoutDashboard} />
            <SidebarTab id="events" label="Events & Workshops" icon={CalendarIcon} count={events.length} />
            <SidebarTab id="team" label="Team Members" icon={Users} count={team.length} />
            <SidebarTab id="about" label="About & Ecosystem" icon={Sparkles} count={subTeams.length + coreValues.length} />
            <SidebarTab id="legacy" label="Hall of Fame & Alumni" icon={Award} count={legacyHeads.length} />
            <SidebarTab id="news" label="News & PDF Gazette" icon={Newspaper} count={newsIssues.length} />
            <SidebarTab id="gallery" label="Gallery Moments" icon={ImageIcon} count={gallery.length} />
            <SidebarTab id="stats" label="Homepage Stats" icon={BarChart3} />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-sky-300 hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }} 
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Change Password Dialog */}
          {showPasswordChange && (
            <form onSubmit={handleChangePassword} className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                required
              />
              <button type="submit" className="w-full py-1.5 bg-sky-500 text-white rounded-lg text-xs font-bold">
                Update
              </button>
            </form>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl min-h-[650px] relative">
          
          {/* 1. OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">System Status: Active</span>
                <h1 className="text-3xl font-extrabold text-white mt-1">Dashboard Overview</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage all live content for CSI_SRMCEM X D&apos;CODERS. Changes save immediately to the live site.
                </p>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab("events")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-sky-400 mb-1">{events.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Total Events</div>
                </div>
                <div onClick={() => setActiveTab("team")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-blue-400 mb-1">{team.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Team Members</div>
                </div>
                <div onClick={() => { setActiveTab("about"); setAboutSubTab("subteams"); }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-purple-400 mb-1">{subTeams.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Sub-Teams</div>
                </div>
                <div onClick={() => { setActiveTab("about"); setAboutSubTab("corevalues"); }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-cyan-400 mb-1">{coreValues.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Core Values</div>
                </div>
                <div onClick={() => setActiveTab("legacy")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-indigo-400 mb-1">{legacyHeads.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Hall of Fame</div>
                </div>
                <div onClick={() => setActiveTab("news")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-sky-400 mb-1">{newsIssues.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">News Editions</div>
                </div>
                <div onClick={() => setActiveTab("gallery")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-pink-400 mb-1">{gallery.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Gallery Photos</div>
                </div>
                <div onClick={() => setActiveTab("stats")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{stats.placementRate}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Placement Record</div>
                </div>
              </div>

              {/* Backup & System Tools */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <span>Data Backup, Export &amp; Reset</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Export complete website data to a JSON file to create a backup, or restore data from a previous file.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import JSON Backup</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>

                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all ml-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENTS MANAGER */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Events &amp; Workshops Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Add, edit, or delete flagship hackathons, bootcamps, and workshops.</p>
                </div>
                <button
                  onClick={() => openEventModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={ev.image} alt={ev.title} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border",
                            ev.category === "upcoming" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" :
                            ev.category === "current" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse" :
                            "bg-slate-800 text-slate-400 border-slate-700"
                          )}>
                            {ev.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{ev.date} • {ev.time}</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{ev.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{ev.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openEventModal(ev)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TEAM MEMBERS MANAGER */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Team Members Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage Executive Board and Core Committee members.</p>
                </div>
                <button
                  onClick={() => openTeamModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={member.image} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">{member.position}</span>
                        <h4 className="text-base font-bold text-white">{member.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{member.bio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => openTeamModal(member)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTeam(member.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ABOUT & ECOSYSTEM MANAGER (SUB-TEAMS & CORE VALUES) */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">About &amp; Ecosystem Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage the 5 Sub-Teams domain wings and 4 Foundational Core Values.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
                    <button
                      onClick={() => setAboutSubTab("subteams")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        aboutSubTab === "subteams" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Sub-Teams ({subTeams.length})
                    </button>
                    <button
                      onClick={() => setAboutSubTab("corevalues")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        aboutSubTab === "corevalues" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Core Values ({coreValues.length})
                    </button>
                  </div>
                  <button
                    onClick={() => aboutSubTab === "subteams" ? openSubTeamModal() : openCoreValueModal()}
                    className="flex items-center gap-2 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add {aboutSubTab === "subteams" ? "Sub-Team" : "Value"}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Teams Sub-Tab */}
              {aboutSubTab === "subteams" && (
                <div className="space-y-4">
                  {subTeams.map((st) => (
                    <div key={st.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {st.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Theme: {st.color}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{st.title}</h4>
                        <p className="text-slate-300 text-xs leading-relaxed mb-2">{st.frontDesc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {st.points.map((pt, idx) => (
                            <span key={idx} className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => openSubTeamModal(st)} className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-xl transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSubTeam(st.id)} className="p-2.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Core Values Sub-Tab */}
              {aboutSubTab === "corevalues" && (
                <div className="space-y-4">
                  {coreValues.map((cv) => (
                    <div key={cv.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {cv.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Theme: {cv.color}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{cv.title}</h4>
                        <p className="text-slate-300 text-xs leading-relaxed mb-2">{cv.frontDesc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cv.points.map((pt, idx) => (
                            <span key={idx} className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => openCoreValueModal(cv)} className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-xl transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCoreValue(cv.id)} className="p-2.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. LEGACY OF LEADERSHIP & HALL OF FAME MANAGER */}
          {activeTab === "legacy" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Hall of Fame &amp; Alumni Leaders</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage alumni leaders, placements (Google, Microsoft, etc.), and tenures.</p>
                </div>
                <button
                  onClick={() => openLegacyModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hall of Fame Leader</span>
                </button>
              </div>

              <div className="space-y-4">
                {legacyHeads.map((leader) => (
                  <div key={leader.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 max-w-2xl">
                      {leader.image && (
                        <img src={leader.image} alt={leader.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {leader.role}
                          </span>
                          {leader.placedAt && (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Placed @ {leader.placedAt}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">• {leader.tenure}</span>
                        </div>
                        <h4 className="text-lg font-extrabold text-white mb-1">{leader.name}</h4>
                        <p className="text-slate-300 text-xs leading-relaxed mb-2">{leader.bio}</p>
                        <span className="text-[11px] font-mono text-sky-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                          {leader.highlight}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openLegacyModal(leader)} className="p-2.5 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-xl transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLegacy(leader.id)} className="p-2.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. NEWS & MONTHLY PDF GAZETTE MANAGER */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">News &amp; Monthly Gazette Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage monthly publications, in-browser PDF reader edition, and archives.</p>
                </div>
                <button
                  onClick={() => openNewsModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Issue</span>
                </button>
              </div>

              <div className="space-y-4">
                {newsIssues.map((issue) => (
                  <div key={issue.id} className={cn(
                    "p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                    issue.isCurrent ? "bg-sky-950/20 border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.15)]" : "bg-slate-900/80 border-slate-800"
                  )}>
                    <div className="flex items-start gap-4">
                      <img src={issue.coverImage} alt={issue.title} className="w-16 h-20 rounded-xl object-cover border border-slate-700 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {issue.isCurrent && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-sky-500 text-white flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              Active Live Edition
                            </span>
                          )}
                          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                            {issue.month} {issue.year} // {issue.volume}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">• {issue.fileSize} • {issue.pageCount} Pages</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{issue.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{issue.description}</p>
                        <a href={issue.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline flex items-center gap-1 mt-1 font-mono">
                          <FileText className="w-3.5 h-3.5" /> View PDF Link
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!issue.isCurrent && (
                        <button
                          onClick={() => handleSetCurrentNews(issue.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300 text-xs font-bold rounded-lg transition-colors"
                        >
                          Set as Live Issue
                        </button>
                      )}
                      <button onClick={() => openNewsModal(issue)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteNews(issue.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. GALLERY MANAGER */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Gallery Moments Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage event photo highlights and display grids.</p>
                </div>
                <button
                  onClick={() => openGalleryModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 relative group overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                    <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                      Grid Layout: {item.size}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.detail}</p>
                    <div className="flex items-center justify-end gap-1 mt-3">
                      <button onClick={() => openGalleryModal(item)} className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteGallery(item.id)} className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. HOMEPAGE STATS MANAGER */}
          {activeTab === "stats" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Homepage Metrics &amp; Key Stats</h2>
                <p className="text-xs text-slate-400 mt-0.5">Customize the key stats displayed across the homepage.</p>
              </div>

              <form onSubmit={handleSaveStats} className="space-y-5 bg-slate-950/60 p-6 rounded-3xl border border-slate-800">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Events Hosted Counter</label>
                  <input
                    type="text"
                    value={stats.eventsHosted}
                    onChange={(e) => setStats({ ...stats, eventsHosted: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Active Members Counter</label>
                  <input
                    type="text"
                    value={stats.activeMembers}
                    onChange={(e) => setStats({ ...stats, activeMembers: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Live Projects Counter</label>
                  <input
                    type="text"
                    value={stats.liveProjects}
                    onChange={(e) => setStats({ ...stats, liveProjects: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Placement Record Percentage</label>
                  <input
                    type="text"
                    value={stats.placementRate}
                    onChange={(e) => setStats({ ...stats, placementRate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-md"
                >
                  Save Metrics Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIVERSAL MODAL POPUP FOR ADD / EDIT */}
      {/* ========================================================================= */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setModalMode(null)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {modalMode === "add" ? "Add New" : "Edit"} {
                activeTab === "events" ? "Event" :
                activeTab === "team" ? "Team Member" :
                activeTab === "about" ? (aboutSubTab === "subteams" ? "Sub-Team Domain Wing" : "Core Value Pillar") :
                activeTab === "legacy" ? "Hall of Fame Leader" :
                activeTab === "news" ? "News Gazette Edition" : "Gallery Photo"
              }
            </h3>

            {/* ABOUT SUB-TEAM FORM */}
            {activeTab === "about" && aboutSubTab === "subteams" && (
              <form onSubmit={handleSaveSubTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Sub-Team Title</label>
                  <input type="text" required placeholder="e.g. Technical Team" value={subTeamForm.title || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Domain Category</label>
                    <input type="text" placeholder="e.g. Core Engineering" value={subTeamForm.category || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Accent Theme</label>
                    <select value={subTeamForm.color || "sky"} onChange={(e) => setSubTeamForm({ ...subTeamForm, color: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="sky">Sky Blue</option>
                      <option value="purple">Purple</option>
                      <option value="blue">Royal Blue</option>
                      <option value="cyan">Electric Cyan</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Front Short Description</label>
                  <input type="text" required placeholder="Short summary displayed on front of card" value={subTeamForm.frontDesc || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, frontDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Back Full Description</label>
                  <textarea rows={3} placeholder="Detailed role description on flip back" value={subTeamForm.backDesc || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, backDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Key Focus Points (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Next.js & Cloud, AI Pipelines, Open Source" value={subTeamForm.pointsText || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, pointsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl text-sm">Save Sub-Team</button>
              </form>
            )}

            {/* ABOUT CORE VALUE FORM */}
            {activeTab === "about" && aboutSubTab === "corevalues" && (
              <form onSubmit={handleSaveCoreValue} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Title</label>
                  <input type="text" required placeholder="e.g. Hackathons & Tech Talks" value={coreValueForm.title || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Category</label>
                    <input type="text" placeholder="e.g. Innovation & Build" value={coreValueForm.category || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Accent Theme</label>
                    <select value={coreValueForm.color || "sky"} onChange={(e) => setCoreValueForm({ ...coreValueForm, color: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="sky">Sky Blue</option>
                      <option value="blue">Royal Blue</option>
                      <option value="cyan">Electric Cyan</option>
                      <option value="indigo">Indigo</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Front Short Description</label>
                  <input type="text" required placeholder="Short summary displayed on front of card" value={coreValueForm.frontDesc || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, frontDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Back Full Description</label>
                  <textarea rows={3} placeholder="Detailed principle description on flip back" value={coreValueForm.backDesc || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, backDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Deliverables (Comma-separated)</label>
                  <input type="text" placeholder="e.g. 24-48h Sprints, Industry Speakers, Tech Workshops" value={coreValueForm.pointsText || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, pointsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl text-sm">Save Core Value</button>
              </form>
            )}

            {/* LEGACY LEADER FORM */}
            {activeTab === "legacy" && (
              <form onSubmit={handleSaveLegacy} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Leader Name</label>
                  <input type="text" placeholder="e.g. Rahul Sharma" required value={legacyForm.name || ""} onChange={(e) => setLegacyForm({ ...legacyForm, name: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Role Title</label>
                    <input type="text" placeholder="e.g. President (2022-2023)" value={legacyForm.role || ""} onChange={(e) => setLegacyForm({ ...legacyForm, role: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Placed At Company</label>
                    <input type="text" placeholder="e.g. Google, Microsoft, Amazon" value={legacyForm.placedAt || ""} onChange={(e) => setLegacyForm({ ...legacyForm, placedAt: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Tenure Period</label>
                    <input type="text" placeholder="e.g. 2022-2023" value={legacyForm.tenure || ""} onChange={(e) => setLegacyForm({ ...legacyForm, tenure: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Photo URL</label>
                    <input type="text" placeholder="e.g. /images/... or https://..." value={legacyForm.image || ""} onChange={(e) => setLegacyForm({ ...legacyForm, image: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Highlight Badge Tag</label>
                  <input type="text" placeholder="e.g. SDE @ Google • 10+ Hackathons" value={legacyForm.highlight || ""} onChange={(e) => setLegacyForm({ ...legacyForm, highlight: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Contribution Story / Bio</label>
                  <textarea rows={3} required value={legacyForm.bio || ""} onChange={(e) => setLegacyForm({ ...legacyForm, bio: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl text-sm">Save Hall of Fame Leader</button>
              </form>
            )}

            {/* NEWS & GAZETTE FORM */}
            {activeTab === "news" && (
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Gazette Title</label>
                  <input type="text" required value={newsForm.title || ""} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Volume</label>
                    <input type="text" placeholder="e.g. Vol. 08" value={newsForm.volume || ""} onChange={(e) => setNewsForm({ ...newsForm, volume: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Month</label>
                    <input type="text" placeholder="e.g. October" value={newsForm.month || ""} onChange={(e) => setNewsForm({ ...newsForm, month: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Year</label>
                    <input type="text" placeholder="e.g. 2024" value={newsForm.year || ""} onChange={(e) => setNewsForm({ ...newsForm, year: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Direct PDF URL / Local Document Path</label>
                  <input type="text" required placeholder="e.g. /documents/gazette.pdf or https://example.com/gazette.pdf" value={newsForm.pdfUrl || ""} onChange={(e) => setNewsForm({ ...newsForm, pdfUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Cover Thumbnail URL</label>
                  <input type="text" placeholder="e.g. /images/... or https://..." value={newsForm.coverImage || ""} onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">File Size</label>
                    <input type="text" placeholder="e.g. 5.4 MB" value={newsForm.fileSize || ""} onChange={(e) => setNewsForm({ ...newsForm, fileSize: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Page Count</label>
                    <input type="number" placeholder="16" value={newsForm.pageCount || 16} onChange={(e) => setNewsForm({ ...newsForm, pageCount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Topics (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Hackathon, AI, Web3, DSA" value={newsForm.topicsText || ""} onChange={(e) => setNewsForm({ ...newsForm, topicsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Summary / Highlights</label>
                  <textarea rows={2} value={newsForm.description || ""} onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isCurrent" checked={Boolean(newsForm.isCurrent)} onChange={(e) => setNewsForm({ ...newsForm, isCurrent: e.target.checked })} className="rounded text-sky-500 focus:ring-sky-500" />
                  <label htmlFor="isCurrent" className="text-xs text-white font-medium">Set as Current Active Live Edition (Embedded in browser reader)</label>
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl text-sm">Save Gazette Edition</button>
              </form>
            )}

            {/* GALLERY FORM */}
            {activeTab === "gallery" && (
              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Photo Title</label>
                  <input type="text" required value={galleryForm.title || ""} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Image URL</label>
                  <input type="text" required placeholder="e.g. /images/... or https://..." value={galleryForm.image || ""} onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Grid Layout Span</label>
                  <select value={galleryForm.size || "small"} onChange={(e) => setGalleryForm({ ...galleryForm, size: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                    <option value="small">Standard (1x1)</option>
                    <option value="large">Large Highlight (2x2)</option>
                    <option value="wide">Wide Banner (2x1)</option>
                    <option value="tall">Tall Portrait (1x2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Caption Details</label>
                  <textarea rows={2} value={galleryForm.detail || ""} onChange={(e) => setGalleryForm({ ...galleryForm, detail: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 text-white font-bold rounded-xl text-sm">Save Photo</button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
