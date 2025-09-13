// types/resume.ts (frontend types)
export interface PersonalInfo {
  fullName: string;
  phone: string;
  email: string;
  summary: string;
}

export interface Education {
  school: string;
  degree: string;
  start: string;
  end: string;
}

export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ResumeVersion {
  _id: string;
  resumeId?: string;
  version: number;
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  currentVersionId: string | null;
  versions?: ResumeVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeData {
  title: string;
  personal?: Partial<PersonalInfo>;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
}

export interface UpdateResumeData {
  title?: string;
  personal?: Partial<PersonalInfo>;
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
}

// Auth types
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    hasResume: boolean;
    seenOnboarding: boolean;
  };
}

export interface ErrorResponse {
  error?: string;
  message?: string;
}

export interface ResumeVersionResponse {
  resume: Resume;
  newVersion: ResumeVersion;
}