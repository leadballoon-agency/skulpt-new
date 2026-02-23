'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { trackAssessmentStart, trackAssessmentComplete } from '@/components/FacebookPixel'

// Configuration
const CONFIG = {
  webhookUrl: 'https://services.leadconnectorhq.com/hooks/GVVaIBlAD0WmNtFQQ6KJ/webhook-trigger/e1ac65b4-49e7-4ae1-bd46-8b3958893a0c',
  whatsappNumber: '447700173390',
  phoneNumber: '07700 173390',
}

// Rotating pain point headlines - appeals to both fat loss AND skin tightening audiences
const ROTATING_HEADLINES = [
  "Stubborn Fat That Won't Budge? We Can Help.",
  "Get Your Body Ready for That Special Occasion",
  "Tighten, Tone & Transform Your Trouble Spots",
  "Finally - A Non-Surgical Solution That Works",
]

// Question types
type QuestionType = 'single' | 'multi'

interface Question {
  id: string
  section: number
  sectionName: string
  question: string
  subtext?: string
  type: QuestionType
  options: { value: string; label: string; icon?: string }[]
  showWhen?: (answers: Record<string, any>) => boolean  // Conditional display
}

// Acknowledgments shown after primaryGoal selection
const getAcknowledgment = (goal: string, name: string): string => {
  const acks: Record<string, string> = {
    stubbornFat: `${name}, we understand how frustrating stubborn fat can be - especially when diet and exercise don't seem to help.`,
    looseSkin: `${name}, loose skin after changes in your body can really affect your confidence. Let's find the right solution.`,
    both: `${name}, dealing with both stubborn fat and loose skin is more common than you think - and our RF treatment addresses both!`,
    toneUp: `How exciting ${name}! Let's create a plan to get you looking and feeling amazing for your special occasion.`,
    postPregnancy: `${name}, your body has done something incredible. Now let's help you feel like yourself again.`,
  }
  return acks[goal] || ''
}

// Dynamic section names based on path
const getSectionName = (goal: string): string => {
  const names: Record<string, string> = {
    stubbornFat: 'Your Stubborn Fat',
    looseSkin: 'Your Skin Concerns',
    both: 'Your Body Concerns',
    toneUp: 'Your Event Goals',
    postPregnancy: 'Your Post-Baby Journey',
  }
  return names[goal] || 'About You'
}


