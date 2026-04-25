export type Producto = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  categoria?: string;
  tiempoPreparacion?: number;
  imagen?: string;
};

export type Restaurante = {
  id: string;
  nombre: string;
  descripcion?: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono?: string;
  email?: string;
  horaApertura: string;
  horaCierre: string;
  calificacion?: number;
  numeroResenas?: number;
  imagen?: string;
  categorias?: string[];
  menu?: Producto[];
  activo: boolean;
  distanciaKm?: number;
};

export type BusquedaRequest = {
  latitudUsuario: number;
  longitudUsuario: number;
  radioKm?: number;
  categoria?: string;
  calificacionMinima?: number;
};

export type CrearProductoPayload = {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  categoria?: string;
  tiempoPreparacion?: number;
  imagen?: string;
};

export type CrearRestaurantePayload = {
  nombre: string;
  descripcion?: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono?: string;
  email?: string;
  horaApertura: string;
  horaCierre: string;
  imagen?: string;
  categorias?: string[];
  activo: boolean;
};

const MOCK_RESTAURANTES: Restaurante[] = [
  {
    id: 'mock-1',
    nombre: 'La Fonda Paisa',
    descripcion: 'Auténtica cocina antioqueña con bandeja paisa, frijoles y chicharrón.',
    direccion: 'Cra. 43A #18-12, El Poblado, Medellín',
    latitud: 6.2088,
    longitud: -75.5677,
    horaApertura: '07:00:00',
    horaCierre: '22:00:00',
    calificacion: 4.7,
    numeroResenas: 312,
    categorias: ['Colombiana'],
    activo: true,
  },
  {
    id: 'mock-2',
    nombre: 'Sushi Osaka',
    descripcion: 'Rolls, nigiris y sashimi preparados con pescado fresco importado.',
    direccion: 'Calle 93 #13-45, Bogotá',
    latitud: 4.6757,
    longitud: -74.0479,
    horaApertura: '12:00:00',
    horaCierre: '23:00:00',
    calificacion: 4.5,
    numeroResenas: 198,
    categorias: ['Japonesa'],
    activo: true,
  },
  {
    id: 'mock-3',
    nombre: 'Pizza Napolitana',
    descripcion: 'Pizzas al horno de leña con ingredientes importados de Italia.',
    direccion: 'Av. Quinta de Camacho #67-10, Bogotá',
    latitud: 4.6531,
    longitud: -74.0562,
    horaApertura: '11:30:00',
    horaCierre: '22:30:00',
    calificacion: 4.6,
    numeroResenas: 254,
    categorias: ['Italiana'],
    activo: true,
  },
  {
    id: 'mock-4',
    nombre: 'El Taco Loco',
    descripcion: 'Tacos, burritos y quesadillas con recetas originales del norte de México.',
    direccion: 'Cra. 11 #85-32, Bogotá',
    latitud: 4.6702,
    longitud: -74.0517,
    horaApertura: '11:00:00',
    horaCierre: '23:00:00',
    calificacion: 4.3,
    numeroResenas: 167,
    categorias: ['Mexicana'],
    activo: true,
  },
  {
    id: 'mock-5',
    nombre: 'Burger House',
    descripcion: 'Hamburguesas artesanales con carne angus, papas fritas y malteadas.',
    direccion: 'Calle 72 #10-07, Bogotá',
    latitud: 4.6589,
    longitud: -74.0538,
    horaApertura: '10:00:00',
    horaCierre: '23:30:00',
    calificacion: 4.2,
    numeroResenas: 421,
    categorias: ['Americana'],
    activo: true,
  },
  {
    id: 'mock-6',
    nombre: 'Verde Vida',
    descripcion: 'Menú 100% vegetariano y vegano. Bowls, wraps y jugos naturales.',
    direccion: 'Cra. 6 #119-24, Usaquén, Bogotá',
    latitud: 4.695,
    longitud: -74.0336,
    horaApertura: '08:00:00',
    horaCierre: '21:00:00',
    calificacion: 4.8,
    numeroResenas: 289,
    categorias: ['Vegetariana'],
    activo: true,
  },
  {
    id: 'mock-7',
    nombre: 'Mar y Tierra',
    descripcion: 'Mariscos frescos del Pacífico y cortes de carne a la parrilla.',
    direccion: 'Calle 16 #1-56, La Candelaria, Bogotá',
    latitud: 4.5981,
    longitud: -74.076,
    horaApertura: '12:00:00',
    horaCierre: '22:00:00',
    calificacion: 4.4,
    numeroResenas: 133,
    categorias: ['Colombiana'],
    activo: true,
  },
  {
    id: 'mock-8',
    nombre: 'Ramen Tokio',
    descripcion: 'Ramen artesanal con caldo de 12 horas, gyozas y edamame.',
    direccion: 'Cra. 15 #88-21, Bogotá',
    latitud: 4.6715,
    longitud: -74.049,
    horaApertura: '12:00:00',
    horaCierre: '22:30:00',
    calificacion: 4.6,
    numeroResenas: 176,
    categorias: ['Japonesa'],
    activo: true,
  },
  {
    id: 'mock-9',
    nombre: 'Pasta & Basta',
    descripcion: 'Pastas frescas hechas a mano cada día. Lasaña, fettuccine y risotto.',
    direccion: 'Calle 53 #24-18, Chapinero, Bogotá',
    latitud: 4.6427,
    longitud: -74.0641,
    horaApertura: '12:00:00',
    horaCierre: '22:00:00',
    calificacion: 4.5,
    numeroResenas: 209,
    categorias: ['Italiana'],
    activo: true,
  },
  {
    id: 'mock-10',
    nombre: 'Pollo Broaster El Rey',
    descripcion: 'Pollo broaster crujiente, sudado y a la plancha. Domicilios en 30 min.',
    direccion: 'Av. Américas #36-15, Bogotá',
    latitud: 4.6283,
    longitud: -74.0891,
    horaApertura: '10:00:00',
    horaCierre: '23:00:00',
    calificacion: 4.1,
    numeroResenas: 548,
    categorias: ['Colombiana', 'Americana'],
    activo: true,
  },
];

