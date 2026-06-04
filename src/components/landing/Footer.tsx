import Link from 'next/link'
import { CreditCard, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/25">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">
                One<span className="gradient-brand-text">Blank</span>Page
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Plataforma de cartões digitais profissionais para médicos, peritos
              e profissionais de saúde. Sua identidade digital em um único link.
            </p>
            <p className="mt-4 text-xs text-text-tertiary">
              Um produto{' '}
              <a
                href="https://editoraviva.art.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                Editora Viva
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/register" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Criar Cartão
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Acessar Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Funcionalidades
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="w-4 h-4 text-text-tertiary" />
                <a href="mailto:contatos@editoraviva.art.br" className="hover:text-text-primary transition-colors">
                  contatos@editoraviva.art.br
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="w-4 h-4 text-text-tertiary" />
                <a href="https://wa.me/5531999572799" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                  +55 31 99957-2799
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-text-tertiary" />
                <span>Belo Horizonte, MG — Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} One Blank Page — Editora Viva. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
