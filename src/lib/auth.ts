import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from '@/src/lib/prisma';
import { Truculenta } from 'next/font/google';

const OTH_SERVER_ID = `207634081700249601`;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account }) {
      if (account) {
        const resGuildMember = await fetch(
          `https://discord.com/api/users/@me/guilds/${OTH_SERVER_ID}/member`,
          {
            headers: {
              Authorization: `${account.token_type} ${account.access_token}`,
            },
          }
        );
        const jsonGuild = await resGuildMember.json();

        // This blocks people not on the server from signing in, I think? Probably is a better way
        // to limit this than checking if they have any roles.
        if (jsonGuild.roles.length === 0) return false;

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: jsonGuild.nick,
          },
        });
      }

      return true;
    },
  },
  providers: [
    DiscordProvider({
      authorization:
        'https://discord.com/api/oauth2/authorize?scope=identify%20guilds.members.read',
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      async profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          name: profile.username,
          image: profile.image_url,
        };
      },
    }),
  ],
};
