"use client";

import React, { useState, useRef, FC } from "react";
import { Mail, Phone, ExternalLink, GraduationCap, Briefcase, ArrowDownNarrowWide, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/useUser";
import { createResume } from "@/lib/api";
import { toast } from "sonner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "@/components/shared/ResumePDF";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";



// Define the shape of the resume data to ensure type safety.
interface ResumeEducation {
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface ResumeExperience {
  company: string;
  jobTitle: string;
  startYear: string;
  endYear: string;
  achievements: string[];
}

interface ResumeData {
  title: string;
  fullName: string;
  role: string;
  summary: string;
  phone: string;
  email: string;
  linkedin: string;
  education: ResumeEducation;
  experience: ResumeExperience;
  skills: string;
}



const Page: FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "Untitled Resume",
    fullName: "John Doe",
    role: "Software Engineer",
    summary: "A passionate developer with expertise in React, Node.js, and MongoDB. Proven ability to build scalable and high-performance web applications. Seeking a challenging role to contribute to innovative projects and grow professionally.",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    linkedin: "linkedin.com/in/johndoe",
    education: {
      school: "Stanford University",
      degree: "B.S. in Computer Science",
      startYear: "2018",
      endYear: "2022",
    },
    experience: {
      company: "Google",
      jobTitle: "Frontend Developer",
      startYear: "2022",
      endYear: "Present",
      achievements: [
        "Built a scalable and responsive e-commerce platform.",
        "Improved API performance by 30% through optimized database queries.",
        "Collaborated with cross-functional teams to deliver key features on time."
      ],
    },
    skills: "JavaScript, React, Node.js, Express, MongoDB, Git, Tailwind CSS",
  });



  const { user, token, loading, setLoading } = useUser()
  const [showDialog, setShowDialog] = useState(false)
  const [resumeTitle, setResumeTitle] = useState("")
  const debounceTitle = useDebounce(resumeTitle, 600);
  const debounceResumeData = useDebounce(resumeData, 800);


  // Handles updates for top-level properties like 'fullName' or 'email'
  const handleTopLevelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<ResumeData, "education" | "experience">
  ) => {
    setResumeData(prevData => ({ ...prevData, [field]: e.target.value }));
  };

  // Handles updates for nested properties like 'education.school'
  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof Pick<ResumeData, "education" | "experience">,
    field: keyof ResumeEducation | keyof ResumeExperience
  ) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: e.target.value
      }
    }));
  };

  // Handles achievements separately since it's an array
  const handleAchievementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prevData => ({
      ...prevData,
      experience: {
        ...prevData.experience,
        achievements: e.target.value.split('\n').filter(line => line.trim() !== '')
      }
    }));
  };

  const handlSave = async (formData: ResumeData) => {

    if (!token) return console.error("No token found, user not logged in")
    try {
      setLoading(true)
      // 🔹 Restructure the data to match the backend schema
      const structuredData = {
        title: formData.title,
        personal: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          summary: formData.summary,
        },
        education: [formData.education],
        experience: [formData.experience],
        skills: formData.skills.split(',').map(s => s.trim()),
      };

      const newResume = await createResume(token, structuredData);
      toast.success("Resume created");
    } catch (error) {
      toast.error("Failed to create resume")
    } finally {
      setLoading(false)
    }
  }







  return (
    <>
      <div className="flex flex-col lg:flex-row h-full w-full gap-4  font-sans">
        {/* Left: Resume Input Form */}
        <Card className="w-full lg:w-[50rem] min-w-[325px] p-6 overflow-y-auto scrollbar-hide shadow-lg rounded-2xl border border-gray-200">
          <h2 className="text-3xl font-bold mb-8 dark:text-white :text-gray-800">Create Resume</h2>

          {/* Personal Info */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Personal In formation
            </h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={resumeData.fullName}
                  onChange={(e) => handleTopLevelChange(e, 'fullName')}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="Software Engineer"
                  value={resumeData.role}
                  onChange={(e) => handleTopLevelChange(e, 'role')}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    value={resumeData.phone}
                    onChange={(e) => handleTopLevelChange(e, 'phone')}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={resumeData.email}
                    onChange={(e) => handleTopLevelChange(e, 'email')}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/johndoe"
                  value={resumeData.linkedin}
                  onChange={(e) => handleTopLevelChange(e, 'linkedin')}
                />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  placeholder="A passionate developer with skills in React, Node.js, and MongoDB..."
                  value={resumeData.summary}
                  onChange={(e) => handleTopLevelChange(e, 'summary')}
                />
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Education
            </h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="school">School / University</Label>
                <Input
                  id="school"
                  placeholder="MIT, Stanford, etc."
                  value={resumeData.education.school}
                  onChange={(e) => handleNestedChange(e, 'education', 'school')}
                />
              </div>
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  placeholder="BSc Computer Science"
                  value={resumeData.education.degree}
                  onChange={(e) => handleNestedChange(e, 'education', 'degree')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    placeholder="2020"
                    value={resumeData.education.startYear}
                    onChange={(e) => handleNestedChange(e, 'education', 'startYear')}
                  />
                </div>
                <div>
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    placeholder="2024"
                    value={resumeData.education.endYear}
                    onChange={(e) => handleNestedChange(e, 'education', 'endYear')}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">
              Experience
            </h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Google, Microsoft, etc."
                  value={resumeData.experience.company}
                  onChange={(e) => handleNestedChange(e, 'experience', 'company')}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Frontend Developer"
                  value={resumeData.experience.jobTitle}
                  onChange={(e) => handleNestedChange(e, 'experience', 'jobTitle')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expStart">Start Year</Label>
                  <Input
                    id="expStart"
                    placeholder="2022"
                    value={resumeData.experience.startYear}
                    onChange={(e) => handleNestedChange(e, 'experience', 'startYear')}
                  />
                </div>
                <div>
                  <Label htmlFor="expEnd">End Year</Label>
                  <Input
                    id="expEnd"
                    placeholder="2023"
                    value={resumeData.experience.endYear}
                    onChange={(e) => handleNestedChange(e, 'experience', 'endYear')}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="achievements">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  rows={3}
                  placeholder="• Built a scalable resume platform • Improved API performance by 30%"
                  value={resumeData.experience.achievements.join('\n')}
                  onChange={handleAchievementsChange}
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">Skills</h3>
            <Input
              placeholder="e.g. JavaScript, React, Node.js"
              value={resumeData.skills}
              onChange={(e) => handleTopLevelChange(e, 'skills')}
            />
          </section>

          <div className="flex justify-end">
            <Button onClick={() => setShowDialog(true)} className="cursor-pointer ">Save</Button>
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Name your resume</DialogTitle>
              </DialogHeader>


              <Input placeholder="eg.  FrontendResume" value={resumeTitle} onChange={(e) => setResumeTitle(e.target.value)} />

              <DialogFooter>
                <Button variant="secondary" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (!debounceTitle.trim()) {
                    toast.error("Plase enter a resume name");
                    return;
                  }
                  setResumeData(prev => ({ ...prev, title: debounceTitle }))
                  handlSave({ ...resumeData, title: debounceTitle }
                  );
                  setShowDialog(false)
                  setResumeTitle("")
                }}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>

          </Dialog>



        </Card>

        {/* Right: Resume Preview */}
        <Card className="hidden lg:flex flex-1  dark:bg-muted-foreground p-10 rounded-2xl shadow-xl overflow-y-auto scrollbar-hide">
          <div className="flex-1 space-y-8">
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-gray-200">
              <h1 className="text-4xl font-extrabold text-gray-800">
                {resumeData.fullName}
              </h1>
              <p className="text-lg text-indigo-700 font-semibold mt-2">
                {resumeData.role}
              </p>
              <div className="flex justify-center items-center gap-4 mt-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {resumeData.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {resumeData.email}
                </span>
                <a href={`https://${resumeData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                  <ExternalLink className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Summary */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4">Summary</h2>
              <p className="text-gray-700">{resumeData.summary}</p>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Education
              </h2>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {resumeData.education.degree}
                </h3>
                <p className="text-gray-600 italic">{resumeData.education.school}</p>
                <p className="text-gray-500 text-sm">
                  {resumeData.education.startYear} - {resumeData.education.endYear}
                </p>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Experience
              </h2>
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {resumeData.experience.jobTitle}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {resumeData.experience.startYear} - {resumeData.experience.endYear}
                  </p>
                </div>
                <p className="text-gray-600 italic mb-2">{resumeData.experience.company}</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {resumeData.experience.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 text-sm font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <PDFDownloadLink document={<ResumePDF data={debounceResumeData} />}
            fileName="resume.pdf">
            {({ loading }) => (
              <Button className="dark:bg-muted dark:text-white cursor-pointer" disabled={loading}>
                {loading ? 'Generating PDF...' : (<div className="flex items-center gap-1"><ArrowDown />Download PDF</div>)}
              </Button>
            )}

          </PDFDownloadLink>

        </Card>


      </div>
    </>
  );
};

export default Page;
