import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yoqojrufwigyrflnzncd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Wm3dGa1Yg1TnlevZjxKmSw_0Dy4vmtf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Inquiry operations
export async function submitInquiry(data: {
  name: string;
  phone: string;
  message?: string;
  tehsil: string;
  village: string;
  interestedTractor?: string;
}) {
  const { data: result, error } = await supabase
    .from('inquiries')
    .insert([
      {
        name: data.name,
        phone: data.phone,
        message: data.message || null,
        tehsil: data.tehsil,
        village: data.village,
        interested_tractor: data.interestedTractor || null,
      },
    ])
    .select();

  if (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }

  return result;
}

// Tractor operations
export async function fetchTractors() {
  const { data, error } = await supabase
    .from('tractors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tractors:', error);
    throw error;
  }

  return data;
}

export async function addTractor(data: {
  name: string;
  model: string;
  hp: number;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  year?: number;
}) {
  const { data: result, error } = await supabase
    .from('tractors')
    .insert([
      {
        name: data.name,
        model: data.model,
        hp: data.hp,
        price: data.price,
        image_url: data.imageUrl,
        description: data.description,
        stock: data.stock,
        year: data.year || null,
      },
    ])
    .select();

  if (error) {
    console.error('Error adding tractor:', error);
    throw error;
  }

  return result;
}

export async function updateTractor(id: string, data: {
  name?: string;
  model?: string;
  hp?: number;
  price?: number;
  imageUrl?: string;
  description?: string;
  stock?: number;
  year?: number;
}) {
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.model) updateData.model = data.model;
  if (data.hp) updateData.hp = data.hp;
  if (data.price) updateData.price = data.price;
  if (data.imageUrl) updateData.image_url = data.imageUrl;
  if (data.description) updateData.description = data.description;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.year) updateData.year = data.year;

  const { data: result, error } = await supabase
    .from('tractors')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating tractor:', error);
    throw error;
  }

  return result;
}

export async function deleteTractor(id: string) {
  const { error } = await supabase
    .from('tractors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tractor:', error);
    throw error;
  }
}

// Tehsil operations
export async function fetchTehsils() {
  const { data, error } = await supabase
    .from('tehsils')
    .select(`
      *,
      villages (
        id,
        name
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tehsils:', error);
    throw error;
  }

  return data;
}

export async function addTehsil(name: string) {
  const { data: result, error } = await supabase
    .from('tehsils')
    .insert([{ name }])
    .select();

  if (error) {
    console.error('Error adding tehsil:', error);
    throw error;
  }

  return result;
}

export async function deleteTehsil(id: string) {
  const { error } = await supabase
    .from('tehsils')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tehsil:', error);
    throw error;
  }
}

// Village operations
export async function addVillage(name: string, tehsilId: string) {
  const { data: result, error } = await supabase
    .from('villages')
    .insert([{ name, tehsil_id: tehsilId }])
    .select();

  if (error) {
    console.error('Error adding village:', error);
    throw error;
  }

  return result;
}

export async function deleteVillage(id: string) {
  const { error } = await supabase
    .from('villages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting village:', error);
    throw error;
  }
}

// Image upload to Supabase Storage
export async function uploadImage(file: File, bucket: string = 'tractor-images') {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}
