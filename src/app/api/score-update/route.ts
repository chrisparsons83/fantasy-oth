import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import prisma from '@/src/lib/prisma';
import { League, WeeklyScore } from '@prisma/client';

export const dynamic = 'force-dynamic';
const fleaflickerScoreboardSchema = z.object({
  schedulePeriod: z.object({
    ordinal: z.number(),
  }),
  games: z
    .object({
      id: z.string(),
      home: z.object({
        id: z.number(),
      }),
      away: z.object({
        id: z.number(),
      }),
      homeScore: z.object({
        score: z.object({
          value: z.number(),
          formatted: z.string(),
        }),
      }),
      awayScore: z.object({
        score: z.object({
          value: z.number(),
          formatted: z.string(),
        }),
      }),
    })
    .array(),
});

const pointsMultipler: Record<League['division'], number> = {
  '1': 3,
  '2': 2,
  '3': 1,
};

const handler = async (req: NextRequest) => {
  const leagues = await prisma.league.findMany({
    where: {
      season: {
        isActive: true,
      },
    },
    select: {
      fleaflickerLeagueId: true,
      division: true,
      season: {
        select: {
          startYear: true,
        },
      },
    },
  });

  const promises: Promise<Response>[] = [];
  for (const league of leagues) {
    const leagueQueryVariables = new URLSearchParams({
      sport: 'NHL',
      league_id: league.fleaflickerLeagueId.toString(),
      season: league.season.startYear.toString(),
    });
    promises.push(
      fetch(
        'https://www.fleaflicker.com/api/FetchLeagueScoreboard?' +
          leagueQueryVariables
      )
    );
  }
  const fleaflickerScoreboards = await Promise.all(promises);

  const scorePromises: Promise<WeeklyScore>[] = [];
  for (let i = 0; i < leagues.length; i++) {
    const scoreboard = fleaflickerScoreboards[i];
    const league = leagues[i];

    const parsedScoreboard = fleaflickerScoreboardSchema.parse(
      await scoreboard.json()
    );
    for (const game of parsedScoreboard.games) {
      scorePromises.push(
        prisma.weeklyScore.upsert({
          where: {
            gamePeriod_fleaflickerTeamId: {
              gamePeriod: parsedScoreboard.schedulePeriod.ordinal,
              fleaflickerTeamId: game.away.id.toString(),
            },
          },
          create: {
            gamePeriod: parsedScoreboard.schedulePeriod.ordinal,
            fleaflickerTeamId: game.away.id.toString(),
            pointsFor:
              Number.parseFloat(game.awayScore.score.formatted) *
              pointsMultipler[league.division],
            team: {
              connect: {
                fleaflickerTeamId: game.away.id,
              },
            },
          },
          update: {
            pointsFor:
              Number.parseFloat(game.awayScore.score.formatted) *
              pointsMultipler[league.division],
          },
        })
      );
      scorePromises.push(
        prisma.weeklyScore.upsert({
          where: {
            gamePeriod_fleaflickerTeamId: {
              gamePeriod: parsedScoreboard.schedulePeriod.ordinal,
              fleaflickerTeamId: game.home.id.toString(),
            },
          },
          create: {
            gamePeriod: parsedScoreboard.schedulePeriod.ordinal,
            fleaflickerTeamId: game.home.id.toString(),
            pointsFor:
              Number.parseFloat(game.homeScore.score.formatted) *
              pointsMultipler[league.division],
            team: {
              connect: {
                fleaflickerTeamId: game.home.id,
              },
            },
          },
          update: {
            pointsFor:
              Number.parseFloat(game.homeScore.score.formatted) *
              pointsMultipler[league.division],
          },
        })
      );
    }
  }
  await Promise.all(scorePromises);

  // Update Wins
  // const standingsPromises: Promise<Response>[] = []
  // for (const league of leagues) {
  //   const leagueQueryVariables = new URLSearchParams({
  //     sport: 'NHL',
  //     league_id: league.fleaflickerLeagueId.toString(),
  //     season: league.season.startYear.toString(),
  //   });
  //   standingsPromises.push(
  //     fetch(
  //       'https://www.fleaflicker.com/api/FetchLeagueScoreboard?' +
  //         leagueQueryVariables
  //     )
  //   );
  // }
  // const fleaflickerStandings = await Promise.all(standingsPromises);

  return NextResponse.json({ message: 'added' });
};

export { handler as GET };
