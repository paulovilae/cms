import canUseDOM from './canUseDOM'
import { SERVER_URL, getServerURL } from './serverConfig'

export const getServerSideURL = () => {
  return getServerURL()
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  // For server-side execution, use the same centralized config
  return getServerURL()
}
