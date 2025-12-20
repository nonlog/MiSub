import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * SQLite 数据库管理类
 * 提供与 Cloudflare KV/D1 兼容的接口
 */
class SqliteDatabase {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // 启用 WAL 模式提升性能
    this.initialize();
  }

  /**
   * 初始化数据库表结构
   */
  initialize() {
    // 读取 schema.sql 文件
    const schemaPath = join(__dirname, '../../schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // 执行 SQL 语句创建表
    this.db.exec(schema);
    
    console.log('✅ SQLite 数据库初始化完成');
  }

  /**
   * 获取数据 (兼容 KV.get)
   * @param {string} key - 键名
   * @returns {Promise<any>} 值
   */
  async get(key) {
    const stmt = this.db.prepare('SELECT value FROM kv_store WHERE key = ?');
    const row = stmt.get(key);
    
    if (!row) return null;
    
    try {
      return JSON.parse(row.value);
    } catch (e) {
      return row.value;
    }
  }

  /**
   * 存储数据 (兼容 KV.put)
   * @param {string} key - 键名
   * @param {any} value - 值
   * @returns {Promise<void>}
   */
  async put(key, value) {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    const stmt = this.db.prepare(`
      INSERT INTO kv_store (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `);
    
    stmt.run(key, valueStr);
  }

  /**
   * 删除数据 (兼容 KV.delete)
   * @param {string} key - 键名
   * @returns {Promise<void>}
   */
  async delete(key) {
    const stmt = this.db.prepare('DELETE FROM kv_store WHERE key = ?');
    stmt.run(key);
  }

  /**
   * 列出键 (兼容 KV.list)
   * @param {object} options - 选项
   * @returns {Promise<object>} 键列表
   */
  async list(options = {}) {
    const { prefix = '', limit = 1000 } = options;
    
    const stmt = this.db.prepare(`
      SELECT key FROM kv_store
      WHERE key LIKE ?
      LIMIT ?
    `);
    
    const rows = stmt.all(`${prefix}%`, limit);
    const keys = rows.map(row => ({ name: row.key }));
    
    return {
      keys,
      list_complete: keys.length < limit,
      cursor: null
    };
  }

  /**
   * 关闭数据库连接
   */
  close() {
    this.db.close();
  }
}

export default SqliteDatabase;
