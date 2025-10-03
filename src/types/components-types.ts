import type { IconType } from "react-icons";

export interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: IconType;
  color: string;
}
