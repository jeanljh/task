
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
    })
    test('Test - select a token exchange pair to get swap rate', async () => {
        await uniswap.getSwapRate(data.swapPair1.tokenFrom, data.swapPair1.tokenTo, data.swapPair1.amount)
    })
    test('Test - token swap is not allowed for insufficient fund', async () => {
        await uniswap.getSwapRate(data.swapPair2.tokenFrom, data.swapPair2.tokenTo, data.swapPair2.amount)
        expect(uniswap.btnSwap(), 'swap button enable state').toBeDisabled()
    })
    test('Test - import a custom erc20 token', async () => {
        await uniswap.importToken(data.customToken.address, data.customToken.symbol)
    })
    test.afterAll(async () => {
        await browserContext.close()
    })
})