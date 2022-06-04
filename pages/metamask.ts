import { Page } from '@playwright/test'
import data from '../fixtures/data.json'

export class Metamask {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    inputKey = () => this.page.locator('div.MuiFormControl-root #import-srp__srp-word-0')
    inputKeyById = (id: number) => this.page.locator(`div.MuiFormControl-root #import-srp__srp-word-${id}`)
    inputPassword = () => this.page.locator('#password')
    inputConfirmPassword = () => this.page.locator('#confirm-password')
    ckbTerms = () => this.page.locator('#create-new-vault__terms-checkbox')
    btnSubmit = () => this.page.locator("button[type='submit']")
    btnOk = () => this.page.locator('button.btn-primary')
    btnNetwork = () => this.page.locator('div.network-display')
    linkShowNetwork = () => this.page.locator('a.network-dropdown-content--link')
    btnShowTestNetworks = () => this.page.locator("div[data-testid$='show-testnet-conversion']").last().locator('.toggle-button')
    textNetwork = (network: string) => this.page.locator(`text='${network}'`)

    /** login to metamask and select a network */
    async login(network: string) {
        await this.page.goto(data.urlMeta)
        await this.page.waitForLoadState()
        const keys = data.key.split(' ')
        for (let i = 0; i < keys.length; i++) {
            await this.inputKeyById(i).fill(keys[i])
        }
        // if (process.env.CI) {
        //     const keys = data.key.split(' ')
        //     for (let i = 0; i < keys.length; i++) {
        //         await this.inputKeyById(i).fill(keys[i])
        //     }
        // }
        // else {
        //     await this.page.evaluate(k => navigator.clipboard.writeText(k), data.key)
        //     await this.inputKey().press('Control+V')
        // }
        await this.inputPassword().fill(data.password)
        await this.inputConfirmPassword().fill(data.password)
        await this.ckbTerms().click()
        await this.btnSubmit().click()
        await this.btnOk().click()
        const notDefault = await this.textNetwork(network).isHidden()
        if (notDefault) {
            await this.btnNetwork().click()
            await this.linkShowNetwork().click()
            await this.btnShowTestNetworks().click()
            await this.btnNetwork().click()
            await this.textNetwork(network).click()
        }
        await this.page.close()
    }
}