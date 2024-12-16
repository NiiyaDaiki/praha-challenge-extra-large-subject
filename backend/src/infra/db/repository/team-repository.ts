import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from '../../../app/sample/repository-interface/team-repository-interface'
import { Team } from '../../../domain/entity/team'
import { Pair } from '../../../domain/entity/pair'

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findByParticipantId(participantId: string): Promise<Team | undefined> {
    const participant = await this.prismaClient.participant.findUnique({
      include: {
        pair: true
      },
      where: { id: participantId }
    })
    const pair = await this.prismaClient.pair.findUnique({
      include: {
        team: {
          include: {
            pairs: {
              include: {
                participants: true
              }
            }
          }
        }
      },
      where: { id: participant?.pairId ?? undefined }
    })
    if (!pair || !pair.team) {
      return undefined
    }

    return new Team({
      id: pair.team.id,
      name: pair.team.name,
      pairs: pair.team.pairs.map((pair) => {
        return new Pair({
          id: pair.id,
          name: pair.name,
          participantIds: pair.participants.map((participant) => participant.id)
        })
      })
    })
  }

  public async save(team: Team): Promise<void> {
    const { id, name, pairs } = team.getAllProperties();

    // トランザクション内で操作を行う
    await this.prismaClient.$transaction(async (prisma) => {
      // Team を upsert
      await prisma.team.upsert({
        where: { id },
        update: { name },
        create: { id, name },
      });

      // 既存の Pair の ID を取得
      const existingPairs = await prisma.pair.findMany({
        where: { teamId: id },
        select: { id: true },
      });
      const existingPairIds = existingPairs.map(pair => pair.id);

      // 新規作成、更新、削除すべき Pair を特定
      const newPairIds = pairs.map(pair => pair.id);
      const pairsToCreate = pairs.filter(pair => !existingPairIds.includes(pair.id));
      const pairsToUpdate = pairs.filter(pair => existingPairIds.includes(pair.id));
      const pairsToDelete = existingPairIds.filter(pairId => !newPairIds.includes(pairId));

      // 削除すべき Pair に関連付けられた Participant の pairId を null にする
      if (pairsToDelete.length > 0) {
        await prisma.participant.updateMany({
          where: { pairId: { in: pairsToDelete } },
          data: { pairId: null },
        });

        // Pair を削除
        await prisma.pair.deleteMany({
          where: { id: { in: pairsToDelete } },
        });
      }

      // 更新すべき Pair を更新
      for (const pair of pairsToUpdate) {
        await prisma.pair.update({
          where: { id: pair.id },
          data: {
            name: pair.name,
            teamId: id,
            participants: {
              set: pair.getParticipantIds().map(participantId => ({ id: participantId })),
            },
          },
        });
      }

      // 新規作成すべき Pair を作成
      for (const pair of pairsToCreate) {
        await prisma.pair.create({
          data: {
            id: pair.id,
            name: pair.name,
            teamId: id,
            participants: {
              connect: pair.getParticipantIds().map(participantId => ({ id: participantId })),
            },
          },
        });
      }
    });
  }

}