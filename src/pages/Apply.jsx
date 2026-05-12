import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Upload, X, ChevronRight, ChevronLeft, User, Briefcase, GraduationCap, FileUp, MessageSquare } from "lucide-react";
import { Button, Input, Textarea, Select, MultiSelect, Badge } from "../components/ui/index.jsx";
import { skillOptions, jobs as mockJobsData } from "../data/mockData.js";
import { jobService } from "../services/jobService.js";
import { applicationService } from "../services/applicationService.js";

// Fallback positions shown when backend has no jobs yet
const mockPositions = mockJobsData.map((j) => ({ _id: String(j.id), title: j.title, isMock: false }));

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Professional", icon: Briefcase },
  { id: 3, label: "Education", icon: GraduationCap },
  { id: 4, label: "Uploads", icon: FileUp },
  { id: 5, label: "Questions", icon: MessageSquare },
];

const techStacks = ["MERN Stack", "MEAN Stack", "JAMstack", "Django + React", "Spring Boot + Angular", "FastAPI + Vue", "Laravel + React"];
const qualifications = ["High School Diploma", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD", "Bootcamp Certificate", "Self-taught"];
const countries = ["United States", "United Kingdom", "Canada", "Germany", "Australia", "Nigeria", "India", "Other"];

export default function Apply({ toast }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [usingMockJobs, setUsingMockJobs] = useState(false);
  const resumeRef = useRef();
  const coverRef = useRef();

  const preselectedJobId = searchParams.get("jobId") || "";
  const preselectedJobTitle = searchParams.get("jobTitle") || "";

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", country: "", state: "",
    jobId: preselectedJobId, position: preselectedJobTitle, experience: "", skills: [], techStack: "", portfolio: "", github: "", linkedin: "",
    qualification: "", institution: "", gradYear: "",
    resume: null, coverLetter: null,
    whyHire: "", strongestProject: "", availability: "", workPreference: "",
    agreeTerms: false,
  });

  useEffect(() => {
    jobService.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setJobs(data);
          setUsingMockJobs(false);
        } else {
          setJobs(mockPositions);
          setUsingMockJobs(true);
        }
      })
      .catch(() => {
        setJobs(mockPositions);
        setUsingMockJobs(true);
      })
      .finally(() => setJobsLoading(false));
  }, []);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
      if (!form.phone.trim()) errs.phone = "Phone number is required";
      if (!form.country) errs.country = "Country is required";
    }
    if (step === 2) {
      if (!form.experience) errs.experience = "Experience is required";
      if (form.skills.length === 0) errs.skills = "Select at least one skill";
    }
    if (step === 3) {
      if (!form.qualification) errs.qualification = "Qualification is required";
      if (!form.institution.trim()) errs.institution = "Institution is required";
    }
    if (step === 5) {
      if (!form.whyHire.trim()) errs.whyHire = "This field is required";
      if (!form.strongestProject.trim()) errs.strongestProject = "This field is required";
      if (!form.agreeTerms) errs.agreeTerms = "You must agree to the terms";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 5)); };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    if (!form.resume) {
      toast?.("Please upload your resume", "error");
      setStep(4);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("jobId", form.jobId);
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("address", form.address);
      fd.append("country", form.country);
      fd.append("state", form.state);
      fd.append("experience", form.experience);
      fd.append("skills", form.skills.join(","));
      fd.append("techStack", form.techStack);
      fd.append("portfolio", form.portfolio);
      fd.append("github", form.github);
      fd.append("linkedin", form.linkedin);
      fd.append("qualification", form.qualification);
      fd.append("institution", form.institution);
      fd.append("gradYear", form.gradYear);
      fd.append("whyHire", form.whyHire);
      fd.append("strongestProject", form.strongestProject);
      fd.append("availability", form.availability);
      fd.append("workPreference", form.workPreference);
      fd.append("resume", form.resume);

      await applicationService.submit(fd);
      toast?.("Application submitted successfully!", "success");
      setSubmitted(true);
    } catch (err) {
      toast?.(err.response?.data?.message || "Submission failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) set(field, file);
  };

  const DropZone = ({ field, label, accept, fileRef }) => (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(field); }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => handleDrop(e, field)}
      onClick={() => fileRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver === field ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 hover:border-indigo-500/50 hover:bg-white/5"}`}>
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => set(field, e.target.files[0])} />
      {form[field] ? (
        <div className="flex items-center justify-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">{form[field].name}</span>
          <button type="button" onClick={(ev) => { ev.stopPropagation(); set(field, null); }} className="text-slate-500 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm font-medium">{label}</p>
          <p className="text-slate-600 text-xs mt-1">Drag & drop or click to browse</p>
        </>
      )}
    </div>
  );

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setForm({ fullName: "", email: "", phone: "", address: "", country: "", state: "", jobId: "", position: "", experience: "", skills: [], techStack: "", portfolio: "", github: "", linkedin: "", qualification: "", institution: "", gradYear: "", resume: null, coverLetter: null, whyHire: "", strongestProject: "", availability: "", workPreference: "", agreeTerms: false });
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="glass-strong rounded-3xl p-12 text-center max-w-lg w-full">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-slate-400 mb-8">Thank you, <span className="text-white font-medium">{form.fullName}</span>! We'll review your application and get back to you within 3-5 business days.</p>
          <div className="glass rounded-xl p-4 mb-8 text-left space-y-2">
            <p className="text-sm text-slate-400">Position: <span className="text-white">{form.position || "General Application"}</span></p>
            <p className="text-sm text-slate-400">Email: <span className="text-white">{form.email}</span></p>
            <p className="text-sm text-slate-400">Reference: <span className="text-indigo-400 font-mono">MTH-{Date.now().toString().slice(-6)}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={resetForm}>Submit Another Application</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-10">
          <Badge color="indigo">Join Our Team</Badge>
          <h1 className="text-4xl font-bold text-white mt-4 mb-2">Apply to Marvel Tech Hub</h1>
          <p className="text-slate-400">Complete all sections to submit your application.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map(({ id, label, icon: Icon }, idx) => (
            <div key={id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step > id ? "bg-emerald-600" : step === id ? "bg-indigo-600 glow-blue" : "glass"}`}>
                  {step > id ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${step === id ? "text-white" : "text-slate-500"}`} />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === id ? "text-indigo-400" : step > id ? "text-emerald-400" : "text-slate-600"}`}>{label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all ${step > id ? "bg-emerald-600/50" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-3xl p-8">
          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><User className="w-5 h-5 text-indigo-400" /> Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name *" placeholder="John Doe" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} error={errors.fullName} />
                <Input label="Email Address *" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
                <Input label="Phone Number *" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
                <Input label="Address" placeholder="123 Main Street" value={form.address} onChange={(e) => set("address", e.target.value)} />
                <Select label="Country *" value={form.country} onChange={(e) => set("country", e.target.value)} error={errors.country}>
                  <option value="">Select country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Input label="State / Province" placeholder="California" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-400" /> Professional Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Select label="Position Applying For" value={form.jobId} onChange={(e) => {
                  const job = jobs.find((j) => j._id === e.target.value);
                  set("jobId", e.target.value);
                  set("position", job?.title || "");
                }} className="sm:col-span-2">
                  <option value="">{jobsLoading ? "Loading positions..." : "General Application (no specific role)"}</option>
                  {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                </Select>
                <Select label="Years of Experience *" value={form.experience} onChange={(e) => set("experience", e.target.value)} error={errors.experience}>
                  <option value="">Select experience</option>
                  {["0-1 years", "1-2 years", "2-4 years", "4-6 years", "6-10 years", "10+ years"].map((x) => <option key={x} value={x}>{x}</option>)}
                </Select>
                <Select label="Preferred Tech Stack" value={form.techStack} onChange={(e) => set("techStack", e.target.value)}>
                  <option value="">Select tech stack</option>
                  {techStacks.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <MultiSelect label="Skills *" options={skillOptions} selected={form.skills} onChange={(v) => set("skills", v)} />
                {errors.skills && <p className="text-xs text-red-400 mt-1">{errors.skills}</p>}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="Portfolio URL" placeholder="https://yourportfolio.com" value={form.portfolio} onChange={(e) => set("portfolio", e.target.value)} />
                <Input label="GitHub Profile" placeholder="https://github.com/username" value={form.github} onChange={(e) => set("github", e.target.value)} />
                <Input label="LinkedIn Profile" placeholder="https://linkedin.com/in/username" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-400" /> Education</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Select label="Highest Qualification *" value={form.qualification} onChange={(e) => set("qualification", e.target.value)} error={errors.qualification}>
                  <option value="">Select qualification</option>
                  {qualifications.map((q) => <option key={q} value={q}>{q}</option>)}
                </Select>
                <Input label="Graduation Year" type="number" placeholder="2022" min="1990" max="2030" value={form.gradYear} onChange={(e) => set("gradYear", e.target.value)} />
                <Input label="Institution / University *" placeholder="MIT, Stanford, etc." value={form.institution} onChange={(e) => set("institution", e.target.value)} error={errors.institution} className="sm:col-span-2" />
              </div>
            </div>
          )}

          {/* Step 4: Uploads */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FileUp className="w-5 h-5 text-indigo-400" /> Upload Documents</h2>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Resume / CV *</label>
                <DropZone field="resume" label="Upload your resume (PDF, DOC)" accept=".pdf,.doc,.docx" fileRef={resumeRef} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Cover Letter</label>
                <DropZone field="coverLetter" label="Upload your cover letter (PDF, DOC)" accept=".pdf,.doc,.docx" fileRef={coverRef} />
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-1">📎 Accepted formats: PDF, DOC, DOCX</p>
                <p className="text-sm text-slate-400">📦 Max file size: 10MB per file</p>
              </div>
            </div>
          )}

          {/* Step 5: Questions */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-400" /> Technical Questions</h2>
              <Textarea label="Why should we hire you? *" placeholder="Tell us what makes you stand out..." rows={4} value={form.whyHire} onChange={(e) => set("whyHire", e.target.value)} error={errors.whyHire} />
              <Textarea label="Describe your strongest project *" placeholder="Walk us through a project you're most proud of..." rows={4} value={form.strongestProject} onChange={(e) => set("strongestProject", e.target.value)} error={errors.strongestProject} />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Availability</label>
                  <div className="space-y-2">
                    {["Immediately", "2 weeks notice", "1 month notice", "3+ months"].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="availability" value={opt} checked={form.availability === opt} onChange={() => set("availability", opt)} className="accent-indigo-500" />
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Work Preference</label>
                  <div className="space-y-2">
                    {["Remote only", "Hybrid", "Onsite only", "Flexible"].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="workPreference" value={opt} checked={form.workPreference === opt} onChange={() => set("workPreference", opt)} className="accent-indigo-500" />
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={(e) => set("agreeTerms", e.target.checked)} className="accent-indigo-500 mt-0.5" />
                  <span className="text-sm text-slate-400">I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>. I confirm all information provided is accurate.</span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-red-400 mt-2">{errors.agreeTerms}</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <Button variant="secondary" onClick={prev} disabled={step === 1}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <span className="text-sm text-slate-500">Step {step} of {STEPS.length}</span>
            {step < 5 ? (
              <Button onClick={next}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
