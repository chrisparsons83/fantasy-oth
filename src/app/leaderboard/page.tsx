import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import prisma from '@/src/lib/prisma';
import LeaderboardTable from './LeaderboardTable';

export const dynamic = 'force-dynamic';
const leaderboard = async () => {
  const entries = await prisma.fSquaredEntry.findMany({
    where: {
      season: {
        isActive: true,
      },
    },
    include: {
      user: true,
      teams: {
        include: {
          WeeklyScores: true,
          league: true,
        },
        orderBy: [
          {
            league: {
              division: 'asc',
            },
          },
          {
            league: {
              name: 'asc',
            },
          },
        ],
      },
    },
    orderBy: {
      user: {
        name: 'asc',
      },
    },
  });

  return (
    <div>
      <h1>Leaderboard</h1>
      <p>Clicking on a user's name will display their selections.</p>
      <Tabs defaultValue='pointsFor'>
        <TabsList>
          <TabsTrigger value='pointsFor'>Points For</TabsTrigger>
          <TabsTrigger value='wins'>Wins</TabsTrigger>
        </TabsList>
        <TabsContent value='pointsFor'>
          <LeaderboardTable type='pointsFor' entries={entries} />
        </TabsContent>
        <TabsContent value='wins'>
          <LeaderboardTable type='wins' entries={entries} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default leaderboard;
