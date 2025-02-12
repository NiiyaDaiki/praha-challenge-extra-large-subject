import { ReassignPairParticipantsUseCase } from '../reassign-pair-participants-usecase'
import { ITeamRepository } from '../repository-interface/team-repository-interface'
import { Team } from '../../domain/entity/team'
import { Pair } from '../../domain/entity/pair'

describe('ReassignPairParticipantsUseCase', () => {
  let teamRepo: jest.Mocked<ITeamRepository>
  let usecase: ReassignPairParticipantsUseCase

  beforeEach(() => {
    teamRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPairId: jest.fn(),
      findByParticipantId: jest.fn(),
      save: jest.fn()
    }

    usecase = new ReassignPairParticipantsUseCase(teamRepo)

    jest.spyOn(console, 'log').mockImplementation(() => { }) // console.logをモックしてテストの出力を抑制
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('[正常系]: チームが存在し、ペア情報の再割り当てと保存が正常に行われる', async () => {
    const teamId = 'team1'
    const pairs = [
      new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2'] }),
      new Pair({ id: 'pairB', name: 'b', participantIds: ['p3', 'p4'] })
    ]

    // 修正点: チームの元々のペアにも同じ参加者（p1, p2, p3, p4）が含まれるようにする
    const initialPairs = [
      new Pair({ id: 'oldPair1', name: 'x', participantIds: ['p1', 'p4'] }),
      new Pair({ id: 'oldPair2', name: 'y', participantIds: ['p2', 'p3'] }),
    ]

    const team = new Team({ id: teamId, name: '1', pairs: initialPairs })

    teamRepo.findById.mockResolvedValueOnce(team)

    await expect(usecase.do({ id: teamId, pairs })).resolves.toBeUndefined()

    expect(teamRepo.findById).toHaveBeenCalledWith(teamId)
    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    const savedTeam = teamRepo.save.mock.calls[0]?.[0] as Team

    const savedTeamProps = savedTeam.getAllProperties()
    expect(savedTeamProps.pairs.length).toBe(2)
    expect(savedTeamProps.pairs[0]?.id).toBe('pairA')
    expect(savedTeamProps.pairs[1]?.id).toBe('pairB')

    // ログ確認
    expect(console.log).toHaveBeenCalledWith(`チーム${teamId}のペア情報を更新します`)
    expect(console.log).toHaveBeenCalledWith(`チーム${teamId}のペア情報を更新しました`)
  })


  it('[異常系]: チームが見つからない場合エラー', async () => {
    const teamId = 'non-existent'
    teamRepo.findById.mockResolvedValueOnce(undefined)

    await expect(usecase.do({ id: teamId, pairs: [] }))
      .rejects.toThrow('チームが見つかりませんでした')

    expect(teamRepo.save).not.toHaveBeenCalled()
    // ログは更新開始メッセージのみ出力されるはず
    expect(console.log).toHaveBeenCalledWith(`チーム${teamId}のペア情報を更新します`)
    // 更新完了メッセージは出ない
    expect(console.log).not.toHaveBeenCalledWith(`チーム${teamId}のペア情報を更新しました`)
  })

  it('[異常系]: reassignPairParticipants中にエラーが発生した場合、エラーがスローされる', async () => {
    const teamId = 'team-error'
    const invalidPairs = [
      new Pair({ id: 'pairX', name: 'x', participantIds: ['p1', 'p2'] }),
      new Pair({ id: 'pairX', name: 'x', participantIds: ['p3', 'p4'] }) // 名前重複などのエラー条件
    ]

    const team = new Team({ id: teamId, name: '1', pairs: [] })
    teamRepo.findById.mockResolvedValueOnce(team)

    // reassignPairParticipants内部でエラーが起きるようにspyする
    jest.spyOn(team, 'reassignPairParticipants').mockImplementation(() => {
      throw new Error('ペアの参加者が変更されています')
    })

    await expect(usecase.do({ id: teamId, pairs: invalidPairs }))
      .rejects.toThrow('ペアの参加者が変更されています')

    expect(teamRepo.save).not.toHaveBeenCalled()
    // 更新開始ログはあるが更新完了ログはない
    expect(console.log).toHaveBeenCalledWith(`チーム${teamId}のペア情報を更新します`)
    expect(console.log).not.toHaveBeenCalledWith(`チーム${teamId}のペア情報を更新しました`)
  })
})
