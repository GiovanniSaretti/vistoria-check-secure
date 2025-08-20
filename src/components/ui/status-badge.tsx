import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, AlertCircle, MinusCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium border transition-smooth",
  {
    variants: {
      status: {
        ok: "status-ok",
        pending: "status-pending", 
        na: "status-na",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      status: "na",
      size: "default",
    },
  }
)

const statusIcons = {
  ok: CheckCircle,
  pending: AlertCircle,
  na: MinusCircle,
}

const statusLabels = {
  ok: "OK",
  pending: "Pendência",
  na: "N/A",
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: "ok" | "pending" | "na"
  showIcon?: boolean
  showLabel?: boolean
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, size, showIcon = true, showLabel = true, ...props }, ref) => {
    const Icon = statusIcons[status]
    
    return (
      <div
        className={cn(statusBadgeVariants({ status, size, className }))}
        ref={ref}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4" />}
        {showLabel && statusLabels[status]}
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }