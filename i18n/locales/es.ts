
export default {
  //===== AUTH =====//
  auth: {
    login: {
      title: "Iniciar Sesión",
      signIn: "Ingresar", // Or "Iniciar Sesión"
      forgotPassword: "¿Olvidaste tu contraseña?",
      continueWithGoogle: "Continuar con Google",
      continueWithFacebook: "Continuar con Facebook",
      loginWithGoogle: "Iniciar sesión con Google",
      loginWithFacebook: "Iniciar sesión con Facebook",
      facebookLoginComingSoon:
        "La funcionalidad de inicio de sesión con Facebook estará disponible pronto",
      socialAuthInitiated: "Autenticación social iniciada",
      socialAuthError:
        "Autenticación social fallida. Por favor, inténtalo de nuevo.",
      successTitle: "✅ Inicio de sesión exitoso",
      successMessage: "¡Bienvenido de vuelta!",
      errorTitle: "❌ Inicio de sesión fallido",
      errorMessage: "Por favor, revisa tus credenciales e inténtalo de nuevo",
      formLabels: {
        email: "Correo Electrónico",
        password: "Contraseña",
      },
      validationMessages: {
        emailRequired: "¡No olvides tu correo electrónico!",
        incorrectEmailFormat: "Formato de correo electrónico inválido",
        passwordRequired: "¡Necesitamos tu contraseña!",
        loginFailed:
          "Inicio de sesión fallido. Por favor, revisa tus credenciales.",
        emailAuthExists: "Esta cuenta usa autenticación por correo electrónico",
        useEmailToLogin:
          "Por favor, inicia sesión con tu correo y contraseña en lugar del inicio de sesión social",
      },
    },
    registration: {
      title: "Registro",
      signUp: "Registrarse",
      haveAccount: "¿Ya tienes una cuenta?",
      createAccount: "¿No tienes una cuenta?",
      successTitle: "✅ Registro exitoso",
      errorTitle: "❌ Registro fallido",
      registrationSuccess: "Tu cuenta ha sido creada correctamente",
      registrationWithGoogle: "Registro con Google",
      registrationWithFacebook: "Registro con Facebook",
      formLabels: {
        name: "Nombre",
        email: "Correo Electrónico",
        password: "Contraseña",
        confirmPassword: "Confirma tu contraseña",
        passwordHint: "La contraseña debe tener al menos 8 caracteres",
      },
      formPlaceholders: {
        name: "Tu nombre completo",
        email: "correoejemplo.com", // Adjusted placeholder format
        password: "••••••••",
        confirmPassword: "••••••••",
      },
      validationMessages: {
        nameRequired: "¡Necesitamos tu nombre!",
        emailRequired: "¡No olvides tu correo electrónico!",
        incorrectEmailFormat: "Formato de correo electrónico inválido",
        passwordMin: "La contraseña debe tener al menos 8 caracteres",
        passwordRequired: "¡Necesitamos tu contraseña!",
        passwordMatch: "Las contraseñas deben coincidir",
        confirmPasswordRequired: "Confirma tu contraseña",
      },
      errors: {
        registrationFailed: "Registro fallido",
        googleAuthExists: "Este correo ya está registrado con Google",
        useGoogleToLogin:
          "Por favor, usa el inicio de sesión de Google para esta cuenta",
        emailAuthExists: "Este correo electrónico ya está registrado",
        useEmailToLogin:
          "Por favor, usa tu correo electrónico y contraseña para iniciar sesión",
      },
    },
    passwordChange: {
      // Requesting the change
      title: "Cambiar Contraseña",
      request: "Solicitar Cambio de Contraseña",
      goBackToLogin: "Volver a iniciar sesión",
      successTitle: "✅ Éxito",
      errorTitle: "❌ Error",
      successMessage:
        "Te hemos enviado un correo electrónico con instrucciones para cambiar tu contraseña.",
      errorMessage: "Algo salió mal, por favor inténtalo de nuevo",
      incorrectCurrentPassword: "La contraseña actual es incorrecta",
      googleAuthError:
        "No se puede cambiar la contraseña de cuentas que usan exclusivamente autenticación de Google",
      passwordTooShort: "La nueva contraseña debe tener al menos 8 caracteres",
      socialAccountError:
        "El cambio de contraseña no está disponible para cuentas de redes sociales. Por favor, usa el inicio de sesión social.",
      formLabels: {
        email: "Correo Electrónico",
      },
      validationMessages: {
        emailRequired: "¡No olvides tu correo electrónico!",
        incorrectEmailFormat: "Formato de correo electrónico inválido",
      },
    },
    changePassword: {
      // Setting the new password via link/token
      title: "Cambiar Contraseña",
      submit: "Enviar",
      successTitle: "✅ Contraseña Cambiada",
      errorTitle: "❌ Cambio de Contraseña Fallido",
      successMessage: "¡Contraseña cambiada correctamente!",
      errorMessage: "Algo salió mal, por favor inténtalo de nuevo",
      formLabels: {
        newPassword: "Nueva Contraseña",
        confirmPassword: "Confirma tu nueva contraseña",
      },
      validationMessages: {
        passwordMin: "La contraseña debe tener al menos 8 caracteres",
        passwordRequired: "¡Necesitamos tu contraseña!",
        passwordMatch: "Las contraseñas deben coincidir",
        confirmPasswordRequired: "Confirma tu contraseña",
        missingToken: "Falta el token", // Or "Token faltante"
        invalidResetCode:
          "El código de verificación es inválido. Por favor, verifica e inténtalo de nuevo.",
      },
    },
    activatePassword: {
      // Specific activation flow
      title: "Activar Contraseña",
      submit: "Enviar",
      successMessage: "¡Contraseña activada correctamente!",
      errorMessage: "Algo salió mal, por favor inténtalo de nuevo",
      invalidCode:
        "El código de verificación es inválido. Por favor, verifica e inténtalo de nuevo.",
      formLabels: {
        activationCode: "Código de Activación",
      },
      validationMessages: {
        codeLength: "El código de activación debe tener 6 dígitos",
        codeRequired: "¡Necesitamos tu código de activación!",
      },
      reset: "Restablecer", // Or perhaps "Reenviar Código" depending on function
      goToLogin: "Ir a iniciar sesión",
    },
    passwordChangeSuccess: {
      title: "Contraseña Cambiada",
      message: "¡Tu contraseña ha sido cambiada correctamente!",
      backToLogin: "Volver a iniciar sesión",
    },
    passwordResetRequestSuccess: {
      title: "Solicitud de Restablecimiento de Contraseña Enviada",
      message:
        "Si tu correo electrónico existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña en breve.",
      backToLogin: "Volver a iniciar sesión",
    },
  },

  //===== PROPETY =====//
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
        title: "Información Básica de la Propiedad",
        subTitle:
          "Complete la información general sobre la propiedad que desea agregar al sistema.",
        financialInformation: "Información Financiera",
        multimediaPreview: "Vista Previa de Multimedia",
        youCanAddPhotosOrdocuments:
          "Puede agregar fotos y documentos en el paso 4 (Multimedia).",
        imagesUploadedINMUltimediWIllBeVisibleHere:
          "Las imágenes cargadas en el paso multimedia se mostrarán aquí.",
        youCanContinueToNextStepToAddPhotos:
          "Puede continuar al siguiente paso para agregar fotos.",
        legalDocumentation: "Documentación Legal",
        fields: {
          propertyType: {
            label: "Tipo de Propiedad",
            placeholder: "Seleccione el tipo de propiedad",
            validations: {
              required: "El tipo de propiedad es requerido",
              string: "El tipo de propiedad debe ser una cadena de texto",
            },
          },
          titleOrName: {
            label: "Título o Nombre",
            placeholder: "Ingrese un título o nombre para la propiedad",
            validations: {
              required: "El título o nombre es requerido",
              min: "El título o nombre debe tener al menos 3 caracteres",
              max: "El título o nombre debe tener menos de 100 caracteres",
              string: "El título o nombre debe ser una cadena de texto",
            },
          },
          description: {
            label: "Descripción",
            placeholder: "Escriba una descripción detallada de la propiedad...",
            validations: {
              required: "La descripción es requerida",
              min: "La descripción debe tener al menos 10 caracteres",
              max: "La descripción debe tener menos de 1000 caracteres",
              string: "La descripción debe ser una cadena de texto",
            },
          },
          size: {
            label: "Tamaño m²",
            placeholder: "Ingrese el tamaño de la propiedad (en m²)",
            validations: {
              required: "El tamaño es requerido",
              min: "El tamaño debe ser mayor a 0",
              max: "El tamaño debe ser menor a 10000",
              number: "El tamaño debe ser un número",
            },
          },
          rooms: {
            label: "Habitaciones",
            placeholder: "Ingrese la cantidad de habitaciones",
            validations: {
              required: "La cantidad de habitaciones es requerida",
              min: "La cantidad de habitaciones debe ser mayor a 0",
              max: "La cantidad de habitaciones debe ser menor a 100",
              number: "La cantidad de habitaciones debe ser un número",
            },
          },
          bathrooms: {
            label: "Baños",
            placeholder: "Ingrese la cantidad de baños",
            validations: {
              required: "La cantidad de baños es requerida",
              min: "La cantidad de baños debe ser mayor a 0",
              max: "La cantidad de baños debe ser menor a 100",
              number: "La cantidad de baños debe ser un número",
            },
          },
          constructionYear: {
            label: "Año de Construcción",
            placeholder: "Ingrese el año de construcción",
            validations: {
              required: "El año de construcción es requerido",
              min: "El año de construcción debe ser mayor a 1900",
              max: "El año de construcción debe ser menor a 2025", // Kept as per original input
              number: "El año de construcción debe ser un número",
            },
          },
          adquisitionYear: {
            // Typo 'adquisition' kept from original source
            label: "Año de Adquisición",
            placeholder: "Ingrese el año de adquisición",
            validations: {
              required: "El año de adquisición es requerido",
              min: "El año de adquisición debe ser mayor a 1900",
              max: "El año de adquisición debe ser menor a 2025", // Kept as per original input
              number: "El año de adquisición debe ser un número",
            },
          },
          estimatedValue: {
            label: "Valor Estimado",
            placeholder: "Ingrese el valor estimado de la propiedad",
            validations: {
              required: "El valor estimado es requerido",
              min: "El valor estimado debe ser mayor a 0",
              max: "El valor estimado debe ser menor a 1.000.000.000", // Using dot separators
              number: "El valor estimado debe ser un número",
            },
          },
          price: {
            label: "Precio de Alquiler o Venta",
            placeholder: "Ingrese el precio de la propiedad",
            validations: {
              required: "El precio es requerido",
              min: "El precio debe ser mayor a 0",
              max: "El precio debe ser menor a 1.000.000.000", // Using dot separators
              number: "El precio debe ser un número",
            },
          },
          anualTaxes: {
            // Typo 'anual' kept from original source
            label: "Impuestos Anuales",
            placeholder: "Ingrese los impuestos anuales de la propiedad",
            validations: {
              required: "Los impuestos anuales son requeridos",
              min: "Los impuestos anuales deben ser mayores a 0",
              max: "Los impuestos anuales deben ser menores a 1.000.000.000", // Using dot separators
              number: "Los impuestos anuales deben ser un número",
            },
          },
          maintenanceExpenses: {
            label: "Gastos de Mantenimiento",
            placeholder: "Ingrese los gastos de mantenimiento de la propiedad",
            validations: {
              required: "Los gastos de mantenimiento son requeridos",
              min: "Los gastos de mantenimiento deben ser mayores a 0",
              max: "Los gastos de mantenimiento deben ser menores a 1.000.000.000", // Using dot separators
              number: "Los gastos de mantenimiento deben ser un número",
            },
          },
        },
      },
    },
  },

  //===== SYSTEM =====//

  system: {
    appName: "ZOLARA",
    welcome: "Bienvenido a Zolara",
    subtitle: "Plataforma CRM Inmobiliaria",
    languages: {
      english: "Inglés",
      spanish: "Español",
      changeLanguage: "Cambiar idioma",
    },
    nav: {
      menu: "Menú",
      dashboard: "Panel", // or "Tablero"
      inbox: "Bandeja de entrada",
      contacts: "Contactos",
      clients: "Clientes",
      leads: "Prospectos", // or "Leads"
      properties: "Propiedades",
      listings: "Listados", // or "Publicaciones"
      showings: "Visitas", // or "Muestras"
      tools: "Herramientas",
      templates: "Plantillas",
      analytics: "Analíticas",
      integrations: "Integraciones",
      settings: "Configuración", // or "Ajustes"
    },
    version: {
      app: "Versión de la App",
      api: "Versión de la API",
    },
    notifications: {
      title: "Notificaciones",
      markAllAsRead: "Marcar todo como leído",
      empty: "No hay notificaciones",
      viewAll: "Ver todas las notificaciones",
    },
    common: {
      or: "O",
      add: "Agregar", // or "Añadir"
      close: "Cerrar",
      all: "Todos", // or "Todo" depending on context
      notSpecified: "No especificado",
      cancel: "Oops, olvídalo", // Informal
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      save: "Guardar y listo", // Informal
      delete: "Eliminar",
      next: "Vamos al siguiente", // Informal
      edit: "Vamos a ajustarlo", // Informal
      success: "¡Genial!", // or "¡Éxito!", "¡Estupendo!"
      error: "Error",
      unauthorized: "No autorizado",
      comingSoon: "Próximamente",
      remove: "Quitar", // or "Eliminar"
      goodJob: "¡Buen trabajo!",
      somethingWentWrong: "Uy, algo salió mal", // Informal
      pleaseTryAgain: "Por favor, inténtalo de nuevo", // Simplified from double 'please'
      careful: "¡Cuidado!",
      search: "Busca algo genial", // Informal
      deselectAll: "Deseleccionar todo",
      pleaseCheckTheForm: "Revisa el formulario y corrige esos detallitos", // Informal
      yes: "Sí",
      no: "No",
      never: "Nunca",
      connected: "Conectado",
      notConnected: "No conectado",
      loading: "Cargando...",
    },
  },

  //===== USER =====//
  user: {
    signOut: "Cerrar sesión",
    account: "Mi Cuenta",
    profileLabel: "Perfil",
    guest: "Invitado",
    profile: {
      title: "Configuración del Perfil",
      updatePhoto: "Actualizar Foto",
      saveChanges: "Guardar Cambios",
      basicInfo: "Información Básica",
      security: "Configuración de Seguridad",
      formLabels: {
        name: "Nombre",
        email: "Correo Electrónico", // "Email" is also commonly used and understood
      },
      placeholders: {
        name: "Ingresa tu nombre",
        email: "Ingresa tu correo electrónico",
      },
      authentication: {
        title: "Estado de Autenticación",
        emailVerified: "Verificación de Correo Electrónico",
        google: "Autenticación con Google",
        facebook: "Autenticación con Facebook",
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
        guidanceLength: "Al menos 8 caracteres de longitud",
        guidanceMix:
          "Incluir letras mayúsculas y minúsculas, números y caracteres especiales",
        guidanceUnique: "Diferente a contraseñas usadas anteriormente",
        newHelp: "Crea una contraseña fuerte y única",
        confirmHelp: "Escribe tu nueva contraseña de nuevo para confirmar",
        strength: "Fortaleza de la Contraseña",
        strengthLabels: {
          weak: "Débil",
          fair: "Aceptable", // or "Regular"
          good: "Buena",
          strong: "Fuerte",
        },
      },
      accountStatus: {
        title: "Estado de la Cuenta",
        status: "Estado Actual",
        lastLogin: "Último Inicio de Sesión",
        active: "Activo",
        inactive: "Inactivo",
        suspended: "Suspendido",
      },
      validationMessages: {
        nameRequired: "El nombre es requerido",
        emailRequired: "El correo electrónico es requerido",
        incorrectEmailFormat: "Formato de correo electrónico inválido",
        passwordMin: "La contraseña debe tener al menos 8 caracteres",
        passwordMatch: "Las contraseñas deben coincidir",
        passwordUppercase:
          "La contraseña debe incluir al menos una letra mayúscula",
        passwordLowercase:
          "La contraseña debe incluir al menos una letra minúscula",
        passwordNumber: "La contraseña debe incluir al menos un número",
        passwordSpecial:
          "La contraseña debe incluir al menos un carácter especial",
        currentPasswordRequired: "La contraseña actual es requerida",
        newPasswordRequired: "La nueva contraseña es requerida",
        confirmPasswordRequired:
          "La confirmación de la contraseña es requerida",
      },
      notifications: {
        updateSuccess: "Perfil actualizado correctamente",
        updateFailed: "Error al actualizar el perfil",
        photoUpdateSuccess: "Foto de perfil actualizada correctamente",
        photoUpdateFailed: "Error al actualizar la foto de perfil",
        passwordChangeSuccess: "Contraseña cambiada correctamente",
        passwordChangeFailed: "Error al cambiar la contraseña",
      },
      deleteAccount: {
        title: "Eliminar Cuenta",
        warning: "Esta acción no se puede deshacer",
        confirm: "¿Estás seguro de que quieres eliminar tu cuenta?",
        button: "Eliminar Cuenta",
      },
    },
  },

  //===== INBOX =====//
  inbox: {
    title: "Bandeja de Entrada",
    unified: "Bandeja de Entrada Unificada",
    compose: "Redactar Mensaje",
    search: "Buscar conversaciones...",
    noMessages: "No se encontraron mensajes",
    conversations: "Conversaciones",
    newMessage: "Nuevo Mensaje",
    newMessageTitle: "Nueva Conversación",
    newMessageDescription: "Inicia una nueva conversación con un contacto",
    searchPlaceholder: "Buscar conversaciones...",
    noConversations: "No hay conversaciones",
    noSearchResults: "Ninguna conversación coincide con tu búsqueda",
    noUnreadMessages: "No tienes mensajes no leídos",
    noMessagesInChannel: "No hay mensajes en este canal",
    startNewConversation: "Iniciar una nueva conversación",
    noConversationSelected: "Ninguna conversación seleccionada",
    selectConversation: "Selecciona una conversación de la lista",
    startConversation: "Envía un mensaje para iniciar la conversación",
    conversation: "Conversación",
    yesterday: "Ayer",
    you: "Tú", // Or "Usted" if more formal context is desired
    activeNow: "Activo ahora",
    viewContact: "Ver Contacto",
    typeMessage: "Escribe un mensaje...",
    sendingVia: "Enviando vía",
    call: "Llamar",
    messageSent: "Mensaje Enviado",
    messageSentDescription: "Tu mensaje ha sido enviado correctamente",
    attachment: "Adjunto", // Or "Archivo adjunto"
    channels: {
      whatsapp: "WhatsApp",
      email: "Correo Electrónico", // Or simply "Email"
      instagram: "Instagram",
    },
    filters: {
      all: "Todos", // Or "Todas" if referring to "Conversaciones"
      unread: "No leídos",
      whatsapp: "WhatsApp",
      email: "Correo Electrónico",
      instagram: "Instagram",
    },
    dates: {
      today: "Hoy",
      yesterday: "Ayer",
    },
    actions: {
      archive: "Archivar",
      markUnread: "Marcar como no leído",
      block: "Bloquear",
      send: "Enviar",
      reply: "Responder",
      save: "Guardar",
      delete: "Eliminar",
      cancel: "Cancelar",
      view: "Ver",
    },
    contact: {
      keyInfo: "Información Clave",
      source: "Fuente", // Or "Origen"
      status: "Estado",
      lastContact: "Último Contacto",
      customFields: "Campos Personalizados",
      budget: "Presupuesto",
      area: "Área de Interés",
      propertyType: "Tipo de Propiedad",
      noNotes: "Aún no se han agregado notas",
      addNotePlaceholder: "Agrega una nota sobre este contacto...",
      addNote: "Agregar Nota",
      complete: "Completar", // Verb form
      noFollowUps: "No hay seguimientos programados",
      scheduleFollowUp: "Programar Seguimiento",
      newFollowUp: "Nuevo Seguimiento",
      title: "Título",
      date: "Fecha",
      description: "Descripción",
      today: "Hoy",
      websiteLead: "Prospecto del Sitio Web",
      activeLead: "Prospecto Activo",
      oakDistrict: "Distrito Oak", // Assuming proper name
      singleFamilyHome: "Vivienda Unifamiliar",
      tabs: {
        info: "Info", // Or "Información"
        notes: "Notas",
        followUps: "Seguimientos",
      },
    },
    error: {
      fetchConversations: "Error al obtener conversaciones",
      fetchConversation: "Error al obtener detalles de la conversación",
      conversationNotFound: "Conversación no encontrada",
      sendMessage: "Error al enviar mensaje",
      markAsRead: "Error al marcar conversación como leída",
      noActiveAccount: "No hay cuenta activa para enviar mensajes",
    },
    success: {
      messageSent: "Mensaje enviado correctamente",
    },
  },

  //===== INTEGRATIONS =====//
  integrations: {
    connectWhatsAppBusiness: "Conectar WhatsApp Business",
    title: "Canales",
    description: "Conecta tus canales para centralizar las comunicaciones",
    available: "Integraciones Disponibles",
    connected: "Cuentas Conectadas",
    manage: "Gestionar", // or "Administrar"
    add: "Agregar Nuevo", // or "Añadir Nuevo"
    comingSoon: "Más integraciones próximamente",
    backToIntegrations: "Volver a Integraciones",
    actions: "Acciones",
    whatsapp: {
      deactivateAccount: "Desactivar Cuenta",
      deactivateAccountConfirmation:
        "¿Estás seguro de que quieres desactivar la cuenta {name}?",
      deactivateAccountFail: "Error al desactivar la cuenta",
      title: "WhatsApp Business",
      business: "Cuenta de Empresa",
      description:
        "Conecta tu cuenta de WhatsApp Business para enviar y recibir mensajes",
      connect: "Conectar WhatsApp",
      connecting: "Conectando a WhatsApp...",
      connected: "WhatsApp Conectado",
      disconnected: "WhatsApp Desconectado",
      accounts: "Cuentas de WhatsApp",
      noAccounts: "No hay cuentas de WhatsApp conectadas",
      errorAccounts: "Error al cargar las cuentas de WhatsApp",
      addAccount: "Agregar Cuenta de WhatsApp",
      addAccountDescription:
        "Conecta tu cuenta de WhatsApp Business para comenzar a enviar y recibir mensajes",
      activeAccounts: "Cuentas Activas",
      inactiveAccounts: "Cuentas Inactivas",
      inactive: "Inactivo",
      backToAccounts: "Volver a Cuentas",
      accountDetails: "Detalles de la Cuenta",
      editAccount: "Editar Cuenta",
      connectionStatus: "Estado de la Conexión",
      lastVerification: "Última Verificación",
      waitingForVerification: "Esperando verificación",
      connectionError: "Error de Conexión",
      verificationRequired: "Verificación Requerida",
      successfulConnection: "Conexión Exitosa",
      verify: "Verificar",
      verifyConnection: "Verificar Conexión",
      verifyConnectionConfirmation:
        "¿Estás seguro de que quieres verificar esta conexión?",
      verifyNow: "Verificar Ahora",
      retryConnection: "Reintentar Conexión",
      connectionSuccessMessage:
        "Tu cuenta de WhatsApp está conectada exitosamente y lista para usar.",
      needsVerificationMessage:
        "Tu cuenta de WhatsApp está conectada pero requiere verificación para asegurar que funciona correctamente.",
      connectionErrorMessage:
        "Hubo un problema con tu conexión de WhatsApp. Por favor, revisa tus credenciales e inténtalo de nuevo.",
      confirmDeactivate: "¿Estás seguro de que quieres desactivar esta cuenta?",
      confirmDelete: "¿Estás seguro de que quieres eliminar esta cuenta?",
      form: {
        id: "ID de Cuenta",
        name: "Nombre de la Cuenta",
        namePlaceholder: "Ingresa un nombre para esta cuenta de WhatsApp",
        phoneNumber: "Número de Teléfono",
        phone: "Número de Teléfono",
        createdAt: "Creado",
        lastConnection: "Última Conexión",
        phonePlaceholder: "+1 (123) 456-7890", // Kept format example
        phoneHelp:
          "El número de teléfono asociado con tu cuenta de WhatsApp Business",
        phoneNumberId: "ID del Número de Teléfono",
        phoneNumberIdPlaceholder:
          "Ingresa tu ID de número de teléfono de WhatsApp",
        phoneNumberIdHelp:
          "El ID del Número de Teléfono del Portal de Desarrolladores de Meta",
        businessAccountId: "ID de Cuenta Empresarial",
        businessAccountIdPlaceholder:
          "Ingresa tu ID de cuenta empresarial de WhatsApp",
        businessAccountIdHelp:
          "El ID de Cuenta Empresarial del Portal de Desarrolladores de Meta",
        accessToken: "Token de Acceso",
        accessTokenPlaceholder: "Ingresa tu token de acceso permanente",
        accessTokenHelp:
          "El token de acceso permanente generado desde el Portal de Desarrolladores de Meta",
        webhookSecret: "Secreto del Webhook (Opcional)",
        webhookSecretPlaceholder:
          "Ingresa tu token de verificación del webhook",
        webhookSecretHelp:
          "El token de verificación usado para validar las solicitudes del webhook",
        businessName: "Nombre de la Empresa (Opcional)",
        businessNamePlaceholder: "Ingresa el nombre de tu empresa",
        connect: "Conectar y Verificar",
        update: "Actualizar Cuenta",
        deactivate: "Desactivar Cuenta",
        reactivate: "Reactivar Cuenta",
        delete: "Eliminar Cuenta",
        verify: "Verificar Conexión", // Context specific: verify connection within the form
      },
      activate: "Activar",
      deactivate: "Desactivar",
      retry: "Reintentar",
      connectionActive: "Conexión Activa",
      connectionActiveDescription:
        "Tu cuenta de WhatsApp está conectada y lista para usar",
      unknownError: "Ocurrió un error desconocido con la conexión de WhatsApp",
      status: {
        PENDING: "Pendiente",
        CONNECTED: "Conectado",
        ERROR: "Error de Conexión",
        DISCONNECTED: "Desconectado",
        connected: "Conectado",
        pending: "Pendiente",
        error: "Error de Conexión",
        disconnected: "Desconectado",
        unknown: "Estado Desconocido",
      },
      alerts: {
        connectionVerified: "Conexión de WhatsApp verificada correctamente",
        connectionFailed: "Error al verificar la conexión de WhatsApp",
        accountCreated: "Cuenta de WhatsApp creada correctamente",
        accountUpdated: "Cuenta de WhatsApp actualizada correctamente",
        accountDeactivated: "Cuenta de WhatsApp desactivada",
        accountReactivated: "Cuenta de WhatsApp reactivada",
        accountDeleted: "Cuenta de WhatsApp eliminada correctamente",
        invalidCredentials:
          "Credenciales inválidas. Por favor, revisa tus datos.",
        fetchError: "Error al obtener las cuentas de WhatsApp",
        fetchAccountError:
          "Error al obtener los detalles de la cuenta de WhatsApp",
        updateFailed: "Error al actualizar la cuenta de WhatsApp",
        activationFailed: "Error al activar la cuenta de WhatsApp",
        deactivationFailed: "Error al desactivar la cuenta de WhatsApp",
        deleteFailed: "Error al eliminar la cuenta de WhatsApp",
        noConnections: "No hay conexiones de WhatsApp disponibles",
        noConnectionsMessage:
          "Por favor, conecta una cuenta de WhatsApp para ver las conversaciones",
      },
      errors: {
        nameRequired: "El nombre de la cuenta es requerido",
        phoneRequired: "El número de teléfono es requerido",
        phoneNumberIdRequired: "El ID del número de teléfono es requerido",
        businessAccountIdRequired: "El ID de cuenta empresarial es requerido",
        accessTokenRequired: "El Token de acceso es requerido",
        invalidPhoneNumber: "Por favor, ingresa un número de teléfono válido",
        invalidToken: "Formato de token de acceso inválido",
        connectionFailed:
          "Conexión fallida. Por favor, revisa tus credenciales.",
      },
      helpText: "¿Dónde puedo encontrar esta información?",
      templates: {
        select: "Seleccionar Plantilla",
        noTemplates: "No hay plantillas disponibles",
        loading: "Cargando plantillas...",
        sendTemplate: "Enviar Plantilla",
        customizeMessage: "Personalizar Mensaje",
      },
      conversation: {
        archiveConversation: "Archivar Conversación",
        blockConversation: "Bloquear Conversación",
        refreshConversation: "Actualizar Conversación",
      },
      attachment: {
        image: "Imagen",
        document: "Documento",
        audio: "Audio",
        video: "Video",
      },
      quickActions: {
        location: "Enviar Ubicación",
      },
      inbox: {
        title: "Bandeja de Entrada de WhatsApp",
        noConversations: "No hay conversaciones",
        searchPlaceholder: "Buscar conversaciones...",
        allConversations: "Todas las Conversaciones",
        unreadOnly: "Solo No Leídos",
        selectAccount: "Seleccionar cuenta",
        noAccountSelected: "Ninguna cuenta seleccionada",
        noAccountMessage:
          "Por favor, selecciona una cuenta de WhatsApp para ver las conversaciones",
        errorLoading: "Error al cargar las conversaciones",
        retry: "Reintentar",
        emptyState: "No se encontraron conversaciones",
        emptyStateDescription:
          "Cuando recibas mensajes de WhatsApp, aparecerán aquí",
      },
    },
    verify: "Verificar",
    verifyConnection: "Verificar Conexión",
    verifyConnectionConfirmation:
      "¿Estás seguro de que quieres verificar esta conexión?",
    activateAccount: "Activar Cuenta",
    activateAccountConfirmation:
      "¿Estás seguro de que quieres activar la cuenta {name}?",
    deactivateAccount: "Desactivar Cuenta",
    deactivateAccountConfirmation:
      "¿Estás seguro de que quieres desactivar la cuenta {name}?",
    deleteAccount: "Eliminar Cuenta",
    deleteAccountConfirmation:
      "¿Estás seguro de que quieres eliminar la cuenta {name}? Esta acción no se puede deshacer.",
    activate: "Activar",
    pendingAccounts: "Cuentas Pendientes",
    errorAccounts: "Cuentas con Error",
    inactiveAccounts: "Cuentas Inactivas",
  },
} as const;
