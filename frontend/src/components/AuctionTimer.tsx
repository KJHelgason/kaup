"use client"

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface AuctionTimerProps {
  endDate: string
  variant?: 'default' | 'compact' | 'large'
}

export function AuctionTimer({ endDate, variant = 'default' }: AuctionTimerProps) {
  const { language } = useLanguage()
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    expired: boolean
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, expired: false })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  if (timeLeft.expired) {
    return (
      <div className={`flex items-center gap-1 text-red-600 ${
        variant === 'large' ? 'text-lg font-semibold' : 
        variant === 'compact' ? 'text-xs' : 'text-sm'
      }`}>
        <Clock className={variant === 'large' ? 'w-5 h-5' : 'w-4 h-4'} />
        <span>{language === 'is' ? 'Lokið' : 'Ended'}</span>
      </div>
    )
  }

  // Determine urgency color
  const totalHoursLeft = timeLeft.days * 24 + timeLeft.hours
  const urgencyColor = totalHoursLeft < 1 ? 'text-red-600' : 
                       totalHoursLeft < 24 ? 'text-orange-600' : 
                       'text-muted-foreground'

  if (variant === 'compact') {
    // Compact version for cards
    return (
      <div className={`flex items-center gap-1 ${urgencyColor}`}>
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">
          {timeLeft.days > 0 
            ? `${timeLeft.days}d ${timeLeft.hours}h`
            : `${timeLeft.hours}h ${timeLeft.minutes}m`
          }
        </span>
      </div>
    )
  }

  if (variant === 'large') {
    // Large version for listing detail page - compact grid style
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-medium">
            {language === 'is' ? 'Tími eftir' : 'Time Remaining'}
          </span>
        </div>
        <div className={`grid ${timeLeft.days > 0 ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
          {timeLeft.days > 0 && (
            <div className="text-center bg-muted rounded-md py-1.5 px-2">
              <div className={`text-lg font-bold ${urgencyColor}`}>
                {timeLeft.days}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'is' ? 'dagar' : 'days'}
              </div>
            </div>
          )}
          <div className="text-center bg-muted rounded-md py-1.5 px-2">
            <div className={`text-lg font-bold ${urgencyColor}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">
              {language === 'is' ? 'klst' : 'hrs'}
            </div>
          </div>
          <div className="text-center bg-muted rounded-md py-1.5 px-2">
            <div className={`text-lg font-bold ${urgencyColor}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">
              {language === 'is' ? 'mín' : 'min'}
            </div>
          </div>
          <div className="text-center bg-muted rounded-md py-1.5 px-2">
            <div className={`text-lg font-bold ${urgencyColor}`}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">
              {language === 'is' ? 'sek' : 'sec'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default version
  return (
    <div className={`flex items-center gap-1.5 ${urgencyColor}`}>
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
