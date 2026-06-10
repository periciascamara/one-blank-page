import { NextResponse } from 'next/server'

// Mantenha este token protegido no backend
const CRM_API_TOKEN = '90df5bf0c292a8f1aff2335e8f88a492d254bcd4'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uf = searchParams.get('uf')
  const numero_registro = searchParams.get('numero_registro')

  if (!uf || !numero_registro) {
    return NextResponse.json(
      { error: 'UF e numero_registro são obrigatórios' },
      { status: 400 }
    )
  }

  try {
    const url = `https://consultar.io/api/v1/crm/consultar?uf=${uf.toLowerCase()}&numero_registro=${numero_registro}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${CRM_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Erro ao consultar CRM' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('CRM API Error:', error)
    return NextResponse.json(
      { error: 'Erro interno ao consultar CRM' },
      { status: 500 }
    )
  }
}
