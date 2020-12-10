import {
  toThousandslsFilter,
  accuracyFormat,
  hashFormat
} from '@/utils/filters.js'

describe('Filters', () => {
  test('toThousandslsFilter 3000 to be 3,000', () => {
    expect(toThousandslsFilter("3000")).toBe("3,000");
  })
  test('toThousandslsFilter 300 to be 300', () => {
    expect(toThousandslsFilter("300")).toBe("300");
  })
  test('accuracyFormat default to be ""', () => {
    expect(accuracyFormat()).toBe("");
  })
  test('accuracyFormat(3000, 3) to be 3', () => {
    expect(accuracyFormat(3000, 3)).toBe("3");
  })
  test('hashFormat("") to be ""', () => {
    expect(hashFormat("")).toBe("");
  })
  test('hashFormat("5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg") to be "5CAUdnw....2PXqg"', () => {
    expect(hashFormat("5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg")).toBe("5CAUdnw....2PXqg");
  })
})
