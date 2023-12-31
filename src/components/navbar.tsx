'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session } = useSession();

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <nav className='border-b border-zinc-700 bg-white dark:bg-zinc-950'>
      <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4'>
        <a href='/' className='flex items-center'>
          <Image
            src='/fantasy-oth.svg'
            className='mr-3'
            height={32}
            width={32}
            alt='Fantasy OTH Logo'
          />
          <span className='self-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
            Fantasy OTH
          </span>
        </a>
        <button
          data-collapse-toggle='navbar-default'
          type='button'
          className='inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
          aria-controls='navbar-default'
          aria-expanded='false'
          onClick={toggleDropdown}
        >
          <span className='sr-only'>Open main menu</span>
          <svg
            className='h-5 w-5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 17 14'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M1 1h15M1 7h15M1 13h15'
            />
          </svg>
        </button>
        <div
          className={clsx(
            showDropdown ? 'block md:hidden' : 'hidden md:block',
            'w-full md:w-auto'
          )}
          id='navbar-default'
        >
          <ul
            className={clsx(
              showDropdown && 'dark:bg-gray-800',
              'mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700  md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0'
            )}
          >
            <li>
              <Link
                href='/leaderboard'
                className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
              >
                Leaderboard
              </Link>
            </li>
            <li>
              <Link
                href='/distribution'
                className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
              >
                Picks by League
              </Link>
            </li>
            <li>
              <Link
                href='/rules'
                className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
              >
                Rules
              </Link>
            </li>
            {!session && (
              <li>
                <a
                  href='#'
                  className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
                  onClick={() => signIn('discord')}
                >
                  Sign In
                </a>
              </li>
            )}
            {session && (
              <>
                <li>
                  <Link
                    href='/my-entry'
                    className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
                  >
                    My Entry
                  </Link>
                </li>
                <li>
                  <a
                    href='#'
                    className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
