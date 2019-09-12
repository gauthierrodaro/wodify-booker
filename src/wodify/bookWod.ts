import { IncomingWebhook } from "@slack/webhook"
import moment from "moment"

import { launchBrowser } from "../helpers/launchBrowser"
import { slackMessages } from "../slack/messages"

import { register2Wod } from "./register2Wod"
import { logIn } from "./logIn"
import { verifyBooking } from "./verifyBooking"

if (process.env.WODIFY_USERNAME === undefined) {
  throw new Error("Forgot to set username")
}
if (process.env.WODIFY_PASSWORD === undefined) {
  throw new Error("Forgot to set password")
}
if (process.env.SLACK_WEBHOOK_URL === undefined) {
  throw new Error("Missing webhook")
}

export const bookWod = async (date: moment.Moment): Promise<void> => {
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL)
  const browser = await launchBrowser()
  try {
    await logIn(browser, {
      username: process.env.WODIFY_USERNAME,
      password: process.env.WODIFY_PASSWORD
    })
    await register2Wod(browser, { date })
    try {
      await verifyBooking(browser, { date })
    } catch (error) {
      await webhook.send(slackMessages.warning(date))
    }
    await webhook.send(slackMessages.success(date))
  } catch (error) {
    await webhook.send(slackMessages.error(date, error))
  }
  browser.close()
}
