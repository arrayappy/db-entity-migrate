const dependencyMap: Record<string, string> = {
    "mongodb": "mongodb",
    "mysql": "mysql2",
    "knex": "knex"
  }
  
  const databasesWithKnex: string[] = [
    "mysql"
  ];
  
  export {
    dependencyMap,
    databasesWithKnex,
  }