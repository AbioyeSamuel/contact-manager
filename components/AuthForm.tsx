'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Email and password are required.' })
      setLoading(false)
      return
    }

    let error

    if (type === 'login') {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      error = loginError
    } else {
      const { error: signupError } = await supabase.auth.signUp({ email, password })
      error = signupError
    }

    setLoading(false)

    if (error) {
      setMessage({
        type: 'error',
        text: type === 'login'
          ? 'Invalid email or password. Please try again.'
          : error.message,
      })
    } else {
      if (type === 'signup') {
        setMessage({
          type: 'success',
          text: 'A confirmation link has been sent to your email. Please verify to complete signup.',
        })
      } else {
        await supabase.auth.getSession()
        router.push('/dashboard')
      }
    }
  }

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md shadow-xl border border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {type === 'login' ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-muted-foreground">Email</label>
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-muted-foreground">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Processing...
                </>
              ) : type === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          {/* Message Feedback */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-4 text-sm p-3 rounded-md flex items-start gap-2 ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="mt-0.5 w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="mt-0.5 w-4 h-4 text-red-600" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Link */}
          <div className="mt-4 text-sm text-center text-muted-foreground">
            {type === 'login' ? (
              <>
                Don’t have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
