import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initStorage() {
  const bucketName = 'hyosung-assets';
  
  console.log(`Checking bucket: ${bucketName}...`);
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const exists = buckets.find(b => b.name === bucketName);
  
  if (!exists) {
    console.log(`Bucket ${bucketName} not found. Creating...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
    } else {
      console.log('Bucket created successfully.');
    }
  } else {
    console.log(`Bucket ${bucketName} already exists.`);
  }
}

initStorage();
