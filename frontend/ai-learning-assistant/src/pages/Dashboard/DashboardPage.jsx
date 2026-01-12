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
        setDashboardData(data);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData?.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4 mx-auto">
            <TrendingUp className="w-8 h-8 text-violet-600" />
          </div>
          <p className="text-slate-600">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const statConfig = {
    totalDocuments: { label: "Documents", icon: FileText, gradient: "from-violet-500 to-purple-600" },
    totalFlashcardSets: { label: "Flashcard Sets", icon: BookOpen, gradient: "from-cyan-400 to-cyan-600" },
    totalFlashcards: { label: "Flashcards", icon: BookOpen, gradient: "from-emerald-400 to-emerald-600" },
    reviewedFlashcards: { label: "Reviewed", icon: CheckCircle2, gradient: "from-green-400 to-green-600" },
    totalQuizzes: { label: "Quizzes", icon: BrainCircuit, gradient: "from-pink-500 to-rose-500" },
    completedQuizzes: { label: "Completed", icon: CheckCircle2, gradient: "from-indigo-500 to-purple-600" },
    averageScore: { label: "Avg Score", icon: TrendingUp, gradient: "from-orange-400 to-orange-600" },
    studyStreak: { label: "Study Streak", icon: Clock, gradient: "from-amber-400 to-amber-600" },
  };

  const stats = Object.keys(dashboardData.overview)
    .filter(key => statConfig[key])
    .map(key => ({
      ...statConfig[key],
      value: dashboardData.overview[key],
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-cyan-50/50" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Track your learning progress and achievements
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Recent Activities</h3>
          </div>
          
          {dashboardData.recentActivities && 
           (dashboardData.recentActivities.documents?.length > 0 || dashboardData.recentActivities.quizzes?.length > 0) ? (
            <div className="space-y-4">
              {[
                ...(dashboardData.recentActivities.documents || []).map(doc => ({
                  id: doc._id,
                  title: doc.title,
                  timestamp: doc.lastAccessed,
                  type: "document",
                  link: `/documents/${doc._id}`,
                })),
                ...(dashboardData.recentActivities.quizzes || []).map(quiz => ({
                  id: quiz._id,
                  title: quiz.title,
                  timestamp: quiz.lastAttempted,
                  type: "quiz",
                  link: `/quizzes/${quiz._id}`,
                }))
              ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 5)
              .map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === "document" 
                      ? "bg-gradient-to-br from-violet-500 to-purple-600" 
                      : "bg-gradient-to-br from-pink-500 to-rose-500"
                  }`}>
                    {activity.type === "document" ? (
                      <FileText className="w-5 h-5 text-white" />
                    ) : (
                      <BrainCircuit className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{activity.title}</p>
                    <p className="text-sm text-slate-600">
                      {activity.type === "document" ? "Document accessed" : "Quiz attempted"} • 
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={activity.link}
                    className="px-4 py-2 bg-violet-100 text-violet-700 hover:bg-violet-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No recent activities</p>
              <p className="text-sm text-slate-500 mt-1">Start learning to see your progress here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
