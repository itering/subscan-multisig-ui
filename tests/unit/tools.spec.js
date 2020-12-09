import {
  isMobile,
  getTokenDecimalByCurrency
} from '@/utils/tools.js'

describe('Tools', () => {
  test('isMobile', () => {
    expect(isMobile()).toBeFalsy();
  })

  test('getTokenDecimalByCurrency returns 0 by default', () => {
    expect(getTokenDecimalByCurrency()).toEqual(0);
  })
})
