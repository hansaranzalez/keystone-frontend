export default {
  appName: "ZOLARA",
  welcome: "Bienvenido a Zolara",
  subtitle: "Plataforma CRM para Bienes Raíces",
  error: "Error",
  success: "Éxito",
  retry: "Reintentar",
  view: "Ver",
  delete: "Eliminar",
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
    title: "Canales de Comunicación",
    description: "Conecta tus canales para centralizar comunicaciones",
    available: "Integraciones Disponibles",
    connected: "Cuentas Conectadas",
    manage: "Gestionar",
    add: "Agregar Nuevo",
    comingSoon: "Próximamente más integraciones",
    backToIntegrations: "Volver a Integraciones",
    actions: "Acciones",
    whatsapp: {
      connectWhatsAppBusiness: "Conectar WhatsApp Business",
      title: "WhatsApp Business",
      business: "Cuenta de Negocio",
      description: "Conecta tu cuenta de WhatsApp Business para enviar y recibir mensajes",
      connect: "Conectar WhatsApp",
      connecting: "Conectando a WhatsApp...",
      connected: "WhatsApp Conectado",
      disconnected: "WhatsApp Desconectado",
      accounts: "Cuentas de WhatsApp",
      noAccounts: "No hay cuentas de WhatsApp conectadas",
      errorAccounts: "Error al cargar las cuentas de WhatsApp",
      addAccount: "Agregar Cuenta de WhatsApp",
      addAccountDescription: "Conecta tu cuenta de WhatsApp Business para comenzar a enviar y recibir mensajes",
      activeAccounts: "Cuentas Activas",
      inactiveAccounts: "Cuentas Inactivas",
      inactive: "Inactivo",
      backToAccounts: "Volver a Cuentas",
      accountDetails: "Detalles de la Cuenta",
      editAccount: "Editar Cuenta",
      connectionStatus: "Estado de Conexión",
      lastVerification: "Última Verificación",
      waitingForVerification: "Esperando verificación",
      connectionError: "Error de Conexión",
      accountNotFound: "Cuenta no encontrada",
      verificationRequired: "Verificación Requerida",
      successfulConnection: "Conexión Exitosa",
      verify: "Verificar",
      verifyConnection: "Verificar Conexión",
      verifyConnectionConfirmation: "¿Estás seguro de que deseas verificar esta conexión?",
      verifyNow: "Verificar Ahora",
      retryConnection: "Reintentar Conexión",
      connectionSuccessMessage: "Tu cuenta de WhatsApp está conectada exitosamente y lista para usar.",
      needsVerificationMessage: "Tu cuenta de WhatsApp está conectada pero requiere verificación para asegurar que funcione correctamente.",
      connectionErrorMessage: "Hubo un problema con tu conexión de WhatsApp. Por favor verifica tus credenciales e intenta nuevamente.",
      confirmDeactivate: "¿Estás seguro de que deseas desactivar esta cuenta?",
      confirmDelete: "¿Estás seguro de que deseas eliminar esta cuenta?",
      deactivateAccountConfirmation: "¿Estás seguro de que deseas desactivar la cuenta {name}?",
      deactivateAccountFail: "Error al desactivar la cuenta",
      form: {
        id: "ID de la Cuenta",
        name: "Nombre de la Cuenta",
        namePlaceholder: "Ingresa un nombre para esta cuenta de WhatsApp",
        phoneNumber: "Número de Teléfono",
        phone: "Número de Teléfono",
        createdAt: "Fecha de Creación",
        lastConnection: "Última Conexión",
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
        webhookSecretHelp: "El token de verificación utilizado para validar las solicitudes webhook",
        businessName: "Nombre de Negocio (Opcional)",
        businessNamePlaceholder: "Ingresa el nombre de tu negocio",
        connect: "Conectar y Verificar",
        update: "Actualizar Cuenta",
        deactivate: "Desactivar Cuenta",
        reactivate: "Reactivar Cuenta",
        delete: "Eliminar Cuenta",
        verify: "Verificar Conexión"
      },
      activate: "Activar",
      deactivate: "Desactivar",
      retry: "Reintentar",
      connectionActive: "Conexión Activa",
      connectionActiveDescription: "Tu cuenta de WhatsApp está conectada y lista para usar",
      unknownError: "Se produjo un error desconocido con la conexión de WhatsApp",
      status: {
        PENDING: "Pendiente",
        CONNECTED: "Conectado",
        ERROR: "Error de Conexión",
        DISCONNECTED: "Desconectado",
        connected: "Conectado",
        pending: "Pendiente",
        error: "Error de Conexión",
        disconnected: "Desconectado",
        unknown: "Estado Desconocido"
      },
      alerts: {
        connectionVerified: "Conexión de WhatsApp verificada exitosamente",
        connectionFailed: "No se pudo verificar la conexión de WhatsApp",
        accountCreated: "Cuenta de WhatsApp creada exitosamente",
        accountUpdated: "Cuenta de WhatsApp actualizada exitosamente",
        accountDeactivated: "Cuenta de WhatsApp desactivada",
        accountActivated: "Cuenta de WhatsApp activada exitosamente",
        accountReactivated: "Cuenta de WhatsApp reactivada",
        accountDeleted: "Cuenta de WhatsApp eliminada exitosamente",
        invalidCredentials: "Credenciales inválidas. Por favor verifica tus datos.",
        fetchError: "Error al obtener las cuentas de WhatsApp",
        fetchAccountError: "Error al obtener los detalles de la cuenta de WhatsApp",
        updateFailed: "Error al actualizar la cuenta de WhatsApp",
        activationFailed: "Error al activar la cuenta de WhatsApp",
        deactivationFailed: "Error al desactivar la cuenta de WhatsApp",
        deleteFailed: "Error al eliminar la cuenta de WhatsApp",
        noConnections: "No hay cuentas de WhatsApp conectadas",
        noConnectionsMessage: "Por favor conecta una cuenta de WhatsApp para comenzar a enviar y recibir mensajes",
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
      helpText: "¿Dónde puedo encontrar esta información?",
      templates: {
        select: "Seleccionar Plantilla",
        noTemplates: "No hay plantillas disponibles",
        loading: "Cargando plantillas...",
        sendTemplate: "Enviar Plantilla",
        customizeMessage: "Personalizar Mensaje"
      },
      conversation: {
        archiveConversation: "Archivar Conversación",
        blockConversation: "Bloquear Conversación",
        refreshConversation: "Actualizar Conversación"
      },
      attachment: {
        image: "Imagen",
        document: "Documento",
        audio: "Audio",
        video: "Video"
      },
      quickActions: {
        location: "Enviar Ubicación"
      },
      inbox: {
        title: "Bandeja de WhatsApp",
        noConversations: "No hay conversaciones",
        searchPlaceholder: "Buscar conversaciones...",
        allConversations: "Todas las Conversaciones",
        unreadOnly: "Solo No Leídas",
        selectAccount: "Seleccionar cuenta",
        noAccountSelected: "Ninguna cuenta seleccionada",
        noAccountMessage: "Por favor selecciona una cuenta de WhatsApp para ver las conversaciones",
        errorLoading: "Error al cargar conversaciones",
        retry: "Reintentar",
        emptyState: "No se encontraron conversaciones",
        emptyStateDescription: "Cuando recibas mensajes de WhatsApp, aparecerán aquí"
      },
      deactivateAccount: "Desactivar Cuenta"
    },
    verify: "Verificar",
    verifyConnection: "Verificar Conexión",
    verifyConnectionConfirmation: "¿Estás seguro de que deseas verificar esta conexión?",
    activateAccount: "Activar Cuenta",
    activateAccountConfirmation: "¿Estás seguro de que deseas activar la cuenta {name}?",
    deactivateAccount: "Desactivar Cuenta",
    deleteAccount: "Eliminar Cuenta",
    deleteAccountConfirmation: "¿Estás seguro de que deseas eliminar la cuenta {name}? Esta acción no se puede deshacer.",
    activate: "Activar",
    pendingAccounts: "Cuentas Pendientes",
    errorAccounts: "Cuentas con Error",
    inactiveAccounts: "Cuentas Inactivas"
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
    compose: "Redactar",
    search: "Buscar mensajes...",
    noMessages: "No hay mensajes",
    conversations: "Conversaciones",
    newMessage: "Nuevo mensaje",
    newMessageTitle: "Nueva Conversación",
    newMessageDescription: "Inicia una nueva conversación con un contacto",
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
    sendingVia: "Enviando vía",
    call: "Llamar",
    viewContact: "Ver contacto",
    messageSent: "Mensaje enviado",
    messageSentDescription: "Tu mensaje ha sido enviado exitosamente",
    attachment: "Archivo adjunto",
    channels: {
      whatsapp: "WhatsApp",
      email: "Correo",
      instagram: "Instagram"
    },
    filters: {
      all: "Todos",
      unread: "No leídos",
      whatsapp: "WhatsApp",
      email: "Correo",
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
      noNotes: "No hay notas aún",
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
      oakDistrict: "Distrito Oak",
      singleFamilyHome: "Casa Unifamiliar",
      tabs: {
        info: "Info",
        notes: "Notas",
        followUps: "Seguimientos"
      }
    },
    error: {
      fetchConversations: "Error al cargar conversaciones",
      fetchConversation: "Error al cargar detalles de la conversación",
      conversationNotFound: "Conversación no encontrada",
      sendMessage: "Error al enviar mensaje",
      markAsRead: "Error al marcar la conversación como leída",
      noActiveAccount: "No hay una cuenta activa para enviar mensajes"
    },
    success: {
      messageSent: "Mensaje enviado exitosamente"
    },
    noResults: "No se encontraron resultados",
    loading: "Cargando...",
    loadMore: "Cargar más",
    filterBy: "Filtrar por",
    sortBy: "Ordenar por",
    newest: "Más recientes",
    oldest: "Más antiguos",
    read: "Leídos",
    markAsRead: "Marcar como leído",
    forward: "Reenviar",
    reply: "Responder",
    thisWeek: "Esta semana",
    lastWeek: "Semana pasada",
    older: "Más antiguo",
    to: "Para",
    subject: "Asunto",
    message: "Mensaje",
    cancel: "Cancelar",
    attachFiles: "Adjuntar archivos",
    messagePlaceholder: "Escribe tu mensaje aquí...",
    recipientPlaceholder: "Añadir destinatarios...",
    subjectPlaceholder: "Asunto del mensaje",
    messageError: "Error al enviar el mensaje",
    replyPlaceholder: "Escribe tu respuesta...",
    contacted: "Contactado",
    notContacted: "No contactado"
  },
  login: {
    title: "Iniciar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Ingresar",
    forgotPassword: "¿Olvidaste tu contraseña?",
    register: "Registrarse",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "********",
    notRegistered: "¿No tienes una cuenta?",
    createAccount: "Crear cuenta",
    rememberMe: "Recordarme",
    signIn: "Iniciar sesión",
    continueWithGoogle: "Continuar con Google",
    continueWithFacebook: "Continuar con Facebook",
    loginWithGoogle: "Iniciar sesión con Google",
    loginWithFacebook: "Iniciar sesión con Facebook",
    facebookLoginComingSoon: "La funcionalidad de inicio de sesión con Facebook estará disponible pronto",
    socialAuthInitiated: "Autenticación social iniciada",
    socialAuthError: "Error en la autenticación social. Por favor intenta nuevamente.",
    successTitle: "✅ Inicio de sesión exitoso",
    successMessage: "¡Bienvenido de nuevo!",
    errorTitle: "❌ Error al iniciar sesión",
    errorMessage: "Por favor verifica tus credenciales e intenta nuevamente",
    formLabels: {
      email: "Correo electrónico",
      password: "Contraseña"
    },
    validationMessages: {
      emailRequired: "¡No olvides tu correo electrónico!",
      passwordRequired: "¡Necesitamos tu contraseña!",
      invalidEmail: "Formato de correo electrónico inválido",
      incorrectEmailFormat: "Formato de correo electrónico incorrecto",
      loginFailed: "Error al iniciar sesión. Por favor verifica tus credenciales.",
      emailAuthExists: "Esta cuenta usa autenticación por correo electrónico",
      useEmailToLogin: "Por favor inicia sesión con tu correo electrónico y contraseña en lugar de inicio de sesión social"
    },
    errors: {
      invalidCredentials: "Credenciales inválidas",
      accountLocked: "Tu cuenta ha sido bloqueada",
      accountNotVerified: "Tu cuenta no ha sido verificada",
      tooManyAttempts: "Demasiados intentos fallidos",
      serverError: "Error del servidor. Por favor intenta más tarde."
    }
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
      confirmPassword: "Confirmar contraseña",
      passwordHint: "La contraseña debe tener al menos 8 caracteres"
    },
    formPlaceholders: {
      name: "Tu nombre completo",
      email: "correo{at}ejemplo.com",
      password: "••••••••",
      confirmPassword: "••••••••"
    },
    validationMessages: {
      nameRequired: "El nombre es requerido",
      emailRequired: "El correo electrónico es requerido",
      passwordRequired: "La contraseña es requerida",
      confirmPasswordRequired: "La confirmación de contraseña es requerida",
      invalidEmail: "Formato de correo electrónico inválido",
      passwordLength: "La contraseña debe tener al menos 8 caracteres",
      passwordMatch: "Las contraseñas no coinciden",
      passwordRequirements: "La contraseña debe incluir letras mayúsculas, minúsculas, números y caracteres especiales"
    },
    errors: {
      emailExists: "El correo electrónico ya está registrado",
      serverError: "Error del servidor. Por favor intenta más tarde"
    }
  },
  forgotPassword: {
    title: "Recuperar contraseña",
    email: "Correo electrónico",
    submit: "Enviar enlace de recuperación",
    goBack: "Volver a iniciar sesión",
    checkEmail: "Revisa tu correo electrónico",
    emailSent: "Se ha enviado un enlace de recuperación a tu correo electrónico",
    emailPlaceholder: "Correo electrónico",
    instructions: "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    validationMessages: {
      emailRequired: "El correo electrónico es requerido",
      invalidEmail: "Formato de correo electrónico inválido"
    },
    errors: {
      emailNotFound: "No se encontró una cuenta con este correo electrónico",
      serverError: "Error del servidor. Por favor intenta más tarde."
    }
  },
  passwordChange: {
    title: "Cambiar Contraseña",
    request: "Solicitar Cambio de Contraseña",
    goBackToLogin: "Volver a iniciar sesión",
    successTitle: "✅ Éxito",
    errorTitle: "❌ Error",
    successMessage: "Te hemos enviado un correo electrónico con instrucciones para cambiar tu contraseña.",
    errorMessage: "Algo salió mal, por favor intenta nuevamente",
    incorrectCurrentPassword: "La contraseña actual es incorrecta",
    googleAuthError: "No se puede cambiar la contraseña de cuentas que usan exclusivamente autenticación de Google",
    passwordTooShort: "La nueva contraseña debe tener al menos 8 caracteres",
    socialAccountError: "El cambio de contraseña no está disponible para cuentas de redes sociales. Por favor, usa el inicio de sesión social.",
    formLabels: {
      email: "Correo electrónico"
    },
    validationMessages: {
      emailRequired: "¡No olvides tu correo electrónico!",
      incorrectEmailFormat: "Formato de correo electrónico inválido"
    }
  },
  changePassword: {
    title: "Cambiar Contraseña",
    submit: "Enviar",
    successTitle: "✅ Contraseña Cambiada",
    errorTitle: "❌ Error al Cambiar Contraseña",
    successMessage: "¡Contraseña cambiada exitosamente!",
    errorMessage: "Algo salió mal, por favor intenta nuevamente",
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
      invalidResetCode: "El código de verificación es inválido. Por favor verifica e intenta nuevamente."
    }
  },
  resetPassword: {
    title: "Cambiar contraseña",
    password: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    submit: "Cambiar contraseña",
    goBack: "Volver a iniciar sesión",
    passwordPlaceholder: "Ingresa tu nueva contraseña",
    confirmPlaceholder: "Confirma tu nueva contraseña",
    success: "Tu contraseña ha sido cambiada exitosamente",
    validationMessages: {
      passwordRequired: "La contraseña es requerida",
      confirmPasswordRequired: "La confirmación de contraseña es requerida",
      passwordLength: "La contraseña debe tener al menos 8 caracteres",
      passwordMatch: "Las contraseñas no coinciden",
      missingToken: "Token faltante",
      invalidResetCode: "El código de verificación es inválido. Por favor verifica e intenta nuevamente."
    }
  },
  activatePassword: {
    title: "Activar contraseña",
    submit: "Enviar",
    successMessage: "¡Contraseña activada exitosamente!",
    errorMessage: "Algo salió mal, por favor intenta nuevamente",
    invalidCode: "El código de verificación es inválido. Por favor verifica e intenta nuevamente.",
    formLabels: {
      activationCode: "Código de activación"
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
  },
  actions: {
    send: "Enviar",
    reply: "Responder",
    save: "Guardar",
    delete: "Eliminar",
    cancel: "Cancelar",
    view: "Ver"
  },
  common: {
    or: "O",
    add: "Agregar",
    close: "Cerrar",
    all: "Todos",
    notSpecified: "No especificado",
    cancel: "Ups, no importa",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    save: "Guardar y listo",
    delete: "Eliminar",
    next: "Vamos al siguiente",
    edit: "Ajustémoslo",
    success: "¡Excelente!",
    error: "Error",
    unauthorized: "No autorizado",
    comingSoon: "Próximamente",
    remove: "Eliminar",
    goodJob: "¡Buen trabajo!",
    somethingWentWrong: "Ups, algo salió mal",
    pleaseTryAgain: "Por favor, intenta nuevamente",
    careful: "¡Cuidado!",
    search: "Buscar algo interesante",
    deselectAll: "Deseleccionar todo",
    pleaseCheckTheForm: "Revisa el formulario y corrige esos pequeños detalles",
    yes: "Sí",
    no: "No",
    never: "Nunca",
    connected: "Conectado",
    notConnected: "No conectado",
    loading: "Cargando..."
  },
  property: {
    propertyForm: {
      tabs: {
        basicInfo: "Información Básica",
        location: "Ubicación",
        characteristics: "Características",
        multimedia: "Multimedia",
        finalize: "Finalizar",
      },
      buttons: {
        cancel: "Cancelar",
        save: "Guardar",
        saveAsDraft: "Guardar como Borrador",
      },
      basicInfo: {
        title: 'Información Básica de la Propiedad',
        subTitle: 'Complete la información general sobre la propiedad que desea agregar al sistema.',
        financialInformation: 'Información Financiera',
        multimediaPreview: 'Vista Previa de Multimedia',
        youCanAddPhotosOrdocuments: 'Puede agregar fotos y documentos en el paso 4 (Multimedia).',
        imagesUploadedINMUltimediWIllBeVisibleHere: 'Se mostrarán las imágenes cargadas en el paso multimedia',
        youCanContinueToNextStepToAddPhotos: 'Puedes continuar al siguiente paso para agregar fotos',
        legalDocumentation: 'Documentación Legal',
        fields: {
          propertyType: {
            label: 'Tipo de Propiedad',
            placeholder: 'Seleccione el tipo de propiedad',
            validations: {
              required: "El tipo de propiedad es requerido",
              string: "El tipo de propiedad debe ser una cadena de texto",
            }
          },
          titleOrName: {
            label: 'Título o Nombre',
            placeholder: 'Ingrese un título o nombre para la propiedad',
            validations: {
              required: 'El título o nombre es requerido',
              min: 'El título o nombre debe tener al menos 3 caracteres',
              max: 'El título o nombre debe tener menos de 100 caracteres',
              string: 'El título o nombre debe ser una cadena de texto',
            }
          },
          description: {
            label: 'Descripción',
            placeholder: 'Escriba una descripción detallada de la propiedad...',
            validations: {
              required: 'La descripción es requerida',
              min: 'La descripción debe tener al menos 10 caracteres',
              max: 'La descripción debe tener menos de 1000 caracteres',
              string: 'La descripción debe ser una cadena de texto',
            }
          },
          size: {
            label: 'Tamaño m²',
            placeholder: 'Ingrese el tamaño de la propiedad (en m²)',
            validations: {
              required: 'El tamaño es requerido',
              min: 'El tamaño debe ser mayor a 0',
              max: 'El tamaño debe ser menor a 10000',
              number: 'El tamaño debe ser un número',
            }
          },
          rooms: {
            label: 'Habitaciones',
            placeholder: 'Ingrese la cantidad de habitaciones',
            validations: {
              required: 'Las habitaciones son requeridas',
              min: 'Las habitaciones deben ser mayores a 0',
              max: 'Las habitaciones deben ser menores a 100',
              number: 'Las habitaciones deben ser un número',
            }
          },
          bathrooms: {
            label: 'Baños',
            placeholder: 'Ingrese la cantidad de baños',
            validations: {
              required: 'Los baños son requeridos',
              min: 'Los baños deben ser mayores a 0',
              max: 'Los baños deben ser menores a 100',
              number: 'Los baños deben ser un número',
            }
          },
          constructionYear: {
            label: 'Año de Construcción',
            placeholder: 'Ingrese el año de construcción',
            validations: {
              required: 'El año de construcción es requerido',
              min: 'El año de construcción debe ser mayor a 1900',
              max: 'El año de construcción debe ser menor a 2025',
              number: 'El año de construcción debe ser un número',
            }
          },
          adquisitionYear: {
            label: 'Año de Adquisición',
            placeholder: 'Ingrese el año de adquisición',
            validations: {
              required: 'El año de adquisición es requerido',
              min: 'El año de adquisición debe ser mayor a 1900',
              max: 'El año de adquisición debe ser menor a 2025',
              number: 'El año de adquisición debe ser un número',
            }
          },
          estimatedValue: {
            label: 'Valor Estimado',
            placeholder: 'Ingrese el valor estimado de la propiedad',
            validations: {
              required: 'El valor estimado es requerido',
              min: 'El valor estimado debe ser mayor a 0',
              max: 'El valor estimado debe ser menor a 1000000000',
              number: 'El valor estimado debe ser un número',
            }
          },
          price: {
            label: 'Precio de alquiler o venta',
            placeholder: 'Ingrese el precio de la propiedad',
            validations: {
              required: 'El precio es requerido',
              min: 'El precio debe ser mayor a 0',
              max: 'El precio debe ser menor a 1000000000',
              number: 'El precio debe ser un número',
            }
          },
          anualTaxes: {
            label: 'Impuestos Anuales',
            placeholder: 'Ingrese los impuestos anuales de la propiedad',
            validations: {
              required: 'Los impuestos anuales son requeridos',
              min: 'Los impuestos anuales deben ser mayores a 0',
              max: 'Los impuestos anuales deben ser menores a 1000000000',
              number: 'Los impuestos anuales deben ser un número',
            }
          },
          maintenanceExpenses: {
            label: 'Gastos de Mantenimiento',
            placeholder: 'Ingrese los gastos de mantenimiento de la propiedad',
            validations: {
              required: 'Los gastos de mantenimiento son requeridos',
              min: 'Los gastos de mantenimiento deben ser mayores a 0',
              max: 'Los gastos de mantenimiento deben ser menores a 1000000000',
              number: 'Los gastos de mantenimiento deben ser un número',
            }
          },
        }
      }
    }
  }
} as const;
