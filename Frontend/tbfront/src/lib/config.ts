// Centralized backend/API configuration
// Prefer environment override when provided

const DEFAULT_BACKEND = 'http://127.0.0.1:8000'

export const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || DEFAULT_BACKEND).replace(/\/$/, '')
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || `${BACKEND_ORIGIN}/api`).replace(/\/$/, '')
