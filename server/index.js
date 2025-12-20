import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import SqliteDatabase from './db/sqlite.js';

// 加载环境变量
config();

// 自动生成 COOKIE_SECRET (如果未设置)
const COOKIE_SECRET = process.env.COOKIE_SECRET || randomBytes(32).toString('base64');
if (!process.env.COOKIE_SECRET) {
    console.log('⚠️  COOKIE_SECRET 未设置,已自动生成随机密钥');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化 Express 应用
const app = express();
const PORT = process.env.PORT || 3200;

// 初始化 SQLite 数据库
const dbPath = process.env.DB_PATH || join(__dirname, '../data/misub.db');
const db = new SqliteDatabase(dbPath);

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

// 信任代理 (如果在反向代理后面)
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

// 将数据库实例挂载到 app.locals
app.locals.db = db;

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API 路由 (TODO: 从 functions/ 复用业务逻辑)
app.use('/api', (req, res, next) => {
    // 临时响应,实际路由需要从 functions/ 迁移
    res.json({
        message: 'MiSub Docker API',
        note: 'API routes will be implemented by migrating logic from functions/ directory'
    });
});

// 静态文件服务 (前端构建产物)
app.use(express.static(join(__dirname, '../dist')));

// SPA 回退路由
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 MiSub Docker Server                             ║
║                                                       ║
║   📍 Server running on: http://localhost:${PORT}      ║
║   🗄️  Database: SQLite (${dbPath})                   ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        db.close();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        db.close();
        process.exit(0);
    });
});

export default app;
