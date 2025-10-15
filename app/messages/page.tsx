import { Suspense } from "react"
import MessagesScreen from "@/components/messages/messages-screen"

function MessagesWithSuspense() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesScreen />
    </Suspense>
  )
}

export default function Messages() {
  return <MessagesWithSuspense />
}
