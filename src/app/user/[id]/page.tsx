import React from "react";
import Post from "~/app/_components/post";
import Comment from "~/app/_components/comment";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function page({ params }: { params: { id: string } }) {
  const [userData, userPosts, userComments, session] = await Promise.all([
    api.user.getUserInfo.query({
      userId: params.id ?? "",
    }),
    api.user.getPostsByUser.query({
      userId: params.id ?? "",
    }),
    api.user.getCommentsByUser.query({
      userId: params.id ?? "",
    }),
    getServerAuthSession(),
  ]);

  return (
    <main className="mt-8">
      {!!userData ? (
        <div className="mt-10">
          <div className="">
            <span className="opacity-50">Name:</span> {userData.name}
          </div>
          <div className="mt-2">
            <span className="opacity-50">Created: </span>
            {new Date(userData.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-medium opacity-50">
              Latest posts by {userData.name}:
            </h2>
            <div className="mt-2 grid w-full grid-cols-1">
              {userPosts
                ? userPosts?.map((postData) => <Post data={postData} />)
                : "No posts"}
            </div>
          </div>

          {userComments.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-medium opacity-50">
                Latest comments by {userData.name}:
              </h2>
              <div className="mt-4 space-y-6">
                {userComments
                  ? userComments?.map((commentData) => (
                      <Comment isUserLoggedIn={!!session} data={commentData} />
                    ))
                  : "No posts"}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-2xl font-semibold lg:text-3xl">
          User not found
        </p>
      )}
    </main>
  );
}
