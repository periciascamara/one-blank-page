// TypeScript types for the Supabase database schema
// Based on the PRD model: profiles, cards, badges, linktree_links, portfolio_links, admin_logs, platform_settings

export type PlanoEnum = 'simples' | 'medio' | 'completo'
export type RoleEnum = 'usuario' | 'admin'
export type StatusEnum = 'ativo' | 'dormindo' | 'apagado'
export type LayoutEnum = 'minimalista' | 'moderno' | 'academico'
export type PortfolioTipo = 'github' | 'latex' | 'pdf' | 'outro'

export interface Formacao {
  grau: string
  instituicao: string
  ano?: string
}

export interface Contatos {
  telefone?: string
  whatsapp?: string
  email?: string
}

export interface RedesSociais {
  linkedin?: string
  instagram?: string
  tiktok?: string
  site?: string
}

export interface Customizacao {
  cor_primaria?: string
  cor_fundo?: string
  imagem_fundo_url?: string
  nfc_posicao?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export interface Profile {
  id: string
  email: string
  nome: string
  username: string
  role: RoleEnum
  plano: PlanoEnum
  created_at: string
  updated_at: string
}

export interface Card {
  id: string
  user_id: string
  foto_url: string | null
  nome: string
  titulo: string | null
  formacao: Formacao[]
  especialidades: string[]
  contatos: Contatos
  redes_sociais: RedesSociais
  layout: LayoutEnum
  customizacao: Customizacao
  nfc_ativo: boolean
  status: StatusEnum
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  user_id: string
  label: string
  codigo: string | null
  ativo: boolean
  created_at: string
}

export interface LinktreeLink {
  id: string
  user_id: string
  label: string
  url: string
  ordem: number
  ativo: boolean
  created_at: string
}

export interface PortfolioLink {
  id: string
  user_id: string
  label: string
  url: string
  tipo: PortfolioTipo | null
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  acao: string
  target_id: string | null
  dados_antes: Record<string, unknown> | null
  dados_depois: Record<string, unknown> | null
  created_at: string
}

export interface PlatformSetting {
  key: string
  value: string
  updated_at: string
}

// Supabase Database type for SDK generics
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      cards: {
        Row: Card
        Insert: Omit<Card, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
        Update: Partial<Omit<Card, 'id' | 'user_id' | 'created_at'>>
      }
      badges: {
        Row: Badge
        Insert: Omit<Badge, 'id' | 'created_at'>
        Update: Partial<Omit<Badge, 'id' | 'user_id' | 'created_at'>>
      }
      linktree_links: {
        Row: LinktreeLink
        Insert: Omit<LinktreeLink, 'id' | 'created_at'>
        Update: Partial<Omit<LinktreeLink, 'id' | 'user_id' | 'created_at'>>
      }
      portfolio_links: {
        Row: PortfolioLink
        Insert: Omit<PortfolioLink, 'id' | 'created_at'>
        Update: Partial<Omit<PortfolioLink, 'id' | 'user_id' | 'created_at'>>
      }
      admin_logs: {
        Row: AdminLog
        Insert: Omit<AdminLog, 'id' | 'created_at'>
        Update: never
      }
      platform_settings: {
        Row: PlatformSetting
        Insert: PlatformSetting
        Update: Partial<Omit<PlatformSetting, 'key'>>
      }
    }
    Enums: {
      plano_enum: PlanoEnum
      role_enum: RoleEnum
      status_enum: StatusEnum
      layout_enum: LayoutEnum
    }
  }
}

// Composite types for public card view (joined data)
export interface PublicCardData {
  card: Card
  profile: Pick<Profile, 'username' | 'plano'>
  badges: Badge[]
  linktree_links: LinktreeLink[]
  portfolio_links: PortfolioLink[]
}
