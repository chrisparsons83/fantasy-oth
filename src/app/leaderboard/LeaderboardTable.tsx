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
  include: { user: true, teams: { include: { league: true } } },
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
  score: number;
  entries: string[];
}

const LeaderboardTable = ({ type, entries }: LeaderboardTableProps) => {
  const now = new Date();

  const results: TableRow[] = entries
    .map((entry) => {
      console.log({ teams: entry.teams.map((team) => team.ownerName) });
      return {
        id: entry.id,
        name: entry.user.name ?? '',
        entries: entry.teams
          .filter((team) => team.league.draftDateTime < now)
          .map(
            (team) =>
              `D${team.league.division} ${team.league.name} - ${team.ownerName}`
          ),
        score: 0,
      };
    })
    .sort((a, b) =>
      a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
    );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className='text-right'>
              <span className='pr-2'>Score</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row) => (
            <TableRow key={row.id}>
              <TableCell className='font-medium'>
                <Dialog>
                  <DialogTrigger>{row.name}</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>List of managers selected</DialogTitle>
                      <DialogDescription>
                        This list will populate as leagues draft.
                      </DialogDescription>
                    </DialogHeader>
                    {row.entries.map((entry) => (
                      <div key={entry} className='leading-4'>
                        {entry}
                      </div>
                    ))}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className='text-right'>
                <span className='pr-2'>{row.score}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
