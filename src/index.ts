import dotenv from "dotenv-flow"
dotenv.config()

import express from "express"
import moment from "moment"
import { scheduleJob } from "node-schedule"

import { bookWod } from "./wodify/bookWod"

const app = express()
const port = process.env.PORT || 8080

app.get("/", (req, res) => {
  res.send("Wodify booker!")
})

app.get("/book", async (req, res) => {
  const twoWeeksFromNow = moment().add(14, "days")
  await bookWod(twoWeeksFromNow)
  res.sendStatus(200)
})

app.listen(port, () => {
  // Runs from Monday to Thursday at 8h35 belgium time (utc-2)
  scheduleJob("0 35 10 * * 1-4", async () => {
    const twoWeeksFromNow = moment().add(14, "days")
    await bookWod(twoWeeksFromNow)
  })
  console.log(`🎉 Server started at http://localhost:${port}`)
})
