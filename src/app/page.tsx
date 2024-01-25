import { api } from '~/trpc/server'
import Post from './_components/post'

export default async function Home() {
  const posts = await api.post.getLatestPosts.query()

  return (
    <main className="mt-8">
      <div className="grid w-full grid-cols-1">
        {posts.length > 0
          ? posts.map((post) => <Post key={post.id} data={post} />)
          : 'No posts to show'}
      </div>
    </main>
  )
}
