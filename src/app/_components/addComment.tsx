"use client";

import { Comment } from "@prisma/client";
import React from "react";
import Spinner from "~/app/_components/spinner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { toast } from "sonner";

function AddComment({
  postId,
  commentId,
  onSubmit,
}: {
  postId: string;
  commentId?: string;
  onSubmit?: (comment: Comment) => void;
}) {
  const [commentInput, setCommentInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const addComment = api.comment.create.useMutation();
  const replyToComment = api.comment.replyToComment.useMutation();

  const handleCreateComment = async (e: any) => {
    e.preventDefault();

    if (!commentInput.trim()) return;
    setLoading(true);

    try {
      let comment: Comment;
      if (commentId) {
        comment = await replyToComment.mutateAsync({
          postId,
          commentId,
          content: commentInput,
        });
      } else {
        comment = await addComment.mutateAsync({
          postId,
          content: commentInput,
        });
      }

      onSubmit && onSubmit(comment);
      setCommentInput("");
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    }
  };

  return (
    <form className="max-w-md" onSubmit={handleCreateComment}>
      <Textarea
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
      />

      <Button
        disabled={!commentInput.trim()}
        className="mt-4"
        size="sm"
        variant="secondary"
        type="submit"
      >
        {loading ? <Spinner /> : "Add comment"}
      </Button>
    </form>
  );
}

export default AddComment;
