import prisma from '@/src/lib/prisma';
import { request } from 'http';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const input = await req.json();

  // const result = await prisma.season.create({ data: newYear });
  console.log({ input });

  return NextResponse.json({ hello: 'world' });
};

export { handler as POST };
