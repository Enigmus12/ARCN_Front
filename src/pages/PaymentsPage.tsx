import { useState, type FormEvent } from 'react'
import ApiPaymentService, { type CheckoutPayload } from '../service/Api-payment'

type OrderForm = {
  dishName: string
  quantity: string
  unitPrice: string
  currency: string
  customerReference: string
}

const DEFAULT_FORM: OrderForm = {
  dishName: 'Arroz paisa',
  quantity: '10',
  unitPrice: '20000',
  currency: 'cop',
  customerReference: 'restaurante-demo',
}

type PaymentsPageProps = {
  onCreatedCheckout: (sessionUrl: string) => void
}

function PaymentsPage({ onCreatedCheckout }: PaymentsPageProps) {
  const [form, setForm] = useState<OrderForm>(DEFAULT_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateField = <Key extends keyof OrderForm>(field: Key, value: OrderForm[Key]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const payload: CheckoutPayload = {
      dishName: form.dishName.trim(),
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      currency: form.currency.trim().toLowerCase(),
      customerReference: form.customerReference.trim(),
    }

    try {
      const data = await ApiPaymentService.createCheckout(payload)
      onCreatedCheckout(data.sessionurl as string)
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorMessage(
          `No se pudo conectar con ${ApiPaymentService.getBaseUrl()} (URL/CORS/red). Verifica la URL del servicio y CORS.`,
        )
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar Checkout')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="surface card">
        <div className="eyebrow">Stripe Checkout demo</div>
        <h1>Pedido de prueba para restaurante</h1>
        <p className="lead">
          Crea un pedido mínimo, envíalo al backend y redirige a Stripe Checkout.
        </p>

        <p className="hint">Backend configurado en {ApiPaymentService.getBaseUrl()}</p>

        <form className="order-form" onSubmit={handleSubmit}>
          <label>
            <span>Nombre del plato</span>
            <input
              name="dishName"
              value={form.dishName}
              onChange={(event) => updateField('dishName', event.target.value)}
              placeholder="Ají de gallina"
              required
            />
          </label>

          <div className="form-grid">
            <label>
              <span>Cantidad</span>
              <input
                name="quantity"
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(event) => updateField('quantity', event.target.value)}
                required
              />
            </label>

            <label>
              <span>Precio unitario</span>
              <input
                name="unitPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={form.unitPrice}
                onChange={(event) => updateField('unitPrice', event.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              <span>Moneda</span>
              <input
                name="currency"
                value={form.currency}
                onChange={(event) => updateField('currency', event.target.value)}
                placeholder="cop"
                maxLength={3}
                required
              />
            </label>

            <label>
              <span>Referencia del cliente o restaurante</span>
              <input
                name="customerReference"
                value={form.customerReference}
                onChange={(event) => updateField('customerReference', event.target.value)}
                placeholder="Mesa 4 / Pedido 1024"
              />
            </label>
          </div>

          {errorMessage ? <p className="error-box">{errorMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando Checkout...' : 'Ir a pagar con Stripe'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default PaymentsPage
