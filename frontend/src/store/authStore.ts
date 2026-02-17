import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// SSO role entry from temco-api
interface RoleEntry {
  userLoginId: number
  roleId: number | null
  roleName: string | null
  appId: number
  appName: string | null
}

// SSO User from temco-api (new format with roles[])
interface SSOUser {
  id: number
  username: string
  fullName: string
  email: string
  nic: string
  roles: RoleEntry[]
}

// Member format for backward compatibility
interface Member {
  id: number
  memberId: string
  name: string
  email: string
  phone: string
}

interface AuthState {
  token: string | null
  member: Member | null
  user: SSOUser | null
  isAuthenticated: boolean
  login: (token: string, member: Member) => void
  loginSSO: (token: string, user: SSOUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      member: null,
      user: null,
      isAuthenticated: false,
      login: (token, member) => set({ token, member, isAuthenticated: true }),
      loginSSO: (token, user) => set({ 
        token, 
        user,
        // Map SSO user to member for backward compatibility
        member: {
          id: user.id,
          memberId: user.nic,
          name: user.fullName,
          email: user.email,
          phone: ''
        },
        isAuthenticated: true 
      }),
      logout: () => set({ token: null, member: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
