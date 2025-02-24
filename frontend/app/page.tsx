"use client";

import React, { useEffect } from "react";
import firebase from "@/lib/firebase/firebaseClient";
import * as firebaseui from "firebaseui";

const LoginPage = () => {
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window !== "undefined") {
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth());

      ui.start("#firebaseui-auth-container", {
        signInFlow: "popup",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // 他の認証プロバイダーも追加可能
        ],
        signInSuccessUrl: "/after-login", // 認証成功後のリダイレクト先
      });
    }
  }, []);

  return <div id="firebaseui-auth-container"></div>;
};

export default LoginPage;
