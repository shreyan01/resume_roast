import { Button } from "./ui/button";
export function UserReactions() {
  return (
    <div className="flex items-center gap-4 mt-6">
      <Button variant="outline" className="flex items-center gap-2">
        😭 That hurt
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        😤 Fair enough
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        🔥 Roast harder!
      </Button>
    </div>
  )
}
