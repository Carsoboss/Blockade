import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const API_KEY = process.env.OPENAI_API_KEY;

export const openaiRouter = createTRPCRouter({
  getOpenAIResponse: protectedProcedure
    .input(
      z.object({
        instructions: z.string(),
        userMessage: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { instructions, userMessage } = input;

      const result = await generateText({
        model: openai("gpt-4o"),
        prompt: `System: ${instructions}\nUser: ${userMessage}`,
      });

      return {
        message: result.text,
      };
    }),

  getAllChatBots: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.chatBot.findMany({
      where: {
        orgId: null,
      },
      select: {
        id: true,
        name: true,
        instructions: true,
      },
    });
  }),

  createChat: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        orgId: z.string().nullable(),
        name: z.string(),
        model: z.string(), // Add model to schema
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, orgId, name, model } = input;
      return await ctx.prisma.chat.create({
        data: {
          userId,
          orgId,
          name,
          model,
          deleted: false,
        },
      });
    }),

  deleteChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { chatId } = input;
      await ctx.prisma.message.deleteMany({
        where: { chatId },
      });
      await ctx.prisma.chat.delete({
        where: { id: chatId },
      });
      return { success: true };
    }),

  updateChatName: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        newName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { chatId, newName } = input;
      return await ctx.prisma.chat.update({
        where: { id: chatId },
        data: { name: newName },
      });
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
        origin: z.enum(["USER", "BOT"]),
        originId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { chatId, content, origin, originId } = input;
      return await ctx.prisma.message.create({
        data: {
          chatId,
          content,
          origin,
          originId,
        },
      });
    }),

  getChatsByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;
      return await ctx.prisma.chat.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
        },
      });
    }),

  getMessagesByChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { chatId } = input;
      return await ctx.prisma.message.findMany({
        where: {
          chatId,
        },
        select: {
          id: true,
          content: true,
          origin: true,
        },
      });
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { messageId } = input;
      await ctx.prisma.message.delete({
        where: { id: messageId },
      });
      return { success: true };
    }),
});
