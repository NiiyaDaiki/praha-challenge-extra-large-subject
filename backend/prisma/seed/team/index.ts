import { PrismaClient } from "@prisma/client"
import { uuid } from "uuidv4";

export const seedTeams = async (prisma: PrismaClient) => {
  const teamData = [
    { id: uuid(), name: '1' },
    { id: uuid(), name: '2' },
  ];

  const teams = await Promise.all(
    teamData.map((data) => prisma.team.create({ data }))
  );

  console.log(`${teams.length} teams seeded`);
  return teams;
}