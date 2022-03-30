import React from "react"
import "../style.css"
import { useSelector, useDispatch } from "react-redux"
import {
  toggleAddonEnabled,
  toggleOpenDest,
  setOpenDestTime,
  toggleBlockIpLog,
  toggleEnableCrowd,
  toggleOpenCrowd,
  setOpenCrowdTime,
} from "../prefs"
import { Checkbox, CheckboxWithNumber } from "../../../components/checkboxes"

export default function OptionsTab() {
  const dispatch = useDispatch()
  const prefs = useSelector((state) => state.prefs)
  return (
    <div>
      <Checkbox
        label="Enable website bypass"
        pref={prefs.addonEnabled}
        onChange={(e) => dispatch(toggleAddonEnabled(e.target.checked))}
      />
      <CheckboxWithNumber
        label1="Take me to destination in"
        label2="seconds"
        boxPref={prefs.openDest}
        numberPref={prefs.openDestTime}
        onBoxChange={(e) => {
          dispatch(toggleOpenDest(e.target.checked))
        }}
        onNumberChange={(e) => {
          dispatch(setOpenDestTime(e))
        }}
      />
      <Checkbox
        label="Block IP loggers which can't be bypassed"
        pref={useSelector((state) => state.prefs.blockIpLog)}
        onChange={(e) => dispatch(toggleBlockIpLog(e.target.checked))}
      />
      <Checkbox
        label="Enable crowdbypass"
        pref={useSelector((state) => state.prefs.enableCrowd)}
        onChange={(e) => dispatch(toggleEnableCrowd(e.target.checked))}
      />
      <CheckboxWithNumber
        label1="Take me to crowdbypass destinations in"
        label2="seconds"
        boxPref={prefs.openCrowd}
        numberPref={prefs.openCrowdTime}
        onBoxChange={(e) => {
          dispatch(toggleOpenCrowd(e.target.checked))
        }}
        onNumberChange={(e) => {
          dispatch(setOpenCrowdTime(e))
        }}
      />
    </div>
  )
}
