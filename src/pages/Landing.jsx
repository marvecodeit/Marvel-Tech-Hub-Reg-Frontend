import { Link } from "react-router-dom";
import { ArrowRight, Code2, Layers, Smartphone, Cloud, Palette, GitBranch, Star, ChevronDown,    Zap, Users, Briefcase, TrendingUp } from "lucide-react";
import { Button, Badge, Accordion } from "../components/ui/index.jsx";
import { testimonials, faqs, technologies } from "../data/mockData.js";

const services = [
  { icon: Code2, title: "Frontend Engineering", desc: "React, Vue, Angular — we place top-tier frontend talent.", color: "indigo" },
  { icon: Layers, title: "Fullstack Development", desc: "End-to-end engineers who own the entire product stack.", color: "purple" },
  { icon: Cloud, title: "Cloud & DevOps", desc: "AWS, GCP, Kubernetes specialists for modern infrastructure.", color: "cyan" },
  { icon: Smartphone, title: "Mobile Development", desc: "iOS, Android, and cross-platform React Native experts.", color: "emerald" },
  { icon: Palette, title: "UI/UX Design", desc: "Product designers who craft beautiful, usable interfaces.", color: "amber" },
  { icon: GitBranch, title: "Backend Engineering", desc: "Node.js, Python, Go — scalable backend architecture.", color: "indigo" },
];

const stats = [
  { icon: Users, value: "2,400+", label: "Developers Placed" },
  { icon: Briefcase, value: "180+", label: "Partner Companies" },
  { icon: TrendingUp, value: "94%", label: "Placement Rate" },
  { icon: Star, value: "4.9/5", label: "Candidate Rating" },
];

const colorMap = {
  indigo: "from-indigo-600/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400",
  purple: "from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400",
  cyan: "from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
  emerald: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  amber: "from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400",
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <div className="orb w-96 h-96 bg-indigo-600 top-20 left-1/4" />
        <div className="orb w-80 h-80 bg-purple-600 bottom-20 right-1/4" />
        <div className="orb w-64 h-64 bg-cyan-600 top-1/2 right-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">Now hiring across 12 engineering roles</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Build Your Career at<br />
            <span className="gradient-text">Marvel Tech Hub</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the most innovative engineering team. We're hiring world-class developers, designers, and cloud engineers to shape the future of technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="xl" className="group">
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" size="xl">Browse Jobs</Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass rounded-2xl p-5 text-center">
                <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge color="indigo">What We Offer</Badge>
          <h2 className="text-4xl font-bold text-white mt-4 mb-4">Engineering Roles We Hire For</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From frontend to infrastructure, we connect exceptional engineers with companies building the future.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={`rounded-2xl p-6 bg-gradient-to-br border ${colorMap[color]} hover:-translate-y-1 transition-all duration-300 cursor-default`}>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="purple">Tech Stack</Badge>
            <h2 className="text-4xl font-bold text-white mt-4 mb-4">Technologies We Work With</h2>
            <p className="text-slate-400">We hire for the most in-demand technologies in the industry.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map(({ name, icon }) => (
              <div key={name} className="glass rounded-2xl p-4 text-center hover:bg-white/10 transition-all hover:-translate-y-1 cursor-default">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-xs font-medium text-slate-300">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Culture */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge color="cyan">Our Culture</Badge>
            <h2 className="text-4xl font-bold text-white mt-4 mb-6">Built by Developers, for Developers</h2>
            <p className="text-slate-400 leading-relaxed mb-8">We believe great engineering culture is the foundation of great products. At Marvel Tech Hub, we foster an environment where innovation thrives, learning never stops, and every engineer has the autonomy to do their best work.</p>
            <div className="space-y-4">
              {["Remote-first & async-friendly", "Continuous learning budget", "Open source contributions encouraged", "Flat hierarchy, direct impact"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link to="/apply" className="inline-block mt-8">
              <Button>Join Our Team <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Engineering", value: "60%", color: "indigo" },
              { label: "Remote Team", value: "85%", color: "purple" },
              { label: "Satisfaction", value: "97%", color: "cyan" },
              { label: "Retention", value: "91%", color: "emerald" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`glass rounded-2xl p-6 text-center bg-gradient-to-br border ${colorMap[color]}`}>
                <p className="text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="emerald">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-white mt-4">What Our Engineers Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }) => (
              <div key={name} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white">{avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <Badge color="amber">FAQ</Badge>
          <h2 className="text-4xl font-bold text-white mt-4">Frequently Asked Questions</h2>
        </div>
        <Accordion items={faqs} />
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="orb w-64 h-64 bg-indigo-600 -top-20 -left-20" />
          <div className="orb w-64 h-64 bg-purple-600 -bottom-20 -right-20" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Join Marvel Tech Hub?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Submit your application today and take the first step toward your next great engineering role.</p>
            <Link to="/apply">
              <Button size="xl">Start Your Application <ArrowRight className="w-5 h-5" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Marvel<span className="gradient-text">Tech</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Building the future of tech talent, one engineer at a time.</p>
            </div>
            {[
              { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
              { title: "Platform", links: ["Browse Jobs", "Apply Now", "Dashboard", "Admin"] },
              { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-sm font-semibold text-white mb-4">{title}</p>
                <ul className="space-y-2">
                  {links.map((l) => <li key={l}><a href="#" className="text-slate-500 text-sm hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
            <p className="text-slate-600 text-sm">© 2024 Marvel Tech Hub. All rights reserved.</p>
            <div className="flex gap-4">
              {[].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
