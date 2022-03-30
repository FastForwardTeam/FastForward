import { React, useState } from "react"
import { render, screen } from "@testing-library/react"

import { Checkbox, CheckboxWithNumber } from "."
import ThemeProvider from "../../helpers/theme"

// TODO: Test min max value

function checkBoxTest(checkbox) {
  expect(checkbox).not.toBeChecked()
  checkbox.click()
  expect(checkbox).toBeChecked()
  checkbox.click()
  expect(checkbox).not.toBeChecked()
}

function MockCheckboxComponent() {
  const [checked, setChecked] = useState(false)
  return (
    <ThemeProvider>
      <Checkbox
        label="Test checkbox"
        pref={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </ThemeProvider>
  )
}

describe("Checkbox", () => {
  it("renders label", () => {
    render(<MockCheckboxComponent />)
    expect(screen.getByText("Test checkbox")).toBeVisible()
  })

  it("checks and unchecks", () => {
    render(<MockCheckboxComponent />)
    const checkbox = screen.getByLabelText("Test checkbox")
    checkBoxTest(checkbox)
  })
})

function MockCheckboxWithNumberComponent() {
  const [checked, setChecked] = useState(false)
  const [value, setValue] = useState(10)
  return (
    <ThemeProvider>
      <CheckboxWithNumber
        label1="Test checkbox"
        label2="with number"
        boxPref={checked}
        numberPref={value}
        onBoxChange={(e) => {
          setChecked(e.target.checked)
        }}
        onNumberChange={(e) => {
          setValue(e)
        }}
      />
    </ThemeProvider>
  )
}

describe("CheckboxWithNumber", () => {
  it("renders label", () => {
    render(<MockCheckboxWithNumberComponent />)
    const i = screen.getAllByLabelText(/Test checkbox.*with number/)
    i.forEach((element) => {
      expect(element).toBeVisible()
    })
  })

  it("checks and unchecks", () => {
    render(<MockCheckboxWithNumberComponent />)
    const checkbox = screen.getByRole("checkbox")
    checkBoxTest(checkbox)
  })

  it("changes number", () => {
    render(<MockCheckboxWithNumberComponent />)
    const number = screen.getByRole("textbox")
    expect(number.value).toBe("10")
    number.value = "20"
    number.dispatchEvent(new Event("change"))
    expect(number.value).toBe("20")
  })
})
