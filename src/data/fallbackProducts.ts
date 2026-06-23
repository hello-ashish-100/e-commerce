import type { FakeStoreProduct } from '../types/product'

export const fallbackProducts: FakeStoreProduct[] = [
  {
    id: 1,
    title: 'Everyday Travel Backpack',
    price: 64.95,
    description:
      'A lightweight everyday backpack with padded storage, durable fabric, and clean utility pockets.',
    category: 'bags',
    image: createProductImage('Travel Backpack', '#ede5d8', '#1c1a17'),
    rating: { rate: 4.5, count: 128 },
  },
  {
    id: 2,
    title: 'Classic Cotton Tee',
    price: 24.5,
    description:
      'A soft cotton tee with a relaxed shape, easy drape, and all-day comfort.',
    category: 'apparel',
    image: createProductImage('Cotton Tee', '#f3eee6', '#314432'),
    rating: { rate: 4.2, count: 94 },
  },
  {
    id: 3,
    title: 'Minimal Silver Bracelet',
    price: 39.99,
    description:
      'A polished bracelet with a minimal profile designed for daily wear.',
    category: 'jewelry',
    image: createProductImage('Silver Bracelet', '#eceff1', '#4d5965'),
    rating: { rate: 4.7, count: 72 },
  },
  {
    id: 4,
    title: 'Structured Work Jacket',
    price: 89.0,
    description:
      'A structured jacket made for layering, with a crisp silhouette and practical pockets.',
    category: 'apparel',
    image: createProductImage('Work Jacket', '#e6e0d4', '#283138'),
    rating: { rate: 4.4, count: 67 },
  },
  {
    id: 5,
    title: 'Compact Crossbody Bag',
    price: 48.75,
    description:
      'A compact crossbody bag with adjustable strap, secure zip closure, and daily carry space.',
    category: 'bags',
    image: createProductImage('Crossbody Bag', '#efe8dc', '#6b4f37'),
    rating: { rate: 4.6, count: 111 },
  },
  {
    id: 6,
    title: 'Slim Wireless Headphones',
    price: 119.99,
    description:
      'Wireless headphones with a slim foldable frame, clear sound, and long battery life.',
    category: 'electronics',
    image: createProductImage('Headphones', '#e7edf2', '#25364a'),
    rating: { rate: 4.3, count: 203 },
  },
  {
    id: 7,
    title: 'Ribbed Knit Sweater',
    price: 58.25,
    description:
      'A ribbed knit sweater with a soft hand feel and comfortable seasonal weight.',
    category: 'apparel',
    image: createProductImage('Knit Sweater', '#eee2d5', '#765342'),
    rating: { rate: 4.8, count: 86 },
  },
  {
    id: 8,
    title: 'Matte Gold Ring Set',
    price: 34.5,
    description:
      'A stackable ring set with a matte gold finish and simple geometric forms.',
    category: 'jewelry',
    image: createProductImage('Ring Set', '#f2eadc', '#8a6b2f'),
    rating: { rate: 4.1, count: 58 },
  },
]

function createProductImage(label: string, background: string, foreground: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <rect width="900" height="900" rx="64" fill="${background}" />
      <circle cx="450" cy="350" r="160" fill="#fffaf3" opacity="0.9" />
      <rect x="250" y="505" width="400" height="120" rx="32" fill="#fffaf3" opacity="0.9" />
      <text x="450" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="${foreground}">
        ${label}
      </text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
