"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { plans } from "@/lib/data"

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <section id="pricing" ref={ref} className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às suas necessidades.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="flex flex-col"
            >
              <Card className="flex flex-col justify-between h-full border border-border relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow">
                      Mais Popular
                    </div>
                  </div>
                )}

                <CardHeader className="pt-8 text-center">
                  <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    {plan.pricePeriod && <div className="text-muted-foreground">{plan.pricePeriod}</div>}
                    {plan.details && <div className="text-sm text-muted-foreground mt-2">{plan.details}</div>}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <feature.icon className="h-4 w-4 text-primary" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="mt-6">
                  <Link href="/planos" className="w-full">
                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      className="w-full"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
