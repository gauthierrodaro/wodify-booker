interface Rect {
  top: number
  left: number
  bottom: number
  right: number
}

export const getBoundingClient = async (page, element): Promise<Rect> => {
  const rect = await page.evaluate((element): Rect => {
    const { top, left, bottom, right } = element.getBoundingClientRect()
    return { top, left, bottom, right }
  }, element)
  return rect
}
