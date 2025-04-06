import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./index.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/*
 * Uploads a file to the specified bucket.
 * @param {string} bucket - The name of the bucket.
 * @param {File} file - The file to upload.
 * @param {string} name - The name of the file.
 * @returns {Promise} - The result of the upload.
 */
async function uploadFile(bucket, file, name) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`public/${name}`, file.buffer, {
      upsert: false,
      contentType: file.mimetype,
    });

  if (error) {
    console.error("Error uploading file: ", error);
    return error;
  }

  // console.log("File uploaded: ", data);

  return data;
}

/*
 * Deletes a file from the specified bucket.
 * @param {string} bucket - The name of the bucket.
 * @param {string} name - The name of the file.
 * @returns {Promise} - The result of the deletion.
 */
async function deleteFile(bucket, name) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([`public/${name}`]);

  if (error) {
    console.error("Error deleting file: ", error);
    return error;
  }

  // console.log("File deleted: ", data);

  return data;
}

export { supabase, uploadFile, deleteFile };
