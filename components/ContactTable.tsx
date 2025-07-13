'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

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
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Debounce effect: updates debouncedSearch after 300ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)

    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    const fetchContacts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setAllContacts(data || [])
    }

    fetchContacts()
  }, [])

  const updateContact = async (id: string, field: keyof Contact, value: string) => {
    await supabase.from('contacts').update({ [field]: value }).eq('id', id)
  }

  const handleEdit = (id: string, field: keyof Contact, value: string) => {
    setAllContacts(prev =>
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
    let filtered = allContacts.filter(c =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(debouncedSearch.toLowerCase())
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
  }, [allContacts, debouncedSearch, sortKey, sortOrder])

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize)
  const paginatedContacts = filteredAndSorted.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

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
            {paginatedContacts.map(contact => (
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

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
