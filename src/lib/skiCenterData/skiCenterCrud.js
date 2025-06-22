
import { supabase } from '@/lib/supabaseClient';

const mapSkiCenterFromSupabase = (skiCenter) => {
    if (!skiCenter) return null;
    return {
        id: skiCenter.id,
        name: skiCenter.name || '',
        slug: skiCenter.slug || '',
        generalDescription: skiCenter.general_description || '',
        profileAndTracks: skiCenter.profile_and_tracks || '',
        uniqueExperience: skiCenter.unique_experience || '',
        valuableTips: skiCenter.valuable_tips || '',
        practicalInfo: skiCenter.practical_info || '',
        mainImageUrl: skiCenter.main_image_url || '',
        galleryUrls: Array.isArray(skiCenter.gallery_urls) ? skiCenter.gallery_urls : [],
        isVisible: skiCenter.is_visible !== undefined ? skiCenter.is_visible : true,
        websiteUrl: skiCenter.website_url || '',
        metaTitle: skiCenter.meta_title || '',
        metaDescription: skiCenter.meta_description || '',
        createdAt: skiCenter.created_at,
        updatedAt: skiCenter.updated_at,
    };
};

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

const mapSkiCenterToSupabase = (skiCenterData) => {
    const slug = skiCenterData.name 
        ? generateSlug(skiCenterData.name)
        : skiCenterData.slug || ''; // Keep existing slug if name is not changing or not provided

    return {
        name: skiCenterData.name || '',
        slug: slug,
        general_description: skiCenterData.generalDescription || '',
        profile_and_tracks: skiCenterData.profileAndTracks || '',
        unique_experience: skiCenterData.uniqueExperience || '',
        valuable_tips: skiCenterData.valuableTips || '',
        practical_info: skiCenterData.practicalInfo || '',
        main_image_url: skiCenterData.mainImageUrl || '',
        gallery_urls: Array.isArray(skiCenterData.galleryUrls) 
            ? skiCenterData.galleryUrls 
            : (typeof skiCenterData.galleryUrls === 'string' ? skiCenterData.galleryUrls.split(',').map(url => url.trim()).filter(Boolean) : []),
        is_visible: skiCenterData.isVisible !== undefined ? skiCenterData.isVisible : true,
        website_url: skiCenterData.websiteUrl || '',
        meta_title: skiCenterData.metaTitle || skiCenterData.name || '',
        meta_description: skiCenterData.metaDescription || (skiCenterData.generalDescription ? skiCenterData.generalDescription.substring(0,160) : ''),
    };
};

export const getAllSkiCenters = async () => {
    const { data, error } = await supabase
        .from('ski_centers')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching ski centers:', error);
        throw error;
    }
    return data.map(mapSkiCenterFromSupabase);
};

export const getSkiCenterById = async (id) => {
    const { data, error } = await supabase
        .from('ski_centers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching ski center ${id}:`, error);
        return null;
    }
    return mapSkiCenterFromSupabase(data);
};

// Función para normalizar slugs eliminando caracteres especiales
const normalizeSlug = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
        .replace(/[^a-z0-9-]/g, '') // Mantiene solo letras, números y guiones
        .replace(/-+/g, '-') // Reemplaza múltiples guiones por uno solo
        .replace(/^-+|-+$/g, ''); // Elimina guiones al inicio y final
};

export const getSkiCenterBySlug = async (slug) => {
    console.log('Buscando centro con slug:', slug);
    
    if (!slug) {
        console.error('No se proporcionó un slug para buscar');
        return null;
    }

    try {
        // Normalizamos el slug de búsqueda
        const normalizedSearchSlug = normalizeSlug(slug);
        console.log('Slug normalizado para búsqueda:', normalizedSearchSlug);
        
        // Primero intentamos buscar por el slug exacto (sin normalizar)
        const { data: exactData, error: exactError } = await supabase
            .from('ski_centers')
            .select('*')
            .eq('slug', slug)
            .single();

        // Si encontramos por slug exacto, lo retornamos
        if (exactData) {
            console.log('Centro encontrado por slug exacto (sin normalizar)');
            return mapSkiCenterFromSupabase(exactData);
        }
        
        // Si no, intentamos con el slug normalizado
        const { data, error } = await supabase
            .from('ski_centers')
            .select('*')
            .eq('slug', normalizedSearchSlug)
            .single();

        // Si encontramos por slug normalizado, lo retornamos
        if (data) {
            console.log('Centro encontrado por slug normalizado');
            return mapSkiCenterFromSupabase(data);
        }
        
        console.log('No se encontró por slug exacto, buscando en todos los registros...');
        
        // Si no encontramos por slug exacto, buscamos en todos los registros
        const { data: allData, error: allError } = await supabase
            .from('ski_centers')
            .select('*');
            
        if (allError) {
            console.error('Error al buscar todos los centros:', allError);
            return null;
        }
        
        console.log('Total de centros encontrados:', allData.length);
        
        // Buscamos cualquier centro cuyo nombre normalizado coincida con el slug de búsqueda normalizado
        const matchingCenter = allData.find(center => {
            const centerNameSlug = generateSlug(center.name);
            const normalizedCenterNameSlug = normalizeSlug(centerNameSlug);
            const normalizedCenterSlug = normalizeSlug(center.slug || '');
            
            return normalizedCenterNameSlug === normalizedSearchSlug || 
                   normalizedCenterSlug === normalizedSearchSlug;
        });
        
        if (matchingCenter) {
            console.log('Centro encontrado por coincidencia de nombre normalizado');
            return mapSkiCenterFromSupabase(matchingCenter);
        }
        
        // Último intento: buscar por coincidencia parcial en el nombre
        const partialMatch = allData.find(center => {
            const centerName = center.name.toLowerCase();
            const searchName = slug.replace(/-/g, ' '); // Convertir guiones a espacios
            return centerName.includes(searchName) || 
                   searchName.includes(centerName.split(' ')[0].toLowerCase());
        });
        
        if (partialMatch) {
            console.log('Centro encontrado por coincidencia parcial del nombre');
            return mapSkiCenterFromSupabase(partialMatch);
        }
        
        console.error(`No se encontró ningún centro con el slug: ${slug} (normalizado: ${normalizedSearchSlug})`);
        console.log('Nombres de centros disponibles:', allData.map(c => c.name));
        return null;
        
    } catch (err) {
        console.error('Error en getSkiCenterBySlug:', err);
        return null;
    }
};

export const addSkiCenter = async (skiCenterData) => {
    const supabaseData = mapSkiCenterToSupabase(skiCenterData);
    console.log('Adding ski center with data:', supabaseData);
    
    const { data, error } = await supabase
        .from('ski_centers')
        .insert(supabaseData)
        .select()
        .single();

    if (error) {
        console.error('Error adding ski center:', error);
        throw error;
    }
    
    const result = mapSkiCenterFromSupabase(data);
    console.log('Successfully added ski center:', result);
    return result;
};

export const updateSkiCenter = async (id, skiCenterData) => {
    const supabaseFriendlyUpdateData = mapSkiCenterToSupabase(skiCenterData);

    const { data, error } = await supabase
        .from('ski_centers')
        .update(supabaseFriendlyUpdateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error updating ski center ${id}:`, error);
        throw error;
    }
    return mapSkiCenterFromSupabase(data);
};

export const deleteSkiCenter = async (id) => {
    const { error } = await supabase
        .from('ski_centers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(`Error deleting ski center ${id}:`, error);
        throw error;
    }
    return true;
};
  