import Database from 'better-sqlite3';

export interface Profile {
  id?: number;
  name: string;
  proxy: string;
  canvasSeed: string;
}

let dbInstance: Database.Database;

export function initDB(db?: Database.Database) {
  dbInstance = db || new Database('profiles.db');
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      proxy TEXT,
      canvasSeed TEXT NOT NULL
    )
  `);
}

export function createProfile(profile: Profile): number {
  const stmt = dbInstance.prepare('INSERT INTO profiles (name, proxy, canvasSeed) VALUES (?, ?, ?)');
  const info = stmt.run(profile.name, profile.proxy, profile.canvasSeed);
  return info.lastInsertRowid as number;
}

export function getProfiles(): Profile[] {
  const stmt = dbInstance.prepare('SELECT * FROM profiles');
  return stmt.all() as Profile[];
}
