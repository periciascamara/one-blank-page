'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { PublicCardData } from '@/lib/types/database'
import { CardFront } from '@/components/card/CardFront'
import { CardBack } from '@/components/card/CardBack'

interface CardContainerProps {
  data: PublicCardData
  showQrCode?: boolean
}

export function CardContainer({ data, showQrCode = true }: CardContainerProps) {
  const [cardData, setCardData] = useState<PublicCardData>(data)
  const [isFlipped, setIsFlipped] = useState(false)

  // Sync with prop updates
  useEffect(() => {
    setCardData(data)
  }, [data])

  // Sync with local storage changes for real-time dashboard preview updates
  useEffect(() => {
    if (typeof window === 'undefined') return

    const previewKey = `oneblankpage_preview_${data.profile.username}`

    // Check if there is already a live preview in localStorage
    const saved = localStorage.getItem(previewKey)
    if (saved) {
      try {
        setCardData(JSON.parse(saved))
      } catch (e) {
        console.error('Error parsing preview data from localStorage', e)
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === previewKey && e.newValue) {
        try {
          setCardData(JSON.parse(e.newValue))
        } catch (err) {
          console.error('Error parsing live preview updates', err)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [data.profile.username])

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
            <CardFront data={cardData} showQrCode={showQrCode} />
          </div>
          <div className="card-face card-face-back">
            <CardBack data={cardData} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
