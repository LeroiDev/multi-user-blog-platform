// src/components/Button.tsx
import React, { type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import classNames from "classnames";

const base =
  "inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
} as const;
type Variant = keyof typeof variants;

// Plain button
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
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

// Link as button
export interface LinkButtonProps extends LinkProps {
  variant?: Variant;
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
