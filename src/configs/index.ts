const dependencyMap: Record<string, string> = {
  "mongodb": "mongodb",
  "mysql": "mysql2"
}

const databasesWithKnex: string[] = [
  "mysql"
];

export {
  dependencyMap,
  databasesWithKnex,
}