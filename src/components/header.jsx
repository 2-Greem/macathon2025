import Link from "next/link"
import { Scroll } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-amber-700/30 bg-zinc-900 py-4 relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Scroll className="h-6 w-6 text-amber-500" />
          <span className="text-xl font-bold tracking-wider text-amber-500">Soapstone</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              {/* <Link
                href="/"
                className="text-sm uppercase tracking-wider text-zinc-400 transition-colors hover:text-amber-500"
              >
                Map
              </Link> */}
            </li>
            <li>
              <Link
                href="/profile"
                className="text-sm tracking-wider text-zinc-400 transition-colors hover:text-amber-500"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-sm tracking-wider text-zinc-400 transition-colors hover:text-amber-500"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
