import React from 'react';
import CreateSeasonForm from './CreateSeasonForm';
import { getServerSession } from 'next-auth';
import { authOptions, requireAdmin } from '@/src/lib/auth';

const NewSeasonPage = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  return (
    <main>
      <h2>Create New Season</h2>
      <p>
        Put the first year of the season (IE, if it is the 2023-2024 season, put
        2023)
      </p>
      <CreateSeasonForm />
    </main>
  );
};

export default NewSeasonPage;
