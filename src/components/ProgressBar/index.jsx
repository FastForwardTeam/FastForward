import { Progress } from "@mantine/core"
import PropTypes from "prop-types"
import React from "react"

function style(theme) {
  return {
    bar:
      theme.colorScheme === "dark"
        ? {
            background: theme.fn.linearGradient(
              45,
              theme.colors.ff_purple[6],
              theme.colors.ff_blue[6],
              theme.colors.ff_aqua[6]
            ),
          }
        : {
            background: theme.colors.ff_blue[4],
          },
  }
}

export default function ProgressBar(props) {
  const { duration, callback } = props
  const incrementVal = 10 / duration
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(() => {
        if (progress >= 100) {
          clearInterval(timer)
          callback()
          return 100
        }
        return progress + incrementVal
      })
    }, 100)
    return () => clearInterval(timer)
  })
  return <Progress value={progress} styles={(theme) => style(theme)} />
}
ProgressBar.propTypes = {
  duration: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
}
