import { chromium } from '@playwright/test'
import data from '../fixtures/data.json'

export class Setup {

    /** create browser context */
    async init() {
        const extPath = __dirname.replace('pages', data.metaFolder)
        const browserContext = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${extPath}`,
                `--load-extension=${extPath}`
            ]
        })
        browserContext.grantPermissions(['clipboard-write'])
        await Promise.all([
            browserContext.waitForEvent('page'),
            browserContext.backgroundPages()[0]
        ])
        return browserContext
    }
}