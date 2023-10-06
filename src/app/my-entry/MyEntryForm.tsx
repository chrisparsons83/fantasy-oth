'use client';

import { Button } from '@/src/components/ui/button';
import { League, Prisma, Team } from '@prisma/client';
import clsx from 'clsx';
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

  const now = new Date();

  const isValidLineup = Object.values(formValues).every((x) => x.length === 2);
  const managersSelected = Object.values(formValues).flatMap((x) => x).length;

  const buttonText = isLoading
    ? 'Saving...'
    : isValidLineup
    ? 'Save Entry'
    : `${managersSelected} of 16 managers selected`;

  return (
    <>
      {isSuccess && (
        <p className='text-bold bg-green-800 p-4'>
          Your entry has been updated.
        </p>
      )}
      {isFailure && (
        <p className='text-bold bg-red-800 p-4'>
          Something went wrong when submitting your entry. Go bug Chris.
        </p>
      )}
      <form className='mb-8 mt-4' onSubmit={handleSubmit}>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {leagues.map((league) => (
            <div
              key={league.id}
              className='rounded-md bg-zinc-700 p-4 drop-shadow-md'
            >
              <div className='mb-4 text-2xl font-bold'>
                {league.name} - D{league.division}
              </div>
              {league.teams.map((team) => (
                <label key={team.id} className='my-2 flex gap-4'>
                  <input
                    type='checkbox'
                    name={league.id}
                    value={team.id}
                    className='disabled:opacity-25'
                    onChange={handleChange}
                    disabled={
                      (formValues[league.id].length === 2 &&
                        !formValues[league.id].includes(team.id)) ||
                      now > league.draftDateTime
                    }
                    checked={formValues[league.id].includes(team.id)}
                  />{' '}
                  <div
                    className={clsx(
                      formValues[league.id].includes(team.id) && 'text-sky-300'
                    )}
                  >
                    <div className='text-sm font-bold'>{team.teamName}</div>
                    <div className='text-sm italic'>{team.ownerName}</div>
                  </div>
                </label>
              ))}
            </div>
          ))}
        </div>

        <Button
          type='submit'
          disabled={!isValidLineup}
          className='mb-8 mt-4 w-full bg-blue-800 text-white hover:bg-blue-500'
        >
          {buttonText}
        </Button>
      </form>
    </>
  );
};

export default MyEntryForm;
