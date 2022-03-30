const manifestUrl = process.env.MANIFEST_URL

export default async function fetchManifest() {
  const response = await fetch(manifestUrl)
  const manifest = await response.json()
  return manifest
}
