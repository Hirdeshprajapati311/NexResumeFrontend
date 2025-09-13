'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/useUser';
import { useResume } from '@/hooks/useResume';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { createNewResumeVersion, updateResumeVersion } from '@/lib/api';
import { Phone, Mail, GraduationCap, Briefcase, Loader2 } from 'lucide-react';

const EditResumePage = () => {
  const params = useParams();
  const resumeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { token } = useUser();
  const { fetchResumeByID, selectedResume, setSelectedResume, loading, currentVersion, setCurrentVersion } = useResume();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 Local form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    summary: '',
    skills: [] as string[],
    education: [] as Array<{ school: string; degree: string; start: string; end: string }>,
    experience: [] as Array<{ company: string; role: string; start: string; end: string; bullets: string[] }>,
  });

  // Fetch resume by ID
  useEffect(() => {
    if (resumeId && token) {
      fetchResumeByID(resumeId);
    }
  }, [resumeId, token, fetchResumeByID]);

  // 🔹 Sync local form state with currentVersion when it loads
  useEffect(() => {
    if (currentVersion) {
      console.log("Setting form data from currentVersion:", currentVersion);
      console.log("Current version education:", currentVersion.education);
      console.log("Current version experience:", currentVersion.experience);
      console.log("Current version personal:", currentVersion.personal);
      setFormData({
        fullName: currentVersion.personal?.fullName || '',
        phone: currentVersion.personal?.phone || '',
        email: currentVersion.personal?.email || '',
        summary: currentVersion.personal?.summary || '',
        skills: currentVersion.skills || [],
        education: currentVersion.education?.map(edu => ({
          school: edu.school || '',
          degree: edu.degree || '',
          start: edu.start || '',
          end: edu.end || ''
        })) || [],
        experience: currentVersion.experience?.map(exp => ({
          company: exp.company || '',
          role: exp.role || '',
          start: exp.start || '',
          end: exp.end || '',
          bullets: exp.bullets || []
        })) || [],
      });
    }
  }, [currentVersion]);

  // handle input changes
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
    setFormData(prev => {
      const newExperience = [...prev.experience];
      if (field === 'bullets' && typeof value === 'string') {
        // Handle bullets as array of strings
        newExperience[index] = { ...newExperience[index], bullets: value.split('\n').filter(b => b.trim()) };
      } else {
        newExperience[index] = { ...newExperience[index], [field]: value };
      }
      return { ...prev, experience: newExperience };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', start: '', end: '' }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', start: '', end: '', bullets: [] }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Update handleModifyCurrent
  const handleModifyCurrent = async () => {
    if (!token || !resumeId || !currentVersion?._id) {
      toast.error("Cannot update: current version not found.");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        personal: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          summary: formData.summary
        },
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
      };

      const updatedVersion = await updateResumeVersion(token, resumeId, updateData);
      setCurrentVersion(updatedVersion); // Now this should work
      toast.success("Current version updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update version");
    } finally {
      setIsSaving(false);
    }
  };

  // Update handleCreateNewVersion similarly
  const handleCreateNewVersion = async () => {
    if (!token || !resumeId || !currentVersion) {
      toast.error("Cannot create new version: base version not loaded.");
      return;
    }
    if (!newTitle.trim()) return toast.error("Please enter a title");

    setIsSaving(true);
    try {
      const newVersionData = {
        personal: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          summary: formData.summary
        },
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
      };

      const serverResponse = await createNewResumeVersion(token, resumeId, newVersionData, newTitle);
      setSelectedResume(serverResponse.resume);
      setCurrentVersion(serverResponse.newVersion); // This should already be correct
      setIsCreatingNew(false);
      setNewTitle('');
      toast.success("New version created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create new version");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !currentVersion) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4 font-sans">
      {/* Left: Resume Input Form */}
      <Card className="w-full lg:w-[50rem] min-w-[325px] p-6 overflow-y-auto scrollbar-hide shadow-lg rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 dark:text-white text-gray-800">
          Edit Resume: {selectedResume?.title}
        </h2>
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Personal Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                rows={4}
                value={formData.summary}
                onChange={e => handleChange('summary', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`edu-school-${index}`}>School</Label>
                  <Input
                    id={`edu-school-${index}`}
                    value={edu.school}
                    onChange={e => handleEducationChange(index, 'school', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                  <Input
                    id={`edu-degree-${index}`}
                    value={edu.degree}
                    onChange={e => handleEducationChange(index, 'degree', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                    <Input
                      id={`edu-start-${index}`}
                      value={edu.start}
                      onChange={e => handleEducationChange(index, 'start', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                    <Input
                      id={`edu-end-${index}`}
                      value={edu.end}
                      onChange={e => handleEducationChange(index, 'end', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="mt-2" onClick={() => removeEducation(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addEducation}>Add Education</Button>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`exp-company-${index}`}>Company</Label>
                  <Input
                    id={`exp-company-${index}`}
                    value={exp.company}
                    onChange={e => handleExperienceChange(index, 'company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`exp-role-${index}`}>Role</Label>
                  <Input
                    id={`exp-role-${index}`}
                    value={exp.role}
                    onChange={e => handleExperienceChange(index, 'role', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                    <Input
                      id={`exp-start-${index}`}
                      value={exp.start}
                      onChange={e => handleExperienceChange(index, 'start', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                    <Input
                      id={`exp-end-${index}`}
                      value={exp.end}
                      onChange={e => handleExperienceChange(index, 'end', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`exp-bullets-${index}`}>Bullet Points (one per line)</Label>
                  <Textarea
                    id={`exp-bullets-${index}`}
                    rows={3}
                    value={exp.bullets.join('\n')}
                    onChange={e => handleExperienceChange(index, 'bullets', e.target.value)}
                  />
                </div>
              </div>
              <Button variant="destructive" size="sm" className="mt-2" onClick={() => removeExperience(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addExperience}>Add Experience</Button>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Skills</h3>
          <Input
            value={formData.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="Enter skills separated by commas"
          />
        </section>

        {/* Buttons */}
        {!isCreatingNew ? (
          <div className="flex gap-4">
            <Button onClick={handleModifyCurrent} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Modify Current Version
            </Button>
            <Button onClick={() => setIsCreatingNew(true)} disabled={isSaving}>
              Create New Version
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter new resume name"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <Button onClick={handleCreateNewVersion} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save New Version
              </Button>
              <Button variant="secondary" onClick={() => setIsCreatingNew(false)} disabled={isSaving}>
                Cancel
              </Button>
            </div>
            <p className="text-sm text-gray-500">This will create a copy of the current version with your changes</p>
          </div>
        )}
      </Card>

      {/* Right: Resume Preview */}
      <Card className="hidden lg:flex flex-1 dark:bg-muted-foreground p-10 rounded-2xl shadow-xl overflow-y-auto scrollbar-hide">
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-800">
              {formData.fullName || currentVersion?.personal?.fullName}
            </h1>
            <p className="text-lg text-indigo-700 font-semibold mt-2">
              {formData.experience[0]?.role || currentVersion?.experience?.[0]?.role}
            </p>
            <div className="flex justify-center items-center gap-4 mt-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> {formData.phone || currentVersion?.personal?.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {formData.email || currentVersion?.personal?.email}
              </span>
            </div>
          </div>

          {/* Summary */}
          {formData.summary && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4">Summary</h2>
              <p className="text-gray-700">{formData.summary}</p>
            </section>
          )}

          {/* Education */}
          {formData.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Education
              </h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-600 italic">{edu.school}</p>
                  <p className="text-gray-500 text-sm">
                    {edu.start} {edu.end && `- ${edu.end}`}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Experience */}
          {formData.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Experience
              </h2>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {exp.role}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {exp.start} {exp.end && `- ${exp.end}`}
                    </p>
                  </div>
                  <p className="text-gray-600 italic mb-2">{exp.company}</p>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {formData.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-1 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 text-sm font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EditResumePage;