export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Skulpt Body Contouring",
    "alternateName": "Skulpt",
    "url": "https://skintight.uk",
    "sameAs": [
      "https://skintight.uk"
    ],
    "logo": "https://skintight.uk/images/logo.png",
    "image": "https://skintight.uk/images/lift-tighten-define.png",
    "description": "Specialist body contouring and skin tightening clinic in Peterborough. Helping clients tighten loose skin after weight loss from Ozempic, Wegovy, Mounjaro or natural methods. Medical-grade technology with visible results.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Peterborough",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.5695",
      "longitude": "-0.2405"
    },
    "telephone": "+447700173390",
    "email": "info@skintight.uk",
    "priceRange": "££",
    "openingHours": [
      "Mo-Fr 09:00-18:00",
      "Sa 09:00-17:00"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Body Contouring Treatments",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultation & Treatment",
            "description": "Consultation plus first treatment session - ideal for trying our medical-grade technology"
          },
          "price": "50",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "5 Session Course",
            "description": "5 treatment sessions for visible skin tightening results"
          },
          "price": "199",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "10 Session Course",
            "description": "10 treatment sessions for complete body transformation - ideal for post-weight loss loose skin"
          },
          "price": "349",
          "priceCurrency": "GBP"
        }
      ]
    },
    "medicalSpecialty": [
      "Dermatology",
      "Aesthetic Medicine",
      "Body Contouring"
    ],
    "availableService": [
      {
        "@type": "Service",
        "name": "Post-Weight Loss Skin Tightening",
        "description": "Skin tightening for loose skin after Ozempic, Wegovy, Mounjaro or other weight loss"
      },
      {
        "@type": "Service",
        "name": "ProMax Lipo",
        "description": "Advanced non-invasive lipo technology to reduce fat and tighten skin"
      },
      {
        "@type": "Service",
        "name": "Body Contouring",
        "description": "Non-surgical skin firming and body contouring"
      },
      {
        "@type": "Service",
        "name": "Lymphatic Drainage",
        "description": "Lymphatic drainage therapy for detox and wellness"
      },
      {
        "@type": "Service",
        "name": "Tummy Skin Tightening",
        "description": "Target loose abdominal skin after significant weight loss"
      }
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Skulpt Body Contouring - Skin Tightening Peterborough",
    "alternateName": "Post-Ozempic Skin Tightening Peterborough",
    "url": "https://skintight.uk",
    "description": "Specialist skin tightening for loose skin after weight loss from Ozempic, Wegovy, Mounjaro. Medical-grade body contouring in Peterborough.",
    "publisher": {
      "@type": "Organization",
      "name": "Skulpt Body Contouring"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://skintight.uk/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Skulpt Body Contouring",
    "alternateName": "Post-Ozempic Skin Tightening Peterborough",
    "image": "https://skintight.uk/images/lift-tighten-define.png",
    "description": "Specialist body contouring clinic in Peterborough. Helping clients tighten loose skin after weight loss from Ozempic, Wegovy, Mounjaro. Medical-grade treatments with visible results, zero downtime.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Peterborough",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.5695",
      "longitude": "-0.2405"
    },
    "url": "https://skintight.uk",
    "telephone": "+447700173390",
    "email": "info@skintight.uk",
    "priceRange": "££",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "GBP",
    "areaServed": [
      {
        "@type": "City",
        "name": "Peterborough"
      },
      {
        "@type": "City",
        "name": "Cambridge"
      },
      {
        "@type": "City",
        "name": "Huntingdon"
      },
      {
        "@type": "City",
        "name": "Stamford"
      },
      {
        "@type": "City",
        "name": "Corby"
      }
    ],
    "medicalSpecialty": [
      "Dermatology",
      "Aesthetic Medicine",
      "Body Contouring"
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Post-Weight Loss Skin Tightening Peterborough",
    "description": "Specialist skin tightening treatment for loose skin after Ozempic, Wegovy or Mounjaro weight loss. Medical-grade body contouring technology.",
    "provider": {
      "@type": "BeautySalon",
      "name": "Skulpt Body Contouring",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Peterborough",
        "addressCountry": "GB"
      },
      "telephone": "+447700173390"
    },
    "areaServed": [
      "Peterborough",
      "Cambridge",
      "Huntingdon",
      "Stamford",
      "Corby",
      "Cambridgeshire"
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://skintight.uk",
      "serviceSmsNumber": "+447700173390"
    },
    "category": "Beauty Treatment",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Body Contouring Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Consultation & Treatment",
          "price": "50",
          "priceCurrency": "GBP",
          "description": "Consultation plus first treatment session"
        },
        {
          "@type": "Offer",
          "name": "5 Session Course",
          "price": "199",
          "priceCurrency": "GBP",
          "description": "5 treatment sessions for visible results"
        },
        {
          "@type": "Offer",
          "name": "10 Session Course",
          "price": "349",
          "priceCurrency": "GBP",
          "description": "10 treatment sessions for complete transformation"
        }
      ]
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can your treatments help with loose skin after Ozempic or Wegovy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our treatments are particularly effective for addressing the loose, sagging skin that can result from rapid weight loss on GLP-1 medications like Ozempic, Wegovy, or Mounjaro. The technology stimulates your body's natural collagen production to tighten and firm the skin over a course of treatments."
        }
      },
      {
        "@type": "Question",
        "name": "How many sessions will I need?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Everyone's skin is different, so we start with a consultation + first treatment for just £50. During this session, Michelle will assess your skin, you'll experience the treatment firsthand, and she'll create a personalised plan with the exact number of sessions you need. Results typically start showing from session 3-4."
        }
      },
      {
        "@type": "Question",
        "name": "Is there any downtime after treatment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No downtime at all. Our treatments are completely non-invasive. You can return to your normal activities immediately after each session. Some clients experience mild warmth or redness in the treated area, which typically subsides within a few hours."
        }
      },
      {
        "@type": "Question",
        "name": "What areas can be treated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our technology is effective on multiple areas including tummy, arms (bingo wings), thighs, buttocks, and back. These are the most common areas affected by loose skin after weight loss from GLP-1 medications or natural weight loss."
        }
      },
      {
        "@type": "Question",
        "name": "How long do results last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Results are long-lasting as the treatment stimulates your body's own collagen production. With a healthy lifestyle and stable weight, results can last 12-18 months or longer. We recommend maintenance sessions to maintain optimal skin firmness."
        }
      },
      {
        "@type": "Question",
        "name": "Is treatment suitable while still taking Ozempic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Many clients continue their GLP-1 medication while having treatments. In fact, starting skin tightening during your weight loss journey can help prevent excessive skin laxity. We recommend discussing with your prescriber if you have any concerns."
        }
      }
    ]
  }

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Skulpt Body Contouring",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "69",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Hannah-Sophia T."
        },
        "datePublished": "2024-09-15",
        "reviewBody": "Michelle is incredibly professional and has a huge amount of knowledge and empathy. I have just finished a course of the pro max treatment on my tummy and I am unbelievably impressed by my results! Hugely recommend and just do it!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Emma S."
        },
        "datePublished": "2024-07-20",
        "reviewBody": "All I can say is Wow!! Even after my first Promax Lipo session I could see a difference. I had a full course and I was so so pleased with the results. Skulpt is a lovely clinic setting with a great team and fab machines!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sana H."
        },
        "datePublished": "2024-10-15",
        "reviewBody": "Absolutely fantastic! I've just completed my 10th session and immediately booked another 10. Each session I notice a difference and I could not be more happy! Highly recommend!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Melissa B."
        },
        "datePublished": "2024-04-18",
        "reviewBody": "I have just finished my 10 sessions with the LipoMax and actually saw results after just 3 sessions! I had a problematic lower tummy following my cesarean and the LipoMax has made my tummy completely flat and loose skin tightened!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Adila R."
        },
        "datePublished": "2024-06-05",
        "reviewBody": "I have just finished a course of the pro max non invasive lipo and I can honestly say what a difference it has made. I have lost not only inches but it has noticeably tightened my skin. If you are sitting on the fence, just do it!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
    </>
  )
}
