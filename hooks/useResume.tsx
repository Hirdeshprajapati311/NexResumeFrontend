'use client'
import { useCallback, useEffect, useState } from "react";
import useUser from "./useUser";
import { getUserResumes, getResumeById } from "@/lib/api";

export interface ResumeVersion {
  _id: string;
  version: number;
  personal: {
    fullName: string;
    phone: string;
    email: string;
    summary: string;
  };
  education: {
    school: string;
    degree: string;
    start: string;
    end: string;
  }[];
  experience: {
    company: string;
    role: string;
    start: string;
    end: string;
    bullets: string[];
  }[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  currentVersionId: string; 
  versions?: ResumeVersion[];
  createdAt: string;
  updatedAt: string;
}

export const useResume = () => {
  const { token } = useUser();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<ResumeVersion | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getUserResumes(token);
        setResumes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [token]);

  const fetchResumeByID = useCallback(
    async (id: string) => {
      if (!token) return null;
      setLoading(true);
      setError(null);

      try {
        const resume = await getResumeById(token, id);
        console.log("Fetched resume:", resume);
        console.log("Current version ID:", resume?.currentVersionId);
        console.log("Versions:", resume?.versions);

        if (resume) {
          setSelectedResume(resume as Resume);

          if (resume.versions && resume.currentVersionId) {
            const currentVer = resume.versions.find(
              (version: ResumeVersion) => version._id === resume.currentVersionId
            );
            if (currentVer) {
              setCurrentVersion(currentVer as ResumeVersion);
            } else {
              setCurrentVersion(resume.versions[0] as ResumeVersion);
            }
          } else if (resume.versions && resume.versions.length > 0) {
            setCurrentVersion(resume.versions[0] as ResumeVersion);
          } else {
            setCurrentVersion(null);
          }
        }
        return resume;
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching resume:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    resumes,
    selectedResume,
    setSelectedResume,
    fetchResumeByID,
    loading,
    error,
    currentVersion,
    setCurrentVersion,
    setResumes
  };
};