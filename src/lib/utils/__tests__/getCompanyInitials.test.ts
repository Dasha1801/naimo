import { describe, expect, it } from 'vitest';
import { getCompanyInitials } from '../getCompanyInitials';

describe('getCompanyInitials', () => {
  it('возвращает инициалы двух слов', () => {
    expect(getCompanyInitials('Acme Corp')).toBe('AC');
  });

  it('возвращает одну инициалу для одного слова', () => {
    expect(getCompanyInitials('Google')).toBe('G');
  });

  it('берёт только первые два слова, если их больше', () => {
    expect(getCompanyInitials('Big Red Machine')).toBe('BR');
    expect(getCompanyInitials('A B C D E')).toBe('AB');
  });

  it('игнорирует лишние пробелы в начале, конце и между словами', () => {
    expect(getCompanyInitials('   Acme   Corp   ')).toBe('AC');
    expect(getCompanyInitials('Acme\tCorp')).toBe('AC'); // табы тоже
    expect(getCompanyInitials('Acme\nCorp')).toBe('AC'); // переносы тоже
  });

  it('возвращает пустую строку для пустой строки', () => {
    expect(getCompanyInitials('')).toBe('');
  });

  it('возвращает пустую строку для строки из одних пробелов', () => {
    expect(getCompanyInitials('     ')).toBe('');
    expect(getCompanyInitials('\t\n  ')).toBe('');
  });

  it('приводит инициалы к верхнему регистру', () => {
    expect(getCompanyInitials('acme corp')).toBe('AC');
    expect(getCompanyInitials('aCme CoRp')).toBe('AC');
  });

  it('корректно работает с не-ASCII символами', () => {
    expect(getCompanyInitials('Яндекс')).toBe('Я');
    expect(getCompanyInitials('Яндекс Такси')).toBe('ЯТ');
    expect(getCompanyInitials('Ünïcode Corp')).toBe('ÜC');
  });

  it('возвращает первый символ, даже если это цифра или спецсимвол', () => {
    expect(getCompanyInitials('123 Corp')).toBe('1C');
    expect(getCompanyInitials('@home Inc')).toBe('@I');
  });

  it('не падает на суррогатных парах (эмодзи)', () => {
    // w[0] возвращает первый code unit, а не code point,
    // поэтому для эмодзи результат может быть «битым» — фиксируем контракт
    const result = getCompanyInitials('😀 Corp');
    expect(result).toHaveLength(2); // одна инициала эмодзи (code unit) + C
    expect(result[1]).toBe('C');
  });
});
