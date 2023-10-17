import z from 'zod';

export const fetchLeagueStandingsSchema = z.object({
  divisions: z
    .object({
      id: z.number(),
      teams: z
        .object({
          id: z.number(),
          name: z.string(),
          pointsFor: z.object({
            formatted: z.string(),
          }),
          draftPosition: z.number().optional(),
          owners: z
            .object({
              id: z.number(),
              displayName: z.string(),
            })
            .array(),
          recordOverall: z.object({
            wins: z.number().optional(),
            ties: z.number().optional(),
            losses: z.number().optional(),
          }),
        })
        .array(),
    })
    .array(),
  league: z.object({
    id: z.number(),
    name: z.string(),
    draftLiveTimeEpochMilli: z.string(),
  }),
});

export const fleaflickerScoreboardSchema = z.object({
  schedulePeriod: z.object({
    ordinal: z.number(),
  }),
  games: z
    .object({
      id: z.string(),
      home: z.object({
        id: z.number(),
      }),
      away: z.object({
        id: z.number(),
      }),
      homeScore: z.object({
        score: z.object({
          value: z.number(),
          formatted: z.string(),
        }),
      }),
      awayScore: z.object({
        score: z.object({
          value: z.number(),
          formatted: z.string(),
        }),
      }),
    })
    .array(),
});
