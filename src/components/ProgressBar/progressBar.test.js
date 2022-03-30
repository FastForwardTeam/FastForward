import { render } from "@testing-library/react"
import React from "react"
import ThemeProvider from "../../helpers/theme"

import ProgressBar from "."

it("callback is called", () => {
  const mockCallback = jest.fn()
  render(
    <ThemeProvider>
      <ProgressBar duration={2} callback={mockCallback} />
    </ThemeProvider>
  )

  // wait 2 seconds and check if callback was called
  setTimeout(() => {
    expect(mockCallback).toHaveBeenCalled()
  }, 2000)
})
