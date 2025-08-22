import imageCompression from 'browser-image-compression'
import exifr from 'exifr'
import { supabase } from '@/lib/supabase'

export async function uploadPhoto(file: File, orgId: string, inspectionId: string) {
  const compressed = await imageCompression(file, { maxWidthOrHeight: 1920, maxSizeMB: 3 })
  const exif = await exifr.parse(compressed).catch(()=>null)
  const path = `photos/${orgId}/${inspectionId}/${Date.now()}_${file.name}`
  const { error } = await supabase.storage.from('photos').upload(path, compressed)
  if (error) throw error
  const { data:signed } = await supabase.storage.from('photos').createSignedUrl(path, 600)
  return { path, url: signed?.signedUrl, exif }
}