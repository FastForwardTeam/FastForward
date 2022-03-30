// mock store without persist, to be used for testing

import { configureStore } from "@reduxjs/toolkit"
import reducer from "../pages/Settings/prefs"

export default configureStore({
  reducer,
})
