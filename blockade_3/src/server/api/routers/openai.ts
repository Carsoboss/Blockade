import ky from "ky";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const API_KEY = process.env.OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIRequest {
  model: string;
  messages: { role: string; content: string }[];
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

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

      const messages = JSON.parse(userMessage) as {
        role: string;
        content: string;
      }[];

      const requestData: OpenAIRequest = {
        model: "gpt-4",
        messages: [{ role: "system", content: instructions }, ...messages],
      };

      const headers = {
        Authorization: `Bearer ${API_KEY}`,
      };

      try {
        const response = await ky
          .post(API_URL, {
            json: requestData,
            headers,
          })
          .json<OpenAIResponse>();

        if (!response.choices || response.choices.length === 0) {
          throw new Error("No choices found in the OpenAI response");
        }

        return {
          message: response.choices[0]?.message?.content ?? "No content found",
        };
      } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        throw new Error("Error fetching response from OpenAI");
      }
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
        orgId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, orgId, name } = input;
      return await ctx.prisma.chat.create({
        data: {
          userId,
          orgId,
          name,
          archived: false,
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

  // New endpoints for fetching user chats and chat messages
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
