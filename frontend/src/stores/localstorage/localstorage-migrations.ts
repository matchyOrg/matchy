export interface VersionedDatabase<Version extends number> {
  readonly version: Version;
}

/**
 * Helper class purely for getting that cute fluent interface for adding migrations
 */
class Migration<ResultDatabase extends VersionedDatabase<number>> {
  readonly previousMigration: Migration<VersionedDatabase<any>> | null;
  readonly targetVersion: number;
  readonly migrate: (db: VersionedDatabase<any>) => ResultDatabase;

  private constructor(
    previousMigration: Migration<VersionedDatabase<any>> | null,
    targetVersion: number,
    migrate: (db: VersionedDatabase<any>) => ResultDatabase
  ) {
    this.previousMigration = previousMigration;
    this.targetVersion = targetVersion;
    this.migrate = migrate;
  }

  static BaseMigration = new Migration(null, 1, () => {
    return {
      version: 0,
    };
  });

  addMigration<V extends number, U extends VersionedDatabase<V>>(
    targetVersion: V,
    migrate: (db: ReturnType<this["migrate"]>) => U
  ): Migration<U> {
    return new Migration(this, targetVersion, migrate as any);
  }
}
// Database format migrations
// Make sure to *NEVER* change an existing migration that is used in production. Always add new migrations.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const finalMigration = Migration.BaseMigration.addMigration(1, (db) => {
  return {
    /** always increment this */
    version: 1,
    /** Redirect to this page after login */
    redirect: "/",
  };
});
/*.addMigration(2, (db) => {
  return {
    version: 2,
    storage: {
      gamePath: "",
    },
    games: db.games,
  };
});*/

export function migrateToLatest(db: {
  version: number;
}): ReturnType<typeof finalMigration["migrate"]> {
  let currentMigration: Migration<any> | null = finalMigration;
  const upgrades: Migration<any>[] = [];

  while (
    currentMigration !== null &&
    currentMigration.targetVersion > db.version
  ) {
    upgrades.push(currentMigration);
    currentMigration = currentMigration.previousMigration;
  }
  upgrades.reverse();
  upgrades.forEach((migration) => {
    db = migration.migrate(db);
  });

  return db as any;
}

export type LocalStorageDatabase = ReturnType<typeof migrateToLatest>;
