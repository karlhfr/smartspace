'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

interface FadeInSectionProps {
  children: React.ReactNode
}

export function FadeInSection({ children }: FadeInSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}