import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Prisma } from '@prisma/client';

const entriesWithTeamsAndUser = Prisma.validator<Prisma.FSquaredEntryArgs>()({
  include: {
    user: true,
    teams: { include: { league: true, WeeklyScores: true } },
  },
});
export type EntriesWithTeamsAndUser = Prisma.FSquaredEntryGetPayload<
  typeof entriesWithTeamsAndUser
>;

interface LeaderboardTableProps {
  type: 'pointsFor' | 'wins';
  entries: EntriesWithTeamsAndUser[];
}

interface TableRow {
  id: string;
  name: string;
  pointsFor: number;
  wins: number;
  tiebreaker: number;
  entries: EntriesWithTeamsAndUser['teams'];
  rank: number;
}

const scoreByPointsFor = (entry: EntriesWithTeamsAndUser) =>
  Number.parseFloat(
    entry.teams
      .reduce(
        (a, b) => a + b.WeeklyScores.reduce((a, b) => a + b.pointsFor, 0),
        0
      )
      .toFixed(2)
  );

const scoreByWins = (entry: EntriesWithTeamsAndUser) => 0;

const LeaderboardTable = ({ type, entries }: LeaderboardTableProps) => {
  const now = new Date();

  const results: TableRow[] = entries
    .map((entry) => {
      return {
        id: entry.id,
        rank: 1,
        name: entry.user.name ?? '',
        entries: entry.teams.filter((team) => team.league.draftDateTime < now),
        pointsFor: scoreByPointsFor(entry),
        wins: scoreByWins(entry),
        tiebreaker: scoreByWins(entry) + scoreByPointsFor(entry) / 1000000000,
      };
    })
    .sort((a, b) => {
      if (type === 'pointsFor') {
        if (b.pointsFor - a.pointsFor === 0) {
          return b.tiebreaker - a.tiebreaker;
        }
        return b.pointsFor - a.pointsFor;
      }
      if (type === 'wins') {
        if (b.wins - a.wins === 0) {
          return b.tiebreaker - a.tiebreaker;
        }
        return b.wins - a.wins;
      }

      // Don't think we should ever get to this
      return 0;
    });

  const rankedResults = results.map((entry, index) => {
    return {
      ...entry,
      rank: index + 1,
    };
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-8'>Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className='text-right'>
              <span className='pr-2'>Score</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankedResults.map((row) => (
            <TableRow key={row.id}>
              <TableCell className='text-center'>{row.rank}</TableCell>
              <TableCell className='font-medium'>
                <Dialog>
                  <DialogTrigger>{row.name}</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Picks by {row.name}</DialogTitle>
                      <DialogDescription>
                        Breakdown of points scored
                      </DialogDescription>
                    </DialogHeader>
                    <div className='max-h-[70vh] overflow-y-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='p-2'>Team</TableHead>
                            <TableHead className='p-2'>Points</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {row.entries.map((entry) => (
                            <TableRow
                              key={entry.WeeklyScores[0].fleaflickerTeamId}
                            >
                              <TableCell className='p-2'>
                                {`D${entry.league.division} - ${entry.teamName}`}
                              </TableCell>
                              <TableCell className='p-2'>
                                {entry.WeeklyScores.reduce(
                                  (a, b) => a + b.pointsFor,
                                  0
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className='text-right'>
                <span className='pr-2'>
                  {type === 'pointsFor'
                    ? row.pointsFor.toFixed(2)
                    : row.wins.toFixed(0)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
