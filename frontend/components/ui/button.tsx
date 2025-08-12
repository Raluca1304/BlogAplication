import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        success:
          "bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:ring-green-600/20 dark:focus-visible:ring-green-600/40 dark:bg-green-600/60",
        greenDark:
          "bg-green-800 text-white shadow-xs hover:bg-green-900 focus-visible:ring-green-800/20 dark:focus-visible:ring-green-800/40 dark:bg-green-800/60",
        blue:
          "bg-blue-600 text-white shadow-xs hover:bg-blue-700 focus-visible:ring-blue-600/20 dark:focus-visible:ring-blue-600/40 dark:bg-blue-600/60",
        blueLight:
          "bg-blue-400 text-white shadow-xs hover:bg-blue-500 focus-visible:ring-blue-400/20 dark:focus-visible:ring-blue-400/40 dark:bg-blue-400/60",
        blueDark:
          "bg-blue-800 text-white shadow-xs hover:bg-blue-900 focus-visible:ring-blue-800/20 dark:focus-visible:ring-blue-800/40 dark:bg-blue-800/60",
        yellow:
          "bg-yellow-500 text-black shadow-xs hover:bg-yellow-600 focus-visible:ring-yellow-500/20 dark:focus-visible:ring-yellow-500/40 dark:bg-yellow-500/60",
        orange:
          "bg-orange-500 text-white shadow-xs hover:bg-orange-600 focus-visible:ring-orange-500/20 dark:focus-visible:ring-orange-500/40 dark:bg-orange-500/60",
        gray:
          "bg-gray-500 text-white shadow-xs hover:bg-gray-600 focus-visible:ring-gray-500/20 dark:focus-visible:ring-gray-500/40 dark:bg-gray-500/60",
        graySubtle:
          "bg-gray-200 text-gray-800 shadow-xs hover:bg-gray-300 focus-visible:ring-gray-200/20 dark:focus-visible:ring-gray-200/40 dark:bg-gray-700/60 dark:text-gray-200",
        redSubtle:
          "bg-red-100 text-red-700 shadow-xs hover:bg-red-200 focus-visible:ring-red-100/20 dark:focus-visible:ring-red-100/40 dark:bg-red-900/60 dark:text-red-200",
        redDark:
          "bg-red-800 text-white shadow-xs hover:bg-red-900 focus-visible:ring-red-800/20 dark:focus-visible:ring-red-800/40 dark:bg-red-800/60",
        lime:
          "bg-lime-500 text-black shadow-xs hover:bg-lime-600 focus-visible:ring-lime-500/20 dark:focus-visible:ring-lime-500/40 dark:bg-lime-500/60",
        cyan:
          "bg-cyan-500 text-white shadow-xs hover:bg-cyan-600 focus-visible:ring-cyan-500/20 dark:focus-visible:ring-cyan-500/40 dark:bg-cyan-500/60",
        orangeAcid:
          "bg-orange-400 text-black shadow-xs hover:bg-orange-500 focus-visible:ring-orange-400/20 dark:focus-visible:ring-orange-400/40 dark:bg-orange-400/60",
        warmGradient:
          "bg-gradient-to-r from-orange-200 to-pink-200 text-gray-800 shadow-xs hover:from-orange-300 hover:to-pink-300 focus-visible:ring-orange-300/20 dark:focus-visible:ring-orange-300/40 border border-orange-300/30",
        warmSolid:
          "bg-orange-200 text-gray-800 shadow-xs hover:bg-orange-300 focus-visible:ring-orange-200/20 dark:focus-visible:ring-orange-200/40 border border-orange-300/30",
        darkBlueGradient:
          "bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-xs hover:from-blue-700 hover:to-blue-800 focus-visible:ring-blue-800/20 dark:focus-visible:ring-blue-800/40 border border-blue-700/30",
        burgundy:
          "bg-[#3D2C2E] text-white shadow-xs hover:bg-[#4A3638] focus-visible:ring-[#3D2C2E]/20 dark:focus-visible:ring-[#3D2C2E]/40 border border-[#3D2C2E]/30",
        teal:
          "bg-[#0F8B8D] text-white shadow-xs hover:bg-[#0A6B6D] focus-visible:ring-[#0F8B8D]/20 dark:focus-visible:ring-[#0F8B8D]/40 border border-[#0F8B8D]/30",
        beige:
          "bg-[#BCAC9B] text-[#3D2C2E] shadow-xs hover:bg-[#C5B5A4] focus-visible:ring-[#BCAC9B]/20 dark:focus-visible:ring-[#BCAC9B]/40 border border-[#BCAC9B]/30",
        navy:
          "bg-[#19647E] text-white shadow-xs hover:bg-[#145A72] focus-visible:ring-[#19647E]/20 dark:focus-visible:ring-[#19647E]/40 border border-[#19647E]/30",
        forest:
          "bg-[#032C09] text-white shadow-xs hover:bg-[#043A0C] focus-visible:ring-[#032C09]/20 dark:focus-visible:ring-[#032C09]/40 border border-[#032C09]/30",
        navyRounded:
          "bg-[#BCAC9B] text-white shadow-xs hover:bg-[#BCAC9B] focus-visible:ring-[#BCAC9B]/20 dark:focus-visible:ring-[#BCAC9B]/40 border border-[#19647E]/30 rounded-full w-10 h-10 flex items-center justify-center",
          newRounded:
          "bg-[#5C574F] text-white shadow-xs hover:bg-[#5C574F] focus-visible:ring-[#5C574F]/20 dark:focus-visible:ring-[#5C574F]/40 border border-[#5C574F]/30 rounded-full w-10 h-10 flex items-center justify-center",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
