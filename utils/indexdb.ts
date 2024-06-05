import { openDB } from 'idb';

const DB_NAME = 'mediaStore';
const DB_VERSION = 1;
const STORE_NAME = 'media';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveMedia(id:number, data:any, type:any) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({ id,data, type });
  await tx.done;
}
export async function saveText(id:number, data:any, type:any) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({ id, data, type });
  await tx.done;
}

export async function getMedia(id:number) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const media = await store.get(id);
  await tx.done;
  return media;
}

export async function getAllMedia() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const mediaList = await store.getAll();
  await tx.done;
  return mediaList;
}

export async function deleteMedia(id:number) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
}