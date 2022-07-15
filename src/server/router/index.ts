// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { todosRouter } from "./todos";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("auth.", authRouter)
    .merge("todos.", todosRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
