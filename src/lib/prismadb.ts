import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// prevent create multiole instances of PrismaClient in development
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.Node_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