// All questions - master bank with conditional visibility
const allQuestions: Question[] = [
  // ========================================
  // ENTRY QUESTION - Always shown first
  // ========================================
  {
    id: 'primaryGoal',
    section: 1,
    sectionName: 'About You',
    question: "{name}, what's your main body concern right now?",
    subtext: 'This helps us personalise your assessment',
    type: 'single',
    options: [
      { value: 'stubbornFat', label: 'Stubborn fat I can\'t shift', icon: '🎯' },
      { value: 'looseSkin', label: 'Loose or sagging skin', icon: '✨' },
      { value: 'both', label: 'Both - fat and loose skin', icon: '🔄' },
      { value: 'toneUp', label: 'Want to tone up for an event', icon: '🎉' },
      { value: 'postPregnancy', label: 'Post-pregnancy body', icon: '👶' },
    ],
  },

  // ========================================
  // PATH 1: STUBBORN FAT
  // ========================================
  {
    id: 'stubbornFat_duration',
    section: 1,
    sectionName: 'Your Stubborn Fat',
    question: '{name}, how long have you been struggling with this stubborn fat?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'stubbornFat',
    options: [
      { value: 'recently', label: 'Recently (past few months)', icon: '🆕' },
      { value: '1-2years', label: '1-2 years', icon: '📅' },
      { value: 'years', label: 'Several years', icon: '⏰' },
      { value: 'always', label: 'As long as I can remember', icon: '💭' },
    ],
  },
  {
    id: 'stubbornFat_location',
    section: 1,
    sectionName: 'Your Stubborn Fat',
    question: 'Where does the fat seem to accumulate most?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'stubbornFat',
    options: [
      { value: 'tummy', label: 'Tummy/abdomen', icon: '🎯' },
      { value: 'loveHandles', label: 'Love handles/flanks', icon: '🫶' },
      { value: 'thighs', label: 'Thighs', icon: '🦵' },
      { value: 'arms', label: 'Upper arms', icon: '💪' },
      { value: 'multiple', label: 'Multiple areas', icon: '🔄' },
    ],
  },
  {
    id: 'stubbornFat_dietExercise',
    section: 1,
    sectionName: 'Your Stubborn Fat',
    question: 'Have diet and exercise helped at all?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'stubbornFat',
    options: [
      { value: 'noChange', label: 'No change at all', icon: '😔' },
      { value: 'plateau', label: 'Some progress but hit a plateau', icon: '📊' },
      { value: 'exceptStubborn', label: 'Helps everywhere except stubborn areas', icon: '🎯' },
      { value: 'notTried', label: 'Haven\'t tried consistently', icon: '🤷' },
    ],
  },

  // ========================================
  // PATH 2: LOOSE SKIN
  // ========================================
  {
    id: 'looseSkin_cause',
    section: 1,
    sectionName: 'Your Skin Concerns',
    question: '{name}, what caused your loose skin?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'looseSkin',
    options: [
      { value: 'ozempic', label: 'Ozempic/Wegovy/Mounjaro', icon: '💊' },
      { value: 'naturalLoss', label: 'Natural weight loss', icon: '🏃' },
      { value: 'aging', label: 'Aging', icon: '⏰' },
      { value: 'postPregnancy', label: 'Post-pregnancy', icon: '👶' },
      { value: 'combination', label: 'Combination of factors', icon: '🔄' },
    ],
  },
  {
    id: 'looseSkin_weightLost',
    section: 1,
    sectionName: 'Your Skin Concerns',
    question: 'Approximately how much weight did you lose?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'looseSkin',
    options: [
      { value: 'under1stone', label: 'Under 1 stone', icon: '📉' },
      { value: '1-2stone', label: '1-2 stone', icon: '📊' },
      { value: '2-4stone', label: '2-4 stone', icon: '📈' },
      { value: '4-6stone', label: '4-6 stone', icon: '🏆' },
      { value: '6plus', label: '6+ stone', icon: '⭐' },
    ],
  },
  {
    id: 'looseSkin_severity',
    section: 1,
    sectionName: 'Your Skin Concerns',
    question: 'How would you describe your skin laxity?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'looseSkin',
    options: [
      { value: 'mild', label: 'Mild (less firm than before)', icon: '🔹' },
      { value: 'moderate', label: 'Moderate (visible sag)', icon: '🔸' },
      { value: 'significant', label: 'Significant (folds/hangs)', icon: '🔻' },
    ],
  },

  // ========================================
  // PATH 3: BOTH FAT + SKIN
  // ========================================
  {
    id: 'both_priority',
    section: 1,
    sectionName: 'Your Body Concerns',
    question: '{name}, which bothers you more?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'both',
    options: [
      { value: 'fat', label: 'The stubborn fat', icon: '🔥' },
      { value: 'skin', label: 'The loose skin', icon: '✨' },
      { value: 'equal', label: 'Equally both', icon: '⚖️' },
    ],
  },
  {
    id: 'both_trigger',
    section: 1,
    sectionName: 'Your Body Concerns',
    question: 'What triggered these changes?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'both',
    options: [
      { value: 'medication', label: 'Weight loss medication', icon: '💊' },
      { value: 'dietExercise', label: 'Diet and exercise', icon: '🏃' },
      { value: 'aging', label: 'Aging', icon: '⏰' },
      { value: 'pregnancy', label: 'Pregnancy', icon: '👶' },
      { value: 'lifeChanges', label: 'General life changes', icon: '🔄' },
    ],
  },
  {
    id: 'both_speed',
    section: 1,
    sectionName: 'Your Body Concerns',
    question: 'How quickly did the changes happen?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'both',
    options: [
      { value: 'gradual', label: 'Gradual over years', icon: '🐢' },
      { value: 'pastYear', label: 'Within the past year', icon: '📅' },
      { value: 'rapid', label: 'Very rapid (months)', icon: '⚡' },
    ],
  },

  // ========================================
  // PATH 4: TONE UP FOR EVENT
  // ========================================
  {
    id: 'toneUp_occasion',
    section: 1,
    sectionName: 'Your Event Goals',
    question: '{name}, what\'s the occasion?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'toneUp',
    options: [
      { value: 'myWedding', label: 'My wedding', icon: '💍' },
      { value: 'attendWedding', label: 'Attending a wedding', icon: '💒' },
      { value: 'holiday', label: 'Holiday/vacation', icon: '🏖️' },
      { value: 'reunion', label: 'Reunion or party', icon: '🎊' },
      { value: 'photoshoot', label: 'Photoshoot', icon: '📸' },
      { value: 'summer', label: 'Getting ready for summer', icon: '☀️' },
    ],
  },
  {
    id: 'toneUp_timeline',
    section: 1,
    sectionName: 'Your Event Goals',
    question: 'When is your event?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'toneUp',
    options: [
      { value: '4weeks', label: 'Within 4 weeks', icon: '🚀' },
      { value: '1-2months', label: '1-2 months', icon: '📅' },
      { value: '2-3months', label: '2-3 months', icon: '🗓️' },
      { value: '3-6months', label: '3-6 months', icon: '📆' },
      { value: 'general', label: 'Just want to look better generally', icon: '💫' },
    ],
  },
  {
    id: 'toneUp_goal',
    section: 1,
    sectionName: 'Your Event Goals',
    question: 'What would make you feel confident for this event?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'toneUp',
    options: [
      { value: 'flatterTummy', label: 'Flatter tummy', icon: '🎯' },
      { value: 'slimmerArms', label: 'Slimmer arms', icon: '💪' },
      { value: 'definedShape', label: 'More defined shape', icon: '✨' },
      { value: 'tighterSkin', label: 'Tighter skin', icon: '🔥' },
      { value: 'inchLoss', label: 'Overall inch loss', icon: '👗' },
    ],
  },

  // ========================================
  // PATH 5: POST-PREGNANCY
  // ========================================
  {
    id: 'postPregnancy_babyAge',
    section: 1,
    sectionName: 'Your Post-Baby Journey',
    question: '{name}, how old is your youngest child?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'postPregnancy',
    options: [
      { value: 'under6months', label: 'Under 6 months', icon: '👶' },
      { value: '6-12months', label: '6-12 months', icon: '🍼' },
      { value: '1-2years', label: '1-2 years', icon: '🧒' },
      { value: '2plus', label: '2+ years', icon: '👧' },
    ],
  },
  {
    id: 'postPregnancy_breastfeeding',
    section: 1,
    sectionName: 'Your Post-Baby Journey',
    question: 'Are you currently breastfeeding?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'postPregnancy',
    options: [
      { value: 'yesExclusive', label: 'Yes, exclusively', icon: '🤱' },
      { value: 'yesPartial', label: 'Yes, partially', icon: '🍼' },
      { value: 'no', label: 'No', icon: '✅' },
      { value: 'na', label: 'N/A', icon: '➖' },
    ],
  },
  {
    id: 'postPregnancy_concern',
    section: 1,
    sectionName: 'Your Post-Baby Journey',
    question: 'What concerns you most about your post-baby body?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'postPregnancy',
    options: [
      { value: 'mummyTummy', label: 'Mummy tummy/pooch', icon: '🎯' },
      { value: 'looseSkin', label: 'Loose skin on tummy', icon: '✨' },
      { value: 'softness', label: 'Overall softness', icon: '🔄' },
      { value: 'diastasis', label: 'Separated abs (diastasis)', icon: '💪' },
      { value: 'all', label: 'All of the above', icon: '😔' },
    ],
  },
  {
    id: 'postPregnancy_cleared',
    section: 1,
    sectionName: 'Your Post-Baby Journey',
    question: 'Have you been cleared for exercise by your GP/midwife?',
    type: 'single',
    showWhen: (answers) => answers.primaryGoal === 'postPregnancy',
    options: [
      { value: 'yesCleared', label: 'Yes, fully cleared', icon: '✅' },
      { value: 'partial', label: 'Partially', icon: '🔸' },
      { value: 'notYet', label: 'Not yet', icon: '⏳' },
      { value: 'notRelevant', label: 'It\'s been years, not relevant', icon: '➖' },
    ],
  },

  // ========================================
  // SHARED QUESTIONS - All paths merge here
  // ========================================

  // SECTION 2: YOUR CONCERNS
  {
    id: 'areasOfConcern',
    section: 2,
    sectionName: 'Your Concerns',
    question: '{name}, which areas concern you most?',
    subtext: 'Select all that apply',
    type: 'multi',
    options: [
      { value: 'tummy', label: 'Tummy/abdomen', icon: '🎯' },
      { value: 'loveHandles', label: 'Love handles/flanks', icon: '🫶' },
      { value: 'arms', label: 'Upper arms ("bingo wings")', icon: '💪' },
      { value: 'innerThighs', label: 'Inner thighs', icon: '🦵' },
      { value: 'outerThighs', label: 'Outer thighs/saddlebags', icon: '🍐' },
      { value: 'back', label: 'Back/bra bulge', icon: '🔙' },
      { value: 'doubleC', label: 'Double chin/jawline', icon: '👤' },
      { value: 'buttocks', label: 'Buttocks', icon: '🍑' },
    ],
  },
  {
    id: 'concernType',
    section: 2,
    sectionName: 'Your Concerns',
    question: 'In these areas, what bothers you most?',
    type: 'single',
    options: [
      { value: 'fat', label: 'Excess fat/bulges that won\'t budge', icon: '🔥' },
      { value: 'skin', label: 'Loose, saggy or crepey skin', icon: '✨' },
      { value: 'both', label: 'Both fat and loose skin', icon: '🎯' },
      { value: 'lackTone', label: 'Lack of muscle tone/definition', icon: '💪' },
    ],
  },
  {
    id: 'triedBefore',
    section: 2,
    sectionName: 'Your Concerns',
    question: 'What have you already tried?',
    subtext: 'Select all that apply',
    type: 'multi',
    options: [
      { value: 'diet', label: 'Dieting/calorie restriction', icon: '🥗' },
      { value: 'exercise', label: 'Exercise/gym', icon: '🏋️' },
      { value: 'creams', label: 'Creams/lotions/home devices', icon: '🧴' },
      { value: 'treatments', label: 'Professional treatments', icon: '💼' },
      { value: 'nothing', label: 'Nothing specifically', icon: '🆕' },
    ],
  },
  {
    id: 'treatmentsConsidering',
    section: 2,
    sectionName: 'Your Concerns',
    question: 'Are you researching any other treatments?',
    subtext: 'This helps us explain how our treatment compares',
    type: 'multi',
    options: [
      { value: 'morpheus8', label: 'Morpheus8', icon: '💉' },
      { value: 'hifu', label: 'HIFU / Ultherapy', icon: '🔊' },
      { value: 'coolsculpting', label: 'CoolSculpting / Fat freezing', icon: '❄️' },
      { value: 'cavitation', label: 'Ultrasonic cavitation', icon: '🔊' },
      { value: 'surgery', label: 'Surgical options (lipo/tummy tuck)', icon: '🏥' },
      { value: 'none', label: 'No, just researching Skulpt', icon: '✨' },
    ],
  },

  // SECTION 3: YOUR LIFESTYLE
  {
    id: 'exerciseLevel',
    section: 3,
    sectionName: 'Your Lifestyle',
    question: 'How would you describe your current exercise routine?',
    type: 'single',
    options: [
      { value: 'sedentary', label: 'Sedentary (little to no exercise)', icon: '🛋️' },
      { value: 'light', label: 'Light activity (walking, gentle movement)', icon: '🚶' },
      { value: 'moderate', label: 'Moderate (exercise 2-3x per week)', icon: '🏃' },
      { value: 'active', label: 'Active (exercise 4+ times per week)', icon: '💪' },
    ],
  },
  {
    id: 'dietHabits',
    section: 3,
    sectionName: 'Your Lifestyle',
    question: 'How would you describe your eating habits?',
    type: 'single',
    options: [
      { value: 'healthy', label: 'Mostly healthy, balanced diet', icon: '🥗' },
      { value: 'workInProgress', label: 'Working on improving', icon: '📈' },
      { value: 'struggle', label: 'Struggle with consistency', icon: '🔄' },
      { value: 'emotional', label: 'Emotional/stress eating', icon: '😔' },
    ],
  },
  {
    id: 'waterIntake',
    section: 3,
    sectionName: 'Your Lifestyle',
    question: 'How would you rate your water intake?',
    type: 'single',
    options: [
      { value: 'under1L', label: 'Less than 1 litre per day', icon: '💧' },
      { value: '1-2L', label: '1-2 litres per day', icon: '🚰' },
      { value: 'over2L', label: '2+ litres per day', icon: '🌊' },
    ],
  },

  // SECTION 4: YOUR TIMELINE & COMMITMENT
  {
    id: 'desiredOutcome',
    section: 4,
    sectionName: 'Your Timeline',
    question: "{name}, what results are you hoping for?",
    type: 'single',
    options: [
      { value: 'dropDressSize', label: 'Drop a dress size', icon: '👗' },
      { value: 'flattenTummy', label: 'Flatten my tummy', icon: '🎯' },
      { value: 'toneArms', label: 'Tone up specific areas', icon: '💪' },
      { value: 'tightenSkin', label: 'Tighten loose skin', icon: '✨' },
      { value: 'feelConfident', label: 'Just feel more confident in my body', icon: '💫' },
    ],
  },
  {
    id: 'timeline',
    section: 4,
    sectionName: 'Your Timeline',
    question: 'When would you ideally like to see results?',
    type: 'single',
    options: [
      { value: 'asap', label: 'As soon as possible', icon: '🚀' },
      { value: '1-2months', label: 'Within 1-2 months', icon: '📅' },
      { value: '3-6months', label: 'Within 3-6 months', icon: '🗓️' },
      { value: 'noRush', label: 'No rush, just want it to work', icon: '🎯' },
    ],
  },
  {
    id: 'commitment',
    section: 4,
    sectionName: 'Your Timeline',
    question: 'How ready are you to start?',
    type: 'single',
    options: [
      { value: 'veryReady', label: 'Very ready - let\'s do this!', icon: '💯' },
      { value: 'fairlyReady', label: 'Ready but want to try first', icon: '👍' },
      { value: 'exploring', label: 'Still exploring my options', icon: '🔎' },
      { value: 'needConvincing', label: 'Need to know it works first', icon: '🤔' },
    ],
  },
]

// Helper to get visible questions based on current answers
const getVisibleQuestions = (answers: Record<string, any>): Question[] => {
  return allQuestions.filter(q => !q.showWhen || q.showWhen(answers))
}

// Dynamic sections based on path
const getSections = (primaryGoal: string) => [
  { num: 1, name: getSectionName(primaryGoal) },
  { num: 2, name: 'Your Concerns' },
  { num: 3, name: 'Your Lifestyle' },
  { num: 4, name: 'Your Timeline' },
]

// Scoring logic - updated for v4.0 with path-specific questions
function calculateSuitability(answers: Record<string, any>) {
  let score = 0
  const tips: string[] = []

  // Primary goal scoring
  if (answers.primaryGoal === 'both') {
    score += 3 // Both fat and skin = ideal candidate
  } else if (['stubbornFat', 'looseSkin'].includes(answers.primaryGoal)) {
    score += 2
  } else if (answers.primaryGoal === 'toneUp' || answers.primaryGoal === 'postPregnancy') {
    score += 2
  }

  // PATH-SPECIFIC SCORING

  // Stubborn Fat path
  if (answers.primaryGoal === 'stubbornFat') {
    // Long duration = more motivated
    if (['years', 'always'].includes(answers.stubbornFat_duration)) {
      score += 1
    }
    // Diet/exercise hasn't worked = ideal for RF treatment
    if (['noChange', 'exceptStubborn'].includes(answers.stubbornFat_dietExercise)) {
      score += 2
      tips.push('Since diet and exercise haven\'t fully addressed your stubborn areas, our RF treatment can target those spots that won\'t budge.')
    }
  }

  // Loose Skin path
  if (answers.primaryGoal === 'looseSkin') {
    // Ozempic users = high motivation, good candidate
    if (answers.looseSkin_cause === 'ozempic') {
      score += 2
    }
    // More weight lost = more likely to need treatment
    if (['2-4stone', '4-6stone', '6plus'].includes(answers.looseSkin_weightLost)) {
      score += 1
    }
    // Moderate severity = good candidate (significant may need surgery conversation)
    if (answers.looseSkin_severity === 'moderate') {
      score += 1
    }
  }

  // Both path
  if (answers.primaryGoal === 'both') {
    // Medication triggered = GLP-1 users, high motivation
    if (answers.both_trigger === 'medication') {
      score += 2
    }
    // Rapid changes = more urgent need
    if (answers.both_speed === 'rapid') {
      score += 1
    }
  }

  // Tone Up for Event path
  if (answers.primaryGoal === 'toneUp') {
    // Wedding = highly motivated
    if (['myWedding', 'attendWedding'].includes(answers.toneUp_occasion)) {
      score += 2
    } else if (['holiday', 'reunion', 'photoshoot'].includes(answers.toneUp_occasion)) {
      score += 1
    }
    // Short timeline = urgent, ready to start
    if (['4weeks', '1-2months'].includes(answers.toneUp_timeline)) {
      score += 2
    } else if (['2-3months', '3-6months'].includes(answers.toneUp_timeline)) {
      score += 1
    }
  }

  // Post-Pregnancy path
  if (answers.primaryGoal === 'postPregnancy') {
    // Baby 6+ months = usually ready for treatment
    if (['6-12months', '1-2years', '2plus'].includes(answers.postPregnancy_babyAge)) {
      score += 1
    }
    // Not breastfeeding = can proceed with full treatment
    if (['no', 'na'].includes(answers.postPregnancy_breastfeeding)) {
      score += 1
    }
    // Cleared for exercise = ready for treatment
    if (['yesCleared', 'notRelevant'].includes(answers.postPregnancy_cleared)) {
      score += 1
    }
  }

  // SHARED QUESTION SCORING

  // Areas of concern (multiple areas = higher score)
  const areas = answers.areasOfConcern || []
  if (areas.length >= 3) {
    score += 2
  } else if (areas.length >= 2) {
    score += 1
  }

  // Concern type
  if (answers.concernType === 'both') {
    score += 2 // Both fat and skin = perfect for RF treatment
  } else if (['fat', 'skin', 'lackTone'].includes(answers.concernType)) {
    score += 1
  }

  // Already tried things = knows diet/exercise alone won't work
  const tried = answers.triedBefore || []
  if (tried.includes('diet') && tried.includes('exercise')) {
    score += 2
    if (answers.primaryGoal !== 'stubbornFat') { // Don't duplicate tip
      tips.push('Since diet and exercise haven\'t fully addressed your concerns, our RF treatment can target those stubborn areas that won\'t budge.')
    }
  }

  // Timeline scoring
  if (answers.timeline === 'asap' || answers.timeline === '1-2months') {
    score += 2
  } else if (answers.timeline === '3-6months') {
    score += 1
  }

  // Commitment scoring
  if (answers.commitment === 'veryReady') {
    score += 2
  } else if (answers.commitment === 'fairlyReady') {
    score += 1
  }

  // Lifestyle tips
  if (answers.waterIntake === 'under1L') {
    tips.push('Increase your water intake to 2+ litres daily to help your body eliminate treated fat cells and support skin health.')
  } else if (answers.waterIntake === 'over2L') {
    tips.push('Great hydration! This will help your body respond well to treatment and flush out released fat.')
  }

  if (answers.exerciseLevel === 'sedentary') {
    tips.push('Light exercise like walking can enhance your results by improving circulation and lymphatic drainage.')
  } else if (answers.exerciseLevel === 'active') {
    tips.push('Your active lifestyle will support excellent treatment results.')
  }

  if (answers.dietHabits === 'healthy') {
    tips.push('Your healthy eating habits will help maintain your results long-term.')
  } else if (['struggle', 'emotional'].includes(answers.dietHabits)) {
    tips.push('We can discuss simple nutrition tips during your consultation to support your results.')
  }

  // Determine suitability level and recommendation
  let suitability: 'excellent' | 'good' | 'moderate'
  let recommendation: { treatment: string; price: string; oldPrice?: string; sessions: number; description: string }

  // Customise description based on their primary goal
  const isFatFocused = answers.primaryGoal === 'stubbornFat' || answers.concernType === 'fat'
  const isSkinFocused = answers.primaryGoal === 'looseSkin' || answers.concernType === 'skin'

  if (score >= 10) {
    suitability = 'excellent'
    recommendation = {
      treatment: 'Consultation + First Treatment',
      price: '£50',
      sessions: 1,
      description: isFatFocused
        ? 'You\'re an excellent candidate! Start with a consultation where Michelle will assess your needs and create a comprehensive treatment plan for maximum inch loss and contouring.'
        : isSkinFocused
        ? 'You\'re an excellent candidate for skin tightening! Start with a consultation where Michelle will create a tailored plan for visible firming results.'
        : 'You\'re an excellent candidate! Start with a consultation where Michelle will assess your specific concerns and create a personalised treatment plan.',
    }
  } else if (score >= 6) {
    suitability = 'good'
    recommendation = {
      treatment: 'Consultation + First Treatment',
      price: '£50',
      sessions: 1,
      description: isFatFocused
        ? 'Great candidate for targeted treatment! Your consultation includes a first session, then Michelle will recommend the right number of sessions for your goals.'
        : 'Great candidate for skin tightening! Your consultation includes a first session, then Michelle will create a plan tailored to your specific areas of concern.',
    }
  } else {
    suitability = 'moderate'
    recommendation = {
      treatment: 'Consultation + First Treatment',
      price: '£50',
      sessions: 1,
      description: 'Start with a consultation and first treatment session. Michelle will assess your skin, you\'ll experience the technology firsthand, and she\'ll advise on the best approach for your goals.',
    }
  }

  return { score, suitability, recommendation, tips }
}

export default function SkinAssessmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showNameStep, setShowNameStep] = useState(true)  // Name capture first!
  const [userName, setUserName] = useState('')
  const [nameError, setNameError] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [multiSelectTemp, setMultiSelectTemp] = useState<string[]>([])
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showAcknowledgment, setShowAcknowledgment] = useState(false)
  const [leadData, setLeadData] = useState({ firstName: '', email: '', phone: '', bestTime: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [headlineIndex, setHeadlineIndex] = useState(0)

  // Get visible questions based on current answers
  const visibleQuestions = getVisibleQuestions(answers)
  const totalQuestions = visibleQuestions.length
  const currentQuestion = visibleQuestions[currentStep]
  const progress = ((currentStep + 1) / totalQuestions) * 100
  const sections = getSections(answers.primaryGoal || '')

  // Personalize question text with name
  const personalize = (text: string): string => {
    return text.replace('{name}', userName || 'there')
  }

  // Rotate headlines every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % ROTATING_HEADLINES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && !showResults) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen, showResults])

  const openModal = useCallback(() => {
    setIsModalOpen(true)
    if (!hasStarted) {
      setHasStarted(true)
      trackAssessmentStart()
    }
  }, [hasStarted])

  const closeModal = useCallback(() => {
    if (!showResults) {
      setIsModalOpen(false)
    }
  }, [showResults])

  // Handle name submission - now goes to contraindications step
  const handleNameSubmit = () => {
    if (!userName.trim() || userName.trim().length < 2) {
      setNameError('Please enter your first name')
      return
    }
    setNameError('')
    setShowNameStep(false)
    // Continue to questions
  }

  const handleSingleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    // Show acknowledgment after primaryGoal is answered
    if (currentQuestion.id === 'primaryGoal') {
      setTimeout(() => {
        setShowAcknowledgment(true)
        // Auto-advance after showing acknowledgment
        setTimeout(() => {
          setShowAcknowledgment(false)
          // Recalculate visible questions with new answer
          const newVisibleQuestions = getVisibleQuestions(newAnswers)
          if (currentStep < newVisibleQuestions.length - 1) {
            setCurrentStep(currentStep + 1)
          } else {
            setShowLeadForm(true)
          }
        }, 2500)
      }, 300)
    } else {
      setTimeout(() => {
        // Recalculate visible questions with new answer
        const newVisibleQuestions = getVisibleQuestions(newAnswers)
        if (currentStep < newVisibleQuestions.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          setShowLeadForm(true)
        }
      }, 300)
    }
  }

  const handleMultiSelect = (value: string) => {
    if (multiSelectTemp.includes(value)) {
      setMultiSelectTemp(multiSelectTemp.filter(v => v !== value))
    } else {
      setMultiSelectTemp([...multiSelectTemp, value])
    }
  }

  const handleMultiContinue = () => {
    if (multiSelectTemp.length === 0) return

    const newAnswers = { ...answers, [currentQuestion.id]: multiSelectTemp }
    setAnswers(newAnswers)
    setMultiSelectTemp([])

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowLeadForm(true)
    }
  }

  const goBack = () => {
    if (showAcknowledgment) {
      setShowAcknowledgment(false)
      return
    }
    if (showLeadForm) {
      setShowLeadForm(false)
      return
    }
    if (currentStep > 0) {
      const prevQuestion = visibleQuestions[currentStep - 1]
      if (prevQuestion.type === 'multi') {
        setMultiSelectTemp(answers[prevQuestion.id] || [])
      }
      setCurrentStep(currentStep - 1)
    } else if (currentStep === 0) {
      // Go back to name step
      setShowNameStep(true)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    // firstName is already captured at the start as userName
    if (!leadData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!leadData.phone.trim()) newErrors.phone = 'Phone number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)

    const { score, suitability, recommendation, tips } = calculateSuitability(answers)

    // Helper to get label from question options
    const getLabel = (questionId: string, value: string | string[]) => {
      const question = allQuestions.find(q => q.id === questionId)
      if (!question) return value
      if (Array.isArray(value)) {
        return value.map(v => question.options.find(o => o.value === v)?.label || v).join(', ')
      }
      return question.options.find(o => o.value === value)?.label || value
    }

    // Build path-specific details section
    const getPathDetails = (): string => {
      const goal = answers.primaryGoal
      switch (goal) {
        case 'stubbornFat':
          return `• Duration: ${getLabel('stubbornFat_duration', answers.stubbornFat_duration)}
• Fat location: ${getLabel('stubbornFat_location', answers.stubbornFat_location)}
• Diet/exercise helped: ${getLabel('stubbornFat_dietExercise', answers.stubbornFat_dietExercise)}`
        case 'looseSkin':
          return `• Cause: ${getLabel('looseSkin_cause', answers.looseSkin_cause)}
• Weight lost: ${getLabel('looseSkin_weightLost', answers.looseSkin_weightLost)}
• Severity: ${getLabel('looseSkin_severity', answers.looseSkin_severity)}`
        case 'both':
          return `• Priority concern: ${getLabel('both_priority', answers.both_priority)}
• Trigger: ${getLabel('both_trigger', answers.both_trigger)}
• Speed of changes: ${getLabel('both_speed', answers.both_speed)}`
        case 'toneUp':
          return `• Occasion: ${getLabel('toneUp_occasion', answers.toneUp_occasion)}
• Event timeline: ${getLabel('toneUp_timeline', answers.toneUp_timeline)}
• Confidence goal: ${getLabel('toneUp_goal', answers.toneUp_goal)}`
        case 'postPregnancy':
          return `• Baby's age: ${getLabel('postPregnancy_babyAge', answers.postPregnancy_babyAge)}
• Breastfeeding: ${getLabel('postPregnancy_breastfeeding', answers.postPregnancy_breastfeeding)}
• Main concern: ${getLabel('postPregnancy_concern', answers.postPregnancy_concern)}
• Cleared for exercise: ${getLabel('postPregnancy_cleared', answers.postPregnancy_cleared)}`
        default:
          return ''
      }
    }

    // Build beautifully formatted notes for GHL
    const notes = `
📋 BODY ASSESSMENT RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SUITABILITY: ${suitability.toUpperCase()} (Score: ${score})
💰 RECOMMENDED: ${recommendation.treatment} - ${recommendation.price}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ASSESSMENT PATH: ${getSectionName(answers.primaryGoal)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Primary concern: ${getLabel('primaryGoal', answers.primaryGoal)}
${getPathDetails()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 THEIR CONCERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Target areas: ${getLabel('areasOfConcern', answers.areasOfConcern)}
• Main issue: ${getLabel('concernType', answers.concernType)}
• Already tried: ${getLabel('triedBefore', answers.triedBefore)}
• Researching: ${getLabel('treatmentsConsidering', answers.treatmentsConsidering)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏃 THEIR LIFESTYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Exercise level: ${getLabel('exerciseLevel', answers.exerciseLevel)}
• Diet habits: ${getLabel('dietHabits', answers.dietHabits)}
• Water intake: ${getLabel('waterIntake', answers.waterIntake)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ THEIR TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Desired outcome: ${getLabel('desiredOutcome', answers.desiredOutcome)}
• Want results: ${getLabel('timeline', answers.timeline)}
• Readiness: ${getLabel('commitment', answers.commitment)}

${tips.length > 0 ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 TIPS FOR THIS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${tips.map(t => `• ${t}`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 CONTACT PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Best time to call: ${leadData.bestTime || 'Not specified'}
• Assessment version: 4.0
• Submitted: ${new Date().toLocaleString('en-GB')}
`.trim()

    const payload = {
      // Contact info - use userName (collected at start) for firstName
      firstName: userName,
      email: leadData.email,
      phone: leadData.phone,
      bestTimeToCall: leadData.bestTime || 'not specified',

      // All answers
      ...answers,

      // Key fields formatted for CRM
      primaryGoal: getLabel('primaryGoal', answers.primaryGoal),
      assessmentPath: getSectionName(answers.primaryGoal),
      areasOfConcern: Array.isArray(answers.areasOfConcern)
        ? answers.areasOfConcern.join(', ')
        : answers.areasOfConcern || 'none',
      treatmentsConsidering: Array.isArray(answers.treatmentsConsidering)
        ? answers.treatmentsConsidering.join(', ')
        : answers.treatmentsConsidering || 'none',

      // Results
      suitabilityScore: suitability,
      suitabilityPoints: score,
      recommendation: recommendation.treatment,
      recommendedPrice: recommendation.price,
      recommendedSessions: recommendation.sessions,
      lifestyleTips: tips,

      // Beautifully formatted notes for GHL
      notes: notes,

      // Meta
      source: 'body-assessment-landing',
      assessmentVersion: '4.2',
      submittedAt: new Date().toISOString(),
    }

    try {
      await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      })

      // Track completion
      trackAssessmentComplete(recommendation.treatment)
    } catch (error) {
      console.error('Webhook error:', error)
    }

    setShowLeadForm(false)
    setSubmitting(false)
    // Redirect to suitability check page with user name
    window.location.href = `/suitability-check?name=${encodeURIComponent(userName)}`
  }

  const restart = () => {
    setCurrentStep(0)
    setAnswers({})
    setMultiSelectTemp([])
    setShowNameStep(true)
    setUserName('')
    setNameError('')
    setShowLeadForm(false)
    setShowResults(false)
    setShowAcknowledgment(false)
    setLeadData({ firstName: '', email: '', phone: '', bestTime: '' })
    setErrors({})
    setIsModalOpen(false)
    setHasStarted(false)
  }

  const result = showResults ? calculateSuitability(answers) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-lg text-neutral-900 hidden sm:block">Skulpt Body Contouring</span>
            </Link>
            <a
              href={`tel:+${CONFIG.whatsappNumber}`}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-primary-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="hidden sm:inline">{CONFIG.phoneNumber}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-primary-700 font-medium text-sm">Free Personalised Assessment</span>
          </div>

          {/* Rotating Headlines */}
          <div className="h-[120px] sm:h-[140px] lg:h-[160px] flex items-center justify-center mb-6">
            <h1
              key={headlineIndex}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 animate-in fade-in duration-500"
            >
              {ROTATING_HEADLINES[headlineIndex]}
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Get <span className="font-semibold text-primary-600">YOUR</span> personalised body sculpting plan in under 3 minutes
          </p>

          <button
            onClick={openModal}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Start Free Assessment</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Trust Indicators - Updated to differentiate from competitors */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No needles
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Comfortable treatment
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No downtime
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              From £50
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">How Our Treatment Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              UK medical-grade technology combining three powerful modalities for superior results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Polar RF Energy</h3>
              <p className="text-neutral-600">
                Radiofrequency heats the deep layers of skin, causing immediate collagen contraction for instant tightening
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💆</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Vacuum Massage</h3>
              <p className="text-neutral-600">
                Powerful lymphatic drainage removes toxins and enhances circulation for improved cellulite reduction
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Ultrasonic Cavitation</h3>
              <p className="text-neutral-600">
                Sound waves target stubborn fat cells for inch loss while stimulating new collagen production
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Get Started</h2>
            <p className="text-lg text-neutral-600">Your journey to tighter skin begins with a consultation</p>
          </div>

          <div className="max-w-lg mx-auto">
            {/* Main Offer */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 border-2 border-primary-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1 bg-primary-500 text-white text-sm font-bold rounded-full">
                  LIMITED OFFER
                </span>
              </div>
              <div className="text-center mb-6 pt-2">
                <h3 className="text-2xl font-bold mb-2">Consultation + First Treatment</h3>
                <p className="text-4xl font-bold text-primary-600 mb-2">£50</p>
                <p className="text-neutral-600">Experience our UK medical-grade technology</p>
              </div>
              <ul className="space-y-3 text-neutral-600 mb-6">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full skin assessment with Michelle
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Your first treatment session included
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Personalised treatment plan created for your goals
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tailored course pricing based on your specific needs
                </li>
              </ul>
              <button
                onClick={openModal}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-colors"
              >
                Take Assessment & Book
              </button>
              <p className="text-center text-sm text-neutral-500 mt-4">
                No pressure, no hard sell — just honest advice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Your Team */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden">
                <img
                  src="/images/Michelle.jpeg"
                  alt="Michelle - Skulpt Body Contouring Expert"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Meet Michelle</h2>
              <p className="text-primary-600 font-medium mb-4">Your Expert at Skulpt</p>
              <p className="text-neutral-600 leading-relaxed">
                At Skulpt Body Contouring, Michelle brings years of experience helping clients achieve their body goals. Whether you&apos;ve lost weight through GLP-1 medications like Ozempic and Wegovy, or traditional methods, she specialises in tightening loose skin and contouring your body using advanced medical-grade technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white rounded-xl p-6 group">
              <summary className="font-semibold text-neutral-900 cursor-pointer flex justify-between items-center">
                Is the treatment painful?
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-neutral-600">
                Not at all! Most clients describe it as a warm, relaxing massage. The treatment is comfortable throughout, and you can return to normal activities immediately afterwards.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 group">
              <summary className="font-semibold text-neutral-900 cursor-pointer flex justify-between items-center">
                When will I see results?
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-neutral-600">
                Many clients notice immediate skin tightening after their first session. Optimal results develop over 8-12 weeks as new collagen forms, with continued improvement between sessions.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 group">
              <summary className="font-semibold text-neutral-900 cursor-pointer flex justify-between items-center">
                How many sessions do I need?
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-neutral-600">
                This depends on your individual concerns. For mild laxity, 4 sessions may be sufficient. For more significant loose skin after weight loss, we typically recommend 8 sessions for optimal results.
              </p>
            </details>

            <details className="bg-white rounded-xl p-6 group">
              <summary className="font-semibold text-neutral-900 cursor-pointer flex justify-between items-center">
                Is it suitable after Ozempic/Wegovy/Mounjaro?
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-neutral-600">
                Yes! Our RF treatment is ideal for tightening loose skin after GLP-1 medication weight loss. The rapid weight loss from these medications can leave excess skin, and our technology is specifically designed to address this.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Tighten Your Skin?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Take our free assessment to get your personalised treatment plan
          </p>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors"
          >
            Start Your Free Assessment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      <Footer />

      {/* Assessment Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            className="relative w-full sm:max-w-lg mx-auto bg-white sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
            style={{
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
            }}
          >
            {/* Mobile drag indicator */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Close Button */}
            {!showResults && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                aria-label="Close assessment"
              >
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Name Step - First! */}
              {showNameStep && !showResults && (
                <div className="p-5 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl sm:text-4xl">👋</span>
                    </div>
                    <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                      First, what&apos;s your name?
                    </h2>
                    <p className="text-neutral-500 text-sm sm:text-base">
                      We&apos;ll use this to personalise your assessment
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-base text-center text-lg font-medium ${
                          nameError ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-500'
                        }`}
                        placeholder="Your first name"
                        autoComplete="given-name"
                        autoFocus
                      />
                      {nameError && <p className="text-red-500 text-sm mt-2 text-center">{nameError}</p>}
                    </div>

                    <button
                      onClick={handleNameSubmit}
                      className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all touch-manipulation"
                    >
                      Let&apos;s Go!
                    </button>
                  </div>
                </div>
              )}

              {/* Acknowledgment after primaryGoal */}
              {showAcknowledgment && !showResults && (
                <div className="p-5 sm:p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                      <span className="text-4xl">
                        {answers.primaryGoal === 'stubbornFat' && '🎯'}
                        {answers.primaryGoal === 'looseSkin' && '✨'}
                        {answers.primaryGoal === 'both' && '🔄'}
                        {answers.primaryGoal === 'toneUp' && '🎉'}
                        {answers.primaryGoal === 'postPregnancy' && '💕'}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed max-w-md mx-auto animate-in fade-in duration-500">
                      {getAcknowledgment(answers.primaryGoal, userName)}
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                </div>
              )}

              {/* Questions */}
              {!showNameStep && !showAcknowledgment && !showLeadForm && !showResults && currentQuestion && (
                <div className="p-5 sm:p-8">
                  {/* Section & Progress */}
                  <div className="mb-6 sm:mb-8">
                    {/* Section tabs - scrollable on mobile */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
                      {sections.map((section) => (
                        <div
                          key={section.num}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                            section.num === currentQuestion.section
                              ? 'bg-primary-500 text-white'
                              : section.num < currentQuestion.section
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {section.name}
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="flex justify-between items-center mb-2 text-sm text-neutral-500">
                      <span>Question {currentStep + 1} of {totalQuestions}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                      {personalize(currentQuestion.question)}
                    </h2>
                    {currentQuestion.subtext && (
                      <p className="text-neutral-500 text-sm sm:text-base">{currentQuestion.subtext}</p>
                    )}
                  </div>

                  {/* Options - Mobile optimized with larger touch targets */}
                  {currentQuestion.type === 'single' ? (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSingleAnswer(option.value)}
                          className="group w-full flex items-center gap-4 p-4 sm:p-4 bg-white border-2 border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 touch-manipulation"
                        >
                          <span className="text-2xl sm:text-2xl flex-shrink-0">{option.icon}</span>
                          <span className="text-left font-medium text-neutral-700 group-hover:text-primary-700 text-base">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {currentQuestion.options.map((option) => {
                          const isSelected = multiSelectTemp.includes(option.value)
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleMultiSelect(option.value)}
                              className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-200 touch-manipulation ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-neutral-200 bg-white hover:border-primary-300 active:bg-neutral-50'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                  isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-2xl flex-shrink-0">{option.icon}</span>
                              <span className={`text-left font-medium text-base ${isSelected ? 'text-primary-700' : 'text-neutral-700'}`}>
                                {option.label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <button
                        onClick={handleMultiContinue}
                        disabled={multiSelectTemp.length === 0}
                        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                      >
                        Continue ({multiSelectTemp.length} selected)
                      </button>
                    </>
                  )}

                  {/* Back button */}
                  {currentStep > 0 && (
                    <button
                      onClick={goBack}
                      className="mt-6 text-neutral-500 hover:text-neutral-700 text-sm font-medium flex items-center gap-1 mx-auto py-2 touch-manipulation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous question
                    </button>
                  )}
                </div>
              )}

              {/* Lead Capture Form */}
              {showLeadForm && (
                <div className="p-5 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                      {userName}, Your Results Are Ready!
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base">
                      Just a couple more details to see your personalised plan
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={leadData.email}
                        onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-base ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-500'
                        }`}
                        placeholder="your@email.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={leadData.phone}
                        onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-base ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-500'
                        }`}
                        placeholder="07123 456789"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Best time to call (optional)</label>
                      <select
                        value={leadData.bestTime}
                        onChange={(e) => setLeadData({ ...leadData, bestTime: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-colors bg-white text-base"
                      >
                        <option value="">Select a time...</option>
                        <option value="morning">Morning (9am - 12pm)</option>
                        <option value="afternoon">Afternoon (12pm - 5pm)</option>
                        <option value="evening">Evening (5pm - 8pm)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg disabled:opacity-50 touch-manipulation"
                    >
                      {submitting ? 'Processing...' : 'See My Personalised Plan'}
                    </button>

                    <p className="text-xs text-neutral-500 text-center">
                      By submitting, you agree to receive your assessment results and treatment information from Skulpt Body Contouring.
                    </p>
                  </div>

                  <button
                    onClick={goBack}
                    className="mt-6 text-neutral-500 hover:text-neutral-700 text-sm font-medium flex items-center gap-1 mx-auto py-2 touch-manipulation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to questions
                  </button>
                </div>
              )}

              {/* Results */}
              {showResults && result && (
                <div className="p-5 sm:p-8">
                  {/* Suitability Badge */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div
                      className={`inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-white font-bold text-base sm:text-lg mb-4 ${
                        result.suitability === 'excellent'
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : result.suitability === 'good'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600'
                      }`}
                    >
                      {result.suitability === 'excellent' && '✨ EXCELLENT CANDIDATE'}
                      {result.suitability === 'good' && '👍 GOOD CANDIDATE'}
                      {result.suitability === 'moderate' && '🔍 MODERATE CANDIDATE'}
                    </div>
                    <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                      Hi {userName}, here&apos;s your plan
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base">
                      Based on your assessment, we recommend:
                    </p>
                  </div>

                  {/* Recommendation Card */}
                  <div className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-2xl p-5 sm:p-6 mb-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-primary-700">{result.recommendation.treatment}</h3>
                        <p className="text-neutral-600 text-sm">{result.recommendation.sessions} session{result.recommendation.sessions > 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        {result.recommendation.oldPrice && (
                          <p className="text-neutral-400 line-through text-sm">{result.recommendation.oldPrice}</p>
                        )}
                        <p className="text-2xl sm:text-3xl font-bold text-primary-600">{result.recommendation.price}</p>
                      </div>
                    </div>
                    <p className="text-neutral-700 text-sm sm:text-base">{result.recommendation.description}</p>
                  </div>

                  {/* Lifestyle Tips */}
                  {result.tips.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-5">
                      <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <span>💡</span> Tips for Better Results
                      </h4>
                      <ul className="space-y-2">
                        {result.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Competitor Comparison Notes */}
                  {answers.treatmentsConsidering && answers.treatmentsConsidering.length > 0 && !answers.treatmentsConsidering.includes('none') && (
                    <div className="space-y-4 mb-5">
                      {answers.treatmentsConsidering.includes('morpheus8') && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                            <span>💉</span> Comparing to Morpheus8?
                          </h4>
                          <p className="text-sm text-blue-900">
                            Unlike Morpheus8&apos;s microneedling, our RF treatment is completely non-invasive with <strong>no needles</strong>.
                            You&apos;ll experience a comfortable, warm massage-like sensation with zero downtime.
                            Plus, our treatment courses are significantly more affordable than typical Morpheus8 pricing (£1,000+), with personalised pricing based on your needs.
                          </p>
                        </div>
                      )}

                      {answers.treatmentsConsidering.includes('hifu') && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-5">
                          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                            <span>🔊</span> Comparing to HIFU?
                          </h4>
                          <p className="text-sm text-purple-900">
                            While HIFU targets deeper tissue, our UK medical-grade system combines <strong>RF + vacuum massage + cavitation</strong> for
                            comprehensive skin tightening and contouring. More comfortable than HIFU, with gradual results over your course of treatments.
                          </p>
                        </div>
                      )}

                      {answers.treatmentsConsidering.includes('thermage') && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-5">
                          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                            <span>🔥</span> Comparing to Thermage?
                          </h4>
                          <p className="text-sm text-orange-900">
                            Both use RF technology, but our UK medical-grade treatment adds <strong>vacuum massage and cavitation</strong> for enhanced results.
                            Our treatment courses offer exceptional value compared to a single Thermage session (typically £600-2000),
                            with a more comfortable experience and pricing tailored to your needs.
                          </p>
                        </div>
                      )}

                      {answers.treatmentsConsidering.includes('coolsculpting') && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 sm:p-5">
                          <h4 className="font-semibold text-cyan-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                            <span>❄️</span> Comparing to CoolSculpting?
                          </h4>
                          <p className="text-sm text-cyan-900">
                            CoolSculpting targets fat reduction, while our RF treatment focuses on <strong>skin tightening and toning</strong>.
                            If loose skin after weight loss is your main concern (rather than stubborn fat), RF skin tightening may be more suitable for your goals.
                          </p>
                        </div>
                      )}

                      {answers.treatmentsConsidering.includes('surgery') && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5">
                          <h4 className="font-semibold text-rose-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                            <span>🏥</span> Considering Surgery?
                          </h4>
                          <p className="text-sm text-rose-900">
                            Try our RF treatment first - it&apos;s the <strong>non-surgical alternative</strong> that many clients use to avoid going under the knife.
                            No anaesthesia, no scarring, no recovery time. Start with our £50 consultation + treatment to see if non-surgical works for you.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* What to expect */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-5 mb-6">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <span>✅</span> What to Expect
                    </h4>
                    <ul className="text-sm text-green-900 space-y-1">
                      <li>• No downtime - return to activities immediately</li>
                      <li>• Comfortable treatment (feels like a warm massage)</li>
                      <li>• Visible results from the first session</li>
                      <li>• Continued improvement over 8-12 weeks</li>
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                        `Hi, I just completed the skin assessment and I'm interested in the ${result.recommendation.treatment}. My name is ${userName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 active:bg-green-700 transition-all flex items-center justify-center gap-3 touch-manipulation"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Book via WhatsApp
                    </a>

                    <a
                      href={`tel:+${CONFIG.whatsappNumber}`}
                      className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 transition-all flex items-center justify-center gap-3 touch-manipulation"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call {CONFIG.phoneNumber}
                    </a>

                    <button
                      onClick={restart}
                      className="w-full py-3 border-2 border-neutral-200 text-neutral-600 font-medium rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-all flex items-center justify-center touch-manipulation"
                    >
                      Close & Return to Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
