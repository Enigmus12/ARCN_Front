import { useEffect, useState } from 'react'
import ApiCatalogService, {
  type Producto,
  type Restaurante,
  type CrearProductoPayload,
} from '../service/Api-catalog'

type CartItem = {
  producto: Producto
  cantidad: number
}

type CheckoutData = {
  dishName: string
  quantity: number
  unitPrice: number
  restauranteName: string
}

type RestaurantDetailPageProps = {
  restauranteId: string
  onGoBack: () => void
  onCheckout: (data: CheckoutData) => void
}

type ProductForm = {
  nombre: string
  descripcion: string
  precio: string
  categoria: string
  tiempoPreparacion: string
  imagen: string
}

const DEFAULT_PRODUCT_FORM: ProductForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: '',
  tiempoPreparacion: '',
  imagen: '',
}

function RestaurantDetailPage({ restauranteId, onGoBack, onCheckout }: RestaurantDetailPageProps) {
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null)
  const [menu, setMenu] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [productForm, setProductForm] = useState<ProductForm>(DEFAULT_PRODUCT_FORM)
  const [savingProduct, setSavingProduct] = useState(false)
  const [productError, setProductError] = useState('')

  const cargarMenu = async () => {
    const menuData = await ApiCatalogService.obtenerMenu(restauranteId)
    setMenu(menuData)
  }

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      setError('')
      try {
        const [rest, menuData] = await Promise.all([
          ApiCatalogService.obtenerPorId(restauranteId),
          ApiCatalogService.obtenerMenu(restauranteId),
        ])
        setRestaurante(rest)
        setMenu(menuData)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando restaurante')
      } finally {
        setLoading(false)
      }
    }
    void cargar()
  }, [restauranteId])

  const updateProductField = (field: keyof ProductForm, value: string) =>
    setProductForm((prev) => ({ ...prev, [field]: value }))

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setProductError('')
    setSavingProduct(true)
    try {
      const payload: CrearProductoPayload = {
        nombre: productForm.nombre.trim(),
        descripcion: productForm.descripcion.trim() || undefined,
        precio: Number(productForm.precio),
        disponible: true,
        categoria: productForm.categoria.trim() || undefined,
        tiempoPreparacion: productForm.tiempoPreparacion
          ? Number(productForm.tiempoPreparacion)
          : undefined,
        imagen: productForm.imagen.trim() || undefined,
      }
      await ApiCatalogService.agregarProducto(restauranteId, payload)
      setProductForm(DEFAULT_PRODUCT_FORM)
      setShowProductForm(false)
      await cargarMenu()
    } catch (err) {
      setProductError(err instanceof Error ? err.message : 'No se pudo agregar el producto')
    } finally {
      setSavingProduct(false)
    }
  }

  const addToCart = (producto: Producto) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id)
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
  }

  const removeFromCart = (productoId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.producto.id === productoId)
      if (!existing) return prev
      if (existing.cantidad === 1) return prev.filter((i) => i.producto.id !== productoId)
      return prev.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
      )
    })
  }

  const totalItems = cart.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrice = cart.reduce((sum, i) => sum + Number(i.producto.precio) * i.cantidad, 0)

  const handleCheckout = () => {
    if (cart.length === 0 || !restaurante) return
    const dishName =
      cart.length === 1
        ? cart[0].producto.nombre
        : `Pedido en ${restaurante.nombre} (${totalItems} productos)`
    onCheckout({
      dishName,
      quantity: 1,
      unitPrice: totalPrice,
      restauranteName: restaurante.nombre,
    })
  }

  if (loading) {
    return (
      <main className="page-shell">
        <section className="surface card">
          <p className="hint">Cargando restaurante...</p>
        </section>
      </main>
    )
  }

  if (error || !restaurante) {
    return (
      <main className="page-shell">
        <section className="surface card">
          <p className="error-box">{error || 'Restaurante no encontrado'}</p>
          <button className="primary-button secondary" type="button" onClick={onGoBack}>
            Volver
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="surface card catalog-card">
        <button type="button" className="back-btn" onClick={onGoBack}>
          ← Volver a restaurantes
        </button>

        <div className="detail-header">
          <div className="eyebrow">{restaurante.categorias?.join(' · ') ?? 'Restaurante'}</div>
          <h1>{restaurante.nombre}</h1>
          {restaurante.descripcion && <p className="lead">{restaurante.descripcion}</p>}
          <div className="detail-meta">
            {restaurante.calificacion != null && (
              <span className="badge-rating">
                {restaurante.calificacion.toFixed(1)}
                {restaurante.numeroResenas != null && ` (${restaurante.numeroResenas} reseñas)`}
              </span>
            )}
            <span className="hint">{restaurante.direccion}</span>
            <span className="hint">
              {restaurante.horaApertura} – {restaurante.horaCierre}
            </span>
            {restaurante.telefono && <span className="hint">{restaurante.telefono}</span>}
          </div>
        </div>

        <div className="menu-title-row">
          <h2 className="menu-title">Menú</h2>
          <button
            type="button"
            className="primary-button create-btn"
            onClick={() => {
              setShowProductForm((v) => !v)
              setProductError('')
            }}
          >
            {showProductForm ? 'Cancelar' : '+ Agregar producto'}
          </button>
        </div>

        {showProductForm && (
          <form className="order-form product-form" onSubmit={handleAddProduct}>
            <label>
              <span>Nombre *</span>
              <input
                value={productForm.nombre}
                onChange={(e) => updateProductField('nombre', e.target.value)}
                placeholder="Bandeja Paisa"
                required
              />
            </label>
            <label>
              <span>Descripción</span>
              <input
                value={productForm.descripcion}
                onChange={(e) => updateProductField('descripcion', e.target.value)}
                placeholder="Descripción del plato..."
              />
            </label>
            <div className="form-grid">
              <label>
                <span>Precio (COP) *</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={productForm.precio}
                  onChange={(e) => updateProductField('precio', e.target.value)}
                  placeholder="35000"
                  required
                />
              </label>
              <label>
                <span>Categoría</span>
                <input
                  value={productForm.categoria}
                  onChange={(e) => updateProductField('categoria', e.target.value)}
                  placeholder="Plato fuerte"
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                <span>Tiempo preparación (min)</span>
                <input
                  type="number"
                  min="1"
                  value={productForm.tiempoPreparacion}
                  onChange={(e) => updateProductField('tiempoPreparacion', e.target.value)}
                  placeholder="20"
                />
              </label>
              <label>
                <span>URL imagen</span>
                <input
                  value={productForm.imagen}
                  onChange={(e) => updateProductField('imagen', e.target.value)}
                  placeholder="https://..."
                />
              </label>
            </div>
            {productError && <p className="error-box">{productError}</p>}
            <button className="primary-button" type="submit" disabled={savingProduct}>
              {savingProduct ? 'Guardando...' : 'Guardar producto'}
            </button>
          </form>
        )}

        {menu.length === 0 ? (
          <p className="hint">Este restaurante aún no tiene productos en su menú.</p>
        ) : (
          <div className="menu-grid">
            {menu.map((producto) => {
              const cartItem = cart.find((i) => i.producto.id === producto.id)
              return (
                <div
                  key={producto.id}
                  className={`menu-item${!producto.disponible ? ' menu-item-unavailable' : ''}`}
                >
                  {producto.imagen && (
                    <img className="menu-item-img" src={producto.imagen} alt={producto.nombre} />
                  )}
                  <div className="menu-item-body">
                    <div className="menu-item-top">
                      <span className="menu-item-name">{producto.nombre}</span>
                      {producto.categoria && <span className="tag">{producto.categoria}</span>}
                    </div>
                    {producto.descripcion && (
                      <p className="menu-item-desc">{producto.descripcion}</p>
                    )}
                    <div className="menu-item-footer">
                      <span className="menu-item-price">
                        ${Number(producto.precio).toLocaleString('es-CO')}
                      </span>
                      {producto.tiempoPreparacion != null && (
                        <span className="hint">{producto.tiempoPreparacion} min</span>
                      )}
                      {producto.disponible ? (
                        <div className="qty-control">
                          {cartItem ? (
                            <>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => removeFromCart(producto.id)}
                              >
                                −
                              </button>
                              <span className="qty-value">{cartItem.cantidad}</span>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => addToCart(producto)}
                              >
                                +
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="qty-btn qty-add"
                              onClick={() => addToCart(producto)}
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="hint">No disponible</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {totalItems > 0 && (
          <div className="cart-summary">
            <div className="cart-summary-line">
              <span>
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </span>
              <strong className="cart-total">${totalPrice.toLocaleString('es-CO')}</strong>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={handleCheckout}
            >
              Proceder al pago
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default RestaurantDetailPage
