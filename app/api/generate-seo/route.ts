import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { productName, description, marca, tipo } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'El nombre del producto es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la API key de OpenAI esté configurada
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu_openai_api_key_aqui') {
      return NextResponse.json(
        { error: 'La API key de OpenAI no está configurada. Por favor configura OPENAI_API_KEY en las variables de entorno de Vercel.' },
        { status: 500 }
      );
    }

    const prompt = `Genera un título SEO optimizado y una meta descripción para un producto de e-commerce.

Producto: ${productName}
Marca: ${marca || 'N/A'}
Tipo: ${tipo || 'N/A'}
Descripción: ${description ? description.substring(0, 500) : 'N/A'}

Genera:
1. Un título SEO (máximo 60 caracteres) optimizado para Google Shopping y búsquedas
2. Una meta descripción (máximo 160 caracteres) atractiva que incentive el clic

Responde SOLO en formato JSON válido:
{
  "title": "título SEO optimizado aquí",
  "description": "meta descripción aquí"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en SEO y marketing de e-commerce. Generas títulos y descripciones optimizados para productos. Responde siempre en formato JSON válido sin ningún texto adicional.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('OpenAI no generó contenido');
    }

    // Parsear el JSON de la respuesta
    const seoData = JSON.parse(content);

    // Validar que tenga los campos necesarios
    if (!seoData.title || !seoData.description) {
      throw new Error('La respuesta de OpenAI no tiene el formato esperado');
    }

    return NextResponse.json(seoData);
  } catch (error: any) {
    console.error('Error generating SEO:', error);
    
    // Errores específicos de OpenAI
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'La API key de OpenAI no es válida. Verifica tu configuración.' },
        { status: 500 }
      );
    }
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'No tienes créditos suficientes en tu cuenta de OpenAI. Recarga tu cuenta en platform.openai.com' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error al generar SEO con IA', 
        details: error.message || 'Error desconocido',
        hint: 'Verifica que tu API key de OpenAI esté configurada correctamente y tengas créditos disponibles.'
      },
      { status: 500 }
    );
  }
}
