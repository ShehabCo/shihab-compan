export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return {
    auth: {
      getUser: async () => {
        // Return null user for now
        return { data: { user: null }, error: null }
      },
    },
    from: (table: string) => ({
      select: (columns = "*") => {
        let queryParams = `select=${columns}`
        const filters: string[] = []

        const builder = {
          eq: (column: string, value: any) => {
            filters.push(`${column}=eq.${value}`)
            return builder
          },
          order: (column: string, options?: { ascending?: boolean }) => {
            queryParams += `&order=${column}.${options?.ascending ? "asc" : "desc"}`
            return builder
          },
          limit: (count: number) => {
            queryParams += `&limit=${count}`
            return builder
          },
          then: async (resolve: any) => {
            try {
              const filterString = filters.length > 0 ? "&" + filters.join("&") : ""
              const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${queryParams}${filterString}`, {
                headers: {
                  apikey: supabaseKey,
                  "Content-Type": "application/json",
                },
                cache: "no-store",
              })
              const data = await response.json()
              resolve({ data: Array.isArray(data) ? data : [], error: null })
            } catch (error) {
              resolve({ data: [], error })
            }
          },
        }

        return builder
      },
      insert: (values: any) => ({
        select: () => ({
          single: () => ({
            then: async (resolve: any) => {
              try {
                const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                  method: "POST",
                  headers: {
                    apikey: supabaseKey,
                    "Content-Type": "application/json",
                    Prefer: "return=representation",
                  },
                  body: JSON.stringify(values),
                })
                const data = await response.json()
                resolve({ data: Array.isArray(data) ? data[0] : data, error: null })
              } catch (error) {
                resolve({ data: null, error })
              }
            },
          }),
        }),
      }),
    }),
  }
}
