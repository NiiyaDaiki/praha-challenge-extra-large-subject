import { ParticipantTask } from "../entity/participant-task"
import { Progress } from "../entity/task/progress"

describe("ParticipantTask クラス", () => {

  describe("create", () => {
    it("指定されたプロパティでParticipantTaskを作成し、progressが 'NOT_STARTED' に設定される", () => {
      const args = {
        id: "participant-task-1",
        participantId: "participant-1",
        taskId: "task-1",
      }

      const participantTask = ParticipantTask.create(args)

      expect(participantTask.id).toBe("participant-task-1")
      expect(participantTask.participantId).toBe("participant-1")
      expect(participantTask.taskId).toBe("task-1")
      expect(participantTask.progress).toBe("NOT_STARTED")
    })
  })

  describe("reconstruct", () => {
    it("指定されたプロパティでParticipantTaskを再構築できる", () => {
      const args = {
        id: "participant-task-2",
        participantId: "participant-2",
        taskId: "task-2",
        progress: "IN_REVIEW" as Progress,
      }

      const participantTask = ParticipantTask.reconstruct(args)

      expect(participantTask.id).toBe("participant-task-2")
      expect(participantTask.participantId).toBe("participant-2")
      expect(participantTask.taskId).toBe("task-2")
      expect(participantTask.progress).toBe("IN_REVIEW")
    })
  })

  describe("getAllProperties", () => {
    it("ParticipantTaskの全プロパティを正しく返す", () => {
      const args = {
        id: "participant-task-3",
        participantId: "participant-3",
        taskId: "task-3",
        progress: "COMPLETED" as Progress,
      }

      const participantTask = ParticipantTask.reconstruct(args)
      const properties = participantTask.getAllProperties()

      expect(properties).toEqual({
        id: "participant-task-3",
        participantId: "participant-3",
        taskId: "task-3",
        progress: "COMPLETED",
      })
    })
  })

  describe("setProgress", () => {
    it("progressが変更されていない場合、何も起こらない", () => {
      const participantTask = ParticipantTask.reconstruct({
        id: "participant-task-4",
        participantId: "participant-4",
        taskId: "task-4",
        progress: "NOT_STARTED" as Progress,
      })

      participantTask.setProgress("NOT_STARTED")

      expect(participantTask.progress).toBe("NOT_STARTED")
    })

    it("progressを変更できる場合、progressが更新される", () => {
      const participantTask = ParticipantTask.reconstruct({
        id: "participant-task-5",
        participantId: "participant-5",
        taskId: "task-5",
        progress: "NOT_STARTED" as Progress,
      })

      participantTask.setProgress("IN_REVIEW")

      expect(participantTask.progress).toBe("IN_REVIEW")
    })

    it("progressが 'COMPLETED' の場合、ステータスを変更しようとするとエラーをスローするべき", () => {
      const participantTask = ParticipantTask.reconstruct({
        id: "participant-task-6",
        participantId: "participant-6",
        taskId: "task-6",
        progress: "COMPLETED" as Progress,
      })

      expect(() => {
        participantTask.setProgress("IN_REVIEW")
      }).toThrow("ステータスが完了のタスクはステータスを変更できません")
      expect(participantTask.progress).toBe("COMPLETED")
    })
  })

  describe("isMatchedParticipantId", () => {
    it("指定されたparticipantIdが一致する場合、trueを返す", () => {
      const participantTask = ParticipantTask.reconstruct({
        id: "participant-task-7",
        participantId: "participant-7",
        taskId: "task-7",
        progress: "NOT_STARTED" as Progress,
      })

      const result = participantTask.isMatchedParticipantId("participant-7")
      expect(result).toBe(true)
    })

    it("指定されたparticipantIdが一致しない場合、falseを返す", () => {
      const participantTask = ParticipantTask.reconstruct({
        id: "participant-task-8",
        participantId: "participant-8",
        taskId: "task-8",
        progress: "NOT_STARTED" as Progress,
      })

      const result = participantTask.isMatchedParticipantId("participant-9")
      expect(result).toBe(false)
    })
  })
})
