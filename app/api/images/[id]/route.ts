import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const imageId = id
  if (!imageId) {
    return NextResponse.json({ error: "Missing image ID" }, { status: 400 })
  }

  try {
    const { data: imageData, error: selectError } = await supabaseServer
      .from("product_images")
      .select("file_path")
      .eq("id", imageId)
      .single()

    if (selectError) throw selectError
    if (!imageData)
      return NextResponse.json({ error: "Image not found" }, { status: 404 })

    const filePath: string = imageData.file_path

    const { error: storageError } = await supabaseServer.storage
      .from("images")
      .remove([filePath])

    if (storageError) throw storageError

    const { error: dbError } = await supabaseServer
      .from("product_images")
      .delete()
      .eq("id", imageId)

    if (dbError) throw dbError

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
