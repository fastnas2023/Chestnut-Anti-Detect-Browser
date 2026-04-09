import { describe, it, expect, beforeEach } from 'vitest';
import { initDB, createProfile, getProfiles, Profile } from '../electron/db';
import Database from 'better-sqlite3';

describe('Database Layer', () => {
  beforeEach(() => {
    // Use an in-memory database for testing
    const db = new Database(':memory:');
    initDB(db);
  });

  it('should create and retrieve a profile', () => {
    const id = createProfile({
      name: 'Test Profile',
      proxy: 'socks5://127.0.0.1:1080',
      canvasSeed: '12345'
    });

    expect(id).toBeGreaterThan(0);

    const profiles = getProfiles();
    expect(profiles.length).toBe(1);
    expect(profiles[0].name).toBe('Test Profile');
    expect(profiles[0].canvasSeed).toBe('12345');
  });
});
