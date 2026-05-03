import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Service Role Key in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initStorage() {
  const bucketName = 'hyosung-assets';
  
  console.log(`Checking if bucket "${bucketName}" exists...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }
  
  const exists = buckets.find(b => b.name === bucketName);
  
  if (exists) {
    console.log(`Bucket "${bucketName}" already exists.`);
  } else {
    console.log(`Creating bucket "${bucketName}"...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error.message);
      return;
    }
    console.log(`Bucket "${bucketName}" created successfully.`);
  }

  // Ensure it's public (in case it existed but was private)
  console.log(`Ensuring bucket "${bucketName}" is public...`);
  const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
    public: true
  });

  if (updateError) {
    console.warn('Warning: Could not update bucket visibility:', updateError.message);
  } else {
    console.log(`Bucket "${bucketName}" is now public.`);
  }

  console.log('\n--- Setup Complete ---');
  console.log('You can now use the image optimization feature.');
}

initStorage();
