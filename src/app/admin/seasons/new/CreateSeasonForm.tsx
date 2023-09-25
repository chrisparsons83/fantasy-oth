'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const CreateSeasonForm = () => {
  const router = useRouter();

  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const season = {
      startYear: Number.parseInt(year),
      isActive: true,
      isOpenForRegistration: false,
    };

    const response = await fetch('/api/season', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(season),
    });
    const data = await response.json();

    if (response.status === 200) {
      router.refresh();
      router.push('/admin/seasons');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <span>Year</span>
          <input
            required
            type='text'
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
        </label>
        <button type='submit' disabled={isLoading}>
          {isLoading ? <span>Adding...</span> : <span>Add Season</span>}
        </button>
      </div>
    </form>
  );
};

export default CreateSeasonForm;
