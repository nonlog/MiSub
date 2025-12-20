# MiSub Docker 部署指南

> 📦 本指南介绍如何使用 Docker 部署 MiSub,实现完全自托管的订阅管理服务。

## 📋 目录

- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [部署方式](#部署方式)
  - [本地 Docker 部署](#本地-docker-部署)
  - [Zeabur 部署](#zeabur-部署)
  - [Vercel 部署](#vercel-部署)
- [数据管理](#数据管理)
- [故障排除](#故障排除)

---

## 🚀 快速开始

### 前置要求

- Docker 和 Docker Compose (本地部署)
- Node.js 20+ (本地开发)
- Git

### 一键部署

```bash
# 1. 克隆项目
git clone https://github.com/imzyb/MiSub.git
cd MiSub

# 2. 编辑 docker-compose.yml 修改管理员密码
# 找到 ADMIN_PASSWORD=change_this_password
# 修改为您的密码,例如: ADMIN_PASSWORD=my_secure_password_123

# 3. 启动服务
docker-compose up -d

# 4. 访问应用
open http://localhost:3200
```

> 👍 **更简单了!** COOKIE_SECRET 会自动生成,您只需设置管理员密码即可。

---

## ⚙️ 环境配置

### Docker Compose 部署 (推荐)

**最简单的方式**: 直接编辑 `docker-compose.yml` 文件

```yaml
environment:
  - ADMIN_PASSWORD=your_password_here  # 修改为您的密码
```

> ✅ **COOKIE_SECRET 自动生成**: 无需手动配置,系统会自动生成 32 位随机密钥

### 容器平台部署 (Zeabur/Vercel)

在平台的环境变量设置中添加:

```env
# 必需配置
ADMIN_PASSWORD=your_secure_password

# 可选配置 (如果不设置会自动生成)
COOKIE_SECRET=your_random_secret_key
```

> ⚠️ **重要**: 容器平台部署时,**必须**设置 `ADMIN_PASSWORD` 环境变量作为管理员登录密码。

---

## 🐳 部署方式

### 本地 Docker 部署

#### docker-compose.yml 配置模板

创建 `docker-compose.yml` 文件:

```yaml
version: '3.8'

services:
  misub:
    container_name: misub
    build:
      context: .
      dockerfile: Dockerfile
    image: misub:latest
    ports:
      - "3200:3200"  # 后端服务端口
    volumes:
      # 数据持久化 - SQLite 数据库
      - ./data:/app/data
      # 可选: 挂载自定义配置
      # - ./config:/app/config
    environment:
      - NODE_ENV=production
      - PORT=3200
      - ADMIN_PASSWORD=change_this_password  # 请修改为您的管理员密码
      - DB_PATH=/app/data/misub.db
      # COOKIE_SECRET 会自动生成,无需手动配置
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3200/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - misub-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  misub-network:
    driver: bridge

volumes:
  # 命名卷 (可选,用于更好的数据管理)
  misub-data:
    driver: local
```

**配置说明**:
- **端口映射**: `3200:3200` - 将容器的 3200 端口映射到主机
- **管理员密码**: 直接在 `ADMIN_PASSWORD` 中设置,无需 .env 文件
- **Cookie 密钥**: 自动生成,无需手动配置
- **数据卷**: `./data:/app/data` - 持久化 SQLite 数据库
- **健康检查**: 每 30 秒检查服务状态
- **重启策略**: `unless-stopped` - 除非手动停止,否则自动重启
- **日志管理**: 限制日志文件大小,保留最近 3 个文件

> 💡 **提示**: 只需修改 `ADMIN_PASSWORD=change_this_password` 为您的密码即可,其他配置保持默认。

#### 生产环境

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重建并启动 (代码更新后)
docker-compose up -d --build
```

#### 开发环境

```bash
# 使用开发配置启动 (支持热重载)
docker-compose -f docker-compose.dev.yml up

# 后台运行
docker-compose -f docker-compose.dev.yml up -d

# 查看实时日志
docker-compose -f docker-compose.dev.yml logs -f misub-dev

# 进入容器调试
docker-compose -f docker-compose.dev.yml exec misub-dev sh
```

#### 使用 npm scripts

```bash
# 构建镜像
npm run docker:build

# 启动服务
npm run docker:run

# 查看日志
npm run docker:logs

# 停止服务
npm run docker:stop

# 开发环境
npm run docker:dev
```

---

### Zeabur 部署 (推荐)

#### 方式一: 通过 GitHub 自动部署

1. **Fork 项目到你的 GitHub**

2. **登录 Zeabur** (https://zeabur.com)

3. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub"
   - 选择你 Fork 的 MiSub 仓库

4. **配置环境变量** (重要!)
   
   在 Zeabur 项目设置中添加:
   - **ADMIN_PASSWORD**: 你的管理员密码 (必需)
   - **NODE_ENV**: production
   - **COOKIE_SECRET**: (可选,不设置会自动生成)

   > ⚠️ **必须设置**: `ADMIN_PASSWORD` 环境变量是登录管理界面的密码,请务必设置!

5. **配置持久化存储**
   - 在服务设置中添加 Volume
   - 挂载路径: `/app/data`
   - 大小: 1GB (根据需求调整)

6. **部署完成**
   
   Zeabur 会自动构建并部署,完成后会提供访问域名

#### 方式二: 通过 CLI 部署

```bash
# 1. 安装 Zeabur CLI
npm install -g @zeabur/cli

# 2. 登录
zeabur auth login

# 3. 初始化项目
zeabur init

# 4. 部署
zeabur deploy

# 5. 查看日志
zeabur logs
```

**Zeabur 优势**:
- ✅ 自动 HTTPS 证书
- ✅ 自定义域名支持
- ✅ 原生持久化存储
- ✅ 一键回滚
- ✅ 实时日志和监控
- ✅ 国内访问快速

---

### Vercel 部署

> ⚠️ **注意**: Vercel 是 Serverless 环境,SQLite 文件在函数间不共享,需要配置外部存储。

#### 通过 Vercel Dashboard

1. **Fork 项目到你的 GitHub**

2. **登录 Vercel** (https://vercel.com)

3. **导入项目**
   - 点击 "New Project"
   - 选择你 Fork 的 MiSub 仓库
   - Framework Preset: 选择 "Other"

4. **配置构建设置**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **配置环境变量** (重要!)
   
   在 Environment Variables 中添加:
   - **ADMIN_PASSWORD**: 你的管理员密码 (必需)
   - **NODE_ENV**: production
   - **COOKIE_SECRET**: (可选,不设置会自动生成)

   > ⚠️ **必须设置**: `ADMIN_PASSWORD` 环境变量是登录管理界面的密码,请务必设置!

6. **配置存储 (重要!)**
   
   由于 Vercel 是 Serverless,需要配置持久化存储:
   
   **选项 A: 使用 Vercel Blob Storage**
   - 在项目设置中启用 Blob Storage
   - 代码会自动适配
   
   **选项 B: 使用外部数据库**
   - 配置 PostgreSQL (推荐 Vercel Postgres)
   - 设置环境变量 `DATABASE_URL`

7. **部署**
   
   点击 "Deploy" 按钮

#### 通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 生产部署
vercel --prod
```

---

## 💾 数据管理

### 备份数据库

```bash
# 从容器备份
docker-compose exec misub cp /app/data/misub.db /app/data/backup-$(date +%Y%m%d).db

# 从主机备份
cp ./data/misub.db ./data/backup-$(date +%Y%m%d).db

# 压缩备份
tar -czf misub-backup-$(date +%Y%m%d).tar.gz ./data/
```

### 恢复数据库

```bash
# 停止服务
docker-compose down

# 恢复数据库文件
cp ./data/backup.db ./data/misub.db

# 重新启动
docker-compose up -d
```

### 查看数据库信息

```bash
# 查看数据库大小
docker-compose exec misub ls -lh /app/data/

# 进入容器查看
docker-compose exec misub sh
cd /app/data
ls -lh
```

### 自动备份 (可选)

创建 cron 任务自动备份:

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * cd /path/to/MiSub && cp ./data/misub.db ./data/backup-$(date +\%Y\%m\%d).db
```

---

## 🔍 故障排除

### 常见问题

**Q: 容器无法启动**

A: 检查以下几点:
1. 确认 Docker 服务正在运行
2. 检查端口 3200 是否被占用
3. 查看容器日志: `docker-compose logs misub`
4. 确认 `.env` 文件配置正确

**Q: 无法访问管理界面**

A: 
1. 确认容器正在运行: `docker-compose ps`
2. 检查防火墙设置
3. 确认访问地址正确: `http://localhost:3200`
4. 查看浏览器控制台错误

**Q: 数据丢失**

A:
1. 确认数据卷正确挂载: `docker-compose config`
2. 检查 `./data` 目录权限
3. 不要使用 `docker-compose down -v` (会删除数据卷)

**Q: 构建失败**

A:
1. 确认 Node.js 版本 >= 20
2. 清理 Docker 缓存: `docker system prune -a`
3. 重新构建: `docker-compose build --no-cache`

**Q: 性能问题**

A:
1. 检查数据库大小
2. 启用 WAL 模式 (默认已启用)
3. 增加 Docker 资源限制
4. 考虑使用 PostgreSQL (大规模部署)

### 查看日志

```bash
# 实时日志
docker-compose logs -f

# 最近 100 行日志
docker-compose logs --tail=100

# 特定服务日志
docker-compose logs misub

# 导出日志到文件
docker-compose logs > misub.log
```

### 健康检查

```bash
# 检查服务健康状态
curl http://localhost:3200/api/health

# 预期响应
{
  "status": "ok",
  "timestamp": "2025-12-20T14:00:00.000Z",
  "environment": "production"
}
```

---

## 🔐 安全建议

1. **使用强密码**
   - 管理员密码至少 12 位
   - 包含大小写字母、数字和特殊字符

2. **定期备份**
   - 每天自动备份数据库
   - 备份文件存储到云端 (S3/OSS)

3. **HTTPS 配置**
   - 本地部署使用 Caddy 或 Nginx + Let's Encrypt
   - Zeabur/Vercel 自动提供 HTTPS

4. **更新维护**
   - 定期更新 Docker 镜像
   - 关注安全补丁

---

## 📚 更多资源

- [GitHub 仓库](https://github.com/imzyb/MiSub)
- [Docker 镜像](https://ghcr.io/imzyb/misub)
- [问题反馈](https://github.com/imzyb/MiSub/issues)

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件
