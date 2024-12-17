import { Team } from "../../domain/entity/team";

export interface ITeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | undefined>;
  findByPairId(pairId: string): Promise<Team | null>
  findByParticipantId(id: string): Promise<Team | undefined>;
  save(team: Team): Promise<void>;
}