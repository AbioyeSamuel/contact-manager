'use client'

import { useRouter } from 'next/navigation'
import ContactTable from '@/components/ContactTable'
import AddContactForm from '@/components/AddContactForm'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="p-6 min-h-screen bg-gradient-to-br from-muted/40 to-background">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-4xl bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight">
            My Contacts
          </h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="shadow-md border border-muted/30">
          <CardContent className="p-6 space-y-6">
            <AddContactForm />
            <ContactTable />
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
