import dotenv from "dotenv-flow"
dotenv.config()

import express from "express"
import moment from "moment"
import { scheduleJob } from "node-schedule"

import { bookWod } from "./wodify/bookWod"

const app = express()
const port = process.env.PORT || 8080

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Wodify booker!")
})

// start the Express server
app.listen(port, () => {
  // Runs from Monday to Thursday at 8h35 belgium time (utc-2)
  scheduleJob("0 35 10 * * 1-4", async () => {
    const twoWeeksFromNow = moment().add(14, "days")
    await bookWod(twoWeeksFromNow)
  })
  console.log(`🎉 Server started at http://localhost:${port}`)
})
