# Contact Manager App

A full-stack contact management application built with **Next.js**, **Supabase**, **Tailwind CSS**, and **Shadcn UI**.

This app allows users to **sign up**, **log in**, and **manage personal contacts** securely with inline editing, pagination, and row-level data isolation using Supabase's RLS policies.

---

## Live Demo

🔗 [https://contact-manager-phi-snowy.vercel.app](https://contact-manager-phi-snowy.vercel.app)  

---

## Features

### Authentication
- Email/password authentication via **Supabase Auth**
- Signup and login flows with clear feedback messages
- Protected routes with **middleware** to redirect unauthenticated users

### Contacts Table
- User-specific data (each user sees only their contacts)
- Add contacts (name + email)
- **Inline editing** of contact name and email
- **Debounced search** by name or email
- **Sort & filter** by name or email
- Responsive UI using **Tailwind** and **Shadcn UI**
- Smooth animations via **Framer Motion**

### Large Dataset Handling
- Pre-seeded with 500+ contact records (via SQL or script)
- Displays 20 contacts per page
- Efficient frontend rendering with pagination

### Supabase Security
- **Row-Level Security** (RLS) enabled
- Only authenticated users can view or update their own contacts
- Secure usage of Supabase client and SSR cookies

---

## 🧪 Tech Stack

| Area         | Stack                                |
|--------------|---------------------------------------|
| Frontend     | Next.js (App Router), Tailwind CSS    |
| Components   | Shadcn UI                             |
| Auth/DB      | Supabase (Auth + Postgres + RLS)      |
| Animation    | Framer Motion                         |
| Hosting      | Vercel (for demo)                     |

---

## 📂 Supabase Table Schema

```sql
-- contacts table
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users NOT NULL,
name TEXT,
email TEXT,
created_at TIMESTAMP DEFAULT now();


### RLS Policy:

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow only users to access their own contacts
CREATE POLICY "Users can manage their own contacts"
  ON contacts
  FOR ALL
  USING (auth.uid() = user_id);
```

### 📦 Setup Instructions
#### Clone the Repository

git clone https://github.com/AbioyeSamuel/contact-manager.git
cd contact-manager

#### Create .env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key

#### Install Dependencies & Run Dev Server


- npm install
- npm run dev

### ✨ Bonus Features Implemented
- Responsive UI with Tailwind + Shadcn

- Search/filter contacts (client-side debounce)

- Framer Motion animation on form & rows

- Styled error & success feedback messages

- Inline editing with optimistic UI updates

- Middleware-based route protection

- Accessible inputs & semantic HTML
