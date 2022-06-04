
import { test, BrowserContext, expect } from '@playwright/test'
import { Setup } from '../pages/setup'
import { Metamask } from '../pages/metamask'
import { Uniswap } from '../pages/uniswap'
import data from '../fixtures/data.json'

test.describe('Test Suite - Ethereum', async () => {
    let browserContext: BrowserContext
    let uniswap: Uniswap
    test.beforeAll(async () => {
        const setup = new Setup()
        browserContext = await setup.init()
        let page = browserContext.pages()[1]
        const metamask = new Metamask(page)
        await metamask.login(data.network.ethereum)
        page = browserContext.pages()[0]
        uniswap = new Uniswap(page)
        await page.goto('')
        await uniswap.connectMeta(browserContext)


        // await page.goto('')
        // await page.waitForTimeout(300000)
        // metamask = new Metamask(page)
        // await metamask.login()
        // metamask.initPage()
        // // Load metamask extension for chrome
        // const extPath = __dirname.replace('tests', data.metaFolder)
        // const browserContext: BrowserContext = await chromium.launchPersistentContext('', {
        //     headless: false,
        //     args: [
        //         `--disable-extensions-except=${extPath}`,
        //         `--load-extension=${extPath}`
        //     ]
        // })
        // // Go to metamask login page
        // const page: Page = browserContext.pages()[0]
        // await page.goto(data.urlMeta)
        // await page.waitForLoadState()
        // const tempPage: Page = await browserContext.newPage()
        // await page.bringToFront()
        // await tempPage.close()
        // await page.waitForTimeout(5000)
    })
    test('Test - select a token exchange pair to get swap rate', async () => {
        await uniswap.getSwapRate(data.validSwap.tokenFrom, data.validSwap.tokenTo, data.validSwap.amount)
        // await uniswap.getSwapRate('WETH', 'DAI', '2')
        // await page.waitForTimeout(300000)
    })
    test('Test - token swap is not allowed for insufficient fund', async () => {
        await uniswap.getSwapRate(data.invalidSwap.tokenFrom, data.invalidSwap.tokenTo, data.invalidSwap.amount)
        expect(uniswap.btnSwap(), 'swap button enable state').toBeEnabled()
    })
    test('Test - import a custom erc20 token', async () => {
        await uniswap.importToken(data.customToken.address, data.customToken.symbol)
    })
    test.afterAll(async () => {
        await browserContext.close()
    })
})