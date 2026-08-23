"use client";

// ============================================================================
// DATA MODELS
// ============================================================================

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "upcoming" | "current" | "past";
  color: "sky" | "blue" | "cyan" | "indigo" | "purple" | "orange";
  image: string;
  description: string;
  registrationUrl?: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  skills: string[];
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface LegacyHeadItem {
  id: string;
  name: string;
  role: string;
  tenure: string;
  placedAt?: string;
  bio: string;
  highlight: string;
  image?: string;
}

export interface SubTeamItem {
  id: string;
  title: string;
  category: string;
  color: "sky" | "purple" | "blue" | "indigo" | "cyan";
  frontDesc: string;
  backDesc: string;
  points: string[];
}

export interface CoreValueItem {
  id: string;
  title: string;
  category: string;
  color: "sky" | "blue" | "cyan" | "indigo" | "purple";
  frontDesc: string;
  backDesc: string;
  points: string[];
}

export interface NewsIssueItem {
  id: string;
  volume: string;
  month: string;
  year: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  fileSize: string;
  pageCount: number;
  topics: string[];
  isCurrent?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  detail: string;
  image: string;
  size: "small" | "large" | "wide" | "tall";
}

export interface ClubStats {
  eventsHosted: string;
  activeMembers: string;
  liveProjects: string;
  placementRate: string;
}

export interface WebsiteDataBackup {
  version: string;
  exportedAt: string;
  events: EventItem[];
  team: TeamMemberItem[];
  legacyHeads: LegacyHeadItem[];
  subTeams?: SubTeamItem[];
  coreValues?: CoreValueItem[];
  newsIssues: NewsIssueItem[];
  gallery: GalleryItem[];
  stats: ClubStats;
}

// ============================================================================
// OFFICIAL DEFAULT SEEDS
// ============================================================================

export const defaultEvents: EventItem[] = [
  { 
    id: "evt-1", 
    title: "Hackathon Decoded 2024", 
    date: "August 25, 2024", 
    time: "10:00 AM (48 Hrs)",
    location: "Main Auditorium, SRMCEM",
    category: "upcoming", 
    color: "sky",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
    description: "Our flagship 48-hour coding marathon. Gather your team, brainstorm innovative ideas, and build solutions for real-world problems to win massive prizes.",
    registrationUrl: "https://forms.google.com"
  },
  { 
    id: "evt-2", 
    title: "Web3 & Smart Contracts Masterclass", 
    date: "September 10, 2024", 
    time: "02:00 PM",
    location: "Seminar Hall 2",
    category: "upcoming", 
    color: "blue",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800&h=400",
    description: "Dive deep into the world of Blockchain, Smart Contracts, and Decentralized Apps (dApps) with industry experts leading the charge.",
    registrationUrl: "https://forms.google.com"
  },
  { 
    id: "evt-3", 
    title: "Daily DSA Sprint & Contest #12", 
    date: "August 20, 2024", 
    time: "In Progress",
    location: "Lab 4, CSE Block",
    category: "current", 
    color: "cyan",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800&h=400",
    description: "An ongoing intensive competitive programming contest testing dynamic programming, graph theory, and algorithmic optimization.",
    registrationUrl: "https://forms.google.com"
  },
  { 
    id: "evt-4", 
    title: "Techkriti 2024", 
    date: "March 15, 2024", 
    time: "Multiple Days",
    location: "SRMCEM Campus",
    category: "past", 
    color: "indigo",
    image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800&h=400",
    description: "Our grand annual technical festival featuring 10+ sub-events, coding competitions, robotics arena, and guest speakers.",
    registrationUrl: ""
  }
];

