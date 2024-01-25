import React from "react";
import { api } from "~/trpc/server";
import Post from "../_components/post";

export default async function page() {
  const posts = await api.post.getTopPostsIn24Hours.query();

  return (
    <main className="mt-10">
      <h1 className="text-2xl font-bold text-gray-100 lg:text-4xl">
        Trending posts
      </h1>

      <div className="mt-10 grid w-full grid-cols-1">
        {posts.length > 0
          ? posts.map((post) => <Post key={post.id} data={post} />)
          : "No trending posts in the last 24 hours"}
      </div>
    </main>
  );
}
