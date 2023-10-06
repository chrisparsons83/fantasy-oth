import { authOptions, requireAdmin } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import prisma from '@/src/lib/prisma';
import React from 'react';

const SeasonsPage = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const entries = await prisma.fSquaredEntry.findMany({
    where: {
      season: {
        isActive: true,
      },
    },
    select: {
      teams: {
        select: {
          id: true,
        },
        orderBy: {
          id: 'asc',
        },
      },
    },
  });

  const teamsArray = entries.map((entry) =>
    entry.teams.map((x) => x.id).join('-')
  );

  let duplicateEntries = 0;
  for (let i = 0; i < teamsArray.length - 1; i++) {
    for (let j = i + 1; j < teamsArray.length; j++) {
      if (teamsArray[i] === teamsArray[j]) {
        duplicateEntries++;
      }
    }
  }

  return (
    <div>
      <h1>Duplicate Entries</h1>
      <p>Number of entries: {entries.length}</p>
      <p>Number of duplicate entries: {duplicateEntries}</p>
    </div>
  );
};

export default SeasonsPage;
