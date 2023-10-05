import prisma from '../src/lib/prisma';

async function main() {
  console.log('delete this later');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
