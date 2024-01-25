'use client'

import { Post } from '@prisma/client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import UpIcon from '~/lib/icons/upIcon'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

function Post({ data }: { data: Post }) {
  const [postData, setData] = useState(data)
  const [isUpvoted, setIsUpvoted] = useState(false)

  const upvotePost = api.post.upvotePost.useMutation()
  let { data: isPostUpvoted, isLoading } =
    api.post.isPostUpvotedByUser.useQuery({
      postId: data.id
    })

  useEffect(() => {
    setIsUpvoted(isPostUpvoted ?? false)
  }, [isPostUpvoted])

  const handleUpvote = () => {
    upvotePost.mutate({ postId: postData.id })

    setData((data) => ({
      ...data,
      points: isUpvoted ? data.points - 1 : data.points + 1
    }))
    setIsUpvoted((isUpvoted) => !isUpvoted)
  }

  return isLoading ? (
    <div className="flex w-full gap-2.5 py-3">
      <Skeleton className="mt-1 h-6 w-6" />
      <div className="w-full">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2.5 h-5 w-80" />

        <div className="mt-2 flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex w-full gap-2 py-3">
      <div className="mt-1">
        <button
          onClick={handleUpvote}
          className={cn(
            'rounded-md bg-gray-900 p-1',
            isUpvoted && 'bg-gray-700'
          )}
        >
          <UpIcon />
        </button>
      </div>

      <div className="w-full">
        <Link
          className="group block w-full md:w-fit md:min-w-[500px]"
          target="_blank"
          href={postData.value}
        >
          <h2 className="text-gray-200 group-hover:underline">
            {postData.title}
          </h2>
          {postData.description && (
            <p className="mt-1 text-sm text-gray-500">{postData.description}</p>
          )}
        </Link>

        <div className="mt-1 flex items-center gap-3 text-sm text-gray-400 opacity-90">
          <Link
            className="hover:underline"
            href={`/user/${postData.createdByUser}`}
          >
            <span className="">{postData.createdByUser}</span>
          </Link>
          <Separator orientation="vertical" className="h-2 bg-white/80" />
          <div className="text-opacity-80"> {postData.points} points</div>
          <Separator orientation="vertical" className="h-2 bg-white/80" />
          <div className="text-opacity-80">
            <Link className="hover:underline" href={'/post/' + postData.id}>
              discuss
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
