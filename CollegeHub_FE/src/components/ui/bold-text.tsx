import { cn } from "@/lib/utils"

/** Renders text with **bold** markers as actual bold. */
export function BoldText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <span className={cn(className)}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  )
}
