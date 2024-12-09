import { Pair } from '../entity/pair'

describe('Pair クラス', () => {
  describe('constructor', () => {
    it('有効な引数で Pair のインスタンスが正しく作成されること', () => {
      const args = {
        id: 'pair1',
        name: 'A',
        participantIds: ['user1', 'user2']
      }

      const pair = new Pair(args)

      expect(pair.id).toBe('pair1')
      expect(pair.name).toBe('A')
      expect(pair.getParticipantIds()).toEqual(['user1', 'user2'])
    })

    it('名前が無効（2文字以上）の場合にエラーがスローされること', () => {
      const args = {
        id: 'pair2',
        name: 'AB',
        participantIds: ['user1', 'user2']
      }

      expect(() => new Pair(args)).toThrow('ペア名はa-zの英文字1文字でなければなりません。')
    })

    it('名前にa-z/A-Z以外の文字が含まれている場合にエラーがスローされること', () => {
      const args = {
        id: 'pair3',
        name: '1',
        participantIds: ['user1', 'user2']
      }

      expect(() => new Pair(args)).toThrow('ペア名はa-zの英文字1文字でなければなりません。')
    })

    it('参加者数が2名未満の場合にエラーがスローされること', () => {
      const args = {
        id: 'pair4',
        name: 'B',
        participantIds: ['user1']
      }

      expect(() => new Pair(args)).toThrow('ペアには2名〜3名の参加者が必要です。')
    })

    it('参加者数が3名を超える場合にエラーがスローされること', () => {
      const args = {
        id: 'pair5',
        name: 'C',
        participantIds: ['user1', 'user2', 'user3', 'user4']
      }

      expect(() => new Pair(args)).toThrow('ペアには2名〜3名の参加者が必要です。')
    })
  })

  describe('getParticipantIds', () => {
    it('参加者のIDが正しく返されること', () => {
      const args = {
        id: 'pair6',
        name: 'D',
        participantIds: ['user1', 'user2', 'user3']
      }

      const pair = new Pair(args)

      expect(pair.getParticipantIds()).toEqual(['user1', 'user2', 'user3'])
    })
  })

  describe('addParticipant', () => {
    let pair: Pair

    beforeEach(() => {
      const args = {
        id: 'pair7',
        name: 'E',
        participantIds: ['user1', 'user2']
      }
      pair = new Pair(args)
    })

    it('新しい参加者を正常に追加できること', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      pair.addParticipant('user3')

      expect(pair.getParticipantIds()).toContain('user3')
      expect(pair.getParticipantIds().length).toBe(3)
      expect(consoleSpy).toHaveBeenCalledWith('Eにuser3を追加します。')

      consoleSpy.mockRestore()
    })

    it('既に存在する参加者を追加しようとするとエラーがスローされること', () => {
      pair.addParticipant('user3')

      expect(() => pair.addParticipant('user3')).toThrow('既にPairに所属しています。')
    })

    it('参加者数が上限を超える場合にエラーがスローされ、適切なログが出力されること', () => {
      pair.addParticipant('user3')

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      expect(() => pair.addParticipant('user4')).toThrow('ペアには2名〜3名の参加者が必要です。')
      expect(consoleSpy).toHaveBeenCalledWith('Eにuser4を追加します。')
      expect(consoleSpy).toHaveBeenCalledWith('ペアの許容人数を超えました')

      consoleSpy.mockRestore()
    })
  })

  describe('removeParticipant', () => {
    let pair: Pair

    beforeEach(() => {
      const args = {
        id: 'pair8',
        name: 'F',
        participantIds: ['user1', 'user2', 'user3']
      }
      pair = new Pair(args)
    })

    it('指定した参加者を正常に削除できること', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      pair.removeParticipant('user2')

      expect(pair.getParticipantIds()).not.toContain('user2')
      expect(pair.getParticipantIds()).toEqual(['user1', 'user3'])
      expect(consoleSpy).toHaveBeenCalledWith('Fからuser2を削除します。')

      consoleSpy.mockRestore()
    })

    it('削除後の参加者が0名になる場合にエラーがスローされること', () => {
      // Pairのコンストラクタは2名以上を要求するため、2名で初期化
      const pairWithTwo = new Pair({
        id: 'pair10',
        name: 'H',
        participantIds: ['user1', 'user2']
      })

      pairWithTwo.removeParticipant('user2') // 残り1名

      expect(() => pairWithTwo.removeParticipant('user1')).toThrow('Pairのメンバーが0名になりました。')
    })
  })

  describe('isParticipantExist', () => {
    let pair: Pair

    beforeEach(() => {
      const args = {
        id: 'pair11',
        name: 'I',
        participantIds: ['user1', 'user2']
      }
      pair = new Pair(args)
    })

    it('存在する参加者の場合に true を返すこと', () => {
      expect(pair.isParticipantExist('user1')).toBe(true)
      expect(pair.isParticipantExist('user2')).toBe(true)
    })

    it('存在しない参加者の場合に false を返すこと', () => {
      expect(pair.isParticipantExist('user3')).toBe(false)
    })
  })
})
