'use client'

import { motion } from 'framer-motion'
import {
  CreditCard,
  QrCode,
  Shield,
  Wifi,
  Palette,
  BarChart3,
  FolderOpen,
  Headphones,
} from 'lucide-react'

const features = [
  {
    icon: CreditCard,
    title: 'Cartão Digital Interativo',
    description: 'Frente e verso com animação 3D. Centralize todas as suas informações profissionais em um design premium.',
    gradient: 'from-brand-500/20 to-brand-700/10',
    iconColor: 'text-brand-400',
  },
  {
    icon: QrCode,
    title: 'QR Code em Alta Resolução',
    description: 'Gere QR Codes personalizáveis em PNG e SVG para cartões físicos e materiais gráficos.',
    gradient: 'from-accent-500/20 to-accent-700/10',
    iconColor: 'text-accent-400',
  },
  {
    icon: Shield,
    title: 'Badges de Validação',
    description: 'Exiba seu registro CRM, certificações de perito e outras credenciais verificáveis.',
    gradient: 'from-emerald-500/20 to-emerald-700/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Wifi,
    title: 'Compatível com NFC',
    description: 'Compartilhe seu cartão por aproximação. Basta encostar o celular para transferir seus contatos.',
    gradient: 'from-sky-500/20 to-sky-700/10',
    iconColor: 'text-sky-400',
  },
  {
    icon: Palette,
    title: 'Totalmente Personalizável',
    description: 'Escolha entre 3 layouts exclusivos, customize cores, fontes e imagem de fundo.',
    gradient: 'from-violet-500/20 to-violet-700/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: BarChart3,
    title: 'Métricas de Acesso',
    description: 'Acompanhe visualizações do perfil, cliques em links e downloads de QR Code em tempo real.',
    gradient: 'from-amber-500/20 to-amber-700/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: FolderOpen,
    title: 'Portfólio Integrado',
    description: 'Vincule documentos PDF, repositórios GitHub e produções acadêmicas ao seu cartão.',
    gradient: 'from-rose-500/20 to-rose-700/10',
    iconColor: 'text-rose-400',
  },
  {
    icon: Headphones,
    title: 'Suporte Prioritário',
    description: 'Atendimento exclusivo via chat para usuários do plano Completo. Estamos sempre prontos.',
    gradient: 'from-teal-500/20 to-teal-700/10',
    iconColor: 'text-teal-400',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-[120px]" />

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
            Tudo que você precisa em{' '}
            <span className="gradient-brand-text">um só lugar</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Funcionalidades pensadas para profissionais de saúde que valorizam
            credibilidade, praticidade e design.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-2xl p-6 glass-light hover:glass-card transition-all duration-500 cursor-default"
            >
              {/* Gradient bg on hover */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.iconColor}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
