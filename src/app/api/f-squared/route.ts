import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/src/lib/prisma';

const requestSchema = z.object({
  userId: z.string(),
  seasonId: z.string(),
  teams: z.string().array(),
});

const handler = async (req: NextRequest) => {
  const { userId, seasonId, teams } = requestSchema.parse(await req.json());

  // Find if we have an existing entry already.
  const existingEntry = await prisma.fSquaredEntry.findFirst({
    where: {
      userId,
      seasonId,
    },
    include: {
      teams: true,
    },
  });
  if (!existingEntry) {
    await prisma.fSquaredEntry.create({
      data: {
        seasonId,
        userId,
        teams: {
          connect: teams.map((entry) => ({ id: entry })),
        },
      },
    });
  } else {
    await prisma.fSquaredEntry.update({
      where: {
        id: existingEntry.id,
      },
      data: {
        teams: {
          disconnect: existingEntry.teams.map((entry) => ({
            id: entry.id,
            fleaflickerTeamId: entry.fleaflickerTeamId,
          })),
          connect: teams.map((entry) => ({ id: entry })),
        },
      },
    });
  }

  return NextResponse.json({ message: 'added' });
};

export { handler as POST };
