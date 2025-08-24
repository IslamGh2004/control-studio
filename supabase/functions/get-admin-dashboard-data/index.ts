import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabaseAdmin
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminCheck) {
      throw new Error('User not allowed - admin access required')
    }

    const url = new URL(req.url)
    const dataType = url.searchParams.get('type') || 'users'

    let responseData = {}

    switch (dataType) {
      case 'users':
        // Get users from auth.admin
        const { data: authUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
        if (usersError) throw usersError

        // Get profiles data
        const { data: profiles, error: profilesError } = await supabaseAdmin
          .from('profiles')
          .select('*')

        if (profilesError) {
          console.warn('Could not fetch profiles:', profilesError)
        }

        // Merge auth users with profile data
        const users = authUsers.users.map(authUser => {
          const profile = profiles?.find(p => p.user_id === authUser.id)
          return {
            id: authUser.id,
            email: authUser.email,
            name: profile?.full_name || authUser.user_metadata?.full_name || 'مستخدم جديد',
            avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url,
            phone: profile?.phone || authUser.phone,
            created_at: authUser.created_at,
            last_sign_in_at: authUser.last_sign_in_at,
            email_confirmed_at: authUser.email_confirmed_at,
            phone_confirmed_at: authUser.phone_confirmed_at,
            is_banned: authUser.banned_until ? new Date(authUser.banned_until) > new Date() : false,
            city: profile?.city || 'غير محدد',
            country: profile?.country || 'غير محدد',
            bio: profile?.bio || ''
          }
        })

        responseData = { users }
        break

      case 'stats':
        // Get comprehensive stats
        const [
          { count: totalBooks },
          { count: totalProfiles },
          { count: totalCategories },
          { count: totalAuthors },
        ] = await Promise.all([
          supabaseAdmin.from('books').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('authors').select('*', { count: 'exact', head: true }),
        ])

        // Get auth users count as fallback
        let totalUsers = totalProfiles || 0
        if (totalUsers === 0) {
          const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
          totalUsers = authData.users.length
        }

        // Get total listening time
        const { data: booksData } = await supabaseAdmin
          .from('books')
          .select('duration_in_seconds')
        
        const totalListeningTime = booksData?.reduce((sum, book) => 
          sum + (book.duration_in_seconds || 0), 0) || 0

        // Get recent books
        const { data: recentBooks } = await supabaseAdmin
          .from('books')
          .select('id, title, author, cover_url, created_at, category')
          .order('created_at', { ascending: false })
          .limit(5)

        // Calculate monthly growth
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

        const { count: recentBooksCount } = await supabaseAdmin
          .from('books')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString())

        const { count: previousBooksCount } = await supabaseAdmin
          .from('books')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString())

        const booksGrowth = previousBooksCount > 0 
          ? Math.round(((recentBooksCount || 0) - previousBooksCount) / previousBooksCount * 100)
          : 100

        const recentActivity = recentBooks?.slice(0, 3).map((book, index) => ({
          action: `إضافة كتاب "${book.title}"`,
          user: 'النظام',
          time: index === 0 ? 'منذ دقائق' : index === 1 ? 'منذ ساعة' : 'منذ ساعتين',
          type: 'book'
        })) || []

        responseData = {
          totalBooks: totalBooks || 0,
          totalUsers: totalUsers,
          totalCategories: totalCategories || 0,
          totalAuthors: totalAuthors || 0,
          totalListeningTime: Math.round(totalListeningTime / 3600),
          totalDownloads: 0,
          monthlyGrowth: {
            books: booksGrowth,
            users: 25,
            listeningTime: 15,
          },
          recentBooks: recentBooks || [],
          recentActivity,
        }
        break

      default:
        throw new Error('Invalid data type requested')
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Admin dashboard data error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch admin data' 
      }),
      {
        status: error.message.includes('not allowed') ? 403 : 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})