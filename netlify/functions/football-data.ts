const API_BASE = 'https://api.football-data.org/v4'
const FUNCTION_PREFIX = '/.netlify/functions/football-data'

const getPathSuffix = (event: any) => {
  if (event.rawUrl) {
    const url = new URL(event.rawUrl)
    return url.pathname.replace(FUNCTION_PREFIX, '')
  }
  return (event.path || '').replace(FUNCTION_PREFIX, '')
}

const buildTargetUrl = (event: any) => {
  const suffix = getPathSuffix(event)
  const normalizedSuffix = suffix
    ? suffix.startsWith('/')
      ? suffix
      : `/${suffix}`
    : ''
  const query = event.rawQuery ? `?${event.rawQuery}` : ''
  const base = API_BASE.replace(/\/$/, '')
  return `${base}${normalizedSuffix}${query}`
}

const forwardBody = (event: any) => {
  if (!event.body) return undefined
  if (!event.httpMethod || ['GET', 'HEAD'].includes(event.httpMethod)) {
    return undefined
  }
  return event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body
}

export const handler = async (event: any) => {
  const token = process.env.VITE_FOOTBALL_DATA_TOKEN || process.env.FOOTBALL_DATA_TOKEN
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Football Data API token' }),
      headers: { 'content-type': 'application/json' },
    }
  }

  const targetUrl = buildTargetUrl(event)
  const headers: Record<string, string> = {
    'X-Auth-Token': token,
  }

  const allowedForwardHeaders = ['accept', 'content-type']
  allowedForwardHeaders.forEach((header) => {
    const value = event.headers?.[header]
    if (value) {
      headers[header] = value
    }
  })

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod || 'GET',
      headers,
      body: forwardBody(event),
    })

    const responseBody = await response.text()
    const proxiedHeaders: Record<string, string> = {}
    const headerWhitelist = ['content-type', 'cache-control', 'expires']
    headerWhitelist.forEach((name) => {
      const value = response.headers.get(name)
      if (value) {
        proxiedHeaders[name] = value
      }
    })

    return {
      statusCode: response.status,
      body: responseBody,
      headers: proxiedHeaders,
    }
  } catch (error) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: 'Failed to reach Football Data API',
        details: error instanceof Error ? error.message : String(error),
      }),
      headers: { 'content-type': 'application/json' },
    }
  }
}
