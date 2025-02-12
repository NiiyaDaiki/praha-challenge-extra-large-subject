import { MovePairUseCase } from '../move-pair-usecase'
import { ITeamRepository } from '.././repository-interface/team-repository-interface'
import { Team } from '../../../domain/entity/team'
import { Pair } from '../../../domain/entity/pair'

jest.mock('../../../util/random', () => {
  const actualRandom = jest.requireActual('../../../util/random') as { [key: string]: any };
  return {
    ...actualRandom,
    createRandomIdString: jest.fn().mockReturnValue('fixed-id'),
  };
});

describe('MovePairUseCase', () => {
  let teamRepo: jest.Mocked<ITeamRepository>
  let usecase: MovePairUseCase

  beforeEach(() => {
    teamRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPairId: jest.fn(),
      findByParticipantId: jest.fn(),
      save: jest.fn(),
    }

    usecase = new MovePairUseCase(teamRepo)

    jest.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('[正常系]: pairIdを持つチームとtoTeamIdを持つチームが存在し、正常に移動する', async () => {
    const pairId = 'pairA'
    const oldTeam = new Team({
      id: 'team1', name: '1', pairs: [
        new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2'] }),
        new Pair({ id: 'pairB', name: 'b', participantIds: ['p3', 'p4', 'p5'] })
      ]
    })
    const toTeam = new Team({
      id: 'team2', name: '2', pairs: [
        new Pair({ id: 'pairC', name: 'c', participantIds: ['p6', 'p7'] }),
        new Pair({ id: 'pairD', name: 'd', participantIds: ['p8', 'p9'] })
      ]
    })

    teamRepo.findByPairId.mockResolvedValueOnce(oldTeam)
    teamRepo.findById.mockResolvedValueOnce(toTeam)

    await expect(usecase.do({ pairId, toTeamId: 'team2' })).resolves.toBeUndefined()

    // 移動後、oldTeamからpairAは削除され、toTeamにpairAが追加されたはず
    expect(teamRepo.save).toHaveBeenCalledTimes(2)
    // 最初にoldTeamをsave、その後toTeamをsaveしているか(順番までは保証できないが、最低限2回呼ばれていること)
    const savedOldTeam = teamRepo.save.mock.calls[0]?.[0] as Team
    const savedToTeam = teamRepo.save.mock.calls[1]?.[0] as Team

    // oldTeamからpairAは削除されているはず
    expect(savedOldTeam.getAllProperties().pairs.find(p => p.id === pairId)).toBeUndefined()
    // toTeamにpairAが存在する
    expect(savedToTeam.getAllProperties().pairs.find(p => p.id === pairId)).not.toBeUndefined()
  })

  it('[異常系]: pairIdを持つチーム(oldTeam)が見つからない場合、エラーが発生する', async () => {
    teamRepo.findByPairId.mockResolvedValueOnce(null)

    await expect(usecase.do({ pairId: 'not-found', toTeamId: 'team2' }))
      .rejects.toThrow('所属元チームが見つかりませんでした')

    // teamRepo.saveは呼ばれない
    expect(teamRepo.save).not.toHaveBeenCalled()
  })

  it('[異常系]: toTeamIdを持つチームが見つからない場合、エラーが発生する', async () => {
    const pairId = 'pairA'
    const oldTeam = new Team({
      id: 'team1', name: '1', pairs: [
        new Pair({ id: pairId, name: 'a', participantIds: ['p1', 'p2'] })
      ]
    })

    teamRepo.findByPairId.mockResolvedValueOnce(oldTeam)
    teamRepo.findById.mockResolvedValueOnce(undefined)  // 移動先チームが見つからない

    await expect(usecase.do({ pairId, toTeamId: 'not-found-team' }))
      .rejects.toThrow('移動先チームが見つかりませんでした')

    expect(teamRepo.save).not.toHaveBeenCalled()
  })
})
