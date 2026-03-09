import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight text-foreground">
          Campus Founders
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-lg transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/onboarding"
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-lg transition-colors"
          >
            My Profile
          </Link>
          <div className="ml-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}
