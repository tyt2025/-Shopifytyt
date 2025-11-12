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

    const prompt = `Genera un título SEO optimizado y una meta descripción para un producto de e-commerce.

Producto: ${productName}
Marca: ${marca || 'N/A'}
Tipo: ${tipo || 'N/A'}
Descripción: ${description || 'N/A'}

Genera:
1. Un título SEO (máximo 60 caracteres) optimizado para Google Shopping y búsquedas
2. Una meta descripción (máximo 160 caracteres) atractiva que incentive el clic

Responde en formato JSON:
{
  "title": "título SEO optimizado aquí",
  "description": "meta descripción aquí"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en SEO y marketing de e-commerce. Generas títulos y descripciones optimizados para productos. Responde siempre en formato JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No se generó contenido');
    }

    // Parsear el JSON de la respuesta
    const seoData = JSON.parse(content);

    return NextResponse.json(seoData);
  } catch (error: any) {
    console.error('Error generating SEO:', error);
    return NextResponse.json(
      { error: 'Error al generar SEO', details: error.message },
      { status: 500 }
    );
  }
}
