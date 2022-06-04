import { Page } from '@playwright/test'

export class EtherScan {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    textEtherStatus = () => this.page.locator("span[class$='u-label--success rounded']")
}