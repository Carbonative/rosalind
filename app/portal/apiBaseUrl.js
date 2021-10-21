const isProduction = (typeof window !== 'undefined' ? (window.location.protocol === 'https:') : true)

export const apiBaseUrl = isProduction ? '' : 'http://10.0.0.20:3000'
