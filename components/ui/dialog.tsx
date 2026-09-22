"use client";

import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 pr-8">
          <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
          {description && <p className="text-xs text-[#64748B] mt-1">{description}</p>}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
