import React from 'react'

const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    disabled = false,
    className = "",
    variant = "primary",
    size = "md",
}) => { 
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap";

    const variantStyles = {
        primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-300/50",
        secondary: "bg-gradient-to-r from-cyan-400 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-600 shadow-lg shadow-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-300/50",
        danger: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/30 focus:outline-none focus:ring-4 focus:ring-pink-300/50",
    };

    const sizeStyles = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-sm",
    };

    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className={[
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className
            ].join(' ') }
        >
            {children}
        </button>
    );
};

export default Button;