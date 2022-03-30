import React from "react"
import { NumberInput, Checkbox as MantineCheckbox } from "@mantine/core"
import PropTypes from "prop-types"

function style(theme) {
  return {
    input:
      theme.colorScheme === "dark"
        ? {
            background: theme.fn.linearGradient(
              45,
              theme.colors.ff_purple[8],
              theme.colors.ff_blue[8]
            ),
            border: `1px solid ${theme.colors.ff_purple[6]}`,
            "&:checked": {
              background: theme.fn.linearGradient(
                45,
                theme.colors.ff_purple[5],
                theme.colors.ff_blue[5]
              ),
              border: "none",
            },
          }
        : {
            background: theme.colors.white,
            "&:checked": {
              background: theme.colors.ff_blue[4],
            },
          },
  }
}

export function Checkbox(props) {
  const { label, pref, onChange } = props
  return (
    <div className="rootCheckbox">
      <MantineCheckbox
        label={label}
        checked={pref}
        onChange={onChange}
        styles={(theme) => style(theme)}
      />
    </div>
  )
}
Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  pref: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}
export function CheckboxWithNumber(props) {
  const {
    label1,
    label2,
    boxPref,
    numberPref,
    onBoxChange,
    onNumberChange,
    minNumber,
    maxNumber,
  } = props
  return (
    <div className="rootCheckboxWithNumber">
      <MantineCheckbox
        label={
          <span className="labeldiv">
            <span className="spanclass">{label1}</span>
            <NumberInput
              value={numberPref}
              disabled={!boxPref}
              size="xs"
              onChange={onNumberChange}
              min={minNumber}
              max={maxNumber}
            />
            <span className="spanclass">{label2}</span>
          </span>
        }
        styles={(theme) => style(theme)}
        color="gray[8]"
        checked={boxPref}
        onChange={onBoxChange}
      />
    </div>
  )
}
CheckboxWithNumber.propTypes = {
  label1: PropTypes.string.isRequired,
  label2: PropTypes.string.isRequired,
  boxPref: PropTypes.bool.isRequired,
  numberPref: PropTypes.number.isRequired,
  minNumber: PropTypes.number,
  maxNumber: PropTypes.number,
  onBoxChange: PropTypes.func.isRequired,
  onNumberChange: PropTypes.func.isRequired,
}
CheckboxWithNumber.defaultProps = {
  minNumber: 0,
  maxNumber: 100,
}
