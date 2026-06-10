'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function Showcase() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-card border border-white/5 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                Conheça nosso projeto{' '}
                <span className="gradient-brand-text">One Way Out</span>
              </h2>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Descubra uma experiência única. Acesse a página oficial do projeto One Way Out para explorar mais detalhes e imergir nessa jornada incrível.
              </p>
              
              <a 
                href="https://periciascamara.github.io/onewayout/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-medium hover:bg-brand-600 transition-all duration-300 group shadow-[0_0_20px_rgba(var(--brand-500),0.3)] hover:shadow-[0_0_30px_rgba(var(--brand-500),0.5)]"
              >
                Visitar One Way Out
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden glass-light border border-white/10 flex items-center justify-center bg-black/20 group"
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-transparent mix-blend-overlay group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-3xl sm:text-4xl font-black tracking-widest text-white/80 uppercase group-hover:scale-105 transition-transform duration-500 drop-shadow-xl">
                  One Way Out
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
