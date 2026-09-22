import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "active" | "pending" | "inProgress" | "urgent" | "completed" | "neutral" | "gold";
}

export function Badge({ className = "", variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    active: "bg-[#E8F5E9] text-[#138808] border-[#A5D6A7]",
    pending: "bg-[#FFFDE7] text-[#B78103] border-[#FFE082]",
    inProgress: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
    urgent: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
    completed: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
    gold: "bg-[#FFD700] text-[#0F172A] border-[#E6C200]",
    neutral: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]",
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
