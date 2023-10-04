import { authOptions, requireUser } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import React from 'react';
import MyEntryForm from './MyEntryForm';

const rules = async () => {
  const session = await getServerSession(authOptions);
  requireUser(session);

  const leagues = await prisma.league.findMany({
    where: {
      season: {
        isActive: true,
      },
    },
    include: {
      teams: {
        orderBy: {
          draftPosition: 'asc',
        },
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
  });

  const existingEntry = await prisma.fSquaredEntry.findFirst({
    where: {
      season: {
        isActive: true,
      },
      userId: session?.user.id,
    },
    include: {
      teams: true,
    },
  });

  return (
    <main>
      <h1>My Entry</h1>
      <p>
        Pick two teams from each league. You can change your picks for that
        league as long as the league has not started drafting yet.
      </p>
      <p>Each league is ordered by their draft position.</p>
      <MyEntryForm
        leagues={leagues}
        session={session}
        existingEntry={existingEntry}
      />
    </main>
  );
};

export default rules;
