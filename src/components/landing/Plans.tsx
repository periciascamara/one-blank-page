'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Crown, Zap, Star } from 'lucide-react'

const plans = [
  {
    name: 'Simples',
    price: 'Grátis',
    period: 'para sempre',
    description: 'Ideal para começar sua presença digital profissional.',
    icon: Star,
    gradient: 'from-surface-300 to-surface-400',
    borderColor: 'border-surface-400',
    badgeColor: 'bg-surface-400/20 text-text-secondary',
    features: [
      { label: 'Cartão Digital (Frente/Verso)', included: true },
      { label: 'QR Code em alta resolução', included: true },
      { label: 'Animação flip 3D', included: true },
      { label: '3 layouts exclusivos', included: true },
      { label: 'Personalização de cores', included: true },
      { label: 'Indicador NFC', included: true },
      { label: 'Badges de Validação', included: false },
      { label: 'Métricas de Clique', included: false },
      { label: 'Portfólio/Documentos', included: false },
      { label: 'Suporte Prioritário', included: false },
    ],
  },
  {
    name: 'Médio',
    price: 'R$ 29',
    period: '/mês',
    description: 'Para profissionais que precisam de credibilidade extra.',
    icon: Zap,
    gradient: 'from-brand-600 to-brand-500',
    borderColor: 'border-brand-500/50',
    badgeColor: 'bg-brand-500/20 text-brand-400',
    popular: true,
    features: [
      { label: 'Tudo do plano Simples', included: true },
      { label: 'Badges de Validação (CRM, etc.)', included: true },
      { label: 'Métricas de Clique por link', included: true },
      { label: 'Integração Google Analytics', included: true },
      { label: 'Redes sociais ilimitadas', included: true },
      { label: 'Links Linktree ilimitados', included: true },
      { label: 'Portfólio/Documentos', included: false },
      { label: 'Suporte Prioritário', included: false },
    ],
  },
  {
    name: 'Completo',
    price: 'R$ 59',
    period: '/mês',
    description: 'Acesso total com portfólio, documentos e suporte VIP.',
    icon: Crown,
    gradient: 'from-accent-600 to-accent-500',
    borderColor: 'border-accent-500/50',
    badgeColor: 'bg-accent-500/20 text-accent-400',
    features: [
      { label: 'Tudo do plano Médio', included: true },
      { label: 'Portfólio Integrado', included: true },
      { label: 'Upload de PDF e LaTeX', included: true },
      { label: 'Link para repositório GitHub', included: true },
      { label: 'Suporte Prioritário via chat', included: true },
      { label: 'Templates por especialidade', included: true },
      { label: 'Exportação como imagem HD', included: true },
      { label: 'Acesso antecipado a novidades', included: true },
    ],
  },
]

export default function Plans() {
  return (
    <section id="plans" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Escolha o plano{' '}
            <span className="gradient-brand-text">ideal para você</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Comece gratuitamente e evolua conforme suas necessidades. Upgrade ou downgrade a qualquer momento.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative rounded-2xl p-px ${
                plan.popular ? 'bg-gradient-to-b from-brand-500/50 to-brand-500/10' : 'bg-surface-300/50'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white gradient-brand rounded-full shadow-lg shadow-brand-500/30">
                  MAIS POPULAR
                </div>
              )}

              <div className={`relative h-full rounded-2xl p-6 lg:p-8 ${
                plan.popular ? 'bg-surface-100' : 'bg-surface-50'
              }`}>
                {/* Plan header */}
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${plan.badgeColor} mb-4`}>
                    <plan.icon className="w-3.5 h-3.5" />
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                    <span className="text-text-tertiary text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-surface-500 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-text-secondary' : 'text-text-tertiary line-through'
                        }`}
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`group flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'text-white gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02]'
                      : 'text-text-primary glass-button hover:scale-[1.02]'
                  } active:scale-[0.98]`}
                >
                  Começar agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
