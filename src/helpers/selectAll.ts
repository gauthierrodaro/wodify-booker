/**
 * Emulates a Ctrl+A SelectAll key combination by dispatching custom keyboard
 * events and using the results of those events to determine whether to call
 * `document.execCommand( 'selectAll' );`. This is necessary because Puppeteer
 * does not emulate Ctrl+A SelectAll in macOS. Events are dispatched to ensure
 * that any `Event#preventDefault` which would have normally occurred in the
 * application as a result of Ctrl+A is respected.
 *
 * @link https://github.com/GoogleChrome/puppeteer/issues/1313
 * @link https://w3c.github.io/uievents/tools/key-event-viewer.html
 *
 * @return {Promise} Promise resolving once the SelectAll emulation completes.
 */
export async function emulateSelectAll(page): Promise<void> {
  await page.evaluate(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

    document.activeElement.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: isMac ? "Meta" : "Control",
        code: isMac ? "MetaLeft" : "ControlLeft",
        location: window.KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        getModifierState: (keyArg: string) => keyArg === (isMac ? "Meta" : "Control"),
        ctrlKey: !isMac,
        metaKey: isMac,
        charCode: 0,
        keyCode: isMac ? 93 : 17,
        which: isMac ? 93 : 17
      })
    )

    const preventableEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "a",
      code: "KeyA",
      location: window.KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
      getModifierState: (keyArg: string) => keyArg === (isMac ? "Meta" : "Control"),
      ctrlKey: !isMac,
      metaKey: isMac,
      charCode: 0,
      keyCode: 65,
      which: 65
    })

    const wasPrevented = !document.activeElement.dispatchEvent(preventableEvent) || preventableEvent.defaultPrevented

    if (!wasPrevented) {
      document.execCommand("selectall", false, null)
    }

    document.activeElement.dispatchEvent(
      new KeyboardEvent("keyup", {
        bubbles: true,
        cancelable: true,
        key: isMac ? "Meta" : "Control",
        code: isMac ? "MetaLeft" : "ControlLeft",
        location: window.KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        getModifierState: (): boolean => false,
        charCode: 0,
        keyCode: isMac ? 93 : 17,
        which: isMac ? 93 : 17
      })
    )
  })
}
