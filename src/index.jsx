import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { Provider } from "react-redux"
import { HashRouter } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import ThemeProvider from "./helpers/theme"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { store, persistor } from "./app/store"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HashRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </HashRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
