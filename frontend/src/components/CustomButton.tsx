// src/components/CustomButton.tsx
import { type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import classNames from "classnames";

// Base styles for both Button and LinkButton
const base =
  "inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

// Extendable variants
const variants = {
  primary:   "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
  secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-400",
  error:     "bg-error text-white hover:bg-red-700 focus:ring-error",
} as const;
type Variant = keyof typeof variants;

// Plain <button>
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}
export function Button({
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(base, variants[variant], className)}
      {...rest}
    />
  );
}

// <Link> styled as button
export interface LinkButtonProps extends LinkProps {
  variant?: Variant;
  className?: string;
}
export function LinkButton({
  variant = "primary",
  className,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      className={classNames(base, variants[variant], className)}
      {...rest}
    />
  );
}
