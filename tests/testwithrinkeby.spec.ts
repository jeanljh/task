
import { test, BrowserContext } from '@playwright/test'
import { Setup } from '../pages/setup'
import { Metamask } from '../pages/metamask'
import { Uniswap } from '../pages/uniswap'
import data from '../fixtures/data.json'

test.describe('Test Suite - Rinkeby', async () => {
    let browserContext: BrowserContext
    let uniswap: Uniswap
    test.beforeAll(async () => {
        const setup = new Setup()
        browserContext = await setup.init()
        let page = browserContext.pages()[1]
        const metamask = new Metamask(page)
        await metamask.login(data.network.rinkeby)
        page = browserContext.pages()[0]
        uniswap = new Uniswap(page)
        await page.goto('')
        await uniswap.connectMeta(browserContext)
    })
    test('Test - perform token swap for an exchange pair when account has sufficient fund', async () => {
        await uniswap.getSwapRate(data.validSwap.tokenFrom, data.validSwap.tokenTo, data.validSwap.amount)
        await uniswap.swapToken(browserContext)
    })
    test.afterAll(async () => {
        await browserContext.close()
    })
})