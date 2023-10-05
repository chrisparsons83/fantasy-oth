import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions, Session } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { json } from 'stream/consumers';

const OTH_SERVER_ID = `207634081700249601`;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
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

        const name =
          jsonGuild.nick ??
          jsonGuild.user.global_name ??
          jsonGuild.user.username;

        await prisma.user.updateMany({
          where: {
            OR: [
              {
                id: user.id,
              },
              {
                discordUserId: user.id,
              },
            ],
          },
          data: {
            name,
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
          discordUserId: profile.id,
          name: profile.username,
          image: profile.image_url,
        };
      },
    }),
  ],
};

export const requireAdmin = (session: Session | null) => {
  if (!session) {
    redirect('/');
  }
  if (session.user?.id !== 'cll90b6sj0002uf2g442bbb9z') {
    redirect('/');
  }
  return true;
};

export const requireUser = (session: Session | null) => {
  if (!session) {
    redirect('/');
  }

  return true;
};
