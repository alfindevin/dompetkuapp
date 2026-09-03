'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push('/https://dompetkuapp.vercel.app/') // Ganti dengan halaman tujuan setelah login
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* ... input email dan password ... */}
      <button type="submit" className="...">Masuk</button>
    </form>
  )
}
