// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    /** maximum time one test can run for. */
  timeout: 0,
  expect: {
    /** maximum time expect() should wait for the condition to be met. */
    timeout: 60 * 1000
  },
  use: {
    /** maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 60 * 1000,
    /** takes screenshot on failure */
    screenshot: 'only-on-failure',
    /** base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://app.uniswap.org/'
  },
  /** opt out of parallel tests */
  workers: 1,
  /** use allure report to display test results */
  reporter: [
    ['allure-playwright']
  ]
}
export default config