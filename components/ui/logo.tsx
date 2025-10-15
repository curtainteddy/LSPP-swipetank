import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8">
        <Image
          src="/logo.png"
          alt="SwipeTank Logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      </div>
      <span className="font-bold text-xl">SwipeTank</span>
    </div>
  )
}
