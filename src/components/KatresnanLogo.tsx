'use client'
import { useTheme } from './ThemeProvider'
import Image from 'next/image'

interface KatresnanLogoProps {
  /** Override variant: 'light' = putih (untuk bg gelap), 'dark' = hijau (untuk bg terang) */
  variant?: 'light' | 'dark' | 'auto'
  height?: number
  className?: string
}

/**
 * Logo Katresnan
 * - variant="auto"  → ikuti theme (dark mode = logo_light, light mode = logo_dark)
 * - variant="light" → logo putih, cocok di atas background gelap (footer, cover gelap)
 * - variant="dark"  → logo hijau, cocok di atas background terang (navbar transparan)
 */
export default function KatresnanLogo({
  variant = 'auto',
  height = 32,
  className = '',
}: KatresnanLogoProps) {
  const { theme } = useTheme()

  const useLightLogo =
    variant === 'light' || (variant === 'auto' && theme === 'dark')

  const src = useLightLogo ? '/logo_light.svg' : '/logo_dark.svg'

  // Hitung aspect ratio: dark=119/25, light=104/22
  const aspectRatio = useLightLogo ? 104.9 / 22.2 : 119.1 / 25.1
  const width = Math.round(height * aspectRatio)

  return (
    <Image
      src={src}
      alt="Katresnan"
      width={width}
      height={height}
      className={`object-contain select-none ${className}`}
      priority
    />
  )
}
