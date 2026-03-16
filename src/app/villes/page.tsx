'use client'

import { useState } from 'react'
import Link from 'next/link'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import { ArrowLeft, MapPin, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { regions, departments, communes } from '@/lib/senegal-geo'

export default function VillesPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get departments by region
  const getDepartmentsByRegion = (regionId: string) => {
    return departments.filter(d => d.regionId === regionId)
  }

  // Get communes by department
  const getCommunesByDepartment = (deptId: string) => {
    return communes.filter(c => c.departmentId === deptId)
  }

  // Filter based on search
  const filteredRegions = searchQuery 
    ? regions.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : regions

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      <main className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Villes du Sénégal</h1>
            <p className="text-sm text-gray-500">14 régions • 46 départements</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une ville ou région..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-orange-500"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Régions', value: regions.length, color: 'bg-orange-500' },
            { label: 'Départements', value: departments.length, color: 'bg-blue-500' },
            { label: 'Communes', value: communes.length, color: 'bg-green-500' },
            { label: 'Arrondissements', value: '259+', color: 'bg-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className={`text-xl font-bold text-gray-800`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Regions List */}
        <div className="space-y-3">
          {filteredRegions.map((region) => (
            <div key={region.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                className="w-full px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">{region.name}</h3>
                    <p className="text-xs text-gray-500">
                      Chef-lieu: {region.chefLieu}
                      {region.population && ` • ${(region.population / 1000000).toFixed(2)}M hab.`}
                    </p>
                  </div>
                </div>
                {selectedRegion === region.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Departments when expanded */}
              {selectedRegion === region.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2">
                  {getDepartmentsByRegion(region.id).map((dept) => (
                    <div key={dept.id} className="bg-white rounded-lg p-3">
                      <h4 className="font-medium text-gray-700 text-sm">{dept.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">Chef-lieu: {dept.chefLieu}</p>
                      
                      {/* Communes */}
                      <div className="flex flex-wrap gap-1">
                        {getCommunesByDepartment(dept.id).map((commune) => (
                          <Link
                            key={commune.id}
                            href={`/annonces?ville=${encodeURIComponent(commune.name)}`}
                            className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded hover:bg-orange-100"
                          >
                            {commune.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Link to browse ads in region */}
                  <Link
                    href={`/annonces?region=${encodeURIComponent(region.name)}`}
                    className="block text-center py-2 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600"
                  >
                    Voir les annonces en {region.name}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Popular Cities Quick Access */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Villes populaires</h3>
          <div className="grid grid-cols-4 gap-2">
            {['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Mbour', 'Touba', 'Ziguinchor', 'Rufisque'].map((city) => (
              <Link
                key={city}
                href={`/annonces?ville=${city}`}
                className="bg-gray-50 rounded-lg p-2 text-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <span className="text-xs font-medium">{city}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
