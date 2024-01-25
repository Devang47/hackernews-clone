import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '~/server/api/trpc'

export const postRouter = createTRPCRouter({
  isPostUpvotedByUser: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return

      const upData = await ctx.db.upvote.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id
        }
      })

      return !!upData
    }),

  upvotePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const upData = await ctx.db.upvote.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id
        }
      })

      if (upData) {
        await Promise.all([
          ctx.db.upvote.delete({
            where: {
              id: upData.id
            }
          }),
          ctx.db.post.update({
            where: { id: input.postId },
            data: { points: { decrement: 1 } }
          })
        ])
      } else {
        await Promise.all([
          ctx.db.upvote.create({
            data: {
              post: { connect: { id: input.postId } },
              user: { connect: { id: ctx.session.user.id } }
            }
          }),
          ctx.db.post.update({
            where: { id: input.postId },
            data: { points: { increment: 1 } }
          })
        ])
      }

      return true
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        link: z.string().min(1),
        description: z.string().optional()
      })
    )

    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          value: input.link,
          description: input.description ?? '',
          createdBy: { connect: { id: ctx.session.user.id } }
        }
      })
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId
        }
      })

      if (post?.createdByUser !== ctx.session.user.name) {
        throw new Error('You are not the owner of this post')
      } else {
        return ctx.db.post.delete({
          where: {
            id: input.postId
          }
        })
      }
    }),

  getAllPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.post.findMany({
        where: {
          createdBy: { id: input.userId }
        }
      })
    }),

  getTopPosts: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { points: 'desc' },

      take: 50
    })
  }),

  getLatestPosts: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  }),

  getPostInfo: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.post.findUnique({
        where: {
          id: input.postId
        }
      })
    }),

  getTopPostsIn24Hours: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { points: 'desc' },

      take: 50
    })
  })
})