export const defaultTeam: TeamMemberItem[] = [
  { 
    id: "team-1", 
    name: "Abhay Shanker Tiwari", 
    position: "FOUNDER & CEO", 
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300", 
    bio: "Visionary leader driving the club's mission to foster technological excellence and innovation.", 
    skills: ["Leadership", "Vision", "Strategy"], 
    socials: { linkedin: "https://linkedin.com", github: "https://github.com", email: "ceo@csisrmcem.org" } 
  },
  { 
    id: "team-2", 
    name: "Abhishek Soni", 
    position: "CO-FOUNDER & COO", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300", 
    bio: "Co-Founder & COO directing operations, business strategy, engineering workflows, and team execution.", 
    skills: ["Operations", "Strategy", "Execution"], 
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" } 
  },
  { 
    id: "team-3", 
    name: "Vanshika Saxena", 
    position: "CORE COMMITTEE MEMBER", 
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300", 
    bio: "Core contributor focusing on community engagement and managing technical events smoothly.", 
    skills: ["Management", "Community", "Events"], 
    socials: { linkedin: "https://linkedin.com" } 
  },
  { 
    id: "team-4", 
    name: "Abhinav Singh", 
    position: "CORE COMMITTEE MEMBER", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300", 
    bio: "Technical lead ensuring all systems and projects run efficiently without any bottlenecks.", 
    skills: ["Engineering", "Architecture", "Cloud"], 
    socials: { github: "https://github.com" } 
  }
];

export const defaultLegacyHeads: LegacyHeadItem[] = [
  {
    id: "legacy-1",
    name: "Rahul Sharma",
    role: "President (2022-2023)",
    tenure: "2022-2023",
    placedAt: "Google",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Led the chapter to 10+ major hackathons and technical symposiums. Currently a Software Development Engineer focusing on cloud infrastructure.",
    highlight: "SDE @ Google • 10+ National Hackathons"
  },
  {
    id: "legacy-2",
    name: "Sneha Patel",
    role: "Vice President (2021-2022)",
    tenure: "2021-2022",
    placedAt: "Microsoft",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Pioneered UI/UX design masterclasses and frontend architecture bootcamps. Currently a Product Designer crafting global enterprise software.",
    highlight: "Product Designer @ Microsoft • Design Sprints"
  },
  {
    id: "legacy-3",
    name: "Aman Gupta",
    role: "President (2020-2021)",
    tenure: "2020-2021",
    placedAt: "Amazon",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Steered the community through virtual hackathons and online coding initiatives. Now an AWS Cloud Solutions Architect.",
    highlight: "Cloud Architect @ Amazon • AWS Certified"
  },
  {
    id: "legacy-4",
    name: "Priya Singh",
    role: "President (2019-2020)",
    tenure: "2019-2020",
    placedAt: "Atlassian",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    bio: "Built the foundation of our open-source and competitive programming culture. Working as a Backend Systems Engineer.",
    highlight: "Backend Engineer @ Atlassian • Open Source"
  }
];

export const defaultSubTeams: SubTeamItem[] = [
  {
    id: "subteam-1",
    title: "Technical Team",
    category: "Core Engineering",
    color: "sky",
    frontDesc: "Full-stack development, AI/ML, and open-source software.",
    backDesc: "Our core engineering wing powering club web platforms, competitive tools, AI workflows, and automated judge systems.",
    points: ["Next.js & Cloud Deployments", "AI/ML Model Pipelines", "Open Source Repositories"]
  },
  {
    id: "subteam-2",
    title: "Design & Media",
    category: "UI/UX & Branding",
    color: "purple",
    frontDesc: "Visual aesthetics, interactive design & creative direction.",
    backDesc: "From Figma wireframes to sleek 3D motion graphics and brand identity, we ensure every digital asset touches a world-class standard.",
    points: ["Figma UI/UX & Prototypes", "3D Graphics & Animations", "Visual Brand Identity"]
  },
  {
    id: "subteam-3",
    title: "Event Management",
    category: "Logistics & Hackathons",
    color: "blue",
    frontDesc: "Managing 48h hackathons, workshops & speaker logistics.",
    backDesc: "We oversee end-to-end event execution, speaker hosting, platform judging setups, and physical venue coordination for 500+ attendees.",
    points: ["48h Hackathon Operations", "Speaker Accommodations", "Live Bootcamp Coordination"]
  },
  {
    id: "subteam-4",
    title: "PR & Outreach",
    category: "Sponsorships & Connect",
    color: "indigo",
    frontDesc: "Handling sponsorships, institutional partnerships & reach.",
    backDesc: "We are the public ambassadors of the chapter. We secure corporate sponsorships, collaborate with top tech communities, and expand alumni networks.",
    points: ["Corporate Sponsorships", "Inter-College Outreach", "Alumni Career Guidance"]
  },
  {
    id: "subteam-5",
    title: "Photography & Socials",
    category: "Media & Social Channels",
    color: "cyan",
    frontDesc: "Capturing moments & managing our digital social presence.",
    backDesc: "We capture high-octane moments from our tech events, produce cinematic recaps, and manage high-engagement channels on LinkedIn, Instagram & YouTube.",
    points: ["Cinematic Event Shoots", "Social Media Campaigns", "Post-Event Video Recaps"]
  }
];

export const defaultCoreValues: CoreValueItem[] = [
  {
    id: "core-1",
    title: "Hackathons & Tech Talks",
    category: "Innovation & Build",
    color: "sky",
    frontDesc: "Workshops, Speaker Sessions & 48h Hackathons exploring cutting-edge technology.",
    backDesc: "We regularly organize 24-48 hour Hackathons and Tech Talks where students interact with experienced industry speakers, gain valuable real-world insights, and convert ambitious ideas into production-ready software.",
    points: ["24-48 Hour Code Sprints", "Industry Expert Speakers", "Hands-on Tech Workshops"]
  },
  {
    id: "core-2",
    title: "Daily DSA & Contests",
    category: "Algorithmic Excellence",
    color: "blue",
    frontDesc: "Daily Algorithm Practice & Live Coding Contests to sharpen problem solving under pressure.",
    backDesc: "Focusing heavily on coding excellence through Daily DSA sessions with guided explanations, discussions, and practice. Regular contests challenge students to improve their algorithmic reasoning in a healthy, competitive environment.",
    points: ["Daily Problem Practice", "Live Coding Contests", "Placement Interview Prep"]
  },
  {
    id: "core-3",
    title: "Real-World Projects",
    category: "Full-Stack & Systems",
    color: "cyan",
    frontDesc: "Hands-on Development & Industry Stacks across Web, AI/ML, Cloud & Cybersecurity.",
    backDesc: "Collaborative software development bridging the gap between classroom theory and production engineering. Students build scalable web platforms, machine learning models, and open-source tooling with senior mentorship.",
    points: ["Production-Grade Apps", "Open-Source Collaboration", "Mentorship from Seniors"]
  },
  {
    id: "core-4",
    title: "Leadership & Community",
    category: "Team & Growth",
    color: "indigo",
    frontDesc: "Teamwork, Content Creation & Growth cultivating the next generation of tech leaders.",
    backDesc: "Beyond technical learning, we promote teamwork, technical content creation, and community engagement, ensuring every member gets opportunities to lead initiatives, collaborate, and build enduring networks.",
    points: ["Peer Mentorship Network", "Technical Leadership Roles", "Alumni Career Guidance"]
  }
];

