import React from 'react';
import prisma from '@/src/lib/prisma';

const LeaguesTable = async () => {
  const leagues = await prisma.league.findMany({
    include: {
      season: true,
    },
  });

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Year
            </th>
            <th scope='col' className='px-6 py-3'>
              Division
            </th>
            <th scope='col' className='px-6 py-3'>
              Year
            </th>
          </tr>
        </thead>
        <tbody>
          {leagues.map((league) => (
            <tr key={league.id}>
              <th
                scope='row'
                className='whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white'
              >
                {league.name}
              </th>
              <td className='px-6 py-4'>{league.division}</td>
              <td className='px-6 py-4'>{league.season.startYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaguesTable;
