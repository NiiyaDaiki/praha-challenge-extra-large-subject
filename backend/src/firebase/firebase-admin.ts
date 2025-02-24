import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    // 環境に合わせた認証情報を設定する
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

export default admin;