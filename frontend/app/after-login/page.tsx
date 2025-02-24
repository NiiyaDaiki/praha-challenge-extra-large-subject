"use client";

import { useEffect, useState } from "react";
import firebase from "@/lib/firebase/firebaseClient";

const AfterLoginPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGetTasks = async () => {
    setLoading(true);
    try {
      if (!currentUser) {
        console.error("ユーザーがログインしていません");
        setLoading(false);
        return;
      }
      // Firebase AuthからIDトークンを取得
      const token = await currentUser.getIdToken();

      // APIリクエストにアクセストークンを付与
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("API呼び出しに失敗しました", response.status);
        setLoading(false);
        return;
      }
      const data = await response.json();
      // レスポンスに含まれるタスク情報を状態に保存
      setTasks(data.tasks);
    } catch (error) {
      console.error("タスク取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p>ログイン後ページ</p>
      <button onClick={handleGetTasks}>
        {loading ? "読み込み中..." : "タスク取得"}
      </button>
      {tasks.length > 0 && (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{JSON.stringify(task)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AfterLoginPage;
