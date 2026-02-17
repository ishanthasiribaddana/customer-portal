import axios from 'axios'

// Auth API - points to SSOService via proxy
const authApiClient = axios.create({
  baseURL: '/api/v1/customer/auth',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export interface LoginRequest {
  username: string
  password: string
}

export interface RoleEntry {
  userLoginId: number
  roleId: number | null
  roleName: string | null
  appId: number
  appName: string | null
}

export interface CustomerLoginResponse {
  success: boolean
  token: string
  expiresAt: string
  user: {
    id: number
    username: string
    fullName: string
    email: string
    nic: string
    roles: RoleEntry[]
  }
}

export interface SignupRequest {
  nic: string
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  password: string
}

export interface SignupResponse {
  success: boolean
  profileId: number
  email: string
  message: string
}

export const authApi = {
  signup: (data: SignupRequest) => authApiClient.post<SignupResponse>('/signup', data),
  login: (data: LoginRequest) => authApiClient.post<CustomerLoginResponse>('/login', data),
  getCurrentUser: () => authApiClient.get('/me'),
  logout: () => authApiClient.post('/logout'),
  validateToken: () => authApiClient.get('/validate'),
  getProfile: () => authApiClient.get('/profile'),
  updateProfile: (data: unknown) => authApiClient.put('/profile', data),
  changePassword: (currentPassword: string, newPassword: string) => 
    authApiClient.post('/change-password', { currentPassword, newPassword }),
  updateNotificationSettings: (settings: unknown) => 
    authApiClient.put('/settings/notifications', settings),
  updateSecuritySettings: (settings: unknown) => 
    authApiClient.put('/settings/security', settings),
}

// Account Unlock API - WhatsApp OTP based unlock
export interface UnlockRequestResponse {
  success: boolean
  message: string
  maskedPhone?: string
}

export interface UnlockVerifyResponse {
  success: boolean
  message: string
}

export interface WhatsAppInfoResponse {
  success: boolean
  businessPhone: string
  instructions?: string
}

export const unlockApi = {
  requestUnlock: (username: string) => 
    authApiClient.post<UnlockRequestResponse>('/request-unlock', { username }),
  verifyOtp: (username: string, otp: string) => 
    authApiClient.post<UnlockVerifyResponse>('/unlock-account', { username, otp }),
  getWhatsAppInfo: () => 
    authApiClient.get<WhatsAppInfoResponse>('/whatsapp-info'),
}
