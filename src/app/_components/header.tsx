import Link from 'next/link'
import React from 'react'
import { getServerAuthSession } from '~/server/auth'

async function Header() {
  const session = await getServerAuthSession()

  return (
    <header className="flex w-full items-center gap-6 border-b border-gray-800 py-4 text-sm text-gray-400">
      <Link
        href="/"
        className="text-base font-bold text-gray-300 hover:underline"
      >
        Hacker News
      </Link>

      <Link href="/top" className="hover:underline">
        Top posts
      </Link>

      <Link href="/trending" className="hover:underline">
        Trending
      </Link>

      {session?.user ? (
        <>
          <Link href="/create" className="ml-auto  hover:underline">
            Submit
          </Link>

          <Link href={`/user/${session.user.name}`} className="hover:underline">
            {session.user.name}
          </Link>
        </>
      ) : (
        <Link href="/api/auth/signin" className="ml-auto  hover:underline">
          Sign in
        </Link>
      )}
    </header>
  )
}

export default Header
