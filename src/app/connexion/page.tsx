'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MobileHeader from '@/components/layout/MobileHeader'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, accept any email/password
      // In production, this would validate against Firebase Auth
      if (email && password) {
        localStorage.setItem('userLoggedIn', 'true')
        localStorage.setItem('userEmail', email)
        router.push('/')
      } else {
        setError('Veuillez remplir tous les champs')
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <main className="px-4 py-6">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </Link>

        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-2xl mb-4 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte AlloSN</p>
          </div>

          {/* Login form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <Link href="/mot-de-passe-oublie" className="text-sm text-orange-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/inscription" className="text-orange-600 font-medium hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Admin link */}
          <div className="mt-8 text-center">
            <Link href="/admin/login" className="text-gray-400 text-sm hover:text-gray-600">
              Accès administrateur
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
