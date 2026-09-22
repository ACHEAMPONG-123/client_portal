import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variantStyles = {
      primary: "bg-[#138808] text-white hover:bg-[#0F6E06] shadow-sm hover:shadow focus:ring-[#138808]",
      secondary: "bg-[#F2F3F4] text-[#0F172A] hover:bg-[#E2E8F0] focus:ring-[#CBD5E1]",
      outline: "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus:ring-[#138808]",
      ghost: "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus:ring-[#CBD5E1]",
      gold: "bg-[#FFD700] text-[#0F172A] hover:bg-[#E6C200] shadow-sm focus:ring-[#FFD700]",
      danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444]",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
