import type { ReactNode } from "react";

// Define types for router props
export interface RouterProps {
  children: ReactNode;
}

export interface RouteProps {
  path: string;
  element: ReactNode;
  currentPath: string;
}
