import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition">
      {children}
    </div>
  );
}
