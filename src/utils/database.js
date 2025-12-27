// IndexedDB wrapper for offline-first storage

const DB_NAME = 'MediBillDB';
const DB_VERSION = 1;

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Medicines Store
      if (!db.objectStoreNames.contains('medicines')) {
        const medicineStore = db.createObjectStore('medicines', { keyPath: 'id', autoIncrement: true });
        medicineStore.createIndex('name', 'name', { unique: false });
        medicineStore.createIndex('batch', 'batch', { unique: false });
        medicineStore.createIndex('category', 'category', { unique: false });
      }

      // Invoices Store
      if (!db.objectStoreNames.contains('invoices')) {
        const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
        invoiceStore.createIndex('invoiceNo', 'invoiceNo', { unique: true });
        invoiceStore.createIndex('date', 'date', { unique: false });
        invoiceStore.createIndex('customerName', 'customerName', { unique: false });
      }

      // Settings Store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Stock Transactions Store
      if (!db.objectStoreNames.contains('stockTransactions')) {
        const transactionStore = db.createObjectStore('stockTransactions', { keyPath: 'id', autoIncrement: true });
        transactionStore.createIndex('medicineId', 'medicineId', { unique: false });
        transactionStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

// Generic CRUD operations
export const addRecord = (storeName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateRecord = (storeName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteRecord = (storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getRecord = (storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllRecords = (storeName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const searchRecords = (storeName, indexName, query) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll();

    request.onsuccess = () => {
      const results = request.result.filter(item => 
        item[indexName].toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};