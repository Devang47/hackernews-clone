import React from 'react'
import { api } from '~/trpc/server'
import Post from '../_components/post'

export default async function page() {
  const posts = await api.post.getTopPosts.query()

  return (
    <main className="mt-10">
      <h1 className="text-2xl font-bold text-gray-200 lg:text-4xl">
        Top posts in the last year
      </h1>

      <div className="mt-10 grid w-full grid-cols-1">
        {posts.length > 0
          ? posts.map((post) => <Post key={post.id} data={post} />)
          : 'No posts to show'}
      </div>
    </main>
  )
}
