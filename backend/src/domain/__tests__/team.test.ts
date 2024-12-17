import { Team } from '../entity/team'
import { Pair } from '../../domain/entity/pair'

jest.mock('../../util/random', () => ({
  createRandomIdString: jest.fn(() => 'mocked-id')
}))

describe('Teamクラスのテスト', () => {
  let pair1: jest.Mocked<Pair>
  let pair2: jest.Mocked<Pair>
  let pair3: jest.Mocked<Pair>

  beforeEach(() => {
    // 各ペアのモックを手動で作成
    pair1 = {
      id: 'pair1',
      name: 'A',
      getParticipantIds: jest.fn(),
      addParticipant: jest.fn(),
      removeParticipant: jest.fn(),
      isParticipantExist: jest.fn(),
    } as unknown as jest.Mocked<Pair>

    pair2 = {
      id: 'pair2',
      name: 'B',
      getParticipantIds: jest.fn(),
      addParticipant: jest.fn(),
      removeParticipant: jest.fn(),
      isParticipantExist: jest.fn(),
    } as unknown as jest.Mocked<Pair>

    pair3 = {
      id: 'pair3',
      name: 'C',
      getParticipantIds: jest.fn(),
      addParticipant: jest.fn(),
      removeParticipant: jest.fn(),
      isParticipantExist: jest.fn(),
    } as unknown as jest.Mocked<Pair>

    // 各ペアの内部的なparticipantIdsを管理する変数
    let participantIds1 = ['p1', 'p2']
    let participantIds2 = ['p3']
    let participantIds3 = ['p4', 'p5']

    // pair1のモックメソッドの実装
    pair1.getParticipantIds.mockReturnValue(participantIds1)
    pair1.addParticipant.mockImplementation((participantId: string) => {
      participantIds1.push(participantId)
      pair1.getParticipantIds.mockReturnValue(participantIds1)
    })
    pair1.removeParticipant.mockImplementation((participantId: string) => {
      participantIds1 = participantIds1.filter(id => id !== participantId)
      pair1.getParticipantIds.mockReturnValue(participantIds1)
    })
    pair1.isParticipantExist.mockImplementation((participantId: string) => {
      return participantIds1.includes(participantId)
    })

    // pair2のモックメソッドの実装
    pair2.getParticipantIds.mockReturnValue(participantIds2)
    pair2.addParticipant.mockImplementation((participantId: string) => {
      participantIds2.push(participantId)
      pair2.getParticipantIds.mockReturnValue(participantIds2)
    })
    pair2.removeParticipant.mockImplementation((participantId: string) => {
      participantIds2 = participantIds2.filter(id => id !== participantId)
      pair2.getParticipantIds.mockReturnValue(participantIds2)
    })
    pair2.isParticipantExist.mockImplementation((participantId: string) => {
      return participantIds2.includes(participantId)
    })

    // pair3のモックメソッドの実装
    pair3.getParticipantIds.mockReturnValue(participantIds3)
    pair3.addParticipant.mockImplementation((participantId: string) => {
      participantIds3.push(participantId)
      pair3.getParticipantIds.mockReturnValue(participantIds3)
    })
    pair3.removeParticipant.mockImplementation((participantId: string) => {
      participantIds3 = participantIds3.filter(id => id !== participantId)
      pair3.getParticipantIds.mockReturnValue(participantIds3)
    })
    pair3.isParticipantExist.mockImplementation((participantId: string) => {
      return participantIds3.includes(participantId)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('コンストラクタ', () => {
    it('有効なパラメータでチームが正常に作成されること', () => {
      const team = new Team({
        id: 'team1',
        name: '123',
        pairs: [pair1, pair2]
      })

      expect(team.id).toBe('team1')
      expect(team.name).toBe('123')
      expect(team.getAllProperties().pairs).toEqual([pair1, pair2])
    })

    it('チーム名が3文字以下でない場合にエラーが投げられること', () => {
      expect(() => {
        new Team({
          id: 'team2',
          name: '1234',
          pairs: [pair1, pair2]
        })
      }).toThrow('チーム名は3文字以下にしてください')
    })

    it('チーム名が数字でない場合にエラーが投げられること', () => {
      expect(() => {
        new Team({
          id: 'team3',
          name: 'ABC',
          pairs: [pair1, pair2]
        })
      }).toThrow('チーム名は数字にしてください')
    })

    it('チーム名が正の整数でない場合にエラーが投げられること', () => {
      expect(() => {
        new Team({
          id: 'team4',
          name: '-1',
          pairs: [pair1, pair2]
        })
      }).toThrow('チーム名の数字は正の整数にしてください')

      expect(() => {
        new Team({
          id: 'team5',
          name: '1.3',
          pairs: [pair1, pair2]
        })
      }).toThrow('チーム名の数字は正の整数にしてください')
    })

    it('ペアの名前が重複している場合にエラーが投げられること', () => {
      const duplicatePair = {
        id: 'pair4',
        name: 'A',
        getParticipantIds: jest.fn().mockReturnValue(['p6']),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        isParticipantExist: jest.fn().mockReturnValue(['p6'].includes('p6')),
      } as unknown as jest.Mocked<Pair>

      expect(() => {
        new Team({
          id: 'team6',
          name: '456',
          pairs: [pair1, duplicatePair]
        })
      }).toThrow('チーム名:456のペア名が重複しています')
    })
  })

  describe('getAllPropertiesメソッド', () => {
    it('全プロパティが正しく返されること', () => {
      const team = new Team({
        id: 'team7',
        name: '789',
        pairs: [pair1, pair2]
      })

      const properties = team.getAllProperties()
      expect(properties.id).toBe('team7')
      expect(properties.name).toBe('789')
      expect(properties.pairs).toEqual([pair1, pair2])
    })
  })

  describe('getTotalParticipantCountメソッド', () => {
    it('全参加者数が正しく計算されること', () => {
      const team = new Team({
        id: 'team8',
        name: '101',
        pairs: [pair1, pair2, pair3]
      })

      expect(team.getTotalParticipantCount()).toBe(5) // p1, p2, p3, p4, p5
    })
  })

  describe('addParticipantメソッド', () => {
    it('参加者が正常に追加されること', () => {
      const team = new Team({
        id: 'team9',
        name: '202',
        pairs: [pair1, pair2]
      })

      team.addParticipant('p6')

      // 最小参加数のペアはpair2 (p3)
      expect(pair2.addParticipant).toHaveBeenCalledWith('p6')
      expect(pair2.getParticipantIds()).toContain('p6')
    })

    it('ペアが見つからない場合にエラーが投げられること', () => {
      const team = new Team({
        id: 'team10',
        name: '303',
        pairs: []
      })

      expect(() => {
        team.addParticipant('p7')
      }).toThrow('ペアが見つかりませんでした')
    })
  })

  describe('removeParticipantメソッド', () => {
    it('参加者が正常に削除されること', () => {
      const team = new Team({
        id: 'team11',
        name: '404',
        pairs: [pair1, pair2]
      })

      team.removeParticipant('p1')

      expect(pair1.removeParticipant).toHaveBeenCalledWith('p1')
      expect(pair1.getParticipantIds()).not.toContain('p1')
    })

    it('参加者が見つからない場合にエラーが投げられること', () => {
      const team = new Team({
        id: 'team12',
        name: '505',
        pairs: [pair1, pair2]
      })

      expect(() => {
        team.removeParticipant('p999')
      }).toThrow('ペアが見つかりませんでした')
    })

    it('ペアの参加者数が1人になった場合に再配置が行われること', () => {
      const team = new Team({
        id: 'team13',
        name: '606',
        pairs: [pair2]
      })

      team.removeParticipant('p3')

      expect(pair2.removeParticipant).toHaveBeenCalledWith('p3')
      // 再配置処理のテストは内部メソッドのためここでは省略
    })
  })

  describe('getMinParticipantPairメソッド', () => {
    it('最小参加数のペアが正しく取得されること', () => {
      const team = new Team({
        id: 'team14',
        name: '707',
        pairs: [pair1, pair2, pair3]
      })

      const minPairs = team.getMinParticipantPair()
      expect(minPairs).toEqual([pair2])
    })

    it('複数のペアが最小参加数の場合、全てのペアが返されること', () => {
      const pair4 = {
        id: 'pair4',
        name: 'D',
        getParticipantIds: jest.fn().mockReturnValue(['p6']),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        isParticipantExist: jest.fn().mockReturnValue(['p6'].includes('p6')),
      } as unknown as jest.Mocked<Pair>

      const team = new Team({
        id: 'team15',
        name: '808',
        pairs: [pair2, pair4]
      })

      const minPairs = team.getMinParticipantPair()
      expect(minPairs).toEqual([pair2, pair4])
    })
  })

  describe('reassignPairParticipantsメソッド', () => {
    it('参加者の再割り当てが正常に行われること', () => {
      const team = new Team({
        id: 'team16',
        name: '909',
        pairs: [pair1, pair2]
      })

      // 新しいペアを作成（同じ参加者IDを持つ）
      const newPair1 = {
        id: 'pair1-new',
        name: 'A-new',
        getParticipantIds: jest.fn().mockReturnValue(['p1', 'p2']),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        isParticipantExist: jest.fn().mockImplementation((participantId: string) => ['p1', 'p2'].includes(participantId)),
      } as unknown as jest.Mocked<Pair>

      const newPair2 = {
        id: 'pair2-new',
        name: 'B-new',
        getParticipantIds: jest.fn().mockReturnValue(['p3']),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        isParticipantExist: jest.fn().mockImplementation((participantId: string) => ['p3'].includes(participantId)),
      } as unknown as jest.Mocked<Pair>

      // 再割り当てを実行
      team.reassignPairParticipants([newPair1, newPair2])

      // 新しいペアがチームに設定されていることを確認
      expect(team.getAllProperties().pairs).toEqual([newPair1, newPair2])
    })

    it('参加者が変更されている場合にエラーが投げられること', () => {
      const team = new Team({
        id: 'team17',
        name: '999',
        pairs: [pair1, pair2]
      })

      const modifiedPair = {
        id: 'pair1',
        name: 'A',
        getParticipantIds: jest.fn().mockReturnValue(['p1']),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        isParticipantExist: jest.fn().mockReturnValue(['p1'].includes('p1')),
      } as unknown as jest.Mocked<Pair>

      // reassignPairParticipantsを呼び出す際にmodifiedPairを含む新しいペアリストを渡す
      expect(() => {
        team.reassignPairParticipants([modifiedPair, pair2])
      }).toThrow('ペアの参加者が変更されています')
    })
  })

  describe('getPair', () => {
    it('指定したIDのペアが正しく返されること', () => {
      const team = new Team({
        id: 'team18',
        name: '998',
        pairs: [pair1, pair2]
      })

      const foundPair = team.getPair('pair1')
      expect(foundPair).toBe(pair1)
    })

    it('指定したIDのペアが存在しない場合にエラーが投げられること', () => {
      const team = new Team({
        id: 'team19',
        name: '997',
        pairs: [pair1, pair2]
      })

      expect(() => {
        team.getPair('nonexistent-pair')
      }).toThrow('ペアが見つかりませんでした')
    })
  })

  describe('addPair', () => {
    it('ペアが正常に追加されること', () => {
      const team = new Team({
        id: 'team20',
        name: '996',
        pairs: [pair1]
      })

      team.addPair(pair2)

      expect(team.getAllProperties().pairs).toContain(pair2)
    })

    it('追加時にペア名が重複している場合にエラーが投げられること', () => {
      const duplicatePair = {
        id: 'pair3',
        name: 'A',
        getParticipantIds: jest.fn().mockReturnValue(['p4']),
        addParticipant: jest.fn(),
        removeParticipant: jest.fn(),
        isParticipantExist: jest.fn().mockReturnValue(['p4'].includes('p4')),
      } as unknown as jest.Mocked<Pair>

      const team = new Team({
        id: 'team21',
        name: '995',
        pairs: [pair1]
      })

      expect(() => {
        team.addPair(duplicatePair)
      }).toThrow('チーム名:995のペア名が重複しています')
    })
  })

  describe('deletePairメソッド', () => {
    it('ペアが正常に削除されること', () => {
      const team = new Team({
        id: 'team22',
        name: '994',
        pairs: [pair1, pair2, pair3]
      })

      team.deletePair('pair1')

      expect(team.getAllProperties().pairs).toEqual([pair2, pair3])
    })

    it('削除後の参加者数がMIN_MEMBER以上でない場合にエラーが投げられること', () => {
      const team = new Team({
        id: 'team23',
        name: '993',
        pairs: [pair1, pair2, pair3]
      })


      team.deletePair('pair1')

      expect(() => {
        team.deletePair('pair2')
      }).toThrow('チームの参加者数は3人以上必要です')
    })
  })
})
