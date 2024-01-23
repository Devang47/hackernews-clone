import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  isCommentUpvotedByUser: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return false;

      const upData = await ctx.db.upvote.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.session.user.id,
        },
      });

      return !!upData;
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) return false;

      const comment = ctx.db.comment.create({
        data: {
          text: input.content,
          post: { connect: { id: input.postId } },
          createdBy: { connect: { name: ctx.session.user.name ?? "" } },
        },
      });

      return comment;
    }),

  replyToComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.string(),
        commentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const comment = ctx.db.comment.create({
        data: {
          text: input.content,
          post: { connect: { id: input.postId } },
          replyTo: { connect: { id: input.commentId } },

          createdBy: { connect: { name: ctx.session.user.name ?? "" } },
        },
      });

      return comment;
    }),

  upvoteComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const upData = await ctx.db.upvote.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.session.user.id,
        },
      });

      if (upData) {
        await Promise.all([
          ctx.db.upvote.delete({
            where: {
              id: upData.id,
            },
          }),
          ctx.db.comment.update({
            where: { id: input.commentId },
            data: { points: { decrement: 1 } },
          }),
        ]);
      } else {
        await Promise.all([
          ctx.db.upvote.create({
            data: {
              comment: { connect: { id: input.commentId } },
              user: { connect: { id: ctx.session.user.id } },
            },
          }),
          ctx.db.comment.update({
            where: { id: input.commentId },
            data: { points: { increment: 1 } },
          }),
        ]);
      }

      return true;
    }),

  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.db.comment.findUnique({
        where: {
          id: input.commentId,
        },
      });

      if (comment?.createdByUser !== ctx.session.user.name)
        throw new Error("You are not the owner of this comment");
      else
        return ctx.db.comment.delete({
          where: {
            id: input.commentId,
          },
        });
    }),

  getCommentsOfPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          createdBy: true,
          upvotes: true,
          replyTo: true,
        },
      });
    }),
});
