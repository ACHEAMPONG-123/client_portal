/**
 * Centralized Design System Tokens
 * Brand Palette:
 * - Base: Pure Crisp White (#FFFFFF) & Platinum Canvas (#F2F3F4)
 * - Primary Action / Buttons: India Green (#138808)
 * - Highlights & Pending Badges: Gold (#FFD700)
 * - Text Primary: Slate 900 (#0F172A)
 * - Borders: Slate 200 (#E2E8F0)
 */

export const themeTokens = {
  colors: {
    base: "#FFFFFF",
    platinum: "#F2F3F4",
    primaryGreen: "#138808",
    primaryGreenHover: "#0F6E06",
    primaryGreenLight: "#E8F5E9",
    gold: "#FFD700",
    goldDark: "#D4AF37",
    goldLight: "#FFFDE7",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    borderDark: "#CBD5E1",
    cardBackground: "#FFFFFF",
    sidebarBackground: "#FFFFFF",
    status: {
      active: { bg: "#E8F5E9", text: "#138808", border: "#A5D6A7" },
      pending: { bg: "#FFFDE7", text: "#B78103", border: "#FFE082" },
      inProgress: { bg: "#E0F2FE", text: "#0284C7", border: "#BAE6FD" },
      urgent: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
      completed: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
    },
  },
  typography: {
    fontFamily: "'Inter Tight', sans-serif",
  },
  shadows: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
    dropdown: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
} as const;
