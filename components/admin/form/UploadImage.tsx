'use client'

import { useState, useEffect, ChangeEvent } from 'react'

interface ProductImage {
  id: string
  product_id: string
  image_url: string
  file_path: string
  is_main: boolean
  sort_order: number
  created_at: string
}

export default function ProductImagesManager({ productId }: { productId: string }) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(false)

  // 🖼️ Получение всех картинок продукта
  const fetchImages = async () => {
    const res = await fetch(`/api/images?productId=${productId}`)
    const data: ProductImage[] = await res.json()
    setImages(data)
  }

  useEffect(() => {
    fetchImages()
  }, [productId])

  // 📤 Загрузка новой картинки
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('productId', productId)

    const res = await fetch('/api/images', { method: 'POST', body: formData })
    const data: { imageUrl?: string; error?: string } = await res.json()

    if (data.error) {
      console.error(data.error)
    } else if (data.imageUrl) {
      fetchImages();
    
    }

    setLoading(false)
  }

  // ❌ Удаление картинки
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return

    const res = await fetch(`/api/images/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.error) {
      console.error(data.error)
    } else {
      setImages(prev => prev.filter(img => img.id !== id))
    }
  }

  // ⭐ Сделать картинку главной
  const handleSetMain = async (id: string) => {
    const res = await fetch(`/api/images/set-main`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, productId })
    })
    const data = await res.json()
    if (data.error) {
      console.error(data.error)
    } else {
      // обновляем локальный state
      setImages(prev =>
        prev.map(img => ({
          ...img,
          is_main: img.id === id
        }))
      )
    }
  }

  return (
    <div>
      <h3>Upload new image</h3>
      <input type="file" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}

      <h3>All images:</h3>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {images.map(img => (
          <div key={img.id} style={{ position: 'relative', textAlign: 'center' }}>
            <img
              src={img.image_url}
              width={120}
              style={{ border: img.is_main ? '3px solid red' : '1px solid #ccc' }}
            />
            <div style={{ marginTop: 4 }}>
              {!img.is_main && (
                <button onClick={() => handleSetMain(img.id)} style={{ marginRight: 4 }}>
                  Make main
                </button>
              )}
              <button onClick={() => handleDelete(img.id)} style={{ background: 'red', color: 'white' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}