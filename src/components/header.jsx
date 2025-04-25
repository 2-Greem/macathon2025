import Link from "next/link"
import Image from "next/image"
import { isLoggedIn, logout } from "@/pages/api/functions"
import { useEffect, useState } from "react"

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    window.location.href = "/login"
  }

  return (
    <header className="border-b border-orange-700/30 bg-zinc-900 py-3 relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/ss-logo.png" alt="Soapstone Logo" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-wider text-orange-500">Soapstone</span>
        </Link>

        <nav>
          <ul className="flex gap-6 items-center">
            {loggedIn ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="text-sm tracking-wider text-stone-300 transition-colors hover:text-orange-400"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-sm tracking-wider text-stone-300 transition-colors hover:text-orange-400"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="text-sm tracking-wider text-stone-300 transition-colors hover:text-orange-400"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
