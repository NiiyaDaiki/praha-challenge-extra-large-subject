import { UpdateParticipantUseCase } from '../update-participant-usecase'
import { IParticipantRepository } from '../repository-interface/participant-repository-interface'
import { ITeamRepository } from '../repository-interface/team-repository-interface'
import { Participant } from '../../domain/entity/participant'
import { Team } from '../../domain/entity/team'
import { Pair } from '../../domain/entity/pair'
import { MembershipStatus } from '../../domain/entity/participant'
import { Task } from '../../domain/entity/task/task'

// Math.randomを固定
jest.spyOn(global.Math, 'random').mockReturnValue(0.5)

describe('UpdateParticipantUseCase', () => {
  let participantRepo: jest.Mocked<IParticipantRepository>
  let teamRepo: jest.Mocked<ITeamRepository>
  let usecase: UpdateParticipantUseCase

  beforeEach(() => {
    participantRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
    }

    teamRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPairId: jest.fn(),
      findByParticipantId: jest.fn(),
      save: jest.fn(),
    }

    usecase = new UpdateParticipantUseCase(participantRepo, teamRepo)

    jest.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  const existingParticipant = Participant.create({
    id: 'p1',
    name: 'John Doe',
    email: 'john@example.com',
    tasks: [new Task({ id: 't1', title: 'Task1', genre: 'BASIS', description: 'desc' })],
  })

  it('[正常系]: statusをACTIVEに変更し、最小参加人数チームに追加', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    // メール重複なし
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)

    // チーム (2チーム中、1チームが最少人数)
    const pairA = new Pair({ id: 'pairA', name: 'a', participantIds: ['p2', 'p3', 'p4'] })
    const pairB = new Pair({ id: 'pairB', name: 'b', participantIds: ['p5', 'p6'] }) // 最小人数チーム
    const teamA = new Team({ id: 'teamA', name: '1', pairs: [pairA] })
    const teamB = new Team({ id: 'teamB', name: '2', pairs: [pairB] })

    teamRepo.findAll.mockResolvedValueOnce([teamA, teamB]) // TeamService用

    await expect(usecase.do({ id: 'p1', status: 'ACTIVE' })).resolves.toBeUndefined()

    // teamBが最小参加人数なのでp1が追加される
    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    const savedTeam = teamRepo.save.mock.calls[0]?.[0] as Team
    expect(savedTeam.getAllProperties().pairs.find(p => p.id === 'pairB')?.getParticipantIds()).toContain('p1')

    expect(participantRepo.save).toHaveBeenCalledTimes(1)
    const savedParticipant = participantRepo.save.mock.calls[0]?.[0] as Participant
    expect(savedParticipant.status).toBe('ACTIVE')
  })

  it('[正常系]: statusをINACTIVEに変更し、所属チームから削除', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(
      new Team({
        id: 'team1',
        name: '1',
        pairs: [new Pair({ id: 'pairA', name: 'a', participantIds: ['p1', 'p2', 'p3'] })],
      })
    )

    await expect(usecase.do({ id: 'p1', status: 'INACTIVE' })).resolves.toBeUndefined()

    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    const updatedTeam = teamRepo.save.mock.calls[0]?.[0] as Team
    expect(updatedTeam.getAllProperties().pairs[0]?.getParticipantIds()).not.toContain('p1')

    expect(participantRepo.save).toHaveBeenCalledTimes(1)
    const savedParticipant = participantRepo.save.mock.calls[0]?.[0] as Participant
    expect(savedParticipant.status).toBe('INACTIVE')
  })

  it('[正常系]: statusをLEFTに変更し、所属チームから削除', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(
      new Team({
        id: 'team2',
        name: '2',
        pairs: [new Pair({ id: 'pairB', name: 'b', participantIds: ['p1', 'p2', 'p3'] })],
      })
    )

    await expect(usecase.do({ id: 'p1', status: 'LEFT' })).resolves.toBeUndefined()

    expect(teamRepo.save).toHaveBeenCalledTimes(1)
    const updatedTeam = teamRepo.save.mock.calls[0]?.[0] as Team
    expect(updatedTeam.getAllProperties().pairs[0]?.getParticipantIds()).not.toContain('p1')

    expect(participantRepo.save).toHaveBeenCalledTimes(1)
    const savedParticipant = participantRepo.save.mock.calls[0]?.[0] as Participant
    expect(savedParticipant.status).toBe('LEFT')
  })

  it('[正常系]: emailを変更(重複なし)してACTIVEに', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    teamRepo.findAll.mockResolvedValueOnce([
      new Team({
        id: 'teamX',
        name: '1',
        pairs: [new Pair({ id: 'pairX', name: 'x', participantIds: ['p1', 'p2'] })],
      })
    ])

    await expect(usecase.do({ id: 'p1', email: 'new@example.com', status: 'ACTIVE' })).resolves.toBeUndefined()

    const savedParticipant = participantRepo.save.mock.calls[0]?.[0] as Participant
    expect(savedParticipant.email).toBe('new@example.com')
  })

  it('[異常系]: 不正なstatus', async () => {
    await expect(usecase.do({ id: 'p1', status: 'UNKNOWN' as MembershipStatus })).rejects.toThrow('statusの値が不正です')
  })

  it('[異常系]: 参加者が存在しない場合', async () => {
    participantRepo.findById.mockResolvedValueOnce(undefined)
    await expect(usecase.do({ id: 'not_exist', status: 'ACTIVE' })).rejects.toThrow('参加者が見つかりませんでした')
  })

  it('[異常系]: メール重複', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    participantRepo.findByEmail.mockResolvedValueOnce({
      ...existingParticipant,
      email: 'dup@example.com'
    } as Participant)

    await expect(usecase.do({ id: 'p1', email: 'dup@example.com', status: 'ACTIVE' }))
      .rejects.toThrow('このメールアドレスは既に登録されています')
  })

  it('[異常系]: ACTIVEにしようとするがチームが見つからない', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    participantRepo.findByEmail.mockResolvedValueOnce(undefined)
    teamRepo.findAll.mockResolvedValueOnce([]) // チームなし

    await expect(usecase.do({ id: 'p1', status: 'ACTIVE' })).rejects.toThrow('チームが見つかりませんでした')
  })

  it('[異常系]: INACTIVE/LEFTにするがチームが見つからない', async () => {
    participantRepo.findById.mockResolvedValueOnce(existingParticipant)
    teamRepo.findByParticipantId.mockResolvedValueOnce(undefined)

    await expect(usecase.do({ id: 'p1', status: 'INACTIVE' })).rejects.toThrow('チームが見つかりませんでした')
  })
})
