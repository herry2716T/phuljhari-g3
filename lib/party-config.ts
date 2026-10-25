export type PartyConfig = {
  logoSrc: string | null
  heroLogoSrc: string | null
  soundSrc: string | null
  heroBackdropSrc: string
  reasons: Array<{
    copy: string
    imageSrc: string | null
    imageAlt: string
    placeholderLabel: string
  }>
  scenes: Array<{
    id: 'diwali-vibes' | 'games' | 'food-drinks'
    heading: string
    tagline: string
    imageSrc: string
    imageAlt: string
  }>
  event: {
    venueName: string
    fullAddress: string
    date: string
    time: string
    arrivalNote: string
  }
  destinations: {
    directionsUrl: string | null
    whatsappRsvpUrl: string | null
  }
}

export const partyConfig: PartyConfig = {
  logoSrc: '/images/diwali-logo-background.png',
  heroLogoSrc: '/images/diwali-logo-transparent.png',
  soundSrc: null,
  heroBackdropSrc: '/images/hero-festive-atmosphere.png',
  reasons: [
    {
      copy: 'momentarily escape from this miserable life',
      imageSrc: null,
      imageAlt: 'Meme or photo for momentarily escape from this miserable life',
      placeholderLabel: 'MEME / PHOTO ASSET 01',
    },
    {
      copy: 'to keep that Navaratri energy going on',
      imageSrc: null,
      imageAlt: 'Meme or photo for to keep that Navaratri energy going on',
      placeholderLabel: 'MEME / PHOTO ASSET 02',
    },
    {
      copy: 'you are the part of that cool people',
      imageSrc: null,
      imageAlt: 'Meme or photo for you are the part of that cool people',
      placeholderLabel: 'MEME / PHOTO ASSET 03',
    },
    {
      copy: 'maybe he/she will be there',
      imageSrc: null,
      imageAlt: 'Meme or photo for maybe he/she will be there',
      placeholderLabel: 'MEME / PHOTO ASSET 04',
    },
  ],
  scenes: [
    {
      id: 'diwali-vibes',
      heading: 'Diwali vibes',
      tagline: 'you are the vibe',
      imageSrc: '/images/diwali-vibes.png',
      imageAlt: 'Clay-style festive lamps and sculptural objects glowing in warm light',
    },
    {
      id: 'games',
      heading: 'Games',
      tagline: 'heart of the event',
      imageSrc: '/images/games-clay.png',
      imageAlt: 'Abstract clay dice, blank cards, tokens and a sculptural game-inspired form',
    },
    {
      id: 'food-drinks',
      heading: 'Food / Drinks',
      tagline: 'to be alive obv',
      imageSrc: '/images/festive-food.png',
      imageAlt: 'Hand-drawn illustration of traditional Indian festive sweets and snacks',
    },
  ],
  event: {
    venueName: 'TBD — TO BE DECIDED',
    fullAddress: 'TBD — TO BE DECIDED',
    date: 'TBD — TO BE DECIDED',
    time: 'TBD — TO BE DECIDED',
    arrivalNote: 'TBD — TO BE DECIDED',
  },
  destinations: {
    directionsUrl: null,
    whatsappRsvpUrl: null,
  },
}
