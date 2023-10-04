'use client';

import { League, Prisma, Team } from '@prisma/client';
import { Session } from 'next-auth';
import React, { FormEvent, useState } from 'react';

const leagueWithTeams = Prisma.validator<Prisma.LeagueArgs>()({
  include: { teams: true },
});
export type LeagueWithTeams = Prisma.LeagueGetPayload<typeof leagueWithTeams>;

const existingEntryStructure = Prisma.validator<Prisma.FSquaredEntryArgs>()({
  include: { teams: true },
});
export type ExistingEntry = Prisma.FSquaredEntryGetPayload<
  typeof existingEntryStructure
>;

interface MyEntryFormProps {
  leagues: LeagueWithTeams[];
  session: Session | null;
  existingEntry: ExistingEntry | null;
}

const MyEntryForm = ({ leagues, session, existingEntry }: MyEntryFormProps) => {
  const initialFormObject: Record<string, string[]> = {};
  leagues.forEach((league) => {
    initialFormObject[league.id] =
      existingEntry?.teams
        .filter((x) => x.leagueId === league.id)
        .map((x) => x.id) ?? [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [formValues, setFormValues] = useState(initialFormObject);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) {
      setFormValues((prevState) => {
        const newArray = prevState[e.target.name];
        newArray.push(e.target.value);
        return {
          ...prevState,
          [e.target.name]: newArray,
        };
      });
    }
    if (e.target.checked === false) {
      setFormValues((prevState) => {
        const newArray = prevState[e.target.name];
        return {
          ...prevState,
          [e.target.name]: newArray.filter((x) => x !== e.target.value),
        };
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setIsFailure(false);

    const dataToSend = {
      seasonId: leagues[0].seasonId,
      userId: session?.user.id,
      teams: Object.values(formValues).flatMap((x) => x),
    };

    const response = await fetch('/api/f-squared', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    const data = await response.json();

    setIsLoading(false);
    window.scrollTo({ top: 0 });

    if (response.status === 200) {
      setIsSuccess(true);
    } else {
      setIsFailure(true);
    }
  };

  const isValidLineup = Object.values(formValues).every((x) => x.length === 2);

  return (
    <>
      {isSuccess && (
        <p className='text-bold my-4 bg-green-800 p-4'>
          Your entry has been updated.
        </p>
      )}
      {isFailure && (
        <p className='text-bold my-4 bg-red-800 p-4'>
          Something went wrong when submitting your entry. Go bug Chris.
        </p>
      )}
      <form
        className='mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3'
        onSubmit={handleSubmit}
      >
        {leagues.map((league) => (
          <div key={league.id} className='bg-gray-900 p-2'>
            <h2>
              {league.name} - D{league.division}
            </h2>
            {league.teams.map((team) => (
              <label key={team.id} className='block'>
                <input
                  type='checkbox'
                  name={league.id}
                  value={team.id}
                  className='disabled:opacity-25'
                  onChange={handleChange}
                  disabled={
                    formValues[league.id].length === 2 &&
                    !formValues[league.id].includes(team.id)
                  }
                  checked={formValues[league.id].includes(team.id)}
                />{' '}
                <span>
                  {team.teamName} - {team.ownerName}
                </span>
              </label>
            ))}
          </div>
        ))}
        <button type='submit' disabled={!isValidLineup}>
          {isLoading ? <>Saving...</> : <>Save Entry</>}
        </button>
      </form>
    </>
  );
};

export default MyEntryForm;
