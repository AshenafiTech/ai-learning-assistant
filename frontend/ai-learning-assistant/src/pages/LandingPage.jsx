import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  BookOpen,
  BrainCircuit,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Upload,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Document Analysis",
      description:
        "Upload PDFs and let AI extract key information, generate summaries, and identify important concepts.",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    {
      icon: BookOpen,
      title: "Interactive Flashcards",
      description:
        "Automatically generate flashcards from your documents. Study smarter with spaced repetition.",
      gradient: "from-cyan-400 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-50",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Quizzes",
      description:
        "Test your knowledge with intelligent quizzes generated from your study materials.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      icon: MessageSquare,
      title: "Chat with Your Documents",
      description:
        "Ask questions about your documents and get instant answers powered by advanced AI.",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    {
      icon: Sparkles,
      title: "AI Explanations",
      description:
        "Get detailed explanations of complex concepts and topics from your study materials.",
      gradient: "from-cyan-400 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-50",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description:
        "Monitor your learning journey with detailed analytics and progress tracking.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Documents",
      description:
        "Simply upload your PDF documents to get started. Our AI will process them instantly.",
      icon: Upload,
      color: "indigo",
    },
    {
      number: "02",
      title: "Generate Study Materials",
      description:
        "Let AI create flashcards, quizzes, and summaries from your documents automatically.",
      icon: Sparkles,
      color: "cyan",
    },
    {
      number: "03",
      title: "Study & Learn",
      description:
        "Practice with flashcards, take quizzes, and chat with your documents to master the material.",
      icon: Target,
      color: "pink",
    },
  ];

  const benefits = [
    "Save hours of manual note-taking",
    "Personalized learning experience",
    "Study anytime, anywhere",
    "Track your progress in real-time",
    "AI-powered insights and recommendations",
    "Interactive and engaging study tools",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Indigo/Purple Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 opacity-90 -z-10" />
      {/* SVG Grid Background Image */}
      <img
        src="/landing-grid-bg.svg"
        alt="Grid background"
        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none select-none"
        style={{ opacity: 0.18 }}
      />
      {/* Navigation */}
      <nav className="relative z-10 border-b border-indigo-100/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/qstudy-logo.svg"
                alt="Q Study logo"
                className="w-10 h-10 rounded-xl shadow-md shadow-indigo-500/30"
                style={{ background: "none" }}
              />
              <span className="text-xl font-bold text-slate-900">Q Study</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Chegg-style Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-600 mb-6 leading-tight drop-shadow-lg">
            Get Study Help
            <span className="block text-purple-700 font-bold drop-shadow-none">
              Anytime, Anywhere
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
            Step up your learning with instant AI-powered answers, flashcards,
            and quizzes. Upload your materials or ask anything and get help in
            seconds.
          </p>
          {/* Search Bar */}
          <form className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-lg border border-indigo-200 overflow-hidden mb-6 max-w-lg w-full gap-2 sm:gap-0">
            <input
              type="text"
              placeholder="What do you want to learn today?"
              className="flex-1 px-5 py-4 text-lg outline-none bg-transparent min-w-0"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-4 font-bold text-lg transition-colors w-full sm:w-auto"
            >
              Search
            </button>
          </form>
          {/* Removed Get Started and Sign In buttons from hero section for cleaner look */}
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
            alt="Student studying"
            className="w-full max-w-md drop-shadow-2xl rounded-3xl border-4 border-indigo-100 bg-white/80 object-cover"
            style={{
              aspectRatio: "1/1",
              minHeight: "320px",
              minWidth: "320px",
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-20">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 mb-4 shadow-sm">
            <Sparkles className="w-6 h-6 text-indigo-500" strokeWidth={2.5} />
            <span className="text-base font-semibold text-indigo-700 tracking-wide">
              All-in-One AI Study Suite
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Excel
            </span>
            <span className="block text-lg md:text-2xl font-medium text-indigo-600/80 mt-2">
              Smarter, faster, and more engaging learning—powered by AI.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl p-8 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-indigo-600/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-indigo-600/70 max-w-2xl mx-auto">
            Get started in minutes and transform your study routine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colorClasses = {
              indigo: "from-indigo-500 to-purple-600",
              cyan: "from-cyan-400 to-cyan-600",
              pink: "from-pink-500 to-rose-500",
            };
            return (
              <div key={index} className="relative">
                <div className="bg-white/90 backdrop-blur-xl border border-indigo-100/60 rounded-2xl p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      colorClasses[step.color]
                    } mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-6xl font-bold text-indigo-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-indigo-600/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 transform -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-20">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 md:p-16 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Why Choose Q Study?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 text-center max-w-2xl mx-auto">
              Join thousands of students who are already studying smarter
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2
                    className="w-6 h-6 text-cyan-300 shrink-0"
                    strokeWidth={2.5}
                  />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-20">
        <div className="bg-white/90 backdrop-blur-xl border-2 border-indigo-200 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-indigo-600/70 mb-10 max-w-2xl mx-auto">
            Join Q Study today and experience the future of learning
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mx-auto mt-6">
            <Link
              to="/register"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                strokeWidth={2.5}
              />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-lg font-semibold rounded-xl transition-all duration-200 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-indigo-100/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <GraduationCap size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">Q Study</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-100/60 text-center text-sm text-indigo-600/70">
            <p>© 2024 Q Study. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
