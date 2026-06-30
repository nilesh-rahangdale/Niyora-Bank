import React from 'react';

const Logo = ({ className = 'flex items-center gap-3', iconSize = 'w-8 h-8', textSize = 'text-lg', showText = true }) => {
  return (
    <div className={className}>
      
      {/* <img src="/public/Untitled design.svg" alt="" className='h-7' />  */}
      <img src="/Niyora_svg.png" alt="" className='h-8' />


      {showText && (
        <div className={`font-logo font-bold ${textSize} select-none flex items-center tracking-wide`}>
          <span className="text-white">Niyora</span>
          <span className="text-[#38bdf8] ml-1.5 font-extrabold">Bank</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
