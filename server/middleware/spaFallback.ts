import { defineEventHandler, getRequestURL, setResponseStatus, createError } from 'h3';

// This middleware handles SPA fallback for client-side routing
// It will route all page requests to the index.html file for the SPA router to handle

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  
  // If it's an API route or a static asset, don't interfere
  if (
    url.pathname.startsWith('/api/') || 
    url.pathname.startsWith('/_nuxt/') ||
    url.pathname.includes('.')
  ) {
    return;
  }

  // For all page routes, serve the SPA without redirecting
  try {
    // Important: We serve the index.html content but keep the original URL
    // This allows client-side routing to properly handle the route on reload
    event.context._nitro = event.context._nitro || {};
    event.context._nitro.rendererContext = {
      spa: true,           // Mark as SPA route
      internalRender: false // Don't use server-side rendering
    };
    
    // Preserve the original URL in the context for history API
    event.context.spa = {
      originalPath: url.pathname
    };
    
    setResponseStatus(event, 200);
    return;
  } catch (error) {
    return createError({ 
      statusCode: 500, 
      statusMessage: 'Internal Server Error',
      message: 'Failed to handle SPA route'
    });
  }
});
