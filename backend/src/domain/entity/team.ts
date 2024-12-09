import { uuid } from 'uuidv4'
import { Pair } from '../../domain/entity/pair'

export class Team {
  readonly id: string
  readonly name: string
  private pairs: Pair[]

  constructor(props: { id: string, name: string, pairs: Pair[] }) {
    const { id, name, pairs } = props
    this.isValidName(name)

    this.id = id
    this.name = name
    this.pairs = pairs
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

  public removeParticipant(participantId: string): void {
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

  private reallocatePair(pair: Pair): void {
    // 他のPairに合流
    const targetPair = this.pairs
      .filter(p => p !== pair)
      .sort((a, b) => a.getParticipantIds().length - b.getParticipantIds().length)[0];
    if (!targetPair) {
      throw new Error('合流先のPairが見つかりませんでした');
    }
    // 一人だけのPairの参加者を他のPairに移動
    const moveParticipantId = pair.getParticipantIds()[0];
    if (!moveParticipantId) {
      throw new Error('移動する参加者が見つかりませんでした');
    }
    try {
      targetPair.addParticipant(moveParticipantId);
    } catch (e) {
      // 4人になった場合
      console.log(`チーム${this.name}のペア${targetPair.name}が4人になったためペアを分割します`);
      // ランダムに一人を選択
      const randomParticipantId = targetPair.getParticipantIds()[Math.floor(Math.random() * targetPair.getParticipantIds().length)];
      if (!randomParticipantId) {
        throw new Error('ランダムに選択する参加者が見つかりませんでした');
      }
      // ランダムに選ばれた参加者と一人だけのPairの参加者を新しいPairに移動
      // 新しいPairを作成
      const newPair = new Pair({ id: uuid(), name: this.generateNewPairName(), participantIds: [moveParticipantId, randomParticipantId] });
      // 新しいPairを追加
      this.pairs.push(newPair)
      console.log(`チーム${this.name}の新しいペア${newPair.name}を作成し、${moveParticipantId}と${randomParticipantId}を追加しました`);
    }
    // 元のPairを削除
    this.pairs = this.pairs.filter(p => p !== pair);


  }

  private generateNewPairName(): string {
    const existingNames = this.pairs.map(p => p.name);
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const char of alphabet) {
      if (!existingNames.includes(char)) {
        console.log(char);
        return char;
      }
    }
    throw new Error('ペア名を生成できません。');
  }


}
