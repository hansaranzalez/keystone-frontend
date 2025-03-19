import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { Pinia } from 'pinia';
import { useHttp } from '~/composables/useHttp';
import { AuthUser } from '~/models/entities/AuthUser';
import { AuthForms, useAuthStore } from '~/store/authStore';
import { useUiStore } from '~/store/ui.store';
import { HttpStatus } from '~/types/auth.type';

export class AuthService {
  private readonly http = useHttp().http;
  
  private get store() {
    const nuxtApp = useNuxtApp();
    return useAuthStore(nuxtApp.$pinia as Pinia);
  }

  private get endpoints() {
    return useNuxtApp().$endpoints;
  }

  constructor() {
    this.store.loadToken();
    if (this.hasExpiredToken()) {
      this.logout();
      return;
    }
    this.decodeTokenAndSetUser();
  }

  private decodeTokenAndSetUser(): void {
    const token = this.getToken();
    if (token) {
      const decode: JwtPayload = jwtDecode(token);
      this.store.setToken(token);
      this.store.setUser(AuthUser.Build(decode));
      return;
    }
    this.logout();
  }

  public hasExpiredToken(): boolean {
    const jwt: string | null = this.getToken();
    if (jwt) {
      const payload = jwtDecode(jwt) as any;
      return Date.now() >= payload.exp * 1000;
    }
    return true;
  }

  public getToken(): string | null {
    const token = this.store.token;
    if (token && typeof token === 'string') {
      return token;
    }
    return null;
  }

  private setToken(jwt: string): void {
    this.store.setToken(jwt);
  }

  public logout(): void {
    console.log('logout');
    this.store.logout();
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      useUiStore().setSplashVisible(true);
      const response = await this.http.post(this.endpoints.login, {
        email,
        password,
      });
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to login!');
      this.setToken(response.data.accessToken);
      this.store.setRefreshToken(response.data.refreshToken);
      this.decodeTokenAndSetUser();
    } catch (error) {
      this.logout();
      throw error;
    } finally {
      useUiStore().setSplashVisible(false);
      useToast().add({
        color: 'success',
        title: '✅ Sesión iniciada con éxito.',
        description: 'Bienvenido de nuevo!'
      });
    }
  }

  public async register(name: string, email: string, password: string) {
    try {
      useUiStore().setSplashVisible(true);
      const response = await this.http.post(this.endpoints.register, {
        name,
        email,
        password,
      });
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to register!');
      this.setToken(response.data.accessToken);
      this.decodeTokenAndSetUser();
      useToast().add({
        color: 'success',
        title: '✅ Registro exitoso.',
        description: '¡Gracias por registrarte!'
      });
      this.store.setSelectedForm(AuthForms.LOGIN);
    } catch (error) {
      this.logout();
      useToast().add({
        color: 'error',
        title: '❌ ¡Ups! No pudimos registrarte.',
        description: 'Al parecer tus credenciales son incorrectas. Revisalas e intenta de nuevo'
      });
      throw error;
    } finally {
      useUiStore().setSplashVisible(false);
    }
  }

  public async requestPasswordChange(email: string) {
    try {
      const response = await this.http.post(this.endpoints.requestPasswordChange, {
        email,
      });
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to request password change!');
      useToast().add({
        color: 'green',
        title: '✅ Se ha enviado un correo con las instrucciones para cambiar tu contraseña.',
        description: 'Si no recibes un correo en unos minutos, revisa tu bandeja de spam o intenta de nuevo.'
      });
    } catch (error: any) {
      useToast().add({
        color: 'error',
        title: '❌ ¡Ups! No pudimos enviarte un correo con las instrucciones para cambiar tu contraseña.',
        description: `Al parecer ${error.response?.data?.message}`
      });
      throw error;
    }
  }

  public async changePassword(newPassword: string) {
    try {
      const code = this.store.changePasswordCodeGetter;
      if (!code) throw new Error('No hay token para cambiar la contraseña');
      const response = await this.http.post(this.endpoints.changePassword, {
        email: this.store.catchedEmailGetter,
        code,
        newPassword,
      });
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to change password!');
      useToast().add({
        color: 'success',
        title: '✅ Contraseña cambiada con éxito.',
        description: 'Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión con tu nueva contraseña.'
      });
      this.store.setSelectedForm(AuthForms.LOGIN)
    } catch (error: any) {
      useToast().add({
        color: 'error',
        title: '❌ ¡Ups! No pudimos cambiar tu contraseña.',
        description: error.message
      });
      throw error;
    }
  }

  public async verifyActivationCode(code: string) {
    try {
      const response = await this.http.post(this.endpoints.verifyActivationCode, {
        code,
      });
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to verify activation code!');
      return response.data;
    } catch (error) {
      useToast().add({
        color: 'error',
        title: '❌ ¡Ups! No pudimos verificar tu código de activación.',
        description: 'Al parecer tus credenciales son incorrectas. Revisalas e intenta de nuevo'
      });
      throw error;
    }
  }

  public async verifyPasswordResetCode(email: string, code: string) {
    try {
      const response = await this.http.post(this.endpoints.verifyPasswordResetCode, {
        email,
        code,
      });
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to verify password reset code!');
      console.log(response.data);
      this.store.setChangePasswordCode(response.data.code);
      return response.data;
    } catch (error) {
      useToast().add({
        color: 'error',
        title: '❌ ¡Ups! No pudimos verificar tu código de restablecimiento de contraseña.',
        description: 'Al parecer tu codigo a expirado o no es válido. Revisa tu codigo e intenta de nuevo'
      });
      throw error;
    }
  }

  // GOOGLE

  public async initGoogleLoginFlow(): Promise<void> {
    try {
      window.location.href = this.endpoints.googleLogin;
    } catch (error) {
      this.logout();
      useToast().add({
        color: 'error',
        title: '❌ ¡Ups! No pudimos iniciar sesion.',
        description: 'Por favor trata de nuevo'
      });
      throw error;
    }
  }

  public async receiveGoogleCallback(code: string) {
    try {
      useUiStore().setSplashVisible(true);
      // get id token
      const response = await this.http.get(this.endpoints.googleCallback(code));
      if (response.status !== HttpStatus.SUCCESS) throw new Error('Fail to get token id url!');
      this.setToken(response.data.accessToken);
      this.store.setRefreshToken(response.data.refreshToken);
      this.decodeTokenAndSetUser();
      this.store.setSelectedForm(AuthForms.LOGIN);
      useToast().add({
        color: 'success',
        title: '✅ Sesión iniciada con éxito.',
        description: 'Bienvenido a ContentFlow!'
      });
      navigateTo('/');
    } catch (error: any) {
      this.logout();
      useToast().add({
        color: 'error',
        title: `⚠️ ${error.response.data.message}`,
        description: 'Por favor trata de iniciar sesión con tus credenciales registradas en nuestra plataforma',
      });
      throw error;
    } finally {
      useUiStore().setSplashVisible(false);
    }
  }
}