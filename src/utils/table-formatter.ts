import Table from 'cli-table3';

export interface TableColumn {
  align?: 'center' | 'left' | 'right';
  key: string;
  label: string;
  width?: number;
}

export interface TableFormatterOptions {
  columns: TableColumn[];
  fields?: string[];
}

export class TableFormatter {
  private columns: TableColumn[];
  private filteredColumns: TableColumn[];

  constructor(options: TableFormatterOptions) {
    this.columns = options.columns;
    this.filteredColumns = this.filterColumns(options.fields);
  }

  public format(data: Record<string, unknown>[]): string {
    if (data.length === 0) {
      return '';
    }

    const table = new Table({
      head: this.filteredColumns.map((col) => col.label),
      colAligns: this.filteredColumns.map((col) => col.align || 'left'),
      colWidths: this.filteredColumns.map((col) => col.width || null),
      style: {
        head: ['cyan'],
        border: ['grey'],
      },
    });

    for (const row of data) {
      const tableRow = this.filteredColumns.map((col) => {
        const value = row[col.key];
        return value !== undefined && value !== null ? String(value) : '';
      });
      table.push(tableRow);
    }

    return table.toString();
  }

  public getAvailableFields(): string[] {
    return this.columns.map((col) => col.key);
  }

  private filterColumns(fields?: string[]): TableColumn[] {
    if (!fields) {
      return this.columns;
    }

    return this.columns.filter((column) => fields.includes(column.key));
  }
}
