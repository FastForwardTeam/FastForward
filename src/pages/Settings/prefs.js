import { createSlice } from "@reduxjs/toolkit"
import { combineReducers } from "redux"

export const prefsSlice = createSlice({
  name: "prefs",
  initialState: {
    addonEnabled: true,
    openDest: false,
    openDestTime: 10,
    blockIpLog: false,
    enableCrowd: true,
    openCrowd: false,
    openCrowdTime: 10,
    getLatestCS: false,
  },
  reducers: {
    toggleAddonEnabled: (state) => {
      state.addonEnabled = !state.addonEnabled
    },
    toggleOpenDest: (state) => {
      state.openDest = !state.openDest
    },
    setOpenDestTime: (state, action) => {
      state.openDestTime = action.payload
    },
    toggleBlockIpLog: (state) => {
      state.blockIpLog = !state.blockIpLog
    },
    toggleEnableCrowd: (state) => {
      state.enableCrowd = !state.enableCrowd
    },
    toggleOpenCrowd: (state) => {
      state.openCrowd = !state.openCrowd
    },
    setOpenCrowdTime: (state, action) => {
      state.openCrowdTime = action.payload
    },
    toggleGetLatestCS: (state) => {
      state.getLatestCS = !state.getLatestCS
    },
    default: (state) => state,
  },
})

export const {
  toggleAddonEnabled,
  toggleOpenDest,
  setOpenDestTime,
  toggleBlockIpLog,
  toggleEnableCrowd,
  toggleOpenCrowd,
  setOpenCrowdTime,
  toggleGetLatestCS,
} = prefsSlice.actions

const reducer = combineReducers({
  prefs: prefsSlice.reducer,
})

export default reducer
