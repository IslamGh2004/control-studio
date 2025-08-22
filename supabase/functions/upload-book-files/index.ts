import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    const audioFile = formData.get('audioFile') as File
    const coverFile = formData.get('coverFile') as File
    const bookId = formData.get('bookId') as string

    if (!audioFile || !coverFile || !bookId) {
      throw new Error('Missing required files or book ID')
    }

    console.log('Processing files for book:', bookId)
    console.log('Audio file:', audioFile.name, 'Size:', audioFile.size)
    console.log('Cover file:', coverFile.name, 'Size:', coverFile.size)

    // Upload cover image
    const coverFileName = `covers/${bookId}_${Date.now()}.${coverFile.name.split('.').pop()}`
    const { data: coverData, error: coverError } = await supabaseClient.storage
      .from('cover_images')
      .upload(coverFileName, coverFile, {
        upsert: true,
        contentType: coverFile.type
      })

    if (coverError) {
      console.error('Cover upload error:', coverError)
      throw new Error(`Failed to upload cover: ${coverError.message}`)
    }

    // Upload audio file
    const audioFileName = `audio/${bookId}_${Date.now()}.${audioFile.name.split('.').pop()}`
    const { data: audioData, error: audioError } = await supabaseClient.storage
      .from('audio_files')
      .upload(audioFileName, audioFile, {
        upsert: true,
        contentType: audioFile.type
      })

    if (audioError) {
      console.error('Audio upload error:', audioError)
      throw new Error(`Failed to upload audio: ${audioError.message}`)
    }

    // Get audio duration using Web Audio API
    let duration = 0
    try {
      const audioBuffer = await audioFile.arrayBuffer()
      const audioContext = new (globalThis as any).AudioContext()
      const decodedAudio = await audioContext.decodeAudioData(audioBuffer)
      duration = Math.round(decodedAudio.duration)
      console.log('Audio duration extracted:', duration, 'seconds')
    } catch (audioError) {
      console.error('Error extracting audio duration:', audioError)
      // Fallback: estimate duration based on file size (rough estimation)
      duration = Math.round(audioFile.size / 32000) // Rough estimate: 32KB per second
      console.log('Using estimated duration:', duration, 'seconds')
    }

    // Get public URLs
    const { data: coverUrl } = supabaseClient.storage
      .from('cover_images')
      .getPublicUrl(coverFileName)

    const { data: audioUrl } = supabaseClient.storage
      .from('audio_files')
      .getPublicUrl(audioFileName)

    const result = {
      coverUrl: coverUrl.publicUrl,
      audioUrl: audioUrl.publicUrl,
      duration: duration,
      coverPath: coverFileName,
      audioPath: audioFileName
    }

    console.log('Upload successful:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to upload files' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})