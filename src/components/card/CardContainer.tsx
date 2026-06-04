'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { PublicCardData } from '@/lib/types/database'
import { CardFront } from '@/components/card/CardFront'
import { CardBack } from '@/components/card/CardBack'

interface CardContainerProps {
  data: PublicCardData
}

export function CardContainer({ data }: CardContainerProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleFlip()
      }
    },
    [handleFlip],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div
        className="card-scene w-full cursor-pointer"
        style={{ minHeight: '600px' }}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={
          isFlipped
            ? 'Cartão profissional — verso visível. Clique para ver a frente.'
            : 'Cartão profissional — frente visível. Clique para ver o verso.'
        }
      >
        <div
          className={`card-flipper ${isFlipped ? 'flipped' : ''}`}
          style={{ minHeight: '600px' }}
        >
          <div className="card-face">
            <CardFront data={data} />
          </div>
          <div className="card-face card-face-back">
            <CardBack data={data} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
