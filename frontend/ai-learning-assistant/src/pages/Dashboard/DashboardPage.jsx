import React, { useState, useEffect } from 'react'
import Spinner from '../../components/common/Spinner'
import progressService from '../../services/progressService'
import toast from 'react-hot-toast'
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock} from 'lucide-react'

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
        toast.error('Failed to load dashboard data.');
        console.error('Error fetching dashboard data:', error);
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
      <div className='min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4'>
            <TrendingUp className='w-8 h-8 text-indigo-400' />
          </div>
          <p className='text-indigo-600/80 text-sm'>
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments ?? 0,
      icon: FileText,
      gradient: 'from-indigo-500 to-purple-600',
      shadowColor: 'shadow-indigo-500/30',  
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards ?? dashboardData.overview.totalFlashcardSets ?? 0,
      icon: BookOpen,
      gradient: 'from-cyan-400 to-cyan-600',
      shadowColor: 'shadow-cyan-500/30',
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes ?? 0,
      icon: BrainCircuit,
      gradient: 'from-pink-500 to-rose-500',
      shadowColor: 'shadow-pink-500/30',
    }
  ];

  return (
    <div className='min-h-screen'>
      <div className='absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 pointer-events-none' />
     
      <div className='relative max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>
            Dashboard
          </h1>
          <p className='text-indigo-600/80 text-sm'>
            Welcome back! Here's an overview of your learning progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-5'>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white/90 backdrop-blur-xl border border-indigo-100/60
              rounded-2xl shadow-xl shadow-indigo-200/30 p-6 hover:shadow-2xl hover:shadow-indigo-300/40
              transition-all duration-300 hover:-translate-y-1"
              >
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-semibold text-indigo-600/70 uppercase tracking-wide'>
                    {stat.label}
                  </span>
                  <div className= {`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} 
                  flex items-center justify-center text-white ${stat.shadowColor} 
                  shadow-lg`}>
                    <stat.icon className='w-5 h-5 text-white' strokeWidth={2} />
                  </div>
                </div>
                <div className='text-3xl font-semibold text-slate-900 tracking-tight mt-2'>
                  {stat.value}
                </div>
            </div>
          ))} 
        </div>

        {/* Recent Activities Section */}
        <div className='bg-white/90 backdrop-blur-xl border border-indigo-100/60 
        rounded-2xl shadow-xl shadow-indigo-200/30 p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 
            flex items-center justify-center '>
              <Clock className='w-5 h-5 text-indigo-600' strokeWidth={2} />
            </div>
            <h3 className='text-xl font-medium text-slate-900 tracking-tight'>
              Recent Activities
            </h3>
          </div>

          {dashboardData.recentActivities && ((dashboardData.recentActivities.documents?.length || 0) > 0 || (dashboardData.recentActivities.quizzes?.length || 0) > 0) ? (
            <div className='space-y-3'>
              {[
                ...(dashboardData.recentActivities.documents || []).map((doc) => ({
                  id: doc._id,
                  description: doc.title,
                  timestamp: doc.lastAccessed,
                  link: `/documents/${doc._id}`,
                  type: 'document',
                })),
                ...(dashboardData.recentActivities.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.lastAttempted,
                  link: `/quizzes/${quiz._id}`,
                  type: 'quiz',
                }))
              ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((activity, index) => (
                <div
                  key={activity.id || index}
                  className='group flex items-center justify-between p-4 rounded-xl bg-indigo-50/30 border border-indigo-100/60 hover:bg-indigo-50/50 hover:border-indigo-200/60 hover:shadow-md transition-all duration-200'
                  >
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <div className={`w-8 h-2 rounded-full ${
                          activity.type === 'document' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                          : 'bg-gradient-to-r from-cyan-400 to-cyan-600'
                        }`} />
                        <p className='text-sm font-medium text-slate-900 truncate'>
                          {activity.type === 'document' ? 'Accessed Document: ' : 'Attempted Quiz'}
                          <span className=''>
                            {activity.description}
                          </span>
                        </p>
                      </div>
                      <p className='text-xs text-indigo-600/60 pl-4'>
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.link && (
                      <a 
                        href={activity.link}
                        className='ml-4 px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-all duration-200 whitespace-nowrap'
                        >
                          View
                        </a>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4'>
                <Clock className='w-8 h-8 text-indigo-400' />
              </div>
              <p className='text-sm text-indigo-600/80'>No recent activities to show.</p>
              <p className='text-xs text-indigo-500/70 mt-1'>Start learning to see your progress here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
