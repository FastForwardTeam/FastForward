import { React } from "react"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import Settings from "."
import store from "../../app/mockStore"
import ThemeProvider from "../../helpers/theme"

it("renders tabs", () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Settings />
      </ThemeProvider>
    </Provider>
  )

  const tabs = ["Options", "Whitelist Sites", "Custom Bypasses"]

  tabs.forEach((tab) => {
    expect(screen.getByText(tab)).toBeVisible()
  })
})

it("persists state when tabs are changed", () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Settings />
      </ThemeProvider>
    </Provider>
  )

  const numberInput = screen.getAllByLabelText(/Take me to destination in/)[0]

  expect(numberInput.value).toBe("10")
  numberInput.value = "20"
  numberInput.dispatchEvent(new Event("change"))
  const tab2 = screen.getByText("Custom Bypasses")
  tab2.click()
  const tab1 = screen.getByText("Options")
  tab1.click()
  expect(numberInput.value).toBe("20")
})
