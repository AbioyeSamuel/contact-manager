'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
// import { cn } from '@/lib/utils'

type Contact = {
  id: string
  name: string
  email: string
  user_id: string
  created_at: string
}

type SortKey = 'name' | 'email'
type SortOrder = 'asc' | 'desc' | null

export default function ContactTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setContacts(data || [])
    }

    fetchContacts()
  }, [])

  const updateContact = async (id: string, field: keyof Contact, value: string) => {
    await supabase.from('contacts').update({ [field]: value }).eq('id', id)
  }

  const handleEdit = (id: string, field: keyof Contact, value: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    )
    updateContact(id, field, value)
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortOrder('asc')
    } else {
      setSortOrder(prev =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      )
    }
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = contacts.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[sortKey].toLowerCase()
        const valB = b[sortKey].toLowerCase()
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      })
    }

    return filtered
  }, [contacts, search, sortKey, sortOrder])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button
            variant={sortKey === 'name' ? 'default' : 'outline'}
            onClick={() => toggleSort('name')}
          >
            Sort by Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '')}
          </Button>
          <Button
            variant={sortKey === 'email' ? 'default' : 'outline'}
            onClick={() => toggleSort('email')}
          >
            Sort by Email {sortKey === 'email' && (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '')}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map(contact => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t hover:bg-accent/50"
              >
                <td className="px-4 py-2">
                  <Input
                    value={contact.name}
                    onChange={e =>
                      handleEdit(contact.id, 'name', e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    value={contact.email}
                    onChange={e =>
                      handleEdit(contact.id, 'email', e.target.value)
                    }
                    className="w-full"
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
