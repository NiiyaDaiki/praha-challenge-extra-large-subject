# Stage 1: ビルド環境
FROM node:18-alpine AS builder
WORKDIR /app

# package.json等を先にコピーして依存関係をインストール
COPY backend/package*.json ./
RUN npm install

# ソースコード全体をコピーしてビルドを実施

COPY backend/ .
# RUN npm run build

# prisma generate を Docker環境で実行
RUN npx prisma generate


# Stage 2: 本番用イメージ
# FROM node:18-alpine
# WORKDIR /app

# # ビルド済み成果物とnode_modulesをコピー
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist

# アプリケーションがリッスンするポートを公開
EXPOSE 3001

# コンテナ起動時のデフォルトコマンド
CMD ["npm", "run", "dev"]
