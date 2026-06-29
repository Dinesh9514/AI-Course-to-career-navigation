export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  profile?: {
    avatarUrl?: string;
    bio?: string;
    targetRole?: string;
    completedCourses: string[];
    skills: string[];
  };
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  type: "Remote" | "Onsite" | "Hybrid";
  salary: string;
  requiredSkills: string[];
  url: string;
  deadline: string;
  postedDate: string;
}

export interface SkillGapItem {
  skill: string;
  priority: "High" | "Medium" | "Low";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  learningRoadmap: string[];
  resources: { name: string; url: string; platform: string }[];
}

export interface SkillGapAnalysis {
  courseSkills: string[];
  internshipSkills: string[];
  missingSkills: SkillGapItem[];
  careerReadinessScore: number;
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  problemStatement: string;
  objectives: string[];
  technologies: string[];
  dataset: string;
  architecture: string;
  modules: { name: string; description: string }[];
  futureScope: string;
  githubFolderStructure: string;
  estimatedTime: string;
  resumeValue: string;
  interviewQuestions: string[];
}

export interface CareerRoadmapItem {
  id: string;
  step: number;
  title: string;
  description: string;
  type: "Course" | "Internship" | "Project" | "Certification" | "Job Role" | "Senior Position" | "Future Growth";
  skills: string[];
  duration: string;
  resources?: { name: string; url: string }[];
}

export interface CareerRoadmap {
  courseName: string;
  roadmap: CareerRoadmapItem[];
  careerGrowthProjection: string;
}

export interface PortfolioData {
  resume: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    education: { institution: string; degree: string; year: string }[];
    experience: { company: string; role: string; duration: string; details: string[] }[];
  };
  portfolioWebsite: {
    heroTitle: string;
    aboutMe: string;
    featuredProjects: { title: string; desc: string; tech: string[] }[];
  };
  linkedinSummary: string;
  githubReadme: string;
  skills: string[];
  projects: string[];
  internships: string[];
  certifications: string[];
  suggestions?: {
    resumeImprovements: string[];
    portfolioImprovements: string[];
    dos: string[];
    donts: string[];
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "internship" | "hackathon" | "contest" | "discount" | "general";
  isRead: boolean;
  date: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface DatabaseState {
  users: Record<string, User>;
  roadmaps: Record<string, CareerRoadmap>;
  skillGaps: Record<string, SkillGapAnalysis>;
  projects: Record<string, ProjectSuggestion[]>;
  savedInternships: Record<string, string[]>; // userId -> internshipIds
  portfolio: Record<string, PortfolioData>;
  notifications: Record<string, AppNotification[]>; // userId -> notifications
  chatHistory: Record<string, ChatMessage[]>; // userId -> chatMessages
}
