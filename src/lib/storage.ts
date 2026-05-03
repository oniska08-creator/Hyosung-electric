import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 빌드 타임에 변수가 없더라도 에러로 프로세스가 중단되지 않도록 방어 코드 추가
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

if (!supabase) {
  console.warn("⚠️ Supabase credentials are missing. Backend storage features will not work.");
}

/**
 * 최적화된 WebP 포맷으로 이미지를 Supabase Storage에 업로드합니다.
 * @param fileBuffer 이미지 버퍼 (또는 base64에서 변환된 버퍼)
 * @param folder 저장될 폴더명 (products, projects 등)
 * @param fileName 파일명
 * @returns 업로드된 이미지의 Public URL
 */
export async function uploadOptimizedImage(
  fileBuffer: Buffer,
  folder: string,
  fileName: string
): Promise<string> {
  try {
    // 1. Sharp를 사용한 WebP 변환 및 최적화
    console.log(`Optimizing image: ${fileName} (${fileBuffer.length} bytes)`);
    const optimizedBuffer = await sharp(fileBuffer)
      .resize(1200, null, { withoutEnlargement: true }) // 너비 1200px 기준 리사이징
      .webp({ quality: 80 }) // WebP 변환 및 품질 설정
      .toBuffer();
    console.log(`Optimization complete: ${optimizedBuffer.length} bytes`);

    // 파일명 안전하게 변환 (한글, 공백, 특수문자 제거)
    const nameWithoutExt = fileName.includes('.') 
      ? fileName.slice(0, fileName.lastIndexOf('.')) 
      : fileName;
      
    const safeFileName = nameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, '-') // 영문, 숫자 제외하고 모두 '-'로 변경
      .replace(/-+/g, '-')           // 연속된 '-' 하나로 축소
      .replace(/^-|-$/g, '');        // 앞뒤 '-' 제거

    const finalFileName = `${folder}/${Date.now()}-${safeFileName || 'image'}.webp`;
    console.log(`Uploading to Supabase: ${finalFileName}`);

    if (!supabase) {
      throw new Error("Supabase client is not initialized. Check your environment variables.");
    }

    // 2. Supabase Storage 업로드
    const { data, error } = await supabase.storage
      .from('hyosung-assets')
      .upload(finalFileName, optimizedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    // 3. Public URL 추출
    const { data: { publicUrl } } = supabase.storage
      .from('hyosung-assets')
      .getPublicUrl(finalFileName);

    return publicUrl;
  } catch (error: any) {
    console.error('Image upload failed detail:', error);
    throw new Error(error.message || '이미지 최적화 및 업로드 중 오류가 발생했습니다.');
  }
}

/**
 * Base64 이미지를 처리하여 업로드합니다.
 */
export async function uploadBase64Image(
  base64String: string,
  folder: string,
  fileName: string
): Promise<string> {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  return uploadOptimizedImage(buffer, folder, fileName);
}

/**
 * File 객체(또는 Blob)를 처리하여 업로드합니다.
 */
export async function uploadFile(
  file: File,
  folder: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return uploadOptimizedImage(buffer, folder, file.name);
}
