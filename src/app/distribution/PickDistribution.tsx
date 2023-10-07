import { Prisma } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import React from 'react';

const leagueWithEntryCount = Prisma.validator<Prisma.LeagueArgs>()({
  include: {
    teams: {
      include: {
        FSquaredSelections: {
          include: {
            user: true,
          },
        },
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
                <Dialog>
                  <DialogTrigger asChild>
                    <div className='cursor-pointer'>
                      <div className='text-sm font-bold'>{team.teamName}</div>
                      <div className='text-sm italic'>{team.ownerName}</div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Users that selected {team.ownerName}
                      </DialogTitle>
                    </DialogHeader>
                    <div className='grid max-h-[80vh] grid-cols-1 divide-y divide-zinc-800 overflow-y-auto'>
                      {team.FSquaredSelections.sort((a, b) =>
                        a.user.name
                          .toLocaleLowerCase()
                          .localeCompare(b.user.name.toLocaleLowerCase())
                      ).map((entry) => (
                        <div key={entry.id} className='py-2'>
                          {entry.user.name}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
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
