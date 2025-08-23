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

    if (!bookId) {
      throw new Error('Missing book ID')
    }

    if (!audioFile && !coverFile) {
      throw new Error('At least one file (audio or cover) is required')
    }

    console.log('Processing files for book:', bookId)
    if (audioFile) console.log('Audio file:', audioFile.name, 'Size:', audioFile.size)
    if (coverFile) console.log('Cover file:', coverFile.name, 'Size:', coverFile.size)

    let coverFileName, audioFileName, coverUrl, audioUrl;

    // Upload cover image if provided
    if (coverFile) {
      coverFileName = `covers/${bookId}_${Date.now()}.${coverFile.name.split('.').pop()}`
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

      const { data: coverUrlData } = supabaseClient.storage
        .from('cover_images')
        .getPublicUrl(coverFileName)
      coverUrl = coverUrlData.publicUrl
    }

    // Upload audio file if provided
    if (audioFile) {
      audioFileName = `audio/${bookId}_${Date.now()}.${audioFile.name.split('.').pop()}`
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

      const { data: audioUrlData } = supabaseClient.storage
        .from('audio_files')
        .getPublicUrl(audioFileName)
      audioUrl = audioUrlData.publicUrl
    }

    // Get audio duration using Web Audio API (only if audio file is provided)
    let duration = 0
    if (audioFile) {
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
    }

    const result: any = {}
    if (coverUrl) {
      result.coverUrl = coverUrl
      result.coverPath = coverFileName
    }
    if (audioUrl) {
      result.audioUrl = audioUrl
      result.audioPath = audioFileName
      result.duration = duration
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