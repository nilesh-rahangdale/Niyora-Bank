import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070b13] px-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 text-center border border-slate-800">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full w-fit mx-auto mb-4 animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Access Unauthorized</h1>
        <p className="text-sm text-slate-400 mb-6">
          Your credentials do not grant access to the requested corporate environment segment.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150"
        >
          Return to Previous
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
