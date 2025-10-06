"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut({ redirect: true, callbackUrl: "/" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={loading}>
      {loading ? "Saindo..." : "Sair"}
    </Button>
  )
}