import puppeteer from "puppeteer"

export const launchBrowser = (): Promise<puppeteer.Browser> => {
  const options =
    process.env.NODE_ENV === "development"
      ? {
          headless: false
        }
      : {
          args: [
            // Required for Docker version of Puppeteer
            "--no-sandbox",
            "--disable-setuid-sandbox",
            // This will write shared memory files into /tmp instead of /dev/shm,
            // because Docker’s default for /dev/shm is 64MB
            "--disable-dev-shm-usage"
          ]
        }
  return puppeteer.launch(options)
}
