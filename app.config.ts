export default defineAppConfig({
    ui: {
      // Set primary color aliases based on our UI Kit
      colors: {
        primary: 'primary',
        secondary: 'secondary',
        success: 'success',
        warning: 'warning',
        error: 'error',
        info: 'info',
        neutral: 'neutral'
      },
      
      // Configure specific component themes
      
      // Buttons - from UI Kit guidelines
      button: {
        default: {
          size: 'xl',
          color: 'primary',
          variant: 'solid'
        },
        variants: {
          size: {
            sm: {
              base: 'text-xs px-2.5 py-1.5'
            },
            md: {
              base: 'text-sm px-4 py-2'
            },
            lg: {
              base: 'text-base px-5 py-2.5'
            }
          }
        }
      },
      
      // Card component
      card: {
        base: 'overflow-hidden',
        body: {
          padding: 'px-4 py-4 sm:p-5'
        },
        header: {
          padding: 'px-4 py-4 sm:px-5'
        },
        footer: {
          padding: 'px-4 py-4 sm:px-5'
        }
      },
      
      // Form inputs
      input: {
        default: {
          size: 'xl',
          color: 'neutral',
        },
        slots: {
          root: 'relative inline-flex items-center w-full'
        }
      },
      
      // Form select
      select: {
        default: {
          size: 'md',
          color: 'neutral'
        }
      },
      
      // Avatar component
      avatar: {
        default: {
          size: 'md'
        }
      },
      
      // Badge component
      badge: {
        default: {
          size: 'md',
          color: 'neutral',
          variant: 'subtle'
        }
      },
      
      // Notifications
      notification: {
        default: {
          color: 'primary'
        }
      }
    }
  })