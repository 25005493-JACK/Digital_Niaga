const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
 try {
  const context=await browser.newContext(); const page=await context.newPage();
  await page.goto((process.env.TEST_BASE_URL||'http://127.0.0.1:3087')+'/portal');
  const card=page.locator('article').first();
  const original=await card.getByLabel('Dish name',{exact:true}).inputValue();
  await card.getByLabel('Dish name',{exact:true}).fill('Browser test dish');
  await card.getByLabel('Price (RM)').fill('12.34');
  await card.getByLabel('Dish photo').setInputFiles({name:'dish.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4xQAAAAASUVORK5CYII=','base64')});
  await page.getByRole('button',{name:'Save menu',exact:true}).waitFor();
  await page.getByRole('button',{name:/Move down Browser test dish/}).click();
  await page.getByRole('button',{name:'Save menu',exact:true}).click();
  await page.getByRole('status').filter({hasText:'Menu saved'}).waitFor();
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('article')[1]?.querySelector('input[maxlength="120"]')?.value === 'Browser test dish');
  assert.equal(await page.locator('article').nth(1).getByLabel('Dish name',{exact:true}).inputValue(),'Browser test dish');
  await page.getByLabel('Your stall').selectOption('stall-02');
  assert.notEqual(await page.locator('article').first().getByLabel('Dish name',{exact:true}).inputValue(),'Browser test dish');
  await page.goto((process.env.TEST_BASE_URL||'http://127.0.0.1:3087')+'/');
  await page.locator('article').first().getByRole('button',{name:'View menu'}).click();
  await page.getByRole('dialog').getByText('Browser test dish',{exact:true}).waitFor();
  for(const route of ['/pos','/kitchen']) {const response=await page.goto((process.env.TEST_BASE_URL||'http://127.0.0.1:3087')+route); assert.equal(response.status(),404);}
  console.log('Menu editing, upload, reordering, persistence, stall isolation, public display and removed routes passed.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
