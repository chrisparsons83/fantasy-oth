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

  // Get the list of teams that have had their draft start.
  const teamsDrafted = (
    await prisma.team.findMany({
      where: {
        league: {
          season: {
            isActive: true,
          },
          draftDateTime: {
            lte: new Date(),
          },
        },
      },
      select: {
        id: true,
      },
    })
  ).map((x) => x.id);

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
    // If there's no existing entry and drafts have started, no dice for you.
    if (teamsDrafted.length > 0) {
      return NextResponse.json(
        {
          message: 'Drafts have already started.',
        },
        {
          status: 400,
        }
      );
    }
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
    const teamsEntryArray = existingEntry.teams.map((team) => team.id);
    const teamsDraftedInEntry = teamsDrafted
      .filter((x) => teamsEntryArray.includes(x))
      .sort((a, b) => a.localeCompare(b));
    const teamsDraftedInFormSubmit = teamsDrafted
      .filter((x) => teams.includes(x))
      .sort((a, b) => a.localeCompare(b));

    const entriesMatch =
      teamsDraftedInEntry.length === teamsDraftedInFormSubmit.length &&
      teamsDraftedInEntry
        .slice()
        .sort()
        .every((value, index) => value === teamsDraftedInFormSubmit[index]);

    if (!entriesMatch) {
      return NextResponse.json(
        {
          message: 'Drafts have already started.',
        },
        {
          status: 400,
        }
      );
    }

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
