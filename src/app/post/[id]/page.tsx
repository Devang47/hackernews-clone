import { api } from "~/trpc/server";
import React from "react";
import Link from "next/link";
import AddComment from "./addComment";

export default async function page({ params }: { params: { id: string } }) {
  const data = await api.post.getPostInfo.query({
    postId: params.id ?? "",
  });

  const comments = await api.comment.getCommentsOfPost.query({
    postId: params.id ?? "",
  });

  return (
    <main className="mt-8">
      {!!data ? (
        <>
          <Link className="block w-fit hover:underline" href={data.value}>
            <h2 className="text-xl font-semibold lg:text-2xl">
              {data?.title} ({new URL(data.value).host})
            </h2>
          </Link>

          <p className="mt-6">
            {data?.description || (
              <span className="opacity-50"> No description </span>
            )}
          </p>

          <div className="mt-8 text-sm">
            <span className="opacity-50">Points: </span>
            {data.points}
          </div>

          <div className="mt-2 text-sm">
            <span className="opacity-50">Created: </span>
            {new Date(data.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="mt-2 text-sm">
            <span className="opacity-50">by </span>
            <Link
              className="hover:underline"
              href={"/user/" + data.createdByUser}
            >
              {data.createdByUser}
            </Link>
          </div>

          <AddComment />

          <div className="mt-10 space-y-3">
            {comments.length > 0 ? (
              comments.map((data) => <div className="">{data.text}</div>)
            ) : (
              <span className="opacity-70">No comments to show</span>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-2xl font-semibold lg:text-3xl">
          Post not found
        </p>
      )}
    </main>
  );
}
