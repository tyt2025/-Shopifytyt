import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener productos de Supabase
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('product_name', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Función para obtener un producto específico
export async function getProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
