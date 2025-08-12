import * as React from "react"
import { UserIcon, LockIcon, MailIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "user" | "lock" | "email" | "username"
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
  const getIcon = () => {
    switch (variant) {
      case "user":
        return <UserIcon className="h-5 w-5 text-muted-foreground" />
      case "lock":
        return <LockIcon className="h-5 w-5 text-muted-foreground" />
      case "email":
        return <MailIcon className="h-5 w-5 text-muted-foreground" />
      case "username":
        return <UserIcon className="h-5 w-5 text-muted-foreground" />
      default:
        return null
    }
  }

  const icon = getIcon()

  if (variant !== "default") {
    return (
      <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
        {icon}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border-0 bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:ring-0",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
