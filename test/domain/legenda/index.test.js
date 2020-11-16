const { expect, test } = require('@jest/globals');
const { getSubtitle } = require('domain/legenda');

test('Abrir página de legenda', async () => {
  const subtitleList = await getSubtitle('Bananas');
  expect(subtitleList.length).toBe(10);
});
