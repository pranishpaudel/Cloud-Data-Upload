// import json
// import boto3
// from io import BytesIO
// import zipfile

// def lambda_handler(event, context):
//     # Set the timeout for the Lambda function to 5 seconds
//     context.get_remaining_time_in_millis = lambda: 5000

//     s3_resource = boto3.resource('s3')
//     source_bucket = 'bukpri'
//     target_bucket = 'bukpri'
//     target_folder = 'insa/vindas/'
//     flag_folder = 'processed_flags/'

//     my_bucket = s3_resource.Bucket(source_bucket)

//     for file in my_bucket.objects.all():
//         if file.key.startswith(target_folder):
//             print(f"Skipping file {file.key} as it is in the target folder.")
//             continue

//         if file.key.endswith('.zip'):
//             flag_key = flag_folder + file.key + '.processed'

//             # Check if the flag file exists
//             flag_obj = s3_resource.Object(source_bucket, flag_key)
//             try:
//                 flag_obj.load()
//                 print(f"Skipping {file.key} as it has already been processed.")
//                 continue
//             except:
//                 print(f"No flag file for {file.key}, processing.")

//             print(f"Processing zip file: {file.key}")
//             zip_obj = s3_resource.Object(bucket_name=source_bucket, key=file.key)
//             buffer = BytesIO(zip_obj.get()["Body"].read())

//             with zipfile.ZipFile(buffer, 'r') as z:
//                 for filename in z.namelist():
//                     if not filename.endswith('/'):  # Ensure it's a file, not a directory
//                         try:
//                             # Retain the full path within the ZIP
//                             target_key = target_folder + filename

//                             s3_resource.meta.client.upload_fileobj(
//                                 z.open(filename),
//                                 Bucket=target_bucket,
//                                 Key=target_key
//                             )
//                             print(f"Uploaded {filename} to {target_key}")
//                         except Exception as e:
//                             print(f"Failed to upload {filename}: {e}")

//             # Delete the original ZIP file from the source bucket
//             try:
//                 s3_resource.Object(source_bucket, file.key).delete()
//                 print(f"Deleted original zip file {file.key} after processing.")
//             except Exception as e:
//                 print(f"Failed to delete original zip file {file.key}: {e}")

//             # Create a flag file to indicate processing is done
//             flag_obj.put(Body=b'')
//             print(f"Created flag file {flag_key} for {file.key}")

//         else:
//             print(file.key + " is not a zip file.")

//     # Handle deletion event to remove corresponding flag file
//     if 'Records' in event:
//         for record in event['Records']:
//             if record['eventName'] == 'ObjectRemoved:Delete':
//                 deleted_key = record['s3']['object']['key']
//                 flag_key = flag_folder + deleted_key + '.processed'
//                 try:
//                     flag_obj = s3_resource.Object(source_bucket, flag_key)
//                     flag_obj.delete()
//                     print(f"Deleted flag file {flag_key} as its corresponding zip file {deleted_key} was deleted.")
//                 except Exception as e:
//                     print(f"Failed to delete flag file {flag_key}: {e}")

//     return {
//         'statusCode': 200,
//         'body': json.dumps('Processing complete.')
//     }
