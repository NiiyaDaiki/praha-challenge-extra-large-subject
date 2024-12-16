import { Team } from "../../../domain/entity/team";

export interface ITeamRepository {
  findByParticipantId(id: string): Promise<Team | undefined>;
  save(team: Team): Promise<void>;
}