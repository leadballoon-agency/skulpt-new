import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import FacebookPixel from '@/components/FacebookPixel'
import ConvertBox from '@/components/ConvertBox'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Post-Ozempic Skin Tightening Peterborough | Loose Skin After Weight Loss | Skulpt Body Contouring',
  description: 'Tighten loose skin after Ozempic, Wegovy or Mounjaro weight loss. Medical-grade skin tightening in Peterborough stimulates collagen for firmer skin. No surgery, no downtime. £50 Consultation & Treatment. Book your free consultation.',
  keywords: 'post Ozempic skin tightening, Wegovy loose skin treatment, Mounjaro skin laxity, GLP-1 weight loss skin, skin tightening Peterborough, loose skin after weight loss, RF skin tightening, collagen stimulation, non-surgical skin tightening, Skulpt Body Contouring, body contouring Peterborough',
  authors: [{ name: 'Skulpt Body Contouring' }],
  creator: 'Skulpt Body Contouring',
  publisher: 'Skulpt Body Contouring',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://skintight.uk'),
  alternates: {
    canonical: 'https://skintight.uk',
  },
  openGraph: {
    title: 'Post-Ozempic Skin Tightening | Tighten Loose Skin After Weight Loss | Skulpt Body Contouring Peterborough',
    description: 'Lost weight on Ozempic, Wegovy or Mounjaro? Tighten loose skin with medical-grade technology. Non-surgical skin tightening in Peterborough. £50 Consultation & Treatment. No downtime.',
    url: 'https://skintight.uk',
    siteName: 'Skulpt Body Contouring - Skin Tightening Peterborough',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: 'https://skintight.uk/images/clinic/hero-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Skulpt Body Contouring - Skin Tightening Specialist in Peterborough',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post-Ozempic Skin Tightening Peterborough | Skulpt Body Contouring',
    description: 'Tighten loose skin after weight loss. Medical-grade skin tightening - no surgery, no downtime. £50 Consultation & Treatment.',
    images: ['https://skintight.uk/images/clinic/hero-image.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'geo.region': 'GB-CAM',
    'geo.placename': 'Peterborough',
    'geo.position': '52.5695;-0.2405',
    'ICBM': '52.5695, -0.2405',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <FacebookPixel />
          <ConvertBox />
          <ScrollToTop />
        </Suspense>
        <StructuredData />
        {children}
      </body>
    </html>
  )
}