const API_BASE = '/api/v1/restaurantes';

class ApiCatalogService {
  static getBaseUrl() {
    return API_BASE;
  }

  static async obtenerTodos(): Promise<Restaurante[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(API_BASE, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json() as Promise<Restaurante[]>;
    } catch {
      clearTimeout(timeout);
      return MOCK_RESTAURANTES;
    }
  }

  static async obtenerPorId(id: string): Promise<Restaurante> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error(`Error ${response.status} al obtener restaurante`);
    return response.json() as Promise<Restaurante>;
  }

  static async obtenerMenu(restauranteId: string): Promise<Producto[]> {
    const response = await fetch(`${API_BASE}/${restauranteId}/menu`);
    if (!response.ok) throw new Error(`Error ${response.status} al obtener menú`);
    return response.json() as Promise<Producto[]>;
  }

  static async buscarCercanos(request: BusquedaRequest): Promise<Restaurante[]> {
    const response = await fetch(`${API_BASE}/buscar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`Error ${response.status} al buscar restaurantes`);
    return response.json() as Promise<Restaurante[]>;
  }

  static async buscarPorCategoria(categoria: string): Promise<Restaurante[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(`${API_BASE}/categoria/${encodeURIComponent(categoria)}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json() as Promise<Restaurante[]>;
    } catch {
      clearTimeout(timeout);
      return MOCK_RESTAURANTES.filter((r) =>
        r.categorias?.some((c) => c.toLowerCase() === categoria.toLowerCase()),
      );
    }
  }

  static async agregarProducto(restauranteId: string, payload: CrearProductoPayload): Promise<Restaurante> {
    const response = await fetch(`${API_BASE}/${restauranteId}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      let mensaje = `Error ${response.status}`;
      try {
        const data = (await response.json()) as { mensaje?: string };
        if (data.mensaje) mensaje = data.mensaje;
      } catch { /* sin body */ }
      throw new Error(mensaje);
    }
    return response.json() as Promise<Restaurante>;
  }

  static async crear(payload: CrearRestaurantePayload): Promise<Restaurante> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      let mensaje = `Error ${response.status}`;
      try {
        const data = (await response.json()) as { mensaje?: string };
        if (data.mensaje) mensaje = data.mensaje;
      } catch { /* sin body */ }
      throw new Error(mensaje);
    }
    return response.json() as Promise<Restaurante>;
  }

  static async buscarPorNombre(nombre: string): Promise<Restaurante[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(`${API_BASE}/nombre/${encodeURIComponent(nombre)}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json() as Promise<Restaurante[]>;
    } catch {
      clearTimeout(timeout);
      const q = nombre.toLowerCase();
      return MOCK_RESTAURANTES.filter((r) => r.nombre.toLowerCase().includes(q));
    }
  }
}

export default ApiCatalogService;
