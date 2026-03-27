import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { v4 as uuidv4 } from 'uuid'
import type { ProductImage } from '@/types/image'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get('file')
    const productId = formData.get('productId')

    if (!(file instanceof File) || typeof productId !== 'string') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    // 🔒 validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max 5MB' }, { status: 400 })
    }

    // имя файла и путь
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `products/${productId}/${fileName}`

    // upload в Supabase Storage
    const { error: uploadError } = await supabaseServer.storage
      .from('images')
      .upload(filePath, file)

      console.log('Upload result:', { filePath, uploadError })

    if (uploadError) throw uploadError

    // получить publicUrl
    const { data } = supabaseServer.storage
      .from('images')
      .getPublicUrl(filePath)

    const imageUrl = data.publicUrl

    const { error: dbError } = await supabaseServer
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: imageUrl,
        file_path: filePath
      })

    if (dbError) throw dbError

    return NextResponse.json({ imageUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET( req: Request
): Promise<Response> {
    const url = new URL(req.url)
    const productId = url.searchParams.get('productId')

    if (!productId) {
        return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        // .order('is_main', { ascending: false })
        // .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data as ProductImage[])
}