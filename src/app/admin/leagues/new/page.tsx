import React from 'react';
import CreateLeagueForm from './CreateLeagueForm';
import { getServerSession } from 'next-auth';
import { authOptions, requireAdmin } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';

const NewSeasonPage = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const seasons = await prisma.season.findMany();

  return (
    <main>
      <h2>Create New League</h2>
      <CreateLeagueForm seasons={seasons} />
    </main>
  );
};

export default NewSeasonPage;
