import { useCallback, useEffect, useState } from 'react'
import type { DependencyList } from 'react'

type UseGetApiResult<T> = {
  data: T | null
  error: string | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useGetApi<T>(
  fetcher: () => Promise<T>,
  dependencies: DependencyList = [],
): UseGetApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetcher()
      setData(response)
    } catch (err) {
      setData(null)
      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      )
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  }
}