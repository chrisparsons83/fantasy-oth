import prisma from '@/src/lib/prisma';
import type { Team } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { number, z } from 'zod';

const requestSchema = z.object({
  seasonId: z.string(),
  url: z.string(),
});

const fetchLeagueStandingsSchema = z.object({
  divisions: z
    .object({
      id: z.number(),
      teams: z
        .object({
          id: z.number(),
          name: z.string(),
          pointsFor: z.object({
            formatted: z.string(),
          }),
          draftPosition: z.number(),
          owners: z
            .object({
              id: z.number(),
              displayName: z.string(),
            })
            .array(),
        })
        .array(),
    })
    .array(),
  league: z.object({
    id: z.number(),
    name: z.string(),
    draftLiveTimeEpochMilli: z.string(),
  }),
});

const handler = async (req: NextRequest) => {
  const { seasonId, url } = requestSchema.parse(await req.json());
  // TODO: Fail this if there's not a league ID
  const fleaLeagueId = url.split('/').pop() ?? '';
  const fetchLeagueStandingsQueryVariables = new URLSearchParams({
    sport: 'NHL',
    league_id: fleaLeagueId,
    // TODO: Pull this year from current Season ID
    season: '2023',
  });

  const fleaResponse = await (
    await fetch(
      'https://www.fleaflicker.com/api/FetchLeagueStandings?' +
        fetchLeagueStandingsQueryVariables
    )
  ).json();
  const fleaResponseParsed = fetchLeagueStandingsSchema.parse(fleaResponse);

  // Upsert league
  const [leagueName, leagueDivision] =
    fleaResponseParsed.league.name.split(' - ');
  const league = await prisma.league.upsert({
    create: {
      name: leagueName,
      division: Number.parseInt(leagueDivision.slice(-1)),
      fleaflickerLeagueId: fleaResponseParsed.league.id,
      draftDateTime: new Date(
        Number.parseInt(fleaResponseParsed.league.draftLiveTimeEpochMilli) *
          1000
      ),
      season: {
        connect: {
          id: seasonId,
        },
      },
    },
    update: {
      draftDateTime: new Date(
        Number.parseInt(fleaResponseParsed.league.draftLiveTimeEpochMilli) *
          1000
      ),
    },
    where: {
      fleaflickerLeagueId: fleaResponseParsed.league.id,
    },
  });

  // Upsert Teams
  const promises: Promise<Team>[] = [];
  for (const team of fleaResponseParsed.divisions[0].teams) {
    promises.push(
      prisma.team.upsert({
        create: {
          teamName: team.name,
          ownerName: team.owners[0].displayName,
          pointsFor: Number.parseFloat(team.pointsFor.formatted),
          fleaflickerTeamId: team.id,
          draftPosition: team.draftPosition,
          league: {
            connect: {
              id: league.id,
            },
          },
        },
        update: {
          pointsFor: Number.parseFloat(team.pointsFor.formatted),
        },
        where: {
          fleaflickerTeamId: team.id,
        },
      })
    );
  }
  await Promise.all(promises);

  return NextResponse.json({ message: 'loaded' });
};

export { handler as POST };
