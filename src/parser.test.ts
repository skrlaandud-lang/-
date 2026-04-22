import { describe, expect, it } from 'vitest';
import { computeStatus, groupFilesByRequest, parseRequestName } from './parser';

describe('parseRequestName', () => {
  it('preserves core request string with spaces', () => {
    const parsed = parseRequestName('세무서-부가가치세 현수막-견적서-회사이름.pdf');
    expect(parsed.requestName).toBe('부가가치세 현수막');
  });
});

describe('computeStatus', () => {
  it('returns proper summary state', () => {
    expect(computeStatus([false, false, false, false, false, false])).toBe('대기');
    expect(computeStatus([true, true, false, false, false, false])).toBe('진행중');
    expect(computeStatus([true, true, true, true, true, true])).toBe('완료');
  });
});

describe('groupFilesByRequest', () => {
  it('filters mixed groups by inferred work type', () => {
    const advertising = groupFilesByRequest([
      '문구점-봄행사 배너-시안.jpg',
      '문구점-봄행사 배너-청구서.pdf',
      '현장A-외부창호 교체-계약서.pdf',
    ], 'advertising');

    expect(advertising).toHaveLength(1);
    expect(advertising[0].requestName).toBe('봄행사 배너');
  });
});
