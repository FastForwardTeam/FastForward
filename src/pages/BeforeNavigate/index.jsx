import React from "react"
import { useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Anchor, Code, Text } from "@mantine/core"
import ProgressBar from "../../components/ProgressBar"

export default function BeforeNavigate() {
  const [searchParams] = useSearchParams()
  const prefs = useSelector((state) => state.prefs)
  const link = searchParams.get("link")
  const redirect = () => {
    window.location.href = link
  }

  if (prefs.openDest && prefs.openDestTime === 0) {
    redirect()
    return (
      <div>
        <Text>
          You are being redirected to
          <Code>{link}</Code>
        </Text>
      </div>
    )
  }

  if (prefs.openDest && prefs.openDestTime > 0) {
    return (
      <div>
        <Text>
          You are being redirected to
          <Anchor href={link}>
            <Code>{link}</Code>
          </Anchor>
        </Text>
        <ProgressBar duration={prefs.openDestTime} callback={redirect} />
      </div>
    )
  }

  if (!prefs.openDest) {
    return (
      <div>
        <Text>
          You are almost at your destination
          <Anchor href={link}>
            <Code>{link}</Code>
          </Anchor>
        </Text>
      </div>
    )
  }
}
