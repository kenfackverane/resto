import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 pointer-events-none">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-3 font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;