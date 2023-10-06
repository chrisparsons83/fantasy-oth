import { Prisma } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import React from 'react';

const leagueWithEntryCount = Prisma.validator<Prisma.LeagueArgs>()({
  include: {
    teams: {
      include: {
        _count: {
          select: { FSquaredSelections: true },
        },
      },
    },
  },
});
export type LeagueWithEntryCount = Prisma.LeagueGetPayload<
  typeof leagueWithEntryCount
>;

interface PickDistributionProps {
  leagues: LeagueWithEntryCount[];
}

const PickDistribution = ({ leagues }: PickDistributionProps) => {
  console.log({ leagues });

  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {leagues.map((league) => (
        <div
          key={league.id}
          className='rounded-md bg-zinc-700 p-4 drop-shadow-md'
        >
          <div className='mb-4 text-2xl font-bold'>
            {league.name} - D{league.division}
          </div>
          <div className='grid grid-cols-1 divide-y divide-zinc-600'>
            {league.teams.map((team) => (
              <div
                key={team.id}
                className='flex items-center justify-between py-2'
              >
                <div>
                  <div className='text-sm font-bold'>{team.teamName}</div>
                  <div className='text-sm italic'>{team.ownerName}</div>
                </div>
                <div>{team._count.FSquaredSelections}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PickDistribution;
