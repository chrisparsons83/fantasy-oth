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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { pointsMultipler } from '@/src/lib/utils';

const leagueWithEntryCount = Prisma.validator<Prisma.LeagueArgs>()({
  include: {
    teams: {
      include: {
        FSquaredSelections: {
          include: {
            user: true,
          },
        },
        WeeklyScores: {
          select: {
            pointsFor: true,
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

const sortedTeams = (
  teams: LeagueWithEntryCount['teams']
): LeagueWithEntryCount['teams'] =>
  teams.sort((a, b) => {
    const teamAPF = a.WeeklyScores.reduce((a, b) => a + b.pointsFor, 0);
    const teamBPF = b.WeeklyScores.reduce((a, b) => a + b.pointsFor, 0);
    return teamBPF - teamAPF;
  });

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
            <Table className='my-0'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-1/2 p-2'>Team</TableHead>
                  <TableHead className='p-2'>Picks</TableHead>
                  <TableHead className='p-2'>Wins</TableHead>
                  <TableHead className='px-4 py-2'>PF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeams(league.teams).map((team) => (
                  <TableRow key={team.id} className='border-zinc-800'>
                    <TableCell className='py-0 pl-2'>
                      <Dialog>
                        <DialogTrigger className='text-left'>
                          {team.ownerName}
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Users that selected {team.ownerName}
                            </DialogTitle>
                            <DialogDescription>
                              Drafted from the {team.draftPosition} spot
                            </DialogDescription>
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
                    </TableCell>
                    <TableCell>{team._count.FSquaredSelections}</TableCell>
                    <TableCell>
                      {(
                        (team.wins ?? 0) / pointsMultipler[league.division]
                      ).toFixed(0)}
                    </TableCell>
                    <TableCell>
                      {(
                        team.WeeklyScores.reduce((a, b) => a + b.pointsFor, 0) /
                        pointsMultipler[league.division]
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PickDistribution;
