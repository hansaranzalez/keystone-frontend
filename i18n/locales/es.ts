export default {
  appName: "ZOLARA",
  welcome: "Bienvenido a Zolara",
  subtitle: "Plataforma CRM para Bienes Raíces",
  languages: {
    english: "Inglés",
    spanish: "Español",
    changeLanguage: "Cambiar idioma"
  },
  nav: {
    menu: "Menú",
    dashboard: "Panel de Control",
    inbox: "Bandeja de Entrada",
    contacts: "Contactos",
    clients: "Clientes",
    leads: "Prospectos",
    properties: "Propiedades",
    listings: "Listados",
    showings: "Visitas",
    tools: "Herramientas",
    templates: "Plantillas",
    analytics: "Análisis",
    integrations: "Integraciones",
    settings: "Configuración"
  },
  version: {
    app: "Versión App",
    api: "Versión API"
  },
  integrations: {
    title: "Integraciones",
    description: "Conecta tus canales para centralizar comunicaciones",
    available: "Integraciones Disponibles",
    connected: "Cuentas Conectadas",
    manage: "Gestionar",
    add: "Agregar Nuevo",
    comingSoon: "Próximamente más integraciones",
    backToIntegrations: "Volver a Integraciones",
    whatsapp: {
      title: "WhatsApp Business",
      description: "Conecta tu cuenta de WhatsApp Business para enviar y recibir mensajes",
      connect: "Conectar WhatsApp",
      connecting: "Conectando a WhatsApp...",
      connected: "WhatsApp Conectado",
      disconnected: "WhatsApp Desconectado",
      accounts: "Cuentas de WhatsApp",
      noAccounts: "No hay cuentas de WhatsApp conectadas",
      addAccount: "Agregar Cuenta de WhatsApp",
      addAccountDescription: "Conecta tu cuenta de WhatsApp Business para comenzar a enviar y recibir mensajes",
      activeAccounts: "Cuentas Activas",
      inactiveAccounts: "Cuentas Inactivas",
      inactive: "Inactivo",
      backToAccounts: "Volver a Cuentas",
      form: {
        name: "Nombre de la Cuenta",
        namePlaceholder: "Ingresa un nombre para esta cuenta de WhatsApp",
        phoneNumber: "Número de Teléfono",
        phonePlaceholder: "+1 (123) 456-7890",
        phoneHelp: "El número de teléfono asociado con tu cuenta de WhatsApp Business",
        phoneNumberId: "ID de Número de Teléfono",
        phoneNumberIdPlaceholder: "Ingresa tu ID de Número de Teléfono de WhatsApp",
        phoneNumberIdHelp: "El ID de Número de Teléfono del Portal de Desarrolladores de Meta",
        businessAccountId: "ID de Cuenta de Negocio",
        businessAccountIdPlaceholder: "Ingresa tu ID de Cuenta de Negocio de WhatsApp",
        businessAccountIdHelp: "El ID de Cuenta de Negocio del Portal de Desarrolladores de Meta",
        accessToken: "Token de Acceso",
        accessTokenPlaceholder: "Ingresa tu token de acceso permanente",
        accessTokenHelp: "El token de acceso permanente generado desde el Portal de Desarrolladores de Meta",
        webhookSecret: "Secreto de Webhook (Opcional)",
        webhookSecretPlaceholder: "Ingresa tu token de verificación de webhook",
        webhookSecretHelp: "El token de verificación utilizado para validar solicitudes de webhook",
        businessName: "Nombre del Negocio (Opcional)",
        businessNamePlaceholder: "Ingresa el nombre de tu negocio",
        connect: "Conectar y Verificar",
        update: "Actualizar Cuenta",
        deactivate: "Desactivar Cuenta",
        reactivate: "Reactivar Cuenta",
        delete: "Eliminar Cuenta",
        verify: "Verificar Conexión"
      },
      status: {
        PENDING: "Pendiente",
        CONNECTED: "Conectado",
        ERROR: "Error de Conexión",
        DISCONNECTED: "Desconectado"
      },
      alerts: {
        connectionVerified: "Conexión de WhatsApp verificada exitosamente",
        connectionFailed: "No se pudo verificar la conexión de WhatsApp",
        accountCreated: "Cuenta de WhatsApp creada exitosamente",
        accountUpdated: "Cuenta de WhatsApp actualizada exitosamente",
        accountDeactivated: "Cuenta de WhatsApp desactivada",
        accountReactivated: "Cuenta de WhatsApp reactivada",
        invalidCredentials: "Credenciales inválidas. Por favor verifica tus datos."
      },
      errors: {
        nameRequired: "El nombre de la cuenta es requerido",
        phoneRequired: "El número de teléfono es requerido",
        phoneNumberIdRequired: "El ID del número de teléfono es requerido",
        businessAccountIdRequired: "El ID de la cuenta de negocio es requerido",
        accessTokenRequired: "El token de acceso es requerido",
        invalidPhoneNumber: "Por favor ingresa un número de teléfono válido",
        invalidToken: "Formato de token de acceso inválido",
        connectionFailed: "La conexión falló. Por favor verifica tus credenciales."
      },
      helpText: "¿Dónde puedo encontrar esta información?"
    }
  },
  user: {
    signOut: "Cerrar sesión",
    account: "Mi Cuenta",
    profile: "Perfil",
    guest: "Invitado"
  },
  notifications: {
    title: "Notificaciones",
    markAllAsRead: "Marcar todo como leído",
    empty: "No hay notificaciones",
    viewAll: "Ver todas las notificaciones"
  },
  inbox: {
    title: "Bandeja de Entrada",
    unified: "Bandeja Unificada",
    compose: "Redactar Mensaje",
    search: "Buscar conversaciones...",
    noMessages: "No se encontraron mensajes",
    conversations: "Conversaciones",
    newMessage: "Nuevo Mensaje",
    newMessageTitle: "Nueva Conversación",
    newMessageDescription: "Iniciar una nueva conversación con un contacto",
    searchPlaceholder: "Buscar conversaciones...",
    noConversations: "No hay conversaciones",
    noSearchResults: "Ninguna conversación coincide con tu búsqueda",
    noUnreadMessages: "No tienes mensajes sin leer",
    noMessagesInChannel: "No hay mensajes en este canal",
    startNewConversation: "Iniciar una nueva conversación",
    noConversationSelected: "Ninguna conversación seleccionada",
    selectConversation: "Selecciona una conversación de la lista",
    startConversation: "Envía un mensaje para iniciar la conversación",
    conversation: "Conversación",
    yesterday: "Ayer",
    you: "Tú",
    activeNow: "Activo ahora",
    typeMessage: "Escribe un mensaje...",
    sendingVia: "Enviando por",
    call: "Llamar",
    viewContact: "Ver Contacto",
    messageSent: "Mensaje Enviado",
    messageSentDescription: "Tu mensaje ha sido enviado con éxito",
    channels: {
      whatsapp: "WhatsApp",
      email: "Correo Electrónico",
      instagram: "Instagram"
    },
    filters: {
      all: "Todos",
      unread: "No leídos",
      whatsapp: "WhatsApp",
      email: "Correo Electrónico",
      instagram: "Instagram"
    },
    dates: {
      today: "Hoy",
      yesterday: "Ayer"
    },
    actions: {
      archive: "Archivar",
      markUnread: "Marcar como no leído",
      block: "Bloquear"
    },
    contact: {
      keyInfo: "Información Clave",
      source: "Fuente",
      status: "Estado",
      lastContact: "Último Contacto",
      customFields: "Campos Personalizados",
      budget: "Presupuesto",
      area: "Área de Interés",
      propertyType: "Tipo de Propiedad",
      noNotes: "Aún no hay notas añadidas",
      addNotePlaceholder: "Añadir una nota sobre este contacto...",
      addNote: "Añadir Nota",
      complete: "Completado",
      noFollowUps: "No hay seguimientos programados",
      scheduleFollowUp: "Programar Seguimiento",
      newFollowUp: "Nuevo Seguimiento",
      title: "Título",
      date: "Fecha",
      description: "Descripción",
      today: "Hoy",
      websiteLead: "Lead del Sitio Web",
      activeLead: "Lead Activo",
      oakDistrict: "Distrito Roble",
      singleFamilyHome: "Casa Unifamiliar",
      tabs: {
        info: "Info",
        notes: "Notas",
        followUps: "Seguimientos"
      }
    },
    error: {
      fetchConversations: "Error al obtener conversaciones",
      fetchConversation: "Error al obtener detalles de la conversación",
      conversationNotFound: "Conversación no encontrada",
      sendMessage: "Error al enviar el mensaje",
      markAsRead: "Error al marcar la conversación como leída"
    },
    success: {
      messageSent: "Mensaje enviado con éxito"
    }
  },
  common: {
    or: "O",
    add: "Agregar",
    all: "Todos",
    cancel: "Oops, olvídalo",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    save: "Guardar y listo",
    delete: "Eliminar",
    next: "Vamos al siguiente",
    edit: "Vamos a ajustarlo",
    success: "¡Genial!",
    remove: "Remover",
    goodJob: "¡Buen trabajo!",
    somethingWentWrong: "Oops, algo salió mal",
    pleaseTryAgain: "Por favor, inténtalo de nuevo",
    careful: "¡Cuidado!",
    search: "Encuentra algo interesante",
    deselectAll: "Deseleccionar todo",
    pleaseCheckTheForm: "Revisa el formulario y corrige esos pequeños detalles",
    yes: "Sí",
    no: "No",
    never: "Nunca",
    connected: "Conectado",
    notConnected: "No conectado",
    loading: "Cargando...",
    error: "Error",
    comingSoon: "Próximamente",
  },
  login: {
    title: "Iniciar sesión",
    signIn: "Iniciar sesión",
    forgotPassword: "¿Olvidaste tu contraseña?",
    continueWithGoogle: "Continuar con Google",
    continueWithFacebook: "Continuar con Facebook",
    loginWithGoogle: "Iniciar sesión con Google",
    loginWithFacebook: "Iniciar sesión con Facebook",
    facebookLoginComingSoon: "La funcionalidad de inicio de sesión con Facebook estará disponible pronto",
    socialAuthInitiated: "Autenticación social iniciada",
    socialAuthError: "Error en la autenticación social. Por favor, inténtalo de nuevo.",
    successTitle: "✅ Inicio de sesión exitoso",
    successMessage: "¡Bienvenido de nuevo!",
    errorTitle: "❌ Error al iniciar sesión",
    errorMessage: "Por favor verifica tus credenciales e intenta de nuevo",
    formLabels: {
      email: "Correo electrónico",
      password: "Contraseña",
    },
    validationMessages: {
      emailRequired: "¡No olvides tu correo electrónico!",
      incorrectEmailFormat: "Formato de correo inválido",
      passwordRequired: "¡Necesitamos tu contraseña!",
      loginFailed: "Error al iniciar sesión. Por favor verifica tus credenciales.",
      emailAuthExists: "Esta cuenta usa autenticación por correo",
      useEmailToLogin: "Por favor, inicia sesión con tu correo y contraseña en lugar de inicio de sesión social"
    },
  },
  registration: {
    title: "Registro",
    signUp: "Registrarse",
    haveAccount: "¿Ya tienes una cuenta?",
    createAccount: "¿No tienes una cuenta?",
    successTitle: "✅ Registro exitoso",
    errorTitle: "❌ Registro fallido",
    registrationSuccess: "Tu cuenta ha sido creada exitosamente",
    registrationWithGoogle: "Registro con Google",
    registrationWithFacebook: "Registro con Facebook",
    formLabels: {
      name: "Nombre",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirma tu contraseña",
      passwordHint: "La contraseña debe tener al menos 8 caracteres",
    },
    formPlaceholders: {
      name: "Tu nombre completo",
      email: "correo{at}ejemplo.com",
      password: "••••••••",
      confirmPassword: "••••••••"
    },
    validationMessages: {
      nameRequired: "¡Necesitamos tu nombre!",
      emailRequired: "¡No olvides tu correo electrónico!",
      incorrectEmailFormat: "Formato de correo inválido",
      passwordMin: "La contraseña debe tener al menos 8 caracteres",
      passwordRequired: "¡Necesitamos tu contraseña!",
      passwordMatch: "Las contraseñas deben coincidir",
      confirmPasswordRequired: "Confirma tu contraseña",
    },
    errors: {
      registrationFailed: "El registro falló",
      googleAuthExists: "Este correo ya está registrado con Google",
      useGoogleToLogin: "Por favor, usa el inicio de sesión con Google para esta cuenta",
      emailAuthExists: "Este correo electrónico ya está registrado",
      useEmailToLogin: "Por favor, usa tu correo y contraseña para iniciar sesión"
    },
  },
  passwordChange: {
    title: "Cambiar contraseña",
    request: "Solicitar cambio de contraseña",
    goBackToLogin: "Volver a iniciar sesión",
    successTitle: "✅ Éxito",
    errorTitle: "❌ Error",
    successMessage: "Te hemos enviado un correo electrónico con instrucciones para cambiar tu contraseña.",
    errorMessage: "Algo salió mal, por favor intenta de nuevo",
    incorrectCurrentPassword: "La contraseña actual es incorrecta",
    googleAuthError: "No se puede cambiar la contraseña para cuentas que usan exclusivamente la autenticación de Google",
    passwordTooShort: "La nueva contraseña debe tener al menos 8 caracteres",
    socialAccountError: "El cambio de contraseña no está disponible para cuentas de redes sociales. Por favor utiliza el inicio de sesión social.",
    formLabels: {
      email: "Correo electrónico",
    },
    validationMessages: {
      emailRequired: "¡No olvides tu correo electrónico!",
      incorrectEmailFormat: "Formato de correo inválido",
    },
  },
  changePassword: {
    title: "Cambiar Contraseña",
    submit: "Enviar",
    successTitle: "✅ Contraseña Cambiada",
    errorTitle: "❌ Error al Cambiar Contraseña",
    successMessage: "¡Contraseña cambiada exitosamente!",
    errorMessage: "Algo salió mal, por favor intenta de nuevo",
    formLabels: {
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirma tu nueva contraseña"
    },
    validationMessages: {
      passwordMin: "La contraseña debe tener al menos 8 caracteres",
      passwordRequired: "¡Necesitamos tu contraseña!",
      passwordMatch: "Las contraseñas deben coincidir",
      confirmPasswordRequired: "Confirma tu contraseña",
      missingToken: "Token faltante",
      invalidResetCode: "El código de verificación no es válido. Por favor verifica e intenta de nuevo."
    }
  },
  activatePassword: {
    title: "Activar Contraseña",
    submit: "Enviar",
    successMessage: "¡Contraseña activada exitosamente!",
    errorMessage: "Algo salió mal, por favor intenta de nuevo",
    invalidCode: "El código de verificación no es válido. Por favor verifica e intenta de nuevo.",
    formLabels: {
      activationCode: "Código de Activación"
    },
    validationMessages: {
      codeLength: "El código de activación debe tener 6 dígitos",
      codeRequired: "¡Necesitamos tu código de activación!"
    },
    reset: "Restablecer",
    goToLogin: "Ir al inicio de sesión"
  },
  passwordChangeSuccess: {
    title: "Contraseña Cambiada",
    message: "¡Tu contraseña ha sido cambiada exitosamente!",
    backToLogin: "Volver a iniciar sesión"
  },
  passwordResetRequestSuccess: {
    title: "Solicitud de Restablecimiento de Contraseña Enviada",
    message: "Si tu correo electrónico existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña en breve.",
    backToLogin: "Volver a iniciar sesión"
  },
  profile: {
    title: "Configuración de Perfil",
    updatePhoto: "Actualizar Foto",
    saveChanges: "Guardar Cambios",
    basicInfo: "Información Básica",
    security: "Configuración de Seguridad",
    formLabels: {
      name: "Nombre",
      email: "Correo electrónico"
    },
    placeholders: {
      name: "Ingresa tu nombre",
      email: "Ingresa tu correo electrónico"
    },
    authentication: {
      title: "Estado de Autenticación",
      emailVerified: "Verificación de Correo",
      google: "Autenticación de Google",
      facebook: "Autenticación de Facebook"
    },
    password: {
      changePassword: "Cambiar Contraseña",
      current: "Contraseña Actual",
      new: "Nueva Contraseña",
      confirm: "Confirmar Nueva Contraseña",
      lastChanged: "Último Cambio",
      update: "Actualizar Contraseña",
      currentPlaceholder: "Ingresa tu contraseña actual",
      newPlaceholder: "Ingresa tu nueva contraseña",
      guidanceIntro: "Tu contraseña debe ser fuerte y segura:",
      guidanceLength: "Al menos 8 caracteres",
      guidanceMix: "Incluir letras mayúsculas y minúsculas, números y caracteres especiales",
      guidanceUnique: "Diferente de contraseñas utilizadas anteriormente",
      newHelp: "Crea una contraseña fuerte y única",
      confirmHelp: "Escribe tu nueva contraseña nuevamente para confirmar",
      strength: "Fortaleza de Contraseña",
      strengthLabels: {
        weak: "Débil",
        fair: "Aceptable",
        good: "Buena",
        strong: "Fuerte"
      }
    },
    accountStatus: {
      title: "Estado de la Cuenta",
      status: "Estado Actual",
      lastLogin: "Último Inicio de Sesión",
      active: "Activa",
      inactive: "Inactiva",
      suspended: "Suspendida"
    },
    validationMessages: {
      nameRequired: "El nombre es requerido",
      emailRequired: "El correo electrónico es requerido",
      incorrectEmailFormat: "Formato de correo inválido",
      passwordMin: "La contraseña debe tener al menos 8 caracteres",
      passwordMatch: "Las contraseñas deben coincidir",
      passwordUppercase: "La contraseña debe incluir al menos una letra mayúscula",
      passwordLowercase: "La contraseña debe incluir al menos una letra minúscula",
      passwordNumber: "La contraseña debe incluir al menos un número",
      passwordSpecial: "La contraseña debe incluir al menos un caracter especial",
      currentPasswordRequired: "La contraseña actual es requerida",
      newPasswordRequired: "La nueva contraseña es requerida",
      confirmPasswordRequired: "La confirmación de contraseña es requerida"
    },
    notifications: {
      updateSuccess: "Perfil actualizado exitosamente",
      updateFailed: "Error al actualizar el perfil",
      photoUpdateSuccess: "Foto de perfil actualizada exitosamente",
      photoUpdateFailed: "Error al actualizar la foto de perfil",
      passwordChangeSuccess: "Contraseña cambiada exitosamente",
      passwordChangeFailed: "Error al cambiar la contraseña"
    },
    deleteAccount: {
      title: "Eliminar Cuenta",
      warning: "Esta acción no se puede deshacer",
      confirm: "¿Estás seguro de que quieres eliminar tu cuenta?",
      button: "Eliminar Cuenta"
    },
    photoUploadComingSoon: "La carga de fotos estará disponible próximamente",
    loadError: "Error al cargar los datos del perfil",
    updateSuccess: "Perfil actualizado exitosamente"
  }
} as const;
