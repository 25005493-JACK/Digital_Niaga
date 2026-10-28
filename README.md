# Digital Niaga

Public stall discovery, photo menus, and a 3D food district map. Customers order at the stall counter.

## Owner menu editor

Open /portal to select a stall, add or delete dishes, edit names, descriptions, categories and prices, mark availability or signature dishes, upload or remove photos, and move menu cards up or down. Click Save menu to update the public menu. Discard changes restores the saved version. JPG, PNG and WebP uploads up to 10 MB are resized before saving.

This is a browser-local prototype. Menus persist on this browser and sync between its tabs. Owner authentication, shared database storage and photo hosting are required for cross-device publishing. Selecting a stall does not authenticate its owner. Cashier, kitchen and receipt pages have been removed. The Supabase SQL remains an unused historical reference.

## Run

npm install
npm run dev

## Checks

npm test
npm run typecheck
npm run lint
npm run build

For the browser test, start the app on port 3087 and run npm run test:browser. Set TEST_BASE_URL or BROWSER_PATH if needed.
