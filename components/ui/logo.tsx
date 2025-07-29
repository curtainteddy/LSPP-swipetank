import { Sparkles } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-blue-glow">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-xl">SwipeTank</span>
    </div>
  )
}
