import { describe, expect, it } from 'vitest';

import { TableFormatter } from '../../src/utils/table-formatter';

describe('TableFormatter', () => {
  const sampleColumns = [
    { key: 'name', label: 'Name', width: 20 },
    { key: 'email', label: 'Email', width: 30 },
    { key: 'role', label: 'Role', width: 15 },
  ];

  const sampleData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];

  describe('basic functionality', () => {
    it('should format data as table with all columns', () => {
      const formatter = new TableFormatter({ columns: sampleColumns });
      const result = formatter.format(sampleData);

      expect(result).toContain('Name');
      expect(result).toContain('Email');
      expect(result).toContain('Role');
      expect(result).toContain('John Doe');
      expect(result).toContain('jane@example.com');
    });

    it('should return empty string for empty data', () => {
      const formatter = new TableFormatter({ columns: sampleColumns });
      const result = formatter.format([]);

      expect(result).toBe('');
    });

    it('should handle null/undefined values', () => {
      const formatter = new TableFormatter({ columns: sampleColumns });
      const dataWithNulls = [{ name: 'John Doe', email: null, role: undefined }];
      const result = formatter.format(dataWithNulls);

      expect(result).toContain('John Doe');
    });
  });

  describe('field filtering', () => {
    it('should filter columns based on fields parameter', () => {
      const formatter = new TableFormatter({
        columns: sampleColumns,
        fields: ['name', 'role'],
      });
      const result = formatter.format(sampleData);

      expect(result).toContain('Name');
      expect(result).toContain('Role');
      expect(result).not.toContain('Email');
      expect(result).toContain('John Doe');
      expect(result).toContain('Admin');
    });

    it('should show all columns when fields is undefined', () => {
      const formatter = new TableFormatter({
        columns: sampleColumns,
        fields: undefined,
      });
      const result = formatter.format(sampleData);

      expect(result).toContain('Name');
      expect(result).toContain('Email');
      expect(result).toContain('Role');
    });

    it('should handle invalid field names gracefully', () => {
      const formatter = new TableFormatter({
        columns: sampleColumns,
        fields: ['name', 'invalid_field'],
      });
      const result = formatter.format(sampleData);

      expect(result).toContain('Name');
      expect(result).not.toContain('Email');
      expect(result).not.toContain('Role');
    });
  });

  describe('getAvailableFields', () => {
    it('should return all available field keys', () => {
      const formatter = new TableFormatter({ columns: sampleColumns });
      const fields = formatter.getAvailableFields();

      expect(fields).toEqual(['name', 'email', 'role']);
    });
  });
});
