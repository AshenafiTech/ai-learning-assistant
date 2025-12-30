import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../../components/common/StatCard";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Dashboard Data:", data);

        setDashboardData(data);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-indigo-600/80 text-sm">
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  // Config for dashboard stats (icon, color, label)
  const statConfig = {
    totalDocuments: {
      label: "Total Documents",
      icon: FileText,
      gradient: "from-indigo-500 to-purple-600",
      shadowColor: "shadow-indigo-500/30",
    },
    totalFlashcardSets: {
      label: "Flashcard Sets",
      icon: BookOpen,
      gradient: "from-cyan-400 to-cyan-600",
      shadowColor: "shadow-cyan-500/30",
    },
    totalFlashcards: {
      label: "Total Flashcards",
      icon: BookOpen,
      gradient: "from-cyan-400 to-cyan-600",
      shadowColor: "shadow-cyan-500/30",
    },
    reviewedFlashcards: {
      label: "Reviewed Flashcards",
      icon: BookOpen,
      gradient: "from-indigo-400 to-cyan-600",
      shadowColor: "shadow-indigo-400/30",
    },
    starredFlashcards: {
      label: "Starred Flashcards",
      icon: BookOpen,
      gradient: "from-yellow-400 to-yellow-600",
      shadowColor: "shadow-yellow-400/30",
    },
    totalQuizzes: {
      label: "Total Quizzes",
      icon: BrainCircuit,
      gradient: "from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/30",
    },
    completedQuizzes: {
      label: "Completed Quizzes",
      icon: BrainCircuit,
      gradient: "from-green-400 to-green-600",
      shadowColor: "shadow-green-400/30",
    },
    averageScore: {
      label: "Average Score",
      icon: TrendingUp,
      gradient: "from-purple-500 to-indigo-500",
      shadowColor: "shadow-purple-500/30",
    },
    studyStreak: {
      label: "Study Streak (days)",
      icon: Clock,
      gradient: "from-orange-400 to-orange-600",
      shadowColor: "shadow-orange-400/30",
    },
  };

  // Only show stats that exist in overview and are configured
  const stats = Object.keys(dashboardData.overview)
    .filter((key) => statConfig[key])
    .map((key) => ({
      label: statConfig[key].label,
      value: dashboardData.overview[key],
      icon: statConfig[key].icon,
      gradient: statConfig[key].gradient,
      shadowColor: statConfig[key].shadowColor,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 relative">
      {/* Hero Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 animate-fade-in">
            Welcome Back!
          </h1>
          <p className="text-lg text-indigo-600/80 max-w-xl animate-fade-in delay-100">
            Here's a beautiful overview of your learning journey and
            achievements.
          </p>
        </div>
        <div className="flex items-center gap-4 animate-fade-in delay-200">
          <Star className="w-12 h-12 text-yellow-400 drop-shadow-lg animate-bounce" />
          <CheckCircle2 className="w-12 h-12 text-cyan-500 drop-shadow-lg animate-bounce delay-150" />
        </div>
      </div>

      {/* Animated Stats Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12 animate-fade-in-up">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Timeline for Recent Activities */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white/90 backdrop-blur-xl border-2 border-indigo-100/60 rounded-3xl shadow-2xl shadow-indigo-200/30 p-10 animate-fade-in-up delay-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-600" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Recent Activities
            </h3>
          </div>
          {dashboardData.recentActivities &&
          ((dashboardData.recentActivities.documents?.length || 0) > 0 ||
            (dashboardData.recentActivities.quizzes?.length || 0) > 0) ? (
            <ol className="relative border-l-4 border-indigo-100/60 ml-4 space-y-8">
              {[
                ...(dashboardData.recentActivities.documents || []).map(
                  (doc) => ({
                    id: doc._id,
                    description: doc.title,
                    timestamp: doc.lastAccessed,
                    link: `/documents/${doc._id}`,
                    type: "document",
                  })
                ),
                ...(dashboardData.recentActivities.quizzes || []).map(
                  (quiz) => ({
                    id: quiz._id,
                    description: quiz.title,
                    timestamp: quiz.lastAttempted,
                    link: `/quizzes/${quiz._id}`,
                    type: "quiz",
                  })
                ),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <li key={activity.id || index} className="ml-6 group">
                    <span
                      className={`absolute -left-6 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white ${
                        activity.type === "document"
                          ? "bg-gradient-to-br from-indigo-400 to-purple-400"
                          : "bg-gradient-to-br from-cyan-400 to-cyan-600"
                      } shadow-lg`}
                    >
                      {activity.type === "document" ? (
                        <FileText className="w-4 h-4 text-white" />
                      ) : (
                        <BrainCircuit className="w-4 h-4 text-white" />
                      )}
                    </span>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-indigo-50/40 border border-indigo-100/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-slate-900 truncate">
                          {activity.type === "document"
                            ? "Accessed Document: "
                            : "Attempted Quiz: "}
                          <span className="font-semibold text-indigo-700">
                            {activity.description}
                          </span>
                        </p>
                        <p className="text-xs text-indigo-600/60 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.link && (
                        <a
                          href={activity.link}
                          className="ml-0 md:ml-4 px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-all duration-200 whitespace-nowrap"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
                <Clock className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-sm text-indigo-600/80">
                No recent activities to show.
              </p>
              <p className="text-xs text-indigo-500/70 mt-1">
                Start learning to see your progress here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] bg-[length:16px_16px] opacity-20 pointer-events-none z-0" />
    </div>
  );
};

export default DashboardPage;
