import * as React from "react"
import { cn } from "../../lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, className, label, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id ?? generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center gap-2 select-none cursor-pointer group",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input
          id={checkboxId}
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "size-4 rounded-[4px] border border-gray-300 bg-white",
            "flex items-center justify-center transition-colors",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600",
            "peer-checked:bg-blue-600 peer-checked:border-blue-600"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        {label && <span className="text-sm text-gray-800">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"

