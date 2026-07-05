export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return {
    auth: {
      getUser: async () => {
        // Return null user for now - auth will be handled separately
        return { data: { user: null }, error: null }
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email, password }),
        })
        return await response.json()
      },
      signUp: async ({ email, password, options }: any) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email, password, data: options?.data }),
        })
        return await response.json()
      },
      signOut: async () => {
        return { error: null }
      },
    },
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            limit: (count: number) => ({
              then: async (resolve: any) => {
                try {
                  const response = await fetch(
                    `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&order=${column}.${options?.ascending ? "asc" : "desc"}&limit=${count}`,
                    {
                      headers: {
                        apikey: supabaseKey,
                        "Content-Type": "application/json",
                      },
                    },
                  )
                  const data = await response.json()
                  resolve({ data, error: null })
                } catch (error) {
                  resolve({ data: null, error })
                }
              },
            }),
          }),
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (resolve: any) => {
              try {
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${column}.${options?.ascending ? "asc" : "desc"}&limit=${count}`,
                  {
                    headers: {
                      apikey: supabaseKey,
                      "Content-Type": "application/json",
                    },
                  },
                )
                const data = await response.json()
                resolve({ data, error: null })
              } catch (error) {
                resolve({ data: null, error })
              }
            },
          }),
        }),
        then: async (resolve: any) => {
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}`, {
              headers: {
                apikey: supabaseKey,
                "Content-Type": "application/json",
              },
            })
            const data = await response.json()
            resolve({ data, error: null })
          } catch (error) {
            resolve({ data: null, error })
          }
        },
      }),
    }),
  }
}
