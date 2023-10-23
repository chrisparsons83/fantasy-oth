import React from 'react';
import prisma from '@/src/lib/prisma';
import PickDistribution from './PickDistribution';

export const dynamic = 'force-dynamic';
const distribution = async () => {
  const leagues = await prisma.league.findMany({
    where: {
      season: {
        isActive: true,
      },
      draftDateTime: {
        lte: new Date(),
      },
    },
    orderBy: [
      {
        division: 'asc',
      },
      {
        name: 'asc',
      },
    ],
    include: {
      teams: {
        orderBy: {
          pointsFor: 'desc',
        },
        include: {
          FSquaredSelections: {
            include: {
              user: true,
            },
            orderBy: {
              user: {
                name: 'asc',
              },
            },
          },
          WeeklyScores: {
            select: {
              pointsFor: true,
            },
          },
          _count: {
            select: { FSquaredSelections: true },
          },
        },
      },
    },
  });

  return (
    <div>
      <h1>Picks by League</h1>
      <p>
        These will populate as drafts start. Clicking on a team name will show
        you all users that selected that team in their entry.
      </p>
      <PickDistribution leagues={leagues} />
    </div>
  );
};

export default distribution;
