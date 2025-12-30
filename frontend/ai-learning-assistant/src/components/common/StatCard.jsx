import React from "react";

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="group relative bg-white border border-indigo-100/60 rounded-3xl shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
        {label}
      </span>
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center shadow-sm">
        <Icon className="w-6 h-6 text-indigo-500" strokeWidth={2.2} />
      </div>
    </div>
    <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
      {value}
    </div>
  </div>
);

export default StatCard;
