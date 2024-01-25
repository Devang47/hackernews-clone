import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
  getUserInfo: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userData = await ctx.db.user.findUnique({
        where: {
          name: input.userId
        },
        select: {
          name: true,
          createdAt: true
        }
      })
      return userData
    }),

  getPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.post.findMany({
        where: {
          createdByUser: input.userId
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    }),

  getCommentsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.comment.findMany({
        where: {
          createdByUser: input.userId
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    })
})
