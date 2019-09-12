import puppeteer from "puppeteer"
import moment from "moment"

import { emulateSelectAll } from "../helpers/selectAll"
import { getBoundingClient } from "../helpers/getBoundingClient"

const calendarButton = "#AthleteTheme_wt6_block_wtMainContent_wt9_W_Utils_UI_wt212_block_wtDateInputFrom"

interface register2WodProps {
  readonly date: moment.Moment
}

interface ElementWithRect {
  readonly element: puppeteer.ElementHandle<Element>
  readonly top: number
}

export const register2Wod = async (browser: puppeteer.Browser, { date }: register2WodProps): Promise<void> => {
  const page = await browser.newPage()
  page.setViewport({ width: 1500, height: 1000 })

  // GET TIME
  await page.goto("https://app.wodify.com/Schedule/CalendarListViewEntry.aspx")
  await page.waitForSelector(calendarButton)
  await page.click(calendarButton)
  await emulateSelectAll(page)
  await page.type(calendarButton, date.format("DD/MM/YYYY"))
  await page.keyboard.press("Enter")
  await page.waitFor(5000)

  // CLICK ON REGISTER FOR 7:30
  const elements = await page.$x("//span[contains(text(), '07:30 WOD')]")
  if (elements.length > 0) {
    const elementsWithBounding = (await Promise.all(
      elements.map(
        async (element): Promise<ElementWithRect> => {
          const rect = await getBoundingClient(page, element)
          return {
            element,
            top: rect.top
          }
        }
      )
    )).sort((a, b): number => a.top - b.top)
    await elementsWithBounding[0].element.click()
  } else {
    throw new Error("Link not found")
  }

  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")

  await page.keyboard.press("Enter")
  await page.waitFor(5000)
}
