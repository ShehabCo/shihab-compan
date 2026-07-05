// Search Results Page
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import SearchBar from '@/components/search-bar'

interface SearchResult {
  id: string
  title: string
  description: string
  similarity: number
  price?: number
  category?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(!!query)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!query) return

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results)
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error('[Search] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar />

        {query && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              نتائج البحث عن: <span className="text-blue-600">&quot;{query}&quot;</span>
            </h2>

            {loading ? (
              <div className="text-center py-8">جاري البحث...</div>
            ) : (
              <>
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result) => (
                      <Card key={result.id} className="p-6 hover:shadow-lg transition">
                        <h3 className="text-lg font-bold mb-2">{result.title}</h3>
                        <p className="text-gray-600 mb-2">
                          {result.description.substring(0, 100)}...
                        </p>
                        {result.price && (
                          <p className="text-2xl font-bold text-green-600 mb-2">
                            ${result.price}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            التطابق: {(result.similarity * 100).toFixed(0)}%
                          </span>
                          <Button>عرض التفاصيل</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">لم يتم العثور على نتائج</p>
                    {suggestions.length > 0 && (
                      <div>
                        <p className="mb-2">هل تقصد:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {suggestions.map((suggestion) => (
                            <Button
                              key={suggestion}
                              variant="outline"
                              onClick={() =>
                                window.location.href = `/search?q=${encodeURIComponent(suggestion)}`
                              }
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
