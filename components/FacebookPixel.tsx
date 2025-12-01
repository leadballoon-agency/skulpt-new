'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

// Your Facebook Pixel ID
const FACEBOOK_PIXEL_ID = '1180925067336353'

export default function FacebookPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track PageView on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Facebook Pixel Base Code */}
      <Script
        id="facebook-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Helper function to safely track events
const trackFbEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

// Tracking functions for the landing page
export const trackAssessmentStart = () => {
  trackFbEvent('InitiateCheckout', { content_name: 'Skin Assessment Started' })
}

export const trackAssessmentComplete = (recommendation: string) => {
  trackFbEvent('CompleteRegistration', {
    content_name: 'Assessment Completed',
    value: recommendation,
    currency: 'GBP'
  })
}

export const trackBookingModalOpen = () => {
  trackFbEvent('ViewContent', { content_name: 'Booking Modal Opened' })
}

export const trackBookingSubmit = (treatmentType: string, price?: string) => {
  trackFbEvent('Lead', {
    content_name: 'Booking Form Submitted',
    content_category: treatmentType,
    value: price ? parseFloat(price.replace('£', '')) : undefined,
    currency: 'GBP'
  })
}

export const trackPhoneClick = () => {
  trackFbEvent('Contact', { content_name: 'Phone Number Clicked' })
}

export const trackPRPDealView = () => {
  trackFbEvent('ViewContent', {
    content_name: 'Full Course Deal Viewed',
    content_category: 'Special Offer'
  })
}

// Model Day tracking
export const trackModelDayCardClick = () => {
  trackFbEvent('ViewContent', {
    content_name: 'Model Day Card Clicked',
    content_category: 'Model Programme'
  })
}

export const trackModelDayModalOpen = () => {
  trackFbEvent('ViewContent', {
    content_name: 'Model Day Modal Opened',
    content_category: 'Model Programme'
  })
}

export const trackModelDayWhatsAppClick = () => {
  trackFbEvent('Lead', {
    content_name: 'Model Day WhatsApp Application',
    content_category: 'Model Programme'
  })
}
