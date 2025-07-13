'use client'

import { useRouter } from 'next/navigation'
import ContactTable from '@/components/ContactTable'
import AddContactForm from '@/components/AddContactForm'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-primary">Your Contacts</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </motion.div>
      <AddContactForm />
      <ContactTable />
    </main>
  )
}
