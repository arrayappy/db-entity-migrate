const dependencyMap: Record<string, string> = {
    "mongodb": "mongodb",
    "firestore": "firestore-admin",
    "knex": "knex",
    "mysql": "mysql2",
    "postgres": "pg",
    "sqlite3": "sqlite3",
    "oracledb": "oracledb"
  }
  
  const databasesWithKnex: string[] = [
    "mysql",
    "postgres",
    "sqlite3",
    "oracledb"
  ];
  
  export {
    dependencyMap,
    databasesWithKnex,
  }