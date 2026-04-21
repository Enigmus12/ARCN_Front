# Stripe Checkout Front Demo

Frontend minimo para probar pagos de restaurante con Stripe Checkout.

## Estructura

- `src/App.tsx`: enrutado simple por pathname
- `src/pages/PaymentsPage.tsx`: formulario de pedido y creacion de checkout
- `src/pages/PaymentSuccessPage.tsx`: pantalla de pago exitoso y confirmacion opcional
- `src/pages/PaymentCancelPage.tsx`: pantalla de cancelacion
- `src/service/Api-payment.ts`: clase centralizada para llamadas al backend
- `src/styles/global.css`: estilos globales
- `src/styles/payment.css`: estilos de pantallas de pago

## Configuracion del backend (sin .env)

La URL base del backend esta en:

- `src/service/Api-payment.ts`

Variable actual dentro del archivo:

- `API_BASE_URL = 'http://localhost:8081/api/stripe'`

Si cambias de entorno, solo modifica esa constante.

## Contrato de API

### Crear checkout

- `POST /checkout`
- Body:
  - `dishName`
  - `quantity`
  - `unitPrice`
  - `currency`
  - `customerReference`
- Respuesta esperada:
  - `sessionId`
  - `sessionurl`

### Confirmar pago (opcional en success)

- `POST /confirm-payment`
- Body:
  - `sessionId`

## Rutas frontend

- `/`
- `/payment-success?session_id=...`
- `/payment-cancel`

## Ejecutar

```bash
npm install
npm run dev
```

## Build y lint

```bash
npm run lint
npm run build
```
