import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { execSync } from 'child_process';
import { readdirSync, unlinkSync } from 'fs';
import path from 'path';

describe('Migration Integration Tests', () => {
  let testEnv: Record<string, string>;
  let execOptions: any;
  let migrationDir: string;
  let totalMigrationCount: number;

  function countMigrationFiles(): number {
    const files = readdirSync(migrationDir);
    return files.filter(file => file.endsWith('.ts') && file.match(/^\d+/)).length;
  }

  function queryDatabase(query: string): string {
    return execSync(
      `psql -h localhost -U testuser -d testdb -c "${query}" -t`,
      {
        ...execOptions,
        env: {
          ...execOptions.env,
          PGPASSWORD: 'testpass'
        }
      }
    ).toString().trim();
  }

  beforeAll(async () => {
    console.log('Starting PostgreSQL service...');
    execSync('service postgresql start', { stdio: 'pipe' });
    
    let retries = 10;
    while (retries > 0) {
      try {
        execSync('pg_isready -U postgres', { stdio: 'pipe' });
        break;
      } catch {
        retries--;
        if (retries === 0) {
          throw new Error('PostgreSQL failed to start within timeout');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('PostgreSQL is ready');

    migrationDir = path.join(__dirname, '../../images/psapp/server/src/migration');
    totalMigrationCount = countMigrationFiles();
    
    testEnv = {
      ...process.env,
      POSTGRES_CONNECTION_HOST: 'localhost',
      POSTGRES_CONNECTION_PORT: '5432',
      POSTGRES_CONNECTION_USER: 'testuser',
      POSTGRES_CONNECTION_PASSWORD: 'testpass',
      POSTGRES_CONNECTION_DB: 'testdb',
    };

    execOptions = {
      cwd: path.join(__dirname, '../../images/psapp/server'),
      env: testEnv,
      encoding: 'utf8' as const,
      stdio: 'pipe' as const
    };
  });

  afterAll(async () => {
    console.log('Stopping PostgreSQL service...');
    try {
      execSync('service postgresql stop', { stdio: 'pipe' });
    } catch (error) {
      console.warn('Failed to stop PostgreSQL:', error);
    }
  });

  beforeEach(() => {
    const originalFiles = readdirSync(migrationDir);
    const generatedFiles = originalFiles.filter(file => file.includes('TestMigration'));
    generatedFiles.forEach(file => {
      const filePath = path.join(migrationDir, file);
      try {
        unlinkSync(filePath);
      } catch {}
    });
  });

  it('should run all migrations successfully on fresh database', async () => {
    const migrationRunResult = execSync(
      'bun run migration:run',
      execOptions
    );
    
    expect(migrationRunResult).toContain('successfully');
  }, 30000);

  it('should detect no schema drift after migrations are applied', async () => {
    const originalFiles = readdirSync(migrationDir);
    let generationSuccess = false;
    
    try {
      const migrationGenResult = execSync(
        'bun run migration:generate TestMigration',
        execOptions
      );
      
      const newFiles = readdirSync(migrationDir);
      const generatedFiles = newFiles.filter(file => !originalFiles.includes(file));
      
      if (generatedFiles.length > 0) {
        const generatedFile = generatedFiles[0];
        const filePath = path.join(migrationDir, generatedFile);
        const fileContent = require('fs').readFileSync(filePath, 'utf8');
        
        unlinkSync(filePath);
        
        const hasChanges = fileContent.includes('await queryRunner.query') && 
                          !fileContent.includes('// No changes detected');
        
        if (hasChanges) {
          throw new Error(
            `Schema drift detected! Migration was generated with actual changes:\n${fileContent}`
          );
        }
      }
      
      generationSuccess = true;
    } catch (error: any) {
      if (error.stdout?.includes('No changes in database schema were found')) {
        generationSuccess = true;
      } else {
        throw new Error(`Unexpected error during migration generation: ${error.message}`);
      }
    }
    
    expect(generationSuccess).toBe(true);
  }, 30000);

  it('should have executed exactly all available migrations', async () => {
    const migrationShowResult = execSync(
      'bun run migration:show',
      execOptions
    );
    
    const executedMigrations = migrationShowResult.split('\n')
      .filter(line => line.trim().startsWith('[X]'))
      .length;
    
    const pendingMigrations = migrationShowResult.split('\n')
      .filter(line => line.trim().startsWith('[ ]'))
      .length;
    
    expect(executedMigrations).toBe(totalMigrationCount);
    expect(pendingMigrations).toBe(0);
  }, 30000);

  it('should revert all migrations successfully', async () => {
    const migrationShowResult = execSync(
      'bun run migration:show',
      execOptions
    );
    
    const executedMigrations = migrationShowResult.split('\n')
      .filter(line => line.trim().startsWith('[X]'))
      .length;
    
    expect(executedMigrations).toBe(totalMigrationCount);
    
    for (let i = 0; i < executedMigrations; i++) {
      const revertResult = execSync(
        'bun run migration:revert',
        execOptions
      );
      
      expect(revertResult).toContain('reverted successfully');
    }
  }, 60000);

  it('should verify all migrations have been reverted', async () => {
    const finalShowResult = execSync(
      'bun run migration:show',
      execOptions
    );
    
    const remainingExecutedMigrations = finalShowResult.split('\n')
      .filter(line => line.trim().startsWith('[X]'))
      .length;
    
    const pendingMigrations = finalShowResult.split('\n')
      .filter(line => line.trim().startsWith('[ ]'))
      .length;
    
    expect(remainingExecutedMigrations).toBe(0);
    expect(pendingMigrations).toBe(totalMigrationCount);
  }, 30000);

  it('should have completely clean database after all downgrades', async () => {
    const userTables = queryDatabase(
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name != 'migrations'"
    );
    expect(parseInt(userTables)).toBe(0);

    const migrationRecords = queryDatabase(
      "SELECT COUNT(*) FROM migrations"
    );
    expect(parseInt(migrationRecords)).toBe(0);

    const sequences = queryDatabase(
      "SELECT COUNT(*) FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name != 'migrations_id_seq'"
    );
    expect(parseInt(sequences)).toBe(0);

    const views = queryDatabase(
      "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public'"
    );
    expect(parseInt(views)).toBe(0);

    const functions = queryDatabase(
      "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'"
    );
    expect(parseInt(functions)).toBe(0);

    const types = queryDatabase(
      "SELECT COUNT(*) FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e'"
    );
    expect(parseInt(types)).toBe(0);

    const indexes = queryDatabase(
      "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname != 'PK_migrations'"
    );
    expect(parseInt(indexes)).toBe(0);

    const constraints = queryDatabase(
      "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name != 'migrations'"
    );
    expect(parseInt(constraints)).toBe(0);

    const triggers = queryDatabase(
      "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public'"
    );
    expect(parseInt(triggers)).toBe(0);
  }, 30000);
});