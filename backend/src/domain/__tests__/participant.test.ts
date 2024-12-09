import { Participant, MembershipStatus } from "../entity/participant";
import { ParticipantTask } from "../entity/participant-task";
import { Task } from "../entity/task/task";
import { createRandomIdString } from "../../util/random";

// モックの作成
jest.mock("../../util/random", () => ({
  createRandomIdString: jest.fn(),
}));

jest.mock("../../domain/entity/participant-task", () => ({
  ParticipantTask: {
    create: jest.fn(),
  },
}));

describe("Participant クラス", () => {
  const mockCreateRandomIdString = createRandomIdString as jest.Mock;
  const mockParticipantTaskCreate = ParticipantTask.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("有効なプロパティでParticipantを作成されること", () => {
      // モックの設定
      mockCreateRandomIdString.mockReturnValue("random-id-1");
      const mockTask: Task = { id: "task-1", /* 他のTaskプロパティを必要に応じて追加 */ } as Task;
      const mockParticipantTask: ParticipantTask = { id: "participant-task-1", participantId: "participant-1", taskId: "task-1" } as ParticipantTask;
      mockParticipantTaskCreate.mockReturnValue(mockParticipantTask);

      const participant = Participant.create({
        id: "participant-1",
        name: "山田太郎",
        email: "taro.yamada@example.com",
        tasks: [mockTask],
      });

      expect(participant.id).toBe("participant-1");
      expect(participant.name).toBe("山田太郎");
      expect(participant.email).toBe("taro.yamada@example.com");
      expect(participant.status).toBe(MembershipStatus.ACTIVE);
      expect(participant.participantTasks).toEqual([mockParticipantTask]);

      // モックが正しく呼ばれたか確認
      expect(mockCreateRandomIdString).toHaveBeenCalledTimes(1);
      expect(mockParticipantTaskCreate).toHaveBeenCalledWith({
        id: "random-id-1",
        participantId: "participant-1",
        taskId: "task-1",
      });
    });
  });

  describe("reconstruct", () => {
    it("与えられたプロパティでParticipantを再構築されること", () => {
      const mockParticipantTask: ParticipantTask = { id: "participant-task-2", participantId: "participant-2", taskId: "task-2" } as ParticipantTask;

      const participant = Participant.reconstruct({
        id: "participant-2",
        name: "佐藤花子",
        email: "hanako.sato@example.com",
        status: MembershipStatus.INACTIVE,
        tasks: [mockParticipantTask],
      });

      expect(participant.id).toBe("participant-2");
      expect(participant.name).toBe("佐藤花子");
      expect(participant.email).toBe("hanako.sato@example.com");
      expect(participant.status).toBe(MembershipStatus.INACTIVE);
      expect(participant.participantTasks).toEqual([mockParticipantTask]);
    });
  });

  describe("コンストラクタ", () => {
    it("無効なメールアドレスの場合にエラーをスローされること", () => {
      expect(() => {
        Participant.reconstruct({
          id: "participant-3",
          name: "無効なメール",
          email: "invalid-email",
          status: MembershipStatus.ACTIVE,
          tasks: [],
        });
      }).toThrow("無効なメールアドレスが指定されました");
    });

    it("ステータスが提供されない場合にデフォルトでACTIVEに設定されること", () => {
      const mockParticipantTask: ParticipantTask = { id: "participant-task-4", participantId: "participant-4", taskId: "task-4" } as ParticipantTask;

      const participant = Participant.reconstruct({
        id: "participant-4",
        name: "デフォルトステータス",
        email: "default.status@example.com",
        status: undefined as any, // ステータスが未定義であることをシミュレート
        tasks: [mockParticipantTask],
      });

      // ステータスが未定義の場合、コンストラクタで 'ACTIVE' に設定されるはず
      expect(participant.status).toBe(MembershipStatus.ACTIVE);
    });
  });

  describe("isActive", () => {
    it("ステータスがACTIVEの場合にtrueが返されること", () => {
      const participant = Participant.reconstruct({
        id: "participant-5",
        name: "アクティブユーザー",
        email: "active.user@example.com",
        status: MembershipStatus.ACTIVE,
        tasks: [],
      });

      expect(participant.isActive()).toBe(true);
    });

    it("ステータスがACTIVEでない場合にfalseが返されること", () => {
      const participant = Participant.reconstruct({
        id: "participant-6",
        name: "インアクティブユーザー",
        email: "inactive.user@example.com",
        status: MembershipStatus.INACTIVE,
        tasks: [],
      });

      expect(participant.isActive()).toBe(false);
    });
  });

  describe("getAllProperties", () => {
    it("Participantの全プロパティを返すべき", () => {
      const mockParticipantTask1: ParticipantTask = { id: "participant-task-5", participantId: "participant-7", taskId: "task-5" } as ParticipantTask;
      const mockParticipantTask2: ParticipantTask = { id: "participant-task-6", participantId: "participant-7", taskId: "task-6" } as ParticipantTask;
      const participant = Participant.reconstruct({
        id: "participant-7",
        name: "プロパティゲッター",
        email: "property.getter@example.com",
        status: MembershipStatus.LEFT,
        tasks: [mockParticipantTask1, mockParticipantTask2],
      });

      const properties = participant.getAllProperties();

      expect(properties).toEqual({
        id: "participant-7",
        name: "プロパティゲッター",
        email: "property.getter@example.com",
        status: MembershipStatus.LEFT,
        tasks: [mockParticipantTask1, mockParticipantTask2],
      });
    });
  });
});
