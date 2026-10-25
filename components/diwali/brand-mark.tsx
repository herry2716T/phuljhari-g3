import Image from 'next/image'
import { partyConfig } from '@/lib/party-config'

type BrandMarkProps = {
  size?: 'hero' | 'persistent'
}

export function BrandMark({ size = 'hero' }: BrandMarkProps) {
  const logoSrc =
    size === 'hero'
      ? partyConfig.heroLogoSrc ?? partyConfig.logoSrc
      : partyConfig.logoSrc
  const accessibleName = logoSrc
    ? 'Original Diwali logo'
    : 'Original Diwali logo asset not attached'

  return (
    <div className={`brand-mark brand-mark--${size}${logoSrc ? ' brand-mark--image' : ''}`}>
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt="Original Diwali logo"
          fill
          priority={size === 'hero'}
          loading={size === 'persistent' ? 'eager' : undefined}
          sizes={size === 'hero' ? '(max-width: 640px) 148px, 188px' : '66px'}
          className="brand-mark__image"
        />
      ) : (
        <div className="brand-mark__placeholder" role="img" aria-label={accessibleName}>
          {size === 'persistent' ? (
            <span>Logo TBD</span>
          ) : (
            <>
              <span>Original Diwali logo</span>
              <span>asset not attached</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
