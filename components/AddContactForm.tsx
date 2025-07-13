'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function AddContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const addContact = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('contacts').insert({ user_id: user.id, name, email })
    location.reload()
  }

  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button onClick={addContact} className="sm:w-auto w-full">
        Add Contact
      </Button>
    </motion.div>
  )
}
