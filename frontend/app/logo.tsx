import React from 'react';

const LevitatingLogo = () => {
  return (
    <div className="relative flex items-center justify-center h-48">
      {/* Glow effect */}
      <div className="absolute w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Logo container */}
      <div className="relative">
        {/* Shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-black/10 blur-md rounded-full animate-shadow" />
        
        {/* Logo */}
        <img
          src="LogoRepCheck.png"
          alt="Levitating Logo"
          className="relative w-56 h-56 object-contain animate-levitate"
        />
      </div>

      <style jsx>{`
        @keyframes levitate {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        
        @keyframes shadow {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateX(-50%) scale(0.8);
            opacity: 0.1;
          }
        }
        
        .animate-levitate {
          animation: levitate 3s ease-in-out infinite;
        }
        
        .animate-shadow {
          animation: shadow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LevitatingLogo;