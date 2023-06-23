import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-2 bg-white shadow-md animate-pulse w-full h-28 rounded-lg">
      <div className="place-items-center grid mx-auto my-auto rounded-full bg-slate-200 animate-pulse h-24 w-24"></div>
      <div className="flex flex-col my-auto px-2 gap-2">
        <div className="bg-slate-200 animate-pulse h-12 w-20 rounded"></div>
        <div className="bg-slate-200 animate-pulse h-6 w-24 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
