"use client"

import type { Variants } from "framer-motion"

// Variantes para animações de entrada
export const fadeIn = (direction: "up" | "down" | "left" | "right", delay = 0): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 80 : direction === "down" ? -80 : 0,
      x: direction === "left" ? 80 : direction === "right" ? -80 : 0,
      opacity: 0,
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }
}

// Variantes para animações de texto
export const textVariant = (delay = 0): Variants => {
  return {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.6,
        delay,
      },
    },
  }
}

// Variantes para animações de container
export const staggerContainer = (staggerChildren = 0.1): Variants => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
      },
    },
  }
}

// Variantes para animações de botões
export const buttonVariant = (delay = 0): Variants => {
  return {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        delay,
        bounce: 0.3,
      },
    },
  }
}
