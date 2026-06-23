'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_LANG, getT, LANGUAGES } from './i18n'

const I18nContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: (k) => k })

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('konsum_lang') : null
    if (stored && LANGUAGES.find(l => l.code === stored)) {
      setLangState(stored)
    }
    setMounted(true)
  }, [])

  const setLang = (newLang) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') localStorage.setItem('konsum_lang', newLang)
  }

  const t = getT(lang)

  return (
    <I18nContext.Provider value={{ lang, setLang, t, mounted }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
