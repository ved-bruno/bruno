const path = require('path');
const timer = require('node:timers/promises');
const { _electron: electron } = require('playwright');
const { execSync } = require('child_process');

const { test, expect } = require('@playwright/test');
const { Console } = require('node:console');

const electronAppPath = path.join(__dirname, '../packages/bruno-electron');

(async () => {
  const browser = await electron.launch({ args: [electronAppPath] });

  const context = browser.context();
  await context.route('**/*', (route) => route.continue());

  while (true) {
    if(browser.windows().length) break;
    await timer.setTimeout(200);
  }
  const page = browser.windows()[0];

  // ------------code from playwright------------ //
  const import_location = '/Users/vedpr/Desktop/test data';
  const collection_location = '/Users/vedpr/Documents/test_folder3';

  await page.locator('.icon').first().click();
  console.log('clicked on the sidebar menu icon');
  await page.locator('#tippy-2').getByText('Import Collection').click();
  console.log('clicked on the import collection');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Bruno Collection' }).click();
  console.log('clicked on the Bruno Collection');
  const fileChooser = await fileChooserPromise;
  fileChooser.setFiles(path.join(import_location, './bruno-testbench.json'));
  console.log('set the file chooser');  
  await page.locator('#collection-location').fill(collection_location);
  console.log('filled the collection location');
  await page.getByRole('button', { name: 'Import', exact: true }).click();
  console.log('clicked on the import button');
  await page.waitForTimeout(1000);
  //await page.pause();
  await expect(page.getByRole('button', { name: 'Import', exact: true })).toBeHidden()
  console.log('import window is hidden, import is successful');
  await page.waitForTimeout(1000);

  execSync(`rm -r ${collection_location}/bruno-testbench`);

  // ----------end code from playwright---------- //
  await context.close();
  await browser.close();
})();



