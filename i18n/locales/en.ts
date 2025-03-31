export default {
  appName: "ZOLARA",
  welcome: "Welcome to Zolara",
  subtitle: "Real Estate CRM Platform",
  languages: {
    english: "English",
    spanish: "Spanish",
    changeLanguage: "Change language"
  },
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
    integrations: "Integrations",
    settings: "Settings"
  },
  version: {
    app: "App Version",
    api: "API Version"
  },
  integrations: {
    title: "Integrations",
    description: "Connect your channels to centralize communications",
    available: "Available Integrations",
    connected: "Connected Accounts",
    manage: "Manage",
    add: "Add New",
    comingSoon: "More integrations coming soon",
    backToIntegrations: "Back to Integrations",
    actions: "Actions",
    whatsapp: {
      deactivateAccount: "Deactivate Account",
      deactivateAccountConfirmation: "Are you sure you want to deactivate the account {name}?",
      deactivateAccountFail: "Failed to deactivate account",
      title: "WhatsApp Business",
      business: "Business Account",
      description: "Connect your WhatsApp Business account to send and receive messages",
      connect: "Connect WhatsApp",
      connecting: "Connecting to WhatsApp...",
      connected: "WhatsApp Connected",
      disconnected: "WhatsApp Disconnected",
      accounts: "WhatsApp Accounts",
      noAccounts: "No WhatsApp accounts connected",
      errorAccounts: "Error loading WhatsApp accounts",
      addAccount: "Add WhatsApp Account",
      addAccountDescription: "Connect your WhatsApp Business account to start sending and receiving messages",
      activeAccounts: "Active Accounts",
      inactiveAccounts: "Inactive Accounts",
      inactive: "Inactive",
      backToAccounts: "Back to Accounts",
      accountDetails: "Account Details",
      editAccount: "Edit Account",
      connectionStatus: "Connection Status",
      lastVerification: "Last Verified",
      waitingForVerification: "Waiting for verification",
      connectionError: "Connection Error",
      verificationRequired: "Verification Required",
      successfulConnection: "Successful Connection",
      verify: "Verify",
      verifyConnection: "Verify Connection",
      verifyConnectionConfirmation: "Are you sure you want to verify this connection?",
      verifyNow: "Verify Now",
      retryConnection: "Retry Connection",
      connectionSuccessMessage: "Your WhatsApp account is successfully connected and ready to use.",
      needsVerificationMessage: "Your WhatsApp account is connected but requires verification to ensure it's working properly.",
      connectionErrorMessage: "There was a problem with your WhatsApp connection. Please check your credentials and try again.",
      confirmDeactivate: "Are you sure you want to deactivate this account?",
      confirmDelete: "Are you sure you want to delete this account?",
      form: {
        id: "Account ID",
        name: "Account Name",
        namePlaceholder: "Enter a name for this WhatsApp account",
        phoneNumber: "Phone Number",
        phone: "Phone Number",
        createdAt: "Created",
        lastConnection: "Last Connection",
        phonePlaceholder: "+1 (123) 456-7890",
        phoneHelp: "The phone number associated with your WhatsApp Business account",
        phoneNumberId: "Phone Number ID",
        phoneNumberIdPlaceholder: "Enter your WhatsApp Phone Number ID",
        phoneNumberIdHelp: "The Phone Number ID from the Meta Developer Portal",
        businessAccountId: "Business Account ID",
        businessAccountIdPlaceholder: "Enter your WhatsApp Business Account ID",
        businessAccountIdHelp: "The Business Account ID from the Meta Developer Portal",
        accessToken: "Access Token",
        accessTokenPlaceholder: "Enter your permanent access token",
        accessTokenHelp: "The permanent access token generated from the Meta Developer Portal",
        webhookSecret: "Webhook Secret (Optional)",
        webhookSecretPlaceholder: "Enter your webhook verification token",
        webhookSecretHelp: "The verification token used to validate webhook requests",
        businessName: "Business Name (Optional)",
        businessNamePlaceholder: "Enter your business name",
        connect: "Connect & Verify",
        update: "Update Account",
        deactivate: "Deactivate Account",
        reactivate: "Reactivate Account",
        delete: "Delete Account",
        verify: "Verify Connection"
      },
      activate: "Activate",
      deactivate: "Deactivate",
      retry: "Retry",
      connectionActive: "Connection Active",
      connectionActiveDescription: "Your WhatsApp account is connected and ready to use",
      unknownError: "Unknown error occurred with WhatsApp connection",
      status: {
        PENDING: "Pending",
        CONNECTED: "Connected",
        ERROR: "Connection Error",
        DISCONNECTED: "Disconnected",
        connected: "Connected",
        pending: "Pending",
        error: "Connection Error",
        disconnected: "Disconnected",
        unknown: "Unknown Status"
      },
      alerts: {
        connectionVerified: "WhatsApp connection verified successfully",
        connectionFailed: "Failed to verify WhatsApp connection",
        accountCreated: "WhatsApp account created successfully",
        accountUpdated: "WhatsApp account updated successfully",
        accountDeactivated: "WhatsApp account deactivated",
        accountReactivated: "WhatsApp account reactivated",
        accountDeleted: "WhatsApp account deleted successfully",
        invalidCredentials: "Invalid credentials. Please check your details.",
        fetchError: "Failed to fetch WhatsApp accounts",
        fetchAccountError: "Failed to fetch WhatsApp account details",
        updateFailed: "Failed to update WhatsApp account",
        activationFailed: "Failed to activate WhatsApp account",
        deactivationFailed: "Failed to deactivate WhatsApp account",
        deleteFailed: "Failed to delete WhatsApp account"
      },
      errors: {
        nameRequired: "Account name is required",
        phoneRequired: "Phone number is required",
        phoneNumberIdRequired: "Phone Number ID is required",
        businessAccountIdRequired: "Business Account ID is required",
        accessTokenRequired: "Access Token is required",
        invalidPhoneNumber: "Please enter a valid phone number",
        invalidToken: "Invalid access token format",
        connectionFailed: "Connection failed. Please check your credentials."
      },
      helpText: "Where can I find this information?",
      templates: {
        select: "Select Template",
        noTemplates: "No templates available",
        loading: "Loading templates...",
        sendTemplate: "Send Template",
        customizeMessage: "Customize Message"
      },
      conversation: {
        archiveConversation: "Archive Conversation",
        blockConversation: "Block Conversation",
        refreshConversation: "Refresh Conversation"
      },
      attachment: {
        image: "Image",
        document: "Document",
        audio: "Audio",
        video: "Video"
      },
      quickActions: {
        location: "Send Location"
      },
      inbox: {
        title: "WhatsApp Inbox",
        noConversations: "No conversations",
        searchPlaceholder: "Search conversations...",
        allConversations: "All Conversations",
        unreadOnly: "Unread Only",
        selectAccount: "Select account",
        noAccountSelected: "No account selected",
        noAccountMessage: "Please select a WhatsApp account to view conversations",
        errorLoading: "Error loading conversations",
        retry: "Retry",
        emptyState: "No conversations found",
        emptyStateDescription: "When you receive WhatsApp messages, they will appear here"
      }
    },
    verify: "Verify",
    verifyConnection: "Verify Connection",
    verifyConnectionConfirmation: "Are you sure you want to verify this connection?",
    activateAccount: "Activate Account",
    activateAccountConfirmation: "Are you sure you want to activate the account {name}?",
    deactivateAccount: "Deactivate Account",
    deactivateAccountConfirmation: "Are you sure you want to deactivate the account {name}?",
    deleteAccount: "Delete Account",
    deleteAccountConfirmation: "Are you sure you want to delete the account {name}? This action cannot be undone.",
    activate: "Activate",
    pendingAccounts: "Pending Accounts",
    errorAccounts: "Error Accounts",
    inactiveAccounts: "Inactive Accounts"
  },
  user: {
    signOut: "Sign out",
    account: "My Account",
    profile: "Profile",
    guest: "Guest"
  },

  notifications: {
    title: "Notifications",
    markAllAsRead: "Mark all as read",
    empty: "No notifications",
    viewAll: "View all notifications"
  },
  inbox: {
    title: "Inbox",
    unified: "Unified Inbox",
    compose: "Compose Message",
    search: "Search conversations...",
    noMessages: "No messages found",
    conversations: "Conversations",
    newMessage: "New Message",
    newMessageTitle: "New Conversation",
    newMessageDescription: "Start a new conversation with a contact",
    searchPlaceholder: "Search conversations...",
    noConversations: "No conversations",
    noSearchResults: "No conversations match your search",
    noUnreadMessages: "You have no unread messages",
    noMessagesInChannel: "No messages in this channel",
    startNewConversation: "Start a new conversation",
    noConversationSelected: "No conversation selected",
    selectConversation: "Select a conversation from the list",
    startConversation: "Send a message to start the conversation",
    conversation: "Conversation",
    yesterday: "Yesterday",
    you: "You",
    activeNow: "Active now",
    viewContact: "View Contact",
    typeMessage: "Type a message...",
    sendingVia: "Sending via",
    call: "Call",
    messageSent: "Message Sent",
    messageSentDescription: "Your message has been sent successfully",
    attachment: "Attachment",
    channels: {
      whatsapp: "WhatsApp",
      email: "Email",
      instagram: "Instagram"
    },
    filters: {
      all: "All",
      unread: "Unread",
      whatsapp: "WhatsApp",
      email: "Email",
      instagram: "Instagram"
    },
    dates: {
      today: "Today",
      yesterday: "Yesterday"
    },
    actions: {
      archive: "Archive",
      markUnread: "Mark as unread",
      block: "Block"
    },
    contact: {
      keyInfo: "Key Information",
      source: "Source",
      status: "Status",
      lastContact: "Last Contact",
      customFields: "Custom Fields",
      budget: "Budget",
      area: "Area of Interest",
      propertyType: "Property Type",
      noNotes: "No notes added yet",
      addNotePlaceholder: "Add a note about this contact...",
      addNote: "Add Note",
      complete: "Complete",
      noFollowUps: "No follow-ups scheduled",
      scheduleFollowUp: "Schedule Follow-up",
      newFollowUp: "New Follow-up",
      title: "Title",
      date: "Date",
      description: "Description",
      today: "Today",
      websiteLead: "Website Lead",
      activeLead: "Active Lead",
      oakDistrict: "Oak District",
      singleFamilyHome: "Single Family Home",
      tabs: {
        info: "Info",
        notes: "Notes",
        followUps: "Follow-ups"
      }
    },
    error: {
      fetchConversations: "Error fetching conversations",
      fetchConversation: "Error fetching conversation details",
      conversationNotFound: "Conversation not found",
      sendMessage: "Error sending message",
      markAsRead: "Error marking conversation as read",
      noActiveAccount: "No active account to send messages from"
    },
    success: {
      messageSent: "Message sent successfully"
    }
  },
  actions: {
    send: "Send",
    reply: "Reply",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    view: "View"
  },
  common: {
    or: "OR",
    add: "Add",
    close: "Close",
    all: "All",
    notSpecified: "Not specified",
    cancel: "Oops, nevermind",
    showPassword: "Show password",
    hidePassword: "Hide password",
    save: "Save and done",
    delete: "Delete",
    next: "Let's go to the next",
    edit: "Let's tweak it",
    success: "Awesome!",
    error: "Error",
    unauthorized: "Unauthorized",
    comingSoon: "Coming Soon",
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
    loading: "Loading..."
  },
  login: {
    title: "Login",
    signIn: "Sign In",
    forgotPassword: "Forgot your password?",
    continueWithGoogle: "Continue with Google",
    continueWithFacebook: "Continue with Facebook",
    loginWithGoogle: "Login with Google",
    loginWithFacebook: "Login with Facebook",
    facebookLoginComingSoon: "Facebook login functionality will be available soon",
    socialAuthInitiated: "Social authentication initiated",
    socialAuthError: "Social authentication failed. Please try again.",
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
      loginFailed: "Login failed. Please check your credentials.",
      emailAuthExists: "This account uses email authentication",
      useEmailToLogin: "Please login with your email and password instead of social login"
    }
  },
  registration: {
    title: "Registration",
    signUp: "Sign Up",
    haveAccount: "Already have an account?",
    createAccount: "Don't have an account?",
    successTitle: "✅ Registration successful",
    errorTitle: "❌ Registration failed",
    registrationSuccess: "Your account has been created successfully",
    registrationWithGoogle: "Registration with Google",
    registrationWithFacebook: "Registration with Facebook",
    formLabels: {
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm your password",
      passwordHint: "Password must be at least 8 characters"
    },
    formPlaceholders: {
      name: "Your full name",
      email: "email{at}example.com",
      password: "••••••••",
      confirmPassword: "••••••••"
    },
    validationMessages: {
      nameRequired: "We need your name!",
      emailRequired: "Don't forget your email!",
      incorrectEmailFormat: "Invalid email format",
      passwordMin: "Password must be at least 8 characters",
      passwordRequired: "We need your password!",
      passwordMatch: "Passwords must match",
      confirmPasswordRequired: "Confirm your password"
    },
    errors: {
      registrationFailed: "Registration failed",
      googleAuthExists: "This email is already registered with Google",
      useGoogleToLogin: "Please use Google login for this account",
      emailAuthExists: "This email is already registered",
      useEmailToLogin: "Please use your email and password to login"
    }
  },
  passwordChange: {
    title: "Change Password",
    request: "Request Password Change",
    goBackToLogin: "Go back to login",
    successTitle: "✅ Success",
    errorTitle: "❌ Error",
    successMessage: "We have sent you an email with instructions to change your password.",
    errorMessage: "Something went wrong, please try again",
    incorrectCurrentPassword: "Current password is incorrect",
    googleAuthError: "Cannot change password for accounts that use Google authentication exclusively",
    passwordTooShort: "New password must be at least 8 characters long",
    socialAccountError: "Password change is not available for social media accounts. Please use social login.",
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
    successTitle: "✅ Password Changed",
    errorTitle: "❌ Password Change Failed",
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
      missingToken: "Missing token",
      invalidResetCode: "The verification code is invalid. Please check and try again."
    }
  },
  activatePassword: {
    title: "Activate Password",
    submit: "Submit",
    successMessage: "Password activated successfully!",
    errorMessage: "Something went wrong, please try again",
    invalidCode: "The verification code is invalid. Please check and try again.",
    formLabels: {
      activationCode: "Activation Code"
    },
    validationMessages: {
      codeLength: "Activation code must be 6 digits",
      codeRequired: "We need your activation code!"
    },
    reset: "Reset",
    goToLogin: "Go to login"
  },
  passwordChangeSuccess: {
    title: "Password Changed",
    message: "Your password has been changed successfully!",
    backToLogin: "Back to login"
  },
  passwordResetRequestSuccess: {
    title: "Password Reset Request Sent",
    message: "If your email exists in our system, you will receive instructions to reset your password shortly.",
    backToLogin: "Back to login"
  },
  profile: {
    title: "Profile Settings",
    updatePhoto: "Update Photo",
    saveChanges: "Save Changes",
    basicInfo: "Basic Information",
    security: "Security Settings",
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
      lastChanged: "Last Changed",
      update: "Update Password",
      currentPlaceholder: "Enter your current password",
      newPlaceholder: "Enter your new password",
      guidanceIntro: "Your password should be strong and secure:",
      guidanceLength: "At least 8 characters long",
      guidanceMix: "Include both uppercase and lowercase letters, numbers, and special characters",
      guidanceUnique: "Different from previously used passwords",
      newHelp: "Create a strong, unique password",
      confirmHelp: "Type your new password again to confirm",
      strength: "Password Strength",
      strengthLabels: {
        weak: "Weak",
        fair: "Fair",
        good: "Good",
        strong: "Strong"
      }
    },
    accountStatus: {
      title: "Account Status",
      status: "Current Status",
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
      passwordUppercase: "Password must include at least one uppercase letter",
      passwordLowercase: "Password must include at least one lowercase letter",
      passwordNumber: "Password must include at least one number",
      passwordSpecial: "Password must include at least one special character",
      currentPasswordRequired: "Current password is required",
      newPasswordRequired: "New password is required",
      confirmPasswordRequired: "Password confirmation is required"
    },
    notifications: {
      updateSuccess: "Profile updated successfully",
      updateFailed: "Failed to update profile",
      photoUpdateSuccess: "Profile photo updated successfully",
      photoUpdateFailed: "Failed to update profile photo",
      passwordChangeSuccess: "Password changed successfully",
      passwordChangeFailed: "Failed to change password"
    },
    deleteAccount: {
      title: "Delete Account",
      warning: "This action cannot be undone",
      confirm: "Are you sure you want to delete your account?",
      button: "Delete Account"
    }
  }
} as const;
