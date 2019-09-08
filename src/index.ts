import dotenv from "dotenv-flow"
dotenv.config()

import { IncomingWebhook } from "@slack/webhook"
import moment from "moment"
import { scheduleJob } from "node-schedule"

import { launchBrowser } from "./helpers/launchBrowser"
import { slackMessages } from "./slack/messages"

import { bookWod } from "./wodify/bookWod"
import { logIn } from "./wodify/logIn"
import { verifyBooking } from "./wodify/verifyBooking"

const runOnce = async (): Promise<void> => {
  const twoWeeksFromNow = moment().add(14, "days")

  if (process.env.WODIFY_USERNAME === undefined) {
    throw new Error("Forgot to set username")
  }
  if (process.env.WODIFY_PASSWORD === undefined) {
    throw new Error("Forgot to set password")
  }
  if (process.env.SLACK_WEBHOOK_URL === undefined) {
    throw new Error("Missing webhook")
  }
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL)
  const browser = await launchBrowser()
  try {
    await logIn(browser, {
      username: process.env.WODIFY_USERNAME,
      password: process.env.WODIFY_PASSWORD
    })
    await bookWod(browser, {
      date: twoWeeksFromNow
    })
    try {
      await verifyBooking(browser, {
        date: twoWeeksFromNow
      })
    } catch (error) {
      await webhook.send(slackMessages.warning(twoWeeksFromNow))
    }
    await webhook.send(slackMessages.success(twoWeeksFromNow))
  } catch (error) {
    await webhook.send(slackMessages.error(twoWeeksFromNow, error))
  }
  browser.close()
}

// Runs from Monday to Thursday at 8h35 belgium time (utc-2)
scheduleJob("0 35 10 * * 1-4", async () => {
  await runOnce()
})
