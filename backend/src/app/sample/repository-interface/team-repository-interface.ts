import { Team } from "../../../domain/entity/team";

export interface ITeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | undefined>;
  findByParticipantId(id: string): Promise<Team | undefined>;
  save(team: Team): Promise<void>;
}