import { React } from "react"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import Options from "./options"
import store from "../../../app/mockStore"
import ThemeProvider from "../../../helpers/theme"

/* Labels:
 Enable website bypass
Take me to destination in
seconds
Block IP loggers which can't be bypassed
Enable crowdbypass
Take me to crowdbypass destinations in
seconds
*/

const labels = [
  /Enable website bypass/,
  /Take me to destination in.*seconds/,
  /Block IP loggers which can't be bypassed/,
  /Enable crowdbypass/,
  /Take me to crowdbypass destinations in.*seconds/,
]

it("renders all the labels", () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Options />
      </ThemeProvider>
    </Provider>
  )

  labels.forEach((label) => {
    screen.getAllByLabelText(label).forEach((element) => {
      expect(element).toBeVisible()
    })
  })
})

it("checks and unchecks the checkboxes", () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Options />
      </ThemeProvider>
    </Provider>
  )

  const checkboxes = screen.getAllByRole("checkbox")

  checkboxes.forEach((checkbox) => {
    const initChecked = checkbox.checked
    checkbox.click()
    expect(checkbox.checked).toBe(!initChecked)
    checkbox.click()
    expect(checkbox.checked).toBe(initChecked)
  })
})

/* eslint-disable no-param-reassign */
it("changes the number inputs", () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Options />
      </ThemeProvider>
    </Provider>
  )

  const numberInputs = screen.getAllByRole("textbox")

  numberInputs.forEach((numberInput) => {
    const initValue = numberInput.value
    numberInput.value = "20"
    numberInput.dispatchEvent(new Event("change"))
    expect(numberInput.value).toBe("20")
    numberInput.value = initValue
    numberInput.dispatchEvent(new Event("change"))
    expect(numberInput.value).toBe(initValue)
  })
})
/* eslint-enable no-param-reassign */
