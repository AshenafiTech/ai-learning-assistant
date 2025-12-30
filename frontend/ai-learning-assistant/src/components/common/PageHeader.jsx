import React from "react";

const PageHeader = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-7 h-7 text-indigo-600" />}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
