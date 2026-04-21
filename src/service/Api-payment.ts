export type CheckoutPayload = {
  dishName: string
  quantity: number
  unitPrice: number
  currency: string
  customerReference: string
}

export type CheckoutResponse = {
  status?: string
  message?: string
  sessionId?: string
  sessionurl?: string
}

export type ConfirmPaymentResponse = {
  status?: string
  message?: string
  summary?: unknown
}

const API_BASE_URL = 'http://localhost:8081/api/stripe'

class ApiPaymentService {
  static getBaseUrl() {
    return API_BASE_URL
  }

  static async createCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    const endpoint = `${API_BASE_URL}/checkout`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    let data: CheckoutResponse | null = null
    try {
      data = (await response.json()) as CheckoutResponse
    } catch {
      data = null
    }

    if (!response.ok) {
      const details = data?.message ?? 'Sin detalle en el body'
      throw new Error(`El backend respondió ${response.status} en ${endpoint}: ${details}`)
    }

    if (!data?.sessionurl) {
      throw new Error('La respuesta no incluyó sessionurl')
    }

    return data
  }

  static async confirmPayment(sessionId: string): Promise<ConfirmPaymentResponse> {
    const endpoint = `${API_BASE_URL}/confirm-payment`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    })

    let data: ConfirmPaymentResponse | null = null
    try {
      data = (await response.json()) as ConfirmPaymentResponse
    } catch {
      data = null
    }

    if (!response.ok) {
      const details = data?.message ?? 'Sin detalle en el body'
      throw new Error(`Confirmación falló con ${response.status} en ${endpoint}: ${details}`)
    }

    return data ?? {}
  }
}

export default ApiPaymentService
