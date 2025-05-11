import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

function snakeCase(str: string): string {
  return str
    // ABc -> a_bc
    .replace(/([A-Z])([A-Z])([a-z])/g, "$1_$2$3")
    // aC -> a_c
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  columnName(propertyName: string, customName: string | undefined, embeddedPrefixes: string[]): string {
    const name = customName ? customName : propertyName;
    return snakeCase(embeddedPrefixes.concat(name).join('_'));
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    return `PK_${tableName}`;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    return `UQ_${tableName}_${columnNames.join('_')}`;
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[]
  ): string {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const referencedTableName = referencedTablePath?.split('.').pop();
    
    // Generate a descriptive name based on the relationship
    if (referencedTableName) {
      // If it's a single column foreign key, use a simpler naming
      if (columnNames.length === 1) {
        return `FK_${tableName}_${columnNames[0]}`;
      }
      // For multiple columns, include all
      return `FK_${tableName}_${columnNames.join('_')}`;
    }
    
    return `FK_${tableName}_${columnNames.join('_')}`;
  }

  checkConstraintName(tableOrName: Table | string, expression: string): string {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    return `CHK_${tableName}_${Math.random().toString(36).substring(7)}`;
  }

  defaultConstraintName(tableOrName: Table | string, columnName: string): string {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    return `DF_${tableName}_${columnName}`;
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    const tableName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    
    // Special case for unique indexes that have WHERE clauses
    if (where) {
      // Extract meaningful info from WHERE clause if possible
      if (where.includes('NOT NULL')) {
        const column = columnNames[0];
        return `IDX_${tableName}_${column}_unique_where_not_null`;
      }
    }
    
    return `IDX_${tableName}_${columnNames.join('_')}`;
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string
  ): string {
    return snakeCase(firstTableName + '_' + firstPropertyName + '_' + secondTableName);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(tableName + '_' + (columnName ? columnName : propertyName));
  }

  joinTableInverseColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return this.joinTableColumnName(tableName, propertyName, columnName);
  }
}