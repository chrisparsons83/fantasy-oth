import Link from 'next/link';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid md:grid-cols-12 md:gap-4'>
      <div className='md:col-span-3'>
        <ul className='w-full rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'>
          <li className='w-full rounded-t-lg border-b border-gray-200 px-4 py-2 dark:border-gray-600'>
            <Link href='/admin/seasons'>Seasons</Link>
          </li>
          <li className='w-full rounded-b-lg px-4 py-2'>Leagues</li>
        </ul>
      </div>
      <div className='md:col-span-9'>{children}</div>
    </div>
  );
};

export default AdminLayout;
