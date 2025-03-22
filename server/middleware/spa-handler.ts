import { eventHandler, getRequestURL } from 'h3'

// This middleware ensures that all routes are handled by the SPA
// It serves the index.html file for all routes except assets
export default eventHandler((event) => {
  const url = getRequestURL(event)
  
  // Skip handling for API requests and assets
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_nuxt/') ||
    url.pathname.includes('.') ||
    url.pathname === '/'
  ) {
    return
  }
  
  // For all other routes, set a flag for Nitro to serve index.html
  // This allows Vue Router to handle the route client-side
  event.context._nitro = event.context._nitro || {}
  event.context._nitro.rendererContext = {
    spa: true,
    internalRender: false,
  }
  
  return
})
