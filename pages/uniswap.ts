import { BrowserContext, Page, expect } from '@playwright/test'
import { Metamask } from './metamask'
import { EtherScan } from './etherscan'

export class Uniswap {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    btnConnectWallet = () => this.page.locator('#connect-wallet')
    btnConnectMeta = () => this.page.locator('#connect-METAMASK')
    btnAccount = () => this.page.locator('#web3-status-connected')
    divSwapInput = () => this.page.locator('#swap-currency-input')
    divSwapOutput = () => this.page.locator('#swap-currency-output')
    btnTokenInput = () => this.divSwapInput().locator('span.token-symbol-container')
    btnTokenOutput = () => this.divSwapOutput().locator('span.token-symbol-container')
    inputTokenSearch = () => this.page.locator('#token-search-input')
    textToken = (token: string) => this.page.locator(`div.css-8mokm4 >> text='${token}'`)
    inputAmountFrom = () => this.divSwapInput().locator('input')
    inputAmountTo = () => this.divSwapOutput().locator('input')
    btnSwap = () => this.page.locator('#swap-button')
    btnSwapConfirm = () => this.page.locator('#confirm-swap-or-send')
    btnClose = () => this.page.locator("button >> text='Close'")
    btnPending = () => this.btnAccount().locator("text='1 Pending'")
    btnClearAll = () => this.page.locator('button', {hasText: '(clear all)'})
    linkTransaction = () => this.page.locator("div[class*='TransactionListWrapper'] a")
    btnImport = () => this.page.locator("button >> text='Import'")

    /** connect to metamask wallet */
    async connectMeta(browserContext: BrowserContext) {
        await this.btnConnectWallet().click()
        const [pageMeta] = await Promise.all([
            browserContext.waitForEvent('page'),
            this.btnConnectMeta().click()
        ])
        await pageMeta.setViewportSize({
            width: 320,
            height: 650
        })
        await pageMeta.waitForLoadState();
        const metamask = new Metamask(pageMeta);
        // await browserContext.pages()[1].waitForLoadState();
        // const metamask = new Metamask(browserContext.pages()[1]);
        await metamask.btnOk().click()
        await metamask.btnOk().click()
        await this.btnAccount().waitFor({timeout: 10000})
        // await this.txtNetwork(data.network.rinkeby).waitFor({timeout: 10000})
    }

    /** get the swap rate for a selected exchange token pair */
    async getSwapRate(tokenFrom: string, tokenTo: string, amountFrom: string) {
        await this.inputAmountFrom().fill(amountFrom)
        expect(await this.inputAmountFrom().inputValue(), 'entered input amount').toBe(amountFrom)
        if (await this.btnTokenInput().innerText() !== tokenFrom){
            await this.btnTokenInput().click()
            await this.inputTokenSearch().fill(tokenFrom)
            await this.textToken(tokenFrom).click()
            expect(await this.btnTokenInput().innerText(), 'selected input token').toBe(tokenFrom)
        }
        if (await this.btnTokenOutput().innerText() !== tokenTo){
            await this.btnTokenOutput().click()
            await this.inputTokenSearch().fill(tokenTo)
            await this.textToken(tokenTo).click()
            expect(await this.btnTokenOutput().innerText(), 'selected output token').toBe(tokenTo)
        }
        expect(await this.waitForSwapOutput(5), 'display swap value of output token').toBeTruthy()
    }

    /** wait recursively for swap rate to show */
    async waitForSwapOutput(maxRetry: number): Promise<boolean> {
        if (!maxRetry) return false
        const res = await this.inputAmountTo().inputValue()
        if (!Number(res)) {
            await this.page.waitForTimeout(1000)
            return await this.waitForSwapOutput(maxRetry - 1)
        }
        return true
    }

    /** perform token swap and check etherscan transaction status */
    async swapToken(browserContext: BrowserContext) {
        expect(this.btnSwap(), 'swap button enable state').toBeEnabled()
        await this.btnSwap().click()
        await this.btnSwapConfirm().click()
        await browserContext.waitForEvent('page')
        let pageNew = browserContext.pages()[1]
        await pageNew.setViewportSize({
            width: 320,
            height: 650
        })
        await pageNew.waitForLoadState()
        const metamask = new Metamask(pageNew)
        await metamask.btnOk().click()
        await this.btnClose().click()
        await this.btnPending().waitFor({state: 'hidden'})
        await this.btnAccount().click()
        await this.linkTransaction().click()
        await this.btnClearAll().click()
        await browserContext.waitForEvent('page')
        pageNew = browserContext.pages()[1]
        await pageNew.waitForLoadState()
        const etherscan = new EtherScan(pageNew)
        expect(await etherscan.textEtherStatus().innerText(), 'etherscan status').toContain('Success')
        await pageNew.close()
    }

    /** perform token import and check imported token */
    async importToken(tokenAddress: string, tokenSymbol: string) {
        await this.btnTokenInput().click()
        await this.inputTokenSearch().fill(tokenAddress)
        await this.btnImport().click()
        await this.btnImport().click()
        await this.waitForSwapOutput(5)
        expect(await this.btnTokenInput().innerText(), 'imported token symbol').toBe(tokenSymbol)
    }
}