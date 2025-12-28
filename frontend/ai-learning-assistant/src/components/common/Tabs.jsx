import React from 'react'

const Tabs = ({ tabs, activeTab, setActiveTab }) => {

  return (
    <div className='w-full'>
      <div className='relative border-b-2 border-indigo-100'>
        <nav className='flex gap-2'>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.name
                    ? 'text-indigo-600'
                    : 'text-indigo-600/70 hover:text-indigo-900'
              }`}
            >
                <span className='relative z-10'>{tab.label}</span>
                {activeTab === tab.name && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600
                    rounded-full shadow-lg shadow-indigo-500/30" />
                )}
                {activeTab === tab.name && (
                  <div
                    className='absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-t-xl -z-10'
                  />
                )}
            </button>
          ))}
        </nav>
      </div>

        <div className='py-6' >
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            const content = typeof tab.content === 'function' ? tab.content() : tab.content;
            return (
              <div key={tab.name} className='animate-in fade-in duration-300'>
                {content}
              </div>
            );
          }
          return null;
        })}
        </div>
    </div>
  )
}

export default Tabs
