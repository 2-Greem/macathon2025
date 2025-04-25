import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="border-b border-orange-700/30 bg-zinc-900 py-3 relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/ss-logo.png" alt="Soapstone Logo" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-wider text-orange-500">Soapstone</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/profile"
                className="text-sm tracking-wider text-stone-300 transition-colors hover:text-orange-400"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-sm tracking-wider text-stone-300 transition-colors hover:text-orange-400"
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
