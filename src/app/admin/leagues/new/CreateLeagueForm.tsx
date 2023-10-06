'use client';

import { Season } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface Props {
  seasons: Season[];
}

const CreateLeagueForm = ({ seasons }: Props) => {
  const router = useRouter();

  const [season, setSeason] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const league = {
      seasonId: season,
      url,
    };

    const response = await fetch('/api/league', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(league),
    });
    const data = await response.json();

    if (response.status === 200) {
      router.refresh();
      router.push('/admin/leagues');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <span>Season</span>
          <select
            value={season}
            name='seasonId'
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value=''></option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.startYear}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          <span>League URL</span>
          <input
            required
            type='text'
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
        </label>
      </div>
      <div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? <span>Adding...</span> : <span>Add League</span>}
        </button>
      </div>
    </form>
  );
};

export default CreateLeagueForm;
