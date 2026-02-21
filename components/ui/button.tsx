import * as React from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold font-body ring-offset-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-saffron to-saffron-bright text-white rounded-full shadow-saffron-glow hover:shadow-saffron-hover hover:-translate-y-0.5 focus-visible:ring-saffron",
        destructive: "bg-red-500 text-white rounded-xl hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border-[1.5px] border-border-2 bg-white text-text-900 rounded-full shadow-sh-sm hover:border-saffron hover:text-saffron focus-visible:ring-saffron",
        secondary:
          "bg-white text-text-900 border border-border-school rounded-xl shadow-sh-sm hover:shadow-sh-md hover:border-border-2 focus-visible:ring-saffron",
        ghost: "text-text-700 rounded-xl hover:bg-saffron-pale hover:text-saffron focus-visible:ring-saffron",
        "ghost-dark":
          "bg-white/10 border border-white/15 text-white rounded-full hover:bg-white/15 focus-visible:ring-white/40 focus-visible:ring-offset-navy",
        link: "text-saffron underline-offset-4 hover:underline focus-visible:ring-saffron",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm",
        sm: "h-9 rounded-full px-4 text-[13px]",
        lg: "h-12 rounded-full px-8 text-[15px]",
        xl: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
