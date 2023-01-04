// Contains models for the data we want to store in the database config

export interface DbConfig {
  databases: DbConfigDatabases;
  selected?: SelectedDbItem;
}

export interface DbConfigDatabases {
  remote: RemoteDbConfig;
  local: LocalDbConfig;
}

export type SelectedDbItem =
  | SelectedLocalUserDefinedList
  | SelectedLocalDatabase
  | SelectedRemoteSystemDefinedList
  | SelectedRemoteUserDefinedList
  | SelectedRemoteOwner
  | SelectedRemoteRepository;

export enum SelectedDbItemKind {
  LocalUserDefinedList = "localUserDefinedList",
  LocalDatabase = "localDatabase",
  RemoteSystemDefinedList = "remoteSystemDefinedList",
  RemoteUserDefinedList = "remoteUserDefinedList",
  RemoteOwner = "remoteOwner",
  RemoteRepository = "remoteRepository",
}

export interface SelectedLocalUserDefinedList {
  kind: SelectedDbItemKind.LocalUserDefinedList;
  listName: string;
}

export interface SelectedLocalDatabase {
  kind: SelectedDbItemKind.LocalDatabase;
  databaseName: string;
  listName?: string;
}

export interface SelectedRemoteSystemDefinedList {
  kind: SelectedDbItemKind.RemoteSystemDefinedList;
  listName: string;
}

export interface SelectedRemoteUserDefinedList {
  kind: SelectedDbItemKind.RemoteUserDefinedList;
  listName: string;
}

export interface SelectedRemoteOwner {
  kind: SelectedDbItemKind.RemoteOwner;
  ownerName: string;
}

export interface SelectedRemoteRepository {
  kind: SelectedDbItemKind.RemoteRepository;
  repositoryName: string;
  listName?: string;
}

export interface RemoteDbConfig {
  repositoryLists: RemoteRepositoryList[];
  owners: string[];
  repositories: string[];
}

export interface RemoteRepositoryList {
  name: string;
  repositories: string[];
}

export interface LocalDbConfig {
  lists: LocalList[];
  databases: LocalDatabase[];
}

export interface LocalList {
  name: string;
  databases: LocalDatabase[];
}

export interface LocalDatabase {
  name: string;
  dateAdded: number;
  language: string;
  storagePath: string;
}

export function cloneDbConfig(config: DbConfig): DbConfig {
  return {
    databases: {
      remote: {
        repositoryLists: config.databases.remote.repositoryLists.map(
          (list) => ({
            name: list.name,
            repositories: [...list.repositories],
          }),
        ),
        owners: [...config.databases.remote.owners],
        repositories: [...config.databases.remote.repositories],
      },
      local: {
        lists: config.databases.local.lists.map((list) => ({
          name: list.name,
          databases: list.databases.map((db) => ({ ...db })),
        })),
        databases: config.databases.local.databases.map((db) => ({ ...db })),
      },
    },
    selected: config.selected
      ? cloneDbConfigSelectedItem(config.selected)
      : undefined,
  };
}

export function renameLocalList(
  originalConfig: DbConfig,
  currentListName: string,
  newListName: string,
): DbConfig {
  const config = cloneDbConfig(originalConfig);

  const list = config.databases.local.lists.find(
    (l) => l.name === currentListName,
  );
  if (!list) {
    throw Error(`Cannot find list '${currentListName}' to rename`);
  }
  list.name = newListName;

  if (
    config.selected?.kind === SelectedDbItemKind.LocalUserDefinedList ||
    config.selected?.kind === SelectedDbItemKind.LocalDatabase
  ) {
    if (config.selected.listName === currentListName) {
      config.selected.listName = newListName;
    }
  }

  return config;
}

export function renameRemoteList(
  originalConfig: DbConfig,
  currentListName: string,
  newListName: string,
): DbConfig {
  const config = cloneDbConfig(originalConfig);

  const list = config.databases.remote.repositoryLists.find(
    (l) => l.name === currentListName,
  );
  if (!list) {
    throw Error(`Cannot find list '${currentListName}' to rename`);
  }
  list.name = newListName;

  if (
    config.selected?.kind === SelectedDbItemKind.RemoteUserDefinedList ||
    config.selected?.kind === SelectedDbItemKind.RemoteRepository
  ) {
    if (config.selected.listName === currentListName) {
      config.selected.listName = newListName;
    }
  }

  return config;
}

export function renameLocalDb(
  originalConfig: DbConfig,
  currentDbName: string,
  newDbName: string,
  parentListName?: string,
): DbConfig {
  const config = cloneDbConfig(originalConfig);

  if (parentListName) {
    const list = config.databases.local.lists.find(
      (l) => l.name === parentListName,
    );
    if (!list) {
      throw Error(`Cannot find parent list '${parentListName}'`);
    }
    const dbIndex = list.databases.findIndex((db) => db.name === currentDbName);
    if (dbIndex === -1) {
      throw Error(
        `Cannot find database '${currentDbName}' in list '${parentListName}'`,
      );
    }
    list.databases[dbIndex].name = newDbName;
  } else {
    const dbIndex = config.databases.local.databases.findIndex(
      (db) => db.name === currentDbName,
    );
    if (dbIndex === -1) {
      throw Error(`Cannot find database '${currentDbName}' in local databases`);
    }
    config.databases.local.databases[dbIndex].name = newDbName;
  }

  if (
    config.selected?.kind === SelectedDbItemKind.LocalDatabase &&
    config.selected.databaseName === currentDbName
  ) {
    config.selected.databaseName = newDbName;
  }

  return config;
}

function cloneDbConfigSelectedItem(selected: SelectedDbItem): SelectedDbItem {
  switch (selected.kind) {
    case SelectedDbItemKind.LocalUserDefinedList:
      return {
        kind: SelectedDbItemKind.LocalUserDefinedList,
        listName: selected.listName,
      };
    case SelectedDbItemKind.LocalDatabase:
      return {
        kind: SelectedDbItemKind.LocalDatabase,
        databaseName: selected.databaseName,
        listName: selected.listName,
      };
    case SelectedDbItemKind.RemoteSystemDefinedList:
      return {
        kind: SelectedDbItemKind.RemoteSystemDefinedList,
        listName: selected.listName,
      };
    case SelectedDbItemKind.RemoteUserDefinedList:
      return {
        kind: SelectedDbItemKind.RemoteUserDefinedList,
        listName: selected.listName,
      };
    case SelectedDbItemKind.RemoteOwner:
      return {
        kind: SelectedDbItemKind.RemoteOwner,
        ownerName: selected.ownerName,
      };
    case SelectedDbItemKind.RemoteRepository:
      return {
        kind: SelectedDbItemKind.RemoteRepository,
        repositoryName: selected.repositoryName,
        listName: selected.listName,
      };
  }
}
