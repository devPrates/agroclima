"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, MessageSquare, X, BotMessageSquare, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Message = {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

// Componente para o indicador de digitação
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-3 bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] w-24">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Exibe mensagem de boas-vindas quando o chat é aberto
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mostra o indicador de digitação primeiro
      setIsTyping(true)

      // Após um delay, mostra a mensagem de boas-vindas
      const timer = setTimeout(() => {
        setIsTyping(false)
        setMessages([
          {
            id: 1,
            text: "Olá! Como posso ajudar você hoje?",
            isBot: true,
            timestamp: new Date(),
          },
        ])
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, messages.length])

  // Rola para a última mensagem quando uma nova mensagem é adicionada ou quando o indicador de digitação aparece
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Adiciona a mensagem do usuário
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Mostra o indicador de digitação
    setIsTyping(true)

    // Simula resposta do bot após um delay
    setTimeout(() => {
      setIsTyping(false)

      const botMessage: Message = {
        id: messages.length + 2,
        text: "Obrigado por sua mensagem! Em breve um de nossos atendentes entrará em contato.",
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 2000) // Tempo de "digitação" do bot
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat expandido */}
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg flex flex-col w-[350px] h-[500px] border border-gray-200">
          {/* Cabeçalho do chat */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-medium">Chat de Atendimento</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-primary/80"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
              <span className="sr-only">Fechar chat</span>
            </Button>
          </div>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.isBot
                    ? "bg-gray-100 text-gray-800 rounded-tl-none"
                    : "bg-primary/10 text-gray-800 ml-auto rounded-tr-none",
                )}
              >
                {message.text}
                <div className={cn("text-xs mt-1", message.isBot ? "text-gray-500" : "text-gray-500 text-right")}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}

            {/* Indicador de digitação */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulário de envio */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim()}>
              <Send size={18} />
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </form>
        </div>
      ) : (
        // Botão flutuante
        <Button onClick={() => setIsOpen(true)} size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <Bot size={34} />
          <span className="sr-only">Abrir chat</span>
        </Button>
      )}
    </div>
  )
}