export const defaultNewsIssues: NewsIssueItem[] = [
  {
    id: "news-oct-2024",
    volume: "Vol. 08",
    month: "October",
    year: "2024",
    title: "CSI_SRMCEM X D'CODERS Monthly Gazette — Autumn 2024 Edition",
    description: "Featuring complete coverage of Hackathon Decoded 2024, deep dive into Agentic AI workflows, campus recruitment success stories, and our Daily DSA leaderboard champions.",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=1000",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "5.4 MB",
    pageCount: 16,
    topics: ["Hackathon Decoded 2024", "Agentic AI & LLMs", "100% Placement Record", "DSA Contest Champions"],
    isCurrent: true
  },
  {
    id: "news-sep-2024",
    volume: "Vol. 07",
    month: "September",
    year: "2024",
    title: "Web3 Protocols, Open Source Sprints & Freshers Induction",
    description: "Welcoming the incoming cohort of engineers, exploring decentralized systems, and recapping 500+ GitHub contributions.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "4.8 MB",
    pageCount: 14,
    topics: ["Web3 Architecture", "Open Source Sprint", "Freshers Induction"],
    isCurrent: false
  },
  {
    id: "news-aug-2024",
    volume: "Vol. 06",
    month: "August",
    year: "2024",
    title: "AI & Neural Networks Bootcamp Special Gazette",
    description: "Student projects spotlight, building your first neural network from scratch, and hands-on PyTorch workshop recap.",
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "6.1 MB",
    pageCount: 18,
    topics: ["Neural Networks", "PyTorch Special", "Alumni Tech Talk"],
    isCurrent: false
  },
  {
    id: "news-jul-2024",
    volume: "Vol. 05",
    month: "July",
    year: "2024",
    title: "Cloud Infrastructure, DevOps & Containerization",
    description: "Deploying microservices with Docker and Kubernetes, cloud security fundamentals, and mid-year coding contest winners.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=800",
    pdfUrl: "/documents/csi-gazette-october-2024.pdf",
    fileSize: "4.5 MB",
    pageCount: 12,
    topics: ["Docker & K8s", "DevOps Pipelines", "DSA Leaderboard"],
    isCurrent: false
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800&h=800",
    title: "Hackathon Decoded 2024",
    detail: "Over 500 participants coding non-stop for 48 hours to build real-world solutions.",
    size: "large"
  },
  {
    id: "gal-2",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600&h=400",
    title: "AI & ML Bootcamp",
    detail: "Students training their first neural networks in our hands-on AI session.",
    size: "small"
  },
  {
    id: "gal-3",
    image: "https://images.unsplash.com/photo-1475721025505-c31da1687109?auto=format&fit=crop&q=80&w=600&h=400",
    title: "Web3 Summit",
    detail: "Industry experts explaining the future of decentralized internet.",
    size: "small"
  },
  {
    id: "gal-4",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800&h=400",
    title: "Techkriti 2023",
    detail: "The massive crowd gathered for our flagship annual technical festival.",
    size: "wide"
  },
  {
    id: "gal-5",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600&h=400",
    title: "UI/UX Workshop",
    detail: "Design team explaining the core principles of user-centric design using Figma.",
    size: "small"
  },
  {
    id: "gal-6",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=800",
    title: "Open Source Drive",
    detail: "Collaborative coding session where we merged 500+ pull requests.",
    size: "tall"
  }
];

export const defaultStats: ClubStats = {
  eventsHosted: "50+",
  activeMembers: "1k+",
  liveProjects: "10+",
  placementRate: "100%"
};

// ============================================================================
// STORAGE HELPERS (LOCALSTORAGE SYNC)
// ============================================================================

const STORAGE_KEYS = {
  EVENTS: "csi_cms_events_v2",
  TEAM: "csi_cms_team_v2",
  LEGACY: "csi_cms_legacy_v2",
  SUBTEAMS: "csi_cms_subteams_v2",
  COREVALUES: "csi_cms_corevalues_v2",
  NEWS: "csi_cms_news_v2",
  GALLERY: "csi_cms_gallery_v2",
  STATS: "csi_cms_stats_v2",
  PASSWORD: "csi_cms_admin_pwd",
};

// Helper: Safely get data from localStorage or fallback
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return fallback;
  }
}

// Helper: Safely set data to localStorage & notify
function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("csi_data_updated"));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

// Public CMS Getters & Setters
export const DataStore = {
  // Events
  getEvents: (): EventItem[] => getItem(STORAGE_KEYS.EVENTS, defaultEvents),
  saveEvents: (data: EventItem[]) => setItem(STORAGE_KEYS.EVENTS, data),

  // Team
  getTeam: (): TeamMemberItem[] => getItem(STORAGE_KEYS.TEAM, defaultTeam),
  saveTeam: (data: TeamMemberItem[]) => setItem(STORAGE_KEYS.TEAM, data),

  // Legacy Heads
  getLegacyHeads: (): LegacyHeadItem[] => getItem(STORAGE_KEYS.LEGACY, defaultLegacyHeads),
  saveLegacyHeads: (data: LegacyHeadItem[]) => setItem(STORAGE_KEYS.LEGACY, data),

  // Sub-Teams
  getSubTeams: (): SubTeamItem[] => getItem(STORAGE_KEYS.SUBTEAMS, defaultSubTeams),
  saveSubTeams: (data: SubTeamItem[]) => setItem(STORAGE_KEYS.SUBTEAMS, data),

  // Core Values
  getCoreValues: (): CoreValueItem[] => getItem(STORAGE_KEYS.COREVALUES, defaultCoreValues),
  saveCoreValues: (data: CoreValueItem[]) => setItem(STORAGE_KEYS.COREVALUES, data),

  // News Issues
  getNewsIssues: (): NewsIssueItem[] => {
    const issues = getItem(STORAGE_KEYS.NEWS, defaultNewsIssues);
    return issues.map(item => ({
      ...item,
      pdfUrl: item.pdfUrl && item.pdfUrl.includes("w3.org") ? "/documents/csi-gazette-october-2024.pdf" : item.pdfUrl
    }));
  },
  saveNewsIssues: (data: NewsIssueItem[]) => setItem(STORAGE_KEYS.NEWS, data),

  // Gallery
  getGallery: (): GalleryItem[] => getItem(STORAGE_KEYS.GALLERY, defaultGallery),
  saveGallery: (data: GalleryItem[]) => setItem(STORAGE_KEYS.GALLERY, data),

  // Stats
  getStats: (): ClubStats => getItem(STORAGE_KEYS.STATS, defaultStats),
  saveStats: (data: ClubStats) => setItem(STORAGE_KEYS.STATS, data),

  // Admin Password
  getAdminPassword: (): string => {
    if (typeof window === "undefined") return "admin123";
    return localStorage.getItem(STORAGE_KEYS.PASSWORD) || "admin123";
  },
  saveAdminPassword: (pwd: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PASSWORD, pwd);
  },

  // Export Complete Backup JSON
  exportBackup: (): WebsiteDataBackup => ({
    version: "2.0",
    exportedAt: new Date().toISOString(),
    events: DataStore.getEvents(),
    team: DataStore.getTeam(),
    legacyHeads: DataStore.getLegacyHeads(),
    subTeams: DataStore.getSubTeams(),
    coreValues: DataStore.getCoreValues(),
    newsIssues: DataStore.getNewsIssues(),
    gallery: DataStore.getGallery(),
    stats: DataStore.getStats(),
  }),

  // Import Complete Backup JSON
  importBackup: (backup: Partial<WebsiteDataBackup>): boolean => {
    try {
      if (backup.events) DataStore.saveEvents(backup.events);
      if (backup.team) DataStore.saveTeam(backup.team);
      if (backup.legacyHeads) DataStore.saveLegacyHeads(backup.legacyHeads);
      if (backup.subTeams) DataStore.saveSubTeams(backup.subTeams);
      if (backup.coreValues) DataStore.saveCoreValues(backup.coreValues);
      if (backup.newsIssues) DataStore.saveNewsIssues(backup.newsIssues);
      if (backup.gallery) DataStore.saveGallery(backup.gallery);
      if (backup.stats) DataStore.saveStats(backup.stats);
      return true;
    } catch (e) {
      console.error("Failed to import backup", e);
      return false;
    }
  },

  // Reset Everything to Official Defaults
  resetToDefaults: () => {
    DataStore.saveEvents(defaultEvents);
    DataStore.saveTeam(defaultTeam);
    DataStore.saveLegacyHeads(defaultLegacyHeads);
    DataStore.saveSubTeams(defaultSubTeams);
    DataStore.saveCoreValues(defaultCoreValues);
    DataStore.saveNewsIssues(defaultNewsIssues);
    DataStore.saveGallery(defaultGallery);
    DataStore.saveStats(defaultStats);
  }
};
