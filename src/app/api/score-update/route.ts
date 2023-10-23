import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { League, Team, WeeklyScore } from '@prisma/client';
import {
  fetchLeagueStandingsSchema,
  fleaflickerScoreboardSchema,
} from '@/src/schemas/fleaflicker';
import { pointsMultipler } from '@/src/lib/utils';

export const dynamic = 'force-dynamic';

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
    if (scorePromises.length >= 10) {
      await Promise.all(scorePromises);
      scorePromises.length = 0;
    }
  }
  await Promise.all(scorePromises);

  // Update Wins
  const standingsPromises: Promise<Response>[] = [];
  for (const league of leagues) {
    const leagueQueryVariables = new URLSearchParams({
      sport: 'NHL',
      league_id: league.fleaflickerLeagueId.toString(),
      season: league.season.startYear.toString(),
    });
    standingsPromises.push(
      fetch(
        'https://www.fleaflicker.com/api/FetchLeagueStandings?' +
          leagueQueryVariables
      )
    );
  }
  const fleaflickerStandings = await Promise.all(standingsPromises);

  const standingsUpdatePromises: Promise<Team>[] = [];
  for (let i = 0; i < leagues.length; i++) {
    const standings = fleaflickerStandings[i];
    const league = leagues[i];

    const parsedStandings = fetchLeagueStandingsSchema.parse(
      await standings.json()
    );
    for (const team of parsedStandings.divisions[0].teams) {
      standingsUpdatePromises.push(
        prisma.team.update({
          where: {
            fleaflickerTeamId: team.id,
          },
          data: {
            wins:
              (team.recordOverall.wins ?? 0) *
                pointsMultipler[league.division] +
              (team.recordOverall.ties ?? 0) *
                pointsMultipler[league.division] *
                0.5,
          },
        })
      );
      if (standingsUpdatePromises.length >= 10) {
        await Promise.all(standingsUpdatePromises);
        standingsUpdatePromises.length = 0;
      }
    }
  }
  await Promise.all(standingsUpdatePromises);

  // Save score update
  // This basically acts as a log that a score update happened. Everything is default so all you
  // need to do is save it.
  await prisma.scoreUpdate.create({
    data: {},
  });

  return NextResponse.json({ message: 'added' });
};

export { handler as GET };
