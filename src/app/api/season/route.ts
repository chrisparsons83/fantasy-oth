import prisma from '@/src/lib/prisma';
import { request } from 'http';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const newYear = await req.json();

  const result = await prisma.season.create({ data: newYear });
  // console.log({ newYear });

  return NextResponse.json({ hello: 'world' });
};

export { handler as POST };
