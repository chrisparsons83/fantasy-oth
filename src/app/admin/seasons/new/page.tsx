'use client';

import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { getServerSession } from 'next-auth';
import { authOptions, requireAdmin } from '@/src/lib/auth';

const formSchema = z.object({
  startYear: z.number().min(2023, {
    message: 'Year must not be in the past',
  }),
});

const NewSeasonPage = async () => {
  const session = await getServerSession(authOptions);
  requireAdmin(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startYear: new Date().getFullYear(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newYear = {
      ...values,
      isActive: false,
      isOpenForRegistration: false,
    };

    console.log({ newYear });

    try {
      const result = await fetch('/api/season', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newYear),
      });
      const data = await result.json();
      console.log({ data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='startYear'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
                <FormDescription>
                  The year you are creating a season for. It should be the first
                  year in the season, e.g. 2023 for the 2023-2024 season.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewSeasonPage;
