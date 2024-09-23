import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    res.status(200).json({ hash })
  } catch (error) {
    console.error('Error hashing password:', error)
    res.status(500).json({ message: 'Error hashing password' })
  }
}