import { PrismaClient, Team } from "@prisma/client"
import { uuid } from "uuidv4"

export const seedPairs = async (prisma: PrismaClient, prismaTeams: Team[]) => {

  const team1PairsData = [
    { id: uuid(), name: 'a', teamId: prismaTeams[0]?.id },
    { id: uuid(), name: 'b', teamId: prismaTeams[0]?.id },
  ]
  const team2PairsData = [
    { id: uuid(), name: 'c', teamId: prismaTeams[1]?.id },
    { id: uuid(), name: 'd', teamId: prismaTeams[1]?.id },
  ]

  const allPairsData = [...team1PairsData, ...team2PairsData]

  const pairs = await Promise.all(
    allPairsData.map((data) => prisma.pair.create({ data }))
  )

  console.log(`${allPairsData.length} pairs seeded`)
  return pairs
}