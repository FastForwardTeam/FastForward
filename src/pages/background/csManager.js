import { useSelector, useDispatch } from "react-redux"
import fetchManifest from "../../helpers/network"
import { toggleGetLatestCS } from "../prefs"

function isVersionBelowMin(version, minVersion) {
  const splitVerArray = version.split(".")
  const splitMinVerArray = minVersion.split(".")
  for (let i = 0; i < 2; i += 1) {
    const ver = parseInt(splitVerArray[i], 10)
    const minVer = parseInt(splitMinVerArray[i], 10)
    if (ver < minVer) {
      return false
    }
    if (ver > minVer) {
      return true
    }
  }
  return false
}

/* manifest blue print 
{
    cs_version: '1.0.0',
    min_ext_version: '2.0.0',
    cs_url: 'https://example.com/cs.js',
    cs_integrity: 'sha256-...',

}
*/

export default function getCS() {
  // If getLatestCS is disabled, return cs from internal page
  const prefs = useSelector((state) => state.prefs)
  if (!prefs.getLatestCS) {
    fetch(Browser.runtime.getURL("/cs.js"))
      .then((response) => response.text())
      .then((cs) => cs)
  } else {
    return getLatestCSasync()
  }
}

async function getLatestCSasync() {
  const manifest = await fetchManifest()
  const csUrl = manifest.cs_url
  const csIntegrity = manifest.cs_integrity
  const csVersion = manifest.cs_version
  const minExtVersion = manifest.min_ext_version
  const extVersion = Browser.runtime.getManifest().version
  if (isVersionBelowMin(extVersion, minExtVersion)) {
    return
  }
  const response = await fetch(csUrl)
  const cs = await response.text()

  // Check integrity
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(cs)
  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  if (hashHex !== csIntegrity) {
    throw new Error("Integrity check failed")
  }
}
