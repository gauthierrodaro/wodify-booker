import puppeteer from "puppeteer"

const usernameInput = "#wtLayoutLogin_SilkUIFramework_wt8_block_wtUsername_wtUsername_wtUserNameInput"
const passwordInput = "#wtLayoutLogin_SilkUIFramework_wt8_block_wtPassword_wtPassword_wtPasswordInput"
const signInButton = "#wtLayoutLogin_SilkUIFramework_wt8_block_wtAction_wtAction_wtLoginButton"

interface LogInProps {
  readonly username: string
  readonly password: string
}

export const logIn = async (browser: puppeteer.Browser, { username, password }: LogInProps): Promise<void> => {
  const page = await browser.newPage()
  page.setViewport({ width: 1500, height: 1000 })

  // SIGN IN
  await page.goto("https://app.wodify.com")
  await page.type(usernameInput, username)
  await page.type(passwordInput, password)
  await page.click(signInButton)
  await page.waitForNavigation({ waitUntil: "load" })
}
