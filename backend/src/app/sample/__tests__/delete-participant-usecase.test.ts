import { DeleteParticipantUseCase } from '../delete-participant-usecase'
import { IParticipantRepository } from '.././repository-interface/participant-repository-interface'
import { ITeamRepository } from '.././repository-interface/team-repository-interface'
import { Participant } from '../../../domain/entity/participant'
import { Task } from '../../../domain/entity/task/task'
import { Team } from '../../../domain/entity/team'
import { Pair } from '../../../domain/entity/pair'

describe('DeleteParticipantUseCase', () => {
  let participantRepo: jest.Mocked<IParticipantRepository>
  let teamRepo: jest.Mocked<ITeamRepository>
  let usecase: DeleteParticipantUseCase

  beforeEach(() => {
    participantRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn()
    }

    teamRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPairId: jest.fn(),
      findByParticipantId: jest.fn(),
      save: jest.fn()
    }

    usecase = new DeleteParticipantUseCase(participantRepo, teamRepo)

    jest.spyOn(console, 'log').mockImplementation(() => { }) // console.logをモック
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('[正常系]: participantとteamが存在し、正常に削除できる', async () => {
    const participantId = 'p1'
    const participant = Participant.create({
      id: participantId,
      name: 'John Doe',
      email: 'john@example.com',
      tasks: [new Task({ id: 'task1', title: 'T1', genre: 'BASIS', description: 'desc' })]
    })

    // teamにはペアがありparticipant p1が含まれる
    const pair = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2', 'p3'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pair] })

    participantRepo.findById.mockResolvedValueOnce(participant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(team)
    participantRepo.delete.mockResolvedValueOnce(participant) // 削除成功

    await expect(usecase.do({ id: participantId })).resolves.toBeUndefined()

    // チームからp1が削除されていること
    expect(team.getAllProperties().pairs[0]?.getParticipantIds()).not.toContain('p1')

    // teamが保存された
    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    // participant削除された
    expect(participantRepo.delete).toHaveBeenCalledWith(participantId)
  })

  it('[異常系]: participantが存在しない場合エラー', async () => {
    participantRepo.findById.mockResolvedValueOnce(undefined)

    await expect(usecase.do({ id: 'p-not-exist' })).rejects.toThrow('参加者が見つかりませんでした')

    expect(teamRepo.findByParticipantId).not.toHaveBeenCalled()
    expect(teamRepo.save).not.toHaveBeenCalled()
    expect(participantRepo.delete).not.toHaveBeenCalled()
  })

  it('[異常系]: teamが存在しない場合エラー', async () => {
    const participantId = 'p1'
    const participant = Participant.create({
      id: participantId,
      name: 'John Doe',
      email: 'john@example.com',
      tasks: []
    })

    participantRepo.findById.mockResolvedValueOnce(participant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(undefined)

    await expect(usecase.do({ id: participantId })).rejects.toThrow('チームが見つかりませんでした')

    expect(teamRepo.save).not.toHaveBeenCalled()
    expect(participantRepo.delete).not.toHaveBeenCalled()
  })

  it('[メール送信確認]: チーム参加者が2名以下になった場合コンソールログ出力', async () => {
    const participantId = 'p1'
    const participant = Participant.create({
      id: participantId,
      name: 'Jane Doe',
      email: 'jane@example.com',
      tasks: []
    })

    // チームには2名参加
    const pair = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2', 'p3'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pair] })

    participantRepo.findById.mockResolvedValueOnce(participant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(team)
    participantRepo.delete.mockResolvedValueOnce(participant) // 削除成功

    await usecase.do({ id: participantId })

    // チーム保存
    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    // ログ出力確認
    expect(console.log).toHaveBeenCalledWith('メール送信処理 チーム名:1のメンバー数が2名以下になりました')
  })

  it('[異常系]: participantRepo.deleteがfalseを返した場合エラー', async () => {
    const participantId = 'p1'
    const participant = Participant.create({
      id: participantId,
      name: 'Delete Fail User',
      email: 'fail@example.com',
      tasks: []
    })

    const pair = new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2', 'p3'] })
    const team = new Team({ id: 'team1', name: '1', pairs: [pair] })

    participantRepo.findById.mockResolvedValueOnce(participant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(team)

    participantRepo.save.mockResolvedValueOnce(undefined) // 削除失敗(戻りがundefined)

    await expect(usecase.do({ id: participantId })).rejects.toThrow('参加者が見つかりませんでした')

    // 削除できなかったので、メール送信は発生しない
    expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('メール送信処理'))
  })
})
