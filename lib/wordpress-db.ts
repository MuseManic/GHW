import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.WORDPRESS_DB_HOST,
  user: process.env.WORDPRESS_DB_USER,
  password: process.env.WORDPRESS_DB_PASSWORD,
  database: process.env.WORDPRESS_DB_NAME,
  port: parseInt(process.env.WORDPRESS_DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const TABLE_PREFIX = process.env.WORDPRESS_TABLE_PREFIX || 'wp_';

export interface WordPressUser {
  ID: number;
  user_login: string;
  user_email: string;
  user_pass: string;
  user_nicename: string;
  display_name: string;
}

export interface UserMeta {
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

/**
 * Find user by email in WordPress
 */
export async function findWordPressUserByEmail(email: string): Promise<WordPressUser | null> {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM ${TABLE_PREFIX}users WHERE user_email = ?`,
      [email]
    );
    connection.release();

    const users = rows as WordPressUser[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error finding WordPress user:', error);
    throw error;
  }
}

/**
 * Find user by ID in WordPress
 */
export async function findWordPressUserById(id: number): Promise<WordPressUser | null> {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM ${TABLE_PREFIX}users WHERE ID = ?`,
      [id]
    );
    connection.release();

    const users = rows as WordPressUser[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error finding WordPress user by ID:', error);
    throw error;
  }
}

/**
 * Get user meta data (first name, last name, etc.)
 */
export async function getUserMeta(userId: number): Promise<UserMeta> {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT meta_key, meta_value FROM ${TABLE_PREFIX}usermeta WHERE user_id = ? AND meta_key IN ('first_name', 'last_name')`,
      [userId]
    );
    connection.release();

    const meta: UserMeta = {};
    const metaRows = rows as Array<{ meta_key: string; meta_value: string }>;
    
    metaRows.forEach(row => {
      meta[row.meta_key] = row.meta_value;
    });

    return meta;
  } catch (error) {
    console.error('Error getting user meta:', error);
    return {};
  }
}

/**
 * Verify WordPress user credentials using WordPress password hash
 * WordPress uses phpass hashing - we'll use a simple comparison for now
 */
export async function verifyWordPressCredentials(
  email: string,
  password: string
): Promise<(WordPressUser & UserMeta) | null> {
  try {
    const user = await findWordPressUserByEmail(email);
    if (!user) {
      return null;
    }

    // For WordPress phpass verification, you would need to implement phpass
    // For now, we'll do a simple check - in production, use proper phpass library
    // This is a placeholder - WordPress passwords are hashed with phpass
    const isValid = await checkWordPressPassword(password, user.user_pass);
    
    if (!isValid) {
      return null;
    }

    // Get user meta
    const meta = await getUserMeta(user.ID);

    return {
      ...user,
      ...meta,
    };
  } catch (error) {
    console.error('Error verifying WordPress credentials:', error);
    return null;
  }
}

/**
 * Check WordPress password
 * Note: WordPress uses phpass hashing. For production, install phpass library
 * This is a simplified version - you should use proper phpass verification
 */
async function checkWordPressPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Import phpass if available, otherwise return false
    // In production, install: npm install phpass
    // For now, this is a placeholder
    
    // Simple check: if hash starts with $ it might be bcrypt
    if (hash.startsWith('$')) {
      const bcrypt = require('bcryptjs');
      return await bcrypt.compare(password, hash);
    }
    
    // Otherwise it's phpass - you need proper phpass library
    console.warn('WordPress phpass verification not fully implemented. Install phpass library for production.');
    return false;
  } catch (error) {
    console.error('Error checking password:', error);
    return false;
  }
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
