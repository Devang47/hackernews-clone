"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

function AddComment() {
  const handleCreateComment = (e: any) => {
    e.preventDefault();
  };

  const [commentInput, setCommentInput] = React.useState("");

  return (
    <form className="mt-12 max-w-md" onSubmit={handleCreateComment}>
      <Textarea
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
      />

      <Button className="mt-4" size="sm" variant="secondary" type="submit">
        Add comment
      </Button>
    </form>
  );
}

export default AddComment;
