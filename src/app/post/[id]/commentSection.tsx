'use client'

import React, { useState } from 'react'
import AddComment from '../../_components/addComment'
import { Comment as IComment } from '@prisma/client'
import Comment from '../../_components/comment'

function CommentSection({
  comments,
  postId,
  isUserLoggedIn
}: {
  comments: IComment[]
  postId: string
  isUserLoggedIn: boolean
}) {
  const [commentsData, setCommentsData] = useState(comments)

  return (
    <>
      {isUserLoggedIn && (
        <div className="mt-12">
          <AddComment
            onSubmit={(comment) => {
              setCommentsData((data) => [comment, ...data])
            }}
            postId={postId}
          />
        </div>
      )}

      <div className="mt-10 opacity-50">Top comments:</div>

      <div className="mt-4 space-y-6">
        {commentsData.length > 0 ? (
          commentsData.map((data) => (
            <Comment
              key={data.id}
              isUserLoggedIn={isUserLoggedIn}
              data={data}
            />
          ))
        ) : (
          <span className="opacity-70">No comments to show</span>
        )}
      </div>
    </>
  )
}

export default CommentSection
