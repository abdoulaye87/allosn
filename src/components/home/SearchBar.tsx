'use client'

import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface City {
  id: string
  name: string
}

interface SearchBarProps {
  onSearch?: (query: string, city: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(console.error)
  }, [])

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, selectedCity)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-3">
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
        <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Que recherchez-vous ?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center gap-2 w-full bg-gray-50 rounded-xl px-4 py-3 text-left"
          >
            <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <span className={`flex-1 ${selectedCity ? 'text-gray-700' : 'text-gray-400'}`}>
              {selectedCity || 'Toutes les villes'}
            </span>
          </button>
          
          {showCityDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-10 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCity('')
                  setShowCityDropdown(false)
                }}
                className="w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700"
              >
                Toutes les villes
              </button>
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city.name)
                    setShowCityDropdown(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700"
                >
                  {city.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 shadow-md shadow-orange-500/20"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
