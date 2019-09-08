import puppeteer from "puppeteer"
import moment from "moment"

const attendenceTable = "#AthleteTheme_wt8_block_wtMainContent_wt15_wtUserClassLoginTable"

interface VerifyBookingProps {
  readonly date: moment.Moment
}

export const verifyBooking = async (browser: puppeteer.Browser, { date }: VerifyBookingProps): Promise<void> => {
  const page = await browser.newPage()
  page.setViewport({ width: 1500, height: 1000 })

  // GET TIME
  await page.goto("https://app.wodify.com/Membership/Attendance.aspx", { waitUntil: "networkidle2" })
  const rowsText = await page.$$eval(`${attendenceTable} tr`, rows => rows.map(row => row.textContent))
  const containsDate = rowsText.filter(rowText => rowText.includes(date.format("DD/MM/YYYY")))
  if (containsDate.length < 1) {
    throw new Error("Not reserved")
  }
}
