/**
 * FlagImg — bandera de país real desde flagcdn.com
 * Funciona en cualquier SO (soluciona el problema de Windows con emojis de bandera)
 */

interface FlagImgProps {
  /** Código ISO 3166-1 alpha-2 en minúsculas, ej: "mx", "br", "cl" */
  code: string
  /** Ancho en px (alto se calcula automáticamente, proporción 4:3) */
  size?: number
  className?: string
}

export function FlagImg({ code, size = 32, className = '' }: FlagImgProps) {
  // flagcdn.com soporta: w20, w40, w80, w160, w320, w640
  const srcSize = size <= 20 ? 20 : size <= 40 ? 40 : 80
  const lowerCode = code.toLowerCase()

  return (
    <img
      src={`https://flagcdn.com/w${srcSize}/${lowerCode}.png`}
      srcSet={`https://flagcdn.com/w${srcSize * 2}/${lowerCode}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={`Bandera ${lowerCode.toUpperCase()}`}
      className={`inline-block object-cover rounded-sm ${className}`}
    />
  )
}
