// useResume.ts
'use client'
import { useCallback, useEffect, useState } from "react";
import useUser from "./useUser";
import { getUserResumes, getResumeById } from "@/lib/api";
import { Resume, ResumeVersion } from "@/lib/types/resume"; 
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

        if (resume) {
          setSelectedResume(resume);

          if (resume.versions && resume.currentVersionId) {
            const currentVer = resume.versions.find(
              (version: ResumeVersion) => version._id === resume.currentVersionId
            );
            if (currentVer) {
              setCurrentVersion(currentVer);
            } else if (resume.versions.length > 0) {
              setCurrentVersion(resume.versions[0]);
            } else {
              setCurrentVersion(null);
            }
          } else if (resume.versions && resume.versions.length > 0) {
            setCurrentVersion(resume.versions[0]);
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