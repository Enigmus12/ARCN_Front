import { useState, type FormEvent } from 'react'
import ApiCatalogService, { type CrearRestaurantePayload } from '../service/Api-catalog'

type RestaurantFormPageProps = {
  onGoBack: () => void
  onCreated: () => void
}

const CATEGORIAS_SUGERIDAS = [
  'Italiana', 'Mexicana', 'Colombiana', 'Japonesa', 'Americana', 'Vegetariana',
]

function RestaurantFormPage({ onGoBack, onCreated }: RestaurantFormPageProps) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    latitud: '',
    longitud: '',
    telefono: '',
    email: '',
    horaApertura: '',
    horaCierre: '',
    imagen: '',
  })
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriaInput, setCategoriaInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const addCategoria = () => {
    const cat = categoriaInput.trim()
    if (cat && !categorias.includes(cat)) {
      setCategorias((prev) => [...prev, cat])
    }
    setCategoriaInput('')
  }

  const removeCategoria = (cat: string) =>
    setCategorias((prev) => prev.filter((c) => c !== cat))

  const addCategoriaSugerida = (cat: string) => {
    if (!categorias.includes(cat)) {
      setCategorias((prev) => [...prev, cat])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const payload: CrearRestaurantePayload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      direccion: form.direccion.trim(),
      latitud: Number(form.latitud),
      longitud: Number(form.longitud),
      telefono: form.telefono.trim() || undefined,
      email: form.email.trim() || undefined,
      horaApertura: form.horaApertura,
      horaCierre: form.horaCierre,
      imagen: form.imagen.trim() || undefined,
      categorias: categorias.length > 0 ? categorias : undefined,
      activo: true,
    }

    try {
      await ApiCatalogService.crear(payload)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el restaurante')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="surface card catalog-card">
        <button type="button" className="back-btn" onClick={onGoBack}>
          ← Volver a restaurantes
        </button>

        <div className="eyebrow">Administración</div>
        <h1>Nuevo restaurante</h1>
        <p className="lead">Completa los datos para agregar un restaurante al catálogo.</p>

        <form className="order-form" onSubmit={handleSubmit}>
          <label>
            <span>Nombre *</span>
            <input
              value={form.nombre}
              onChange={(e) => update('nombre', e.target.value)}
              placeholder="La Fonda Paisa"
              required
            />
          </label>

          <label>
            <span>Descripción</span>
            <input
              value={form.descripcion}
              onChange={(e) => update('descripcion', e.target.value)}
              placeholder="Cocina tradicional antioqueña..."
            />
          </label>

          <label>
            <span>Dirección *</span>
            <input
              value={form.direccion}
              onChange={(e) => update('direccion', e.target.value)}
              placeholder="Cra. 43A #18-12, El Poblado, Medellín"
              required
            />
          </label>

          <div className="form-grid">
            <label>
              <span>Latitud *</span>
              <input
                type="number"
                step="any"
                value={form.latitud}
                onChange={(e) => update('latitud', e.target.value)}
                placeholder="6.2088"
                required
              />
            </label>
            <label>
              <span>Longitud *</span>
              <input
                type="number"
                step="any"
                value={form.longitud}
                onChange={(e) => update('longitud', e.target.value)}
                placeholder="-75.5677"
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>Hora apertura *</span>
              <input
                type="time"
                value={form.horaApertura}
                onChange={(e) => update('horaApertura', e.target.value)}
                required
              />
            </label>
            <label>
              <span>Hora cierre *</span>
              <input
                type="time"
                value={form.horaCierre}
                onChange={(e) => update('horaCierre', e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>Teléfono</span>
              <input
                value={form.telefono}
                onChange={(e) => update('telefono', e.target.value)}
                placeholder="+57 300 000 0000"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="contacto@restaurante.com"
              />
            </label>
          </div>

          <label>
            <span>URL de imagen</span>
            <input
              value={form.imagen}
              onChange={(e) => update('imagen', e.target.value)}
              placeholder="https://..."
            />
          </label>

          <div className="field-group">
            <span className="field-label">Categorías</span>
            <div className="chip-row">
              {CATEGORIAS_SUGERIDAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip ${categorias.includes(cat) ? 'chip-active' : ''}`}
                  onClick={() => addCategoriaSugerida(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-row" style={{ marginTop: 10 }}>
              <input
                value={categoriaInput}
                onChange={(e) => setCategoriaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCategoria()
                  }
                }}
                placeholder="Otra categoría..."
              />
              <button
                type="button"
                className="primary-button search-btn"
                onClick={addCategoria}
              >
                Agregar
              </button>
            </div>
            {categorias.length > 0 && (
              <div className="tag-row" style={{ marginTop: 10 }}>
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className="tag tag-removable"
                    onClick={() => removeCategoria(cat)}
                  >
                    {cat} ×
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="error-box">{error}</p>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear restaurante'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default RestaurantFormPage
