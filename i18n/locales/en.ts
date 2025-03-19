export default {
  appName: "KEYSTONE",
  welcome: "Welcome to Project Keystone",
  subtitle: "Real Estate CRM Platform",
  nav: {
    menu: "Menu",
    dashboard: "Dashboard",
    inbox: "Inbox",
    contacts: "Contacts",
    clients: "Clients",
    leads: "Leads",
    properties: "Properties",
    listings: "Listings",
    showings: "Showings",
    tools: "Tools",
    templates: "Templates",
    analytics: "Analytics",
    settings: "Settings"
  },
  version: "Version",
  user: {
    signOut: "Sign out",
    account: "My Account",
    profile: "Profile"
  },

  notifications: {
    title: "Notifications",
    markAllAsRead: "Mark all as read",
    empty: "No notifications",
    viewAll: "View all notifications"
  },
  inbox: {
    unified: "Unified Inbox",
    compose: "Compose Message",
    search: "Search conversations...",
    noMessages: "No messages found"
  },
  actions: {
    send: "Send",
    reply: "Reply",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel"
  },
  common: {
    or: "OR",
    add: "Add",
    all: "All",
    cancel: "Oops, nevermind",
    save: "Save and done",
    delete: "Delete",
    next: "Let's go to the next",
    edit: "Let's tweak it",
    success: "Awesome!",
    remove: "Remove",
    goodJob: "Nice work!",
    somethingWentWrong: "Oops, something went wrong",
    pleaseTryAgain: "Please try again please",
    careful: "Watch out!",
    search: "Find something cool",
    deselectAll: "Deselect all",
    pleaseCheckTheForm: "Check the form and fix those little things",
    yes: "Yes",
    no: "No",
    never: "Never",
    connected: "Connected",
    notConnected: "Not Connected",
    loading: "Loading...",
    error: "Error"
  },
  login: {
    title: "Login",
    signIn: "Sign In",
    forgotPassword: "Forgot your password?",
    continueWithGoogle: "Continue with Google",
    loginWithGoogle: "Login with Google",
    loginWithFacebook: "Login with Facebook",
    successTitle: "✅ Login successful",
    successMessage: "Welcome back!",
    errorTitle: "❌ Login failed",
    errorMessage: "Please check your credentials and try again",
    formLabels: {
      email: "Email",
      password: "Password"
    },
    validationMessages: {
      emailRequired: "Don't forget your email!",
      incorrectEmailFormat: "Invalid email format",
      passwordRequired: "We need your password!",
      loginFailed: "Login failed. Please check your credentials."
    }
  },
  registration: {
    title: "Registration",
    signUp: "Sign Up",
    haveAccount: "Already have an account?",
    createAccount: "Don't have an account?",
    registrationSuccess: "Your account has been created successfully",
    registrationWithGoogle: "Registration with Google",
    registrationWithFacebook: "Registration with Facebook",
    formLabels: {
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm your password"
    },
    validationMessages: {
      nameRequired: "We need your name!",
      emailRequired: "Don't forget your email!",
      incorrectEmailFormat: "Invalid email format",
      passwordMin: "Password must be at least 8 characters",
      passwordRequired: "We need your password!",
      passwordMatch: "Passwords must match",
      confirmPasswordRequired: "Confirm your password"
    }
  },
  passwordChange: {
    title: "Change Password",
    request: "Request Password Change",
    goBackToLogin: "Go back to login",
    successMessage: "We have sent you an email with instructions to change your password.",
    errorMessage: "Something went wrong, please try again",
    formLabels: {
      email: "Email"
    },
    validationMessages: {
      emailRequired: "Don't forget your email!",
      incorrectEmailFormat: "Invalid email format"
    }
  },
  changePassword: {
    title: "Change Password",
    submit: "Submit",
    successMessage: "Password changed successfully!",
    errorMessage: "Something went wrong, please try again",
    formLabels: {
      newPassword: "New Password",
      confirmPassword: "Confirm your new password"
    },
    validationMessages: {
      passwordMin: "Password must be at least 8 characters",
      passwordRequired: "We need your password!",
      passwordMatch: "Passwords must match",
      confirmPasswordRequired: "Confirm your password",
      missingToken: "Missing token"
    }
  },
  activatePassword: {
    title: "Activate Password",
    submit: "Submit",
    successMessage: "Password activated successfully!",
    errorMessage: "Something went wrong, please try again",
    formLabels: {
      activationCode: "Activation Code"
    },
    validationMessages: {
      codeLength: "Activation code must be 6 digits",
      codeRequired: "We need your activation code!"
    }
  },
  passwordChangeSuccess: {
    title: "Password Changed",
    message: "Your password has been changed successfully!",
    backToLogin: "Back to login"
  },
  passwordResetRequestSuccess: {
    title: "Password Reset Request Sent",
    message: "We have sent you an email with instructions to reset your password.",
    backToLogin: "Back to login"
  },
  profile: {
    title: "Profile Settings",
    updatePhoto: "Update Photo",
    saveChanges: "Save Changes",
    formLabels: {
      name: "Name",
      email: "Email"
    },
    placeholders: {
      name: "Enter your name",
      email: "Enter your email"
    },
    authentication: {
      title: "Authentication Status",
      emailVerified: "Email Verification",
      google: "Google Authentication",
      facebook: "Facebook Authentication"
    },
    password: {
      changePassword: "Change Password",
      current: "Current Password",
      new: "New Password",
      confirm: "Confirm New Password",
      lastChanged: "Last Changed"
    },
    accountStatus: {
      title: "Account Status",
      lastLogin: "Last Login",
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended"
    },
    validationMessages: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      incorrectEmailFormat: "Invalid email format",
      passwordMin: "Password must be at least 8 characters",
      passwordMatch: "Passwords must match",
      currentPasswordRequired: "Current password is required"
    },
    notifications: {
      updateSuccess: "Profile updated successfully",
      updateFailed: "Failed to update profile",
      photoUpdateSuccess: "Profile photo updated successfully",
      photoUpdateFailed: "Failed to update profile photo"
    },
    deleteAccount: {
      title: "Delete Account",
      warning: "This action cannot be undone",
      confirm: "Are you sure you want to delete your account?",
      button: "Delete Account"
    }
  }
} as const;
