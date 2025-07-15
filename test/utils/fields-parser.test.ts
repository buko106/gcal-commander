import { describe, expect, it } from 'vitest';

import { parseFields } from '../../src/utils/fields-parser';

describe('parseFields', () => {
  it('should parse comma-separated fields', () => {
    const result = parseFields('title,date,location');
    expect(result).toEqual(['title', 'date', 'location']);
  });

  it('should return undefined for undefined input', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = parseFields(undefined);
    expect(result).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    const result = parseFields('');
    expect(result).toBeUndefined();
  });

  it('should trim whitespace from fields', () => {
    const result = parseFields('  title  ,  date  ,  location  ');
    expect(result).toEqual(['title', 'date', 'location']);
  });

  it('should handle single field', () => {
    const result = parseFields('title');
    expect(result).toEqual(['title']);
  });

  it('should handle empty fields in the middle', () => {
    const result = parseFields('title,,location');
    expect(result).toEqual(['title', 'location']);
  });

  it('should handle whitespace-only fields', () => {
    const result = parseFields('title,  ,location');
    expect(result).toEqual(['title', 'location']);
  });

  it('should handle trailing comma', () => {
    const result = parseFields('title,date,');
    expect(result).toEqual(['title', 'date']);
  });

  it('should handle leading comma', () => {
    const result = parseFields(',title,date');
    expect(result).toEqual(['title', 'date']);
  });
});
