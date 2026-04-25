import { useEffect, useState, type FormEvent } from 'react'
import ApiCatalogService, { type Restaurante } from '../service/Api-catalog'

type RestaurantListPageProps = {
  onSelectRestaurant: (id: string) => void
  onCreateRestaurant: () => void
}

const CATEGORIAS_SUGERIDAS = [
  'Italiana', 'Mexicana', 'Colombiana', 'Japonesa', 'Americana', 'Vegetariana',
]

function RestaurantListPage({ onSelectRestaurant, onCreateRestaurant }: RestaurantListPageProps) {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('')

  const cargar = async (nombre = '', categoria = '') => {
    setLoading(true)
    setError('')
    try {
      let data: Restaurante[]
      if (categoria) {
        data = await ApiCatalogService.buscarPorCategoria(categoria)
      } else if (nombre) {
        data = await ApiCatalogService.buscarPorNombre(nombre)
      } else {
        data = await ApiCatalogService.obtenerTodos()
      }
      setRestaurantes(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando restaurantes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void cargar() }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setCategoriaActiva('')
    void cargar(searchInput.trim())
  }

  const handleCategoria = (cat: string) => {
    const nueva = cat === categoriaActiva ? '' : cat
    setCategoriaActiva(nueva)
    setSearchInput('')
    void cargar('', nueva)
  }

  return (
    <main className="page-shell">
      <section className="surface card catalog-card">
        <div className="list-header">
          <div className="eyebrow">Entrega a domicilio</div>
          <button type="button" className="primary-button create-btn" onClick={onCreateRestaurant}>
            + Nuevo restaurante
          </button>
        </div>
        <h1>Restaurantes</h1>
        <p className="lead">
          Elige un restaurante, explora su menú y realiza tu pedido en línea.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-row">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre..."
            />
            <button className="primary-button search-btn" type="submit">
              Buscar
            </button>
          </div>
        </form>

        <div className="chip-row">
          {CATEGORIAS_SUGERIDAS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${categoriaActiva === cat ? 'chip-active' : ''}`}
              onClick={() => handleCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="hint">Cargando restaurantes...</p>}
        {error && <p className="error-box">{error}</p>}
        {!loading && !error && restaurantes.length === 0 && (
          <p className="hint">No se encontraron restaurantes.</p>
        )}

        <div className="restaurant-list">
          {restaurantes.map((r) => (
            <button
              key={r.id}
              type="button"
              className="restaurant-card"
              onClick={() => onSelectRestaurant(r.id)}
            >
              {r.imagen ? (
                <img className="restaurant-img" src={r.imagen} alt={r.nombre} />
              ) : (
                <div className="restaurant-img restaurant-img-placeholder" />
              )}
              <div className="restaurant-body">
                <div className="restaurant-title-row">
                  <h2 className="restaurant-name">{r.nombre}</h2>
                  {r.calificacion != null && (
                    <span className="badge-rating">{r.calificacion.toFixed(1)}</span>
                  )}
                </div>
                {r.descripcion && <p className="restaurant-desc">{r.descripcion}</p>}
                <p className="restaurant-address">{r.direccion}</p>
                <p className="restaurant-hours">{r.horaApertura} – {r.horaCierre}</p>
                {r.categorias && r.categorias.length > 0 && (
                  <div className="tag-row">
                    {r.categorias.map((c) => (
                      <span key={c} className="tag">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default RestaurantListPage
