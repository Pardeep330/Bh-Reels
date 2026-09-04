"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  isLoading,
  message = "Processing & Saving Changes...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/40 shadow-2xl flex flex-col items-center space-y-4 max-w-sm text-center">
        {/* Animated Gold Ring Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#D4AF37] border-r-transparent border-b-[#B8860B] border-l-transparent animate-spin" />
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
            {message} <Sparkles className="w-4 h-4 text-[#B8860B]" />
          </h4>
          <p className="text-xs text-slate-500">Communicating with server & MongoDB Atlas...</p>
        </div>
      </div>
    </div>
  );
};
