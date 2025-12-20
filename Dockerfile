# 多阶段构建 - 生产环境优化
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖 (包括 devDependencies)
RUN npm ci

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 生产阶段
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装生产依赖所需的构建工具
RUN apk add --no-cache python3 make g++

# 复制 package 文件
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 复制服务器代码
COPY server ./server

# 复制必要的配置文件
COPY schema.sql ./

# 创建数据目录
RUN mkdir -p /app/data

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3200

# 暴露端口
EXPOSE 3200

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3200/api/health || exit 1

# 启动应用
CMD ["node", "server/index.js"]
