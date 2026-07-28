import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Post {
  id: string;
  title: string;
  date: string;
  draft: boolean;
  rawContent?: string;
  synced?: boolean;
}

interface AdminDB extends DBSchema {
  posts: {
    key: string;
    value: Post;
  };
}

class IndexedDBRepository {
  private dbPromise: Promise<IDBPDatabase<AdminDB>>;

  constructor() {
    this.dbPromise = openDB<AdminDB>('AdminPortalDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('posts')) {
          db.createObjectStore('posts', { keyPath: 'id' });
        }
      },
    });
  }

  async getAllPosts(): Promise<Post[]> {
    const db = await this.dbPromise;
    return db.getAll('posts');
  }

  async getPost(id: string): Promise<Post | undefined> {
    const db = await this.dbPromise;
    return db.get('posts', id);
  }

  async savePost(post: Post): Promise<void> {
    const db = await this.dbPromise;
    await db.put('posts', post);
  }

  async deletePost(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('posts', id);
  }
}

export const dbService = new IndexedDBRepository();
