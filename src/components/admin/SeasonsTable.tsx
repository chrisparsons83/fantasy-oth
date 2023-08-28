import React from 'react';
import prisma from '@/src/lib/prisma';

const SeasonsTable = async () => {
  const seasons = await prisma.season.findMany();

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Year
            </th>
            <th scope='col' className='px-6 py-3'>
              Active?
            </th>
            <th scope='col' className='px-6 py-3'>
              Reg Open?
            </th>
            <th scope='col' className='px-6 py-3'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {seasons.map((season) => (
            <tr key={season.id}>
              <th
                scope='row'
                className='whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white'
              >
                {season.startYear}
              </th>
              <td className='px-6 py-4'>{season.isActive}</td>
              <td className='px-6 py-4'>{season.isOpenForRegistration}</td>
              <td>Open/Close/Open</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonsTable;
