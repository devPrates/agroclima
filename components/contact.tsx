"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner"
import { sendContactEmail, type ContactFormData } from "@/actions/contact-actions"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  message: z.string().min(10, {
    message: "Mensagem deve ter pelo menos 10 caracteres.",
  }),
})

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await sendContactEmail(values as ContactFormData)

      if (!result.success) {
        throw new Error(result.error || 'Erro ao enviar mensagem')
      }

      // Reset form
      form.reset()
      
      // Show success toast
      toast.success("Mensagem enviada com sucesso!", {
        description: "Em breve entraremos em contato com você.",
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error("Erro ao enviar mensagem", {
        description: "Tente novamente mais tarde ou entre em contato diretamente.",
      })
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "Naviraí/MS, Brasil",
      url: "https://www.google.com/maps/place/Navira%C3%AD+-+MS",
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp - Rodrigo",
      content: "(67) 99246-4374",
      url: "https://wa.me/5567992464374",
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp - Helder",
      content: "(67) 99977-3139",
      url: "https://wa.me/5567999773139",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "agroclima.net@gmail.com",
      url: "mailto:agroclima.net@gmail.com",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Seg-Sex: 7h às 17h",
      url: null,
    },
  ]

  return (
    <section id="contact" ref={ref} className="py-20 pb-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Entre em Contato</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-justify">
            Estamos prontos para ajudar você a implementar a melhor solução meteorológica para sua propriedade rural.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Contact Info - 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
              <p className="text-muted-foreground text-justify mb-8">
                Nossa equipe especializada está disponível para esclarecer dúvidas, fornecer orçamentos personalizados e
                acompanhar você em todo o processo.
              </p>
            </div>

            {contactInfo.map((info, index) => {
              const Wrapper = info.url ? motion.a : motion.div
              const props = info.url
                ? {
                    href: info.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-start space-x-4 transition-opacity hover:opacity-75 cursor-pointer",
                  }
                : {
                    className: "flex items-start space-x-4",
                  }

              return (
                <Wrapper
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  {...props}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{info.title}</h4>
                    <p className="text-muted-foreground">{info.content}</p>
                  </div>
                </Wrapper>
              )
            })}
          </motion.div>

          {/* Contact Form - 3/5 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>Solicite seu Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(67) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu-email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Conte-nos sobre sua propriedade e necessidades específicas..."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full">
                      Enviar Solicitação
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
