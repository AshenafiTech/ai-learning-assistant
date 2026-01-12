import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  BookOpen,
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Upload,
  MessageSquare,
  Target,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Document Analysis",
      description: "Upload PDFs and let AI extract key information, generate summaries, and identify important concepts.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: BookOpen,
      title: "Interactive Flashcards",
      description: "Automatically generate flashcards from your documents. Study smarter with spaced repetition.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Quizzes",
      description: "Test your knowledge with intelligent quizzes generated from your study materials.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: MessageSquare,
      title: "Chat with Documents",
      description: "Ask questions about your documents and get instant answers powered by advanced AI.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Sparkles,
      title: "AI Explanations",
      description: "Get detailed explanations of complex concepts and topics from your study materials.",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and progress insights.",
      gradient: "from-indigo-500 to-purple-600",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Documents",
      description: "Simply upload your PDF documents to get started. Our AI processes them instantly.",
      icon: Upload,
    },
    {
      number: "02",
      title: "Generate Materials",
      description: "Let AI create flashcards, quizzes, and summaries from your documents automatically.",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Study & Learn",
      description: "Practice with flashcards, take quizzes, and chat with your documents to master the material.",
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Q Study</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              Built for learners everywhere
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-tight text-slate-900"
            >
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Study</span>
              <br />
              <span>Smarter</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
            >
              Transform your documents into interactive study materials with AI. Generate flashcards, quizzes, and get instant answers from your PDFs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4"
            >
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/40 flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                Sign In
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[{ label: "For students", value: "Flashcards, quizzes, chat" }, { label: "Always on", value: "AI ready when you are" }, { label: "Secure", value: "You control your documents" }].map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 p-4 shadow-sm shadow-slate-900/5">
                  <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                  <div className="text-lg font-semibold text-slate-900 leading-snug">{stat.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-200/60 via-cyan-200/50 to-emerald-100/50 rounded-[36px] blur-3xl" />
            <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[32px] shadow-2xl shadow-slate-900/10 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                  <FileText className="w-8 h-8 text-violet-600 mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">Upload PDF</h3>
                  <p className="text-sm text-slate-600">Drag & drop your study materials</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                  <Zap className="w-8 h-8 text-cyan-600 mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">AI Processing</h3>
                  <p className="text-sm text-slate-600">Instant analysis & generation</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 sm:col-span-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Study Tools</h3>
                      <p className="text-sm text-slate-600">Flashcards, quizzes & chat from one place</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-700">
                    <div className="bg-white/70 rounded-xl px-3 py-2 border border-emerald-100">Flashcards</div>
                    <div className="bg-white/70 rounded-xl px-3 py-2 border border-emerald-100">Quizzes</div>
                    <div className="bg-white/70 rounded-xl px-3 py-2 border border-emerald-100">AI Chat</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[{
                  icon: CheckCircle2,
                  title: "Auto-generated",
                  description: "AI builds study-ready cards",
                }, {
                  icon: MessageSquare,
                  title: "Ask anything",
                  description: "Chat with your PDFs instantly",
                }, {
                  icon: Target,
                  title: "Quiz mode",
                  description: "Test retention in minutes",
                }].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200">
                        <Icon className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Powerful AI Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to accelerate your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-900/5 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-900/5 border border-slate-200/60">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-black text-slate-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-300 to-purple-300 transform -translate-y-1/2" />
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-16 text-center text-white shadow-2xl shadow-violet-500/25">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter with AI
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
            <span className="text-lg font-semibold ml-2">4.9/5 from 2,000+ reviews</span>
          </div>
          
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 hover:bg-violet-50 font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Q Study</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-slate-500">
            <p>© 2024 Q Study. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;