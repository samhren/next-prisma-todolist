import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const todosRouter = createRouter()
    .query("get-my-todos", {
        async resolve({ ctx }) {
            if (!ctx.session || !ctx.session.user) {
                throw new TRPCError({
                    message: "You are not signed in",
                    code: "UNAUTHORIZED",
                });
            }

            const todos = await ctx.prisma.todo.findMany({
                where: {
                    userId: ctx.session.user.id,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            return todos;
        },
    })
    .mutation("create-todo", {
        input: z.object({
            title: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!ctx.session || !ctx.session.user) {
                throw new TRPCError({
                    message: "You are not signed in",
                    code: "UNAUTHORIZED",
                });
            }

            const todo = await ctx.prisma.todo.create({
                data: {
                    title: input.title,
                    completed: false,
                    user: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });

            return todo;
        },
    })
    .mutation("update-todo", {
        input: z.object({
            id: z.string(),
            title: z.string(),
            completed: z.boolean(),
        }),
        async resolve({ ctx, input }) {
            if (!ctx.session || !ctx.session.user) {
                throw new TRPCError({
                    message: "You are not signed in",
                    code: "UNAUTHORIZED",
                });
            }

            const todo = await ctx.prisma.todo.update({
                where: {
                    id: input.id,
                },
                data: {
                    title: input.title,
                    completed: input.completed,
                },
            });

            return todo;
        },
    })
    .mutation("delete-todo", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!ctx.session || !ctx.session.user) {
                throw new TRPCError({
                    message: "You are not signed in",
                    code: "UNAUTHORIZED",
                });
            }

            const todo = await ctx.prisma.todo.delete({
                where: {
                    id: input.id,
                },
            });

            return todo;
        },
    });
