import Prisma, * as PrismaAll from "@prisma/client";

export const PrismaClient = Prisma?.PrismaClient || PrismaAll?.PrismaClient;

export const prisma = new PrismaClient();