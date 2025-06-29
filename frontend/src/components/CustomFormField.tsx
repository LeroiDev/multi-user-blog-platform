import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block font-medium mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
