import React from "react"
import "./style.css"
import { Tabs } from "@mantine/core"
import {
  Code as CustomBypassesIcon,
  Settings as OptionsIcon,
  ListCheck as ListCheckIcon,
} from "tabler-icons-react"
import OptionsTab from "./tabs/options"

function styles(theme) {
  return {
    tabsList: {
      padding: "1em",
    },
    tabsListWrapper:
      theme.colorScheme === "dark"
        ? { borderRight: `2px solid ${theme.colors.gray[8]}` }
        : { borderRight: `2px solid ${theme.colors.gray[3]}` },
  }
}

export default function Settings() {
  return (
    <Tabs
      color="indigo"
      orientation="vertical"
      size="m"
      className="tabs"
      variant="pills"
      grow
      styles={(theme) => styles(theme)}
    >
      <Tabs.Tab label="Options" icon={<OptionsIcon size={14} />}>
        <OptionsTab />
      </Tabs.Tab>

      <Tabs.Tab label="Whitelist Sites" icon={<ListCheckIcon size={14} />} />
      <Tabs.Tab
        label="Custom Bypasses"
        icon={<CustomBypassesIcon size={14} />}
      />
    </Tabs>
  )
}
