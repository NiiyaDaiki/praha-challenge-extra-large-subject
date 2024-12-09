import { Pair } from '../../domain/entity/pair'
import { createRandomIdString } from '../../util/random'

export class Team {
  readonly id: string
  readonly name: string
  private pairs: Pair[]
  public readonly MIN_MEMBER = 3

  constructor(props: { id: string, name: string, pairs: Pair[] }) {
    const { id, name, pairs } = props
    this.isValidName(name)

    this.name = name
    this.id = id
    this.pairs = pairs
    this.isUniquePairName(pairs)
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      pairs: this.pairs
    }
  }

  private isValidName(name: string): void {
    if (name.length > 3) {
      throw new Error('チーム名は3文字以下にしてください')
    }

    const numValue = Number(name)

    if (isNaN(numValue)) {
      throw new Error('チーム名は数字にしてください')
    }

    if (numValue < 0 || !Number.isInteger(numValue)) {
      throw new Error('チーム名の数字は正の整数にしてください')
    }
  }

  public getTotalParticipantCount(): number {
    return this.pairs.reduce((sum, pair) => sum + pair.getParticipantIds().length, 0);
  }


  public addParticipant(participantId: string): void {
    const targetPairs = this.getMinParticipantPair()

    // 最小参加人数のペアからランダムに選択する
    const targetPair = targetPairs[Math.floor(Math.random() * targetPairs.length)]
    if (!targetPair) {
      throw new Error('ペアが見つかりませんでした')
    }

    try {
      targetPair.addParticipant(participantId)
    } catch (e) {
      this.reallocatePair(targetPair)
    }
  }

  public removeParticipant(participantId: string): void {
    console.log(`チーム${this.name}から参加者${participantId}を削除します`);
    const targetPair = this.pairs.find(pair => pair.isParticipantExist(participantId));
    if (!targetPair) {
      throw new Error('ペアが見つかりませんでした');
    }
    targetPair.removeParticipant(participantId);
    if (targetPair.getParticipantIds().length === 1) {
      console.log(`チーム${this.name}のペア${targetPair.name}が1人になったため再配置します`);
      this.reallocatePair(targetPair);
    }
  }

  public getMinParticipantPair(): Pair[] {
    // 最も参加人数が少ないペアを取得する
    let minPairCount = 0
    let targetPairs: Pair[] = []
    for (const pair of this.pairs) {
      const participantCount = pair.getParticipantIds().length
      if (minPairCount === 0 || participantCount < minPairCount) {
        minPairCount = participantCount
        targetPairs = [pair]
      } else if (participantCount === minPairCount) {
        targetPairs.push(pair)
      }
    }
    return targetPairs
  }

  public reassignPairParticipants(pairs: Pair[]): void {
    const oldParticipantIds = this.pairs.flatMap(p => p.getParticipantIds())
    const newParticipantIds = pairs.flatMap(p => p.getParticipantIds())

    // 参加者の追加、削除、重複がある場合はエラー
    const diff = oldParticipantIds.filter(id => !newParticipantIds.includes(id))
    if (oldParticipantIds.length !== newParticipantIds.length || diff.length !== 0) {
      throw new Error('ペアの参加者が変更されています');
    }
    this.pairs = pairs
    this.isUniquePairName(pairs)
  }

  public getPair(pairId: string) {
    const pair = this.pairs.find((pair) => pair.id === pairId)
    if (!pair) {
      throw new Error('ペアが見つかりませんでした')
    }
    return pair
  }

  public addPair = (pair: Pair): void => {
    this.pairs.push(pair)
    this.isUniquePairName(this.pairs)
  }

  public deletePair = (pairId: string): void => {
    this.pairs = this.pairs.filter((pair) => pair.id !== pairId)
    this.checkTeamParticipantCount()
  }

  private checkTeamParticipantCount(): void {
    if (!(this.getTotalParticipantCount() >= this.MIN_MEMBER)) {
      throw new Error(`チームの参加者数は${this.MIN_MEMBER}人以上必要です`)
    }
  }

  private isUniquePairName(pairs: Pair[]): void {
    // ペア名の重複チェック
    const pairNames = pairs.map(p => p.name);
    const uniquePairNames = new Set(pairNames);
    if (pairNames.length !== uniquePairNames.size) {
      throw new Error(`チーム名:${this.name}のペア名が重複しています`);
    }
  }

  private reallocatePair(pair: Pair): void {
    const participantCount = pair.getParticipantIds().length;
    if (participantCount === 1) {
      // 参加者が1名の場合、他のペアに合流
      this.mergePair(pair);
    } else if (participantCount === 4) {
      // 参加者が4名の場合、ペアを分割
      this.splitPair(pair);
    }

  }

  private mergePair(pair: Pair): void {
    const targetPair = this.pairs
      .filter(p => p !== pair)
      .sort((a, b) => a.getParticipantIds().length - b.getParticipantIds().length)[0];

    if (!targetPair) {
      throw new Error('合流先のペアが見つかりませんでした');
    }

    // 一人だけのペアの参加者を他のペアに移動
    const moveParticipantId = pair.getParticipantIds()[0];
    if (!moveParticipantId) {
      throw new Error('移動する参加者が見つかりませんでした');
    }
    console.log(`ペア${pair.name}の参加者${moveParticipantId}をペア${targetPair.name}に移動します`);
    targetPair.addParticipant(moveParticipantId);

    // 元のペアを削除
    this.pairs = this.pairs.filter(p => p !== pair);
  }

  private splitPair(pair: Pair): void {
    // 参加者を2つのグループに分割
    const participantIds = pair.getParticipantIds();
    const shuffledIds = participantIds.sort(() => 0.5 - Math.random());
    const groupSize = Math.ceil(shuffledIds.length / 2);
    const group1Ids = shuffledIds.slice(0, groupSize);
    const group2Ids = shuffledIds.slice(groupSize);

    // 古いペアを削除
    this.pairs = this.pairs.filter(p => p !== pair);

    // 新しいペアを作成
    const newPair1 = new Pair({
      id: createRandomIdString(),
      name: this.generateNewPairName(),
      participantIds: group1Ids,
    });

    this.pairs.push(newPair1); // newPair2作成前に先に追加しないとペア名が重複してしまう

    const newPair2 = new Pair({
      id: createRandomIdString(),
      name: this.generateNewPairName(),
      participantIds: group2Ids,
    });

    this.pairs.push(newPair2);
  }

  private generateNewPairName(): string {
    const existingNames = this.pairs.map(p => p.name);
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const char of alphabet) {
      if (!existingNames.includes(char)) {
        return char;
      }
    }
    throw new Error('ペア名を生成できません。');
  }


}
