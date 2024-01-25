import { api } from "~/trpc/server";
import { formatDistance } from "date-fns";
import React from "react";
import Link from "next/link";
import CommentSection from "./commentSection";
import { getServerAuthSession } from "~/server/auth";

export default async function page({ params }: { params: { id: string } }) {
  const [data, comments, session] = await Promise.all([
    api.post.getPostInfo.query({
      postId: params.id ?? "",
    }),
    api.comment.getCommentsOfPost.query({
      postId: params.id ?? "",
    }),
    getServerAuthSession(),
  ]);

  if (!data)
    return (
      <h1 className="py-20 text-center text-2xl font-medium">
        404 | Not found
      </h1>
    );

  let datePassed = formatDistance(new Date(data.createdAt), new Date(), {
    addSuffix: true,
  });

  return (
    <main className="mt-8 pb-20">
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

            <span className="ml-2 opacity-70">({datePassed})</span>
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

          <CommentSection
            isUserLoggedIn={!!session}
            comments={comments}
            postId={data.id}
          />
        </>
      ) : (
        <p className="text-center text-2xl font-semibold lg:text-3xl">
          Post not found
        </p>
      )}
    </main>
  );
}
