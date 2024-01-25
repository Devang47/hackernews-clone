"use client";

import { Comment } from "@prisma/client";
import { formatDistance } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import UpIcon from "~/lib/icons/upIcon";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import AddComment from "./addComment";
import Spinner from "~/app/_components/spinner";
import { useRouter } from "next/navigation";

function Comment({
  data,
  isUserLoggedIn,
}: {
  data: Comment;
  isUserLoggedIn: boolean;
}) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isReplyModelOpen, setIsReplyModelOpen] = useState(false);

  let datePassed = formatDistance(new Date(data.createdAt), new Date(), {
    addSuffix: true,
  });

  const upvoteComment = api.comment.upvoteComment.useMutation();
  let { data: isPostUpvoted, isLoading } =
    api.comment.isCommentUpvotedByUser.useQuery({
      commentId: data.id,
    });

  const { data: replyComments, isLoading: isRepliesLoading } =
    api.comment.getRepliesOfComment.useQuery({
      commentId: data.id,
    });

  useEffect(() => {
    setIsUpvoted(isPostUpvoted ?? false);
  }, [isPostUpvoted]);

  const handleUpvote = () => {
    upvoteComment.mutate({ commentId: data.id });
    setIsUpvoted((isUpvoted) => !isUpvoted);
  };

  return isLoading ? (
    <div className="flex w-full gap-2.5 py-3">
      <Skeleton className="mt-1 h-6 w-6" />
      <div className="w-full">
        <Skeleton className="h-4 w-80" />
        <Skeleton className="mt-2.5 h-8 w-80" />
      </div>
    </div>
  ) : (
    <div>
      <div className="flex w-full gap-2.5 py-1">
        <div className="mt-1">
          <button
            onClick={handleUpvote}
            className={cn(
              "rounded-md bg-gray-900 p-1",
              isUpvoted && "bg-gray-700",
            )}
          >
            <UpIcon />
          </button>
        </div>

        <div className="w-full text-gray-300">
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Link className="!p-0" href={"/user/" + data.createdByUser}>
              {data.createdByUser}
            </Link>

            <div className="opacity-50">{datePassed}</div>

            {isUserLoggedIn && (
              <button
                className="opacity-70 hover:underline"
                onClick={() => setIsReplyModelOpen((state) => !state)}
              >
                reply
              </button>
            )}
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words">{data.text}</p>
        </div>
      </div>
      {isReplyModelOpen && isUserLoggedIn && (
        <div className="mt-3 pl-7">
          <AddComment
            onSubmit={(comment) => {
              setIsReplyModelOpen((state) => !state);
              replyComments?.splice(0, 0, comment);
            }}
            postId={data.postId}
            commentId={data.id}
          />
        </div>
      )}

      {isRepliesLoading ? (
        <div className="pl-8">
          <Spinner width="w-4" />
        </div>
      ) : (
        replyComments?.map((comment) => (
          <div key={comment.id} className="mt-3 pl-7">
            <Comment isUserLoggedIn={isUserLoggedIn} data={comment} />
          </div>
        ))
      )}
    </div>
  );
}

export default Comment;
