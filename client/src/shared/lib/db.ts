export const DBConfig = {
  name: 'VideoDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'videos',
      storeConfig: { keyPath: 'uuid', unique: true, autoIncrement: false },
      storeSchema: [
        { name: 'term', keypath: 'term', options: { unique: false } },
        { name: 'cover', keypath: 'cover', options: { unique: false } },
        { name: 'status', keypath: 'status', options: { unique: false } },
        { name: 'status_message', keypath: 'status_message', options: { unique: false } },
        { name: 'created_at', keypath: 'created_at', options: { unique: false } }
      ]
    }
  ]
}
