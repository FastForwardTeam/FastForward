import { React, useState } from "react"
import PropTypes from "prop-types"
import { MantineProvider, ColorSchemeProvider } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import colors from "./colours"

export default function ThemeProvider(props) {
  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState(preferredColorScheme)
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  const { children } = props
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          colors,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
