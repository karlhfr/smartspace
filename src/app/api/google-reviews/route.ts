import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = bd74b20xa0b6517f3396d3e8// Replace with your actual Google Place ID

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places API key is not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }

    const data = await response.json()
    return NextResponse.json(data.result.reviews || [])
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}