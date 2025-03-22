export default {
  appName: "KEYSTONE",
  welcome: "Bienvenido a Project Keystone",
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
    settings: "Configuración"
  },
  version: {
    app: "Versión App",
    api: "Versión API"
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
