# S3 Image Cleanup Implementation

## Overview
Automatic cleanup of old images from S3 bucket when users upload new images or remove existing ones.

## What Was Added

### Profile Image Cleanup (`ImageUpload.tsx`)

#### When Uploading a New Image:
1. **Before uploading**: Checks if there's a current image URL
2. **Deletes old image**: Calls DELETE endpoint to remove the old image from S3
3. **Uploads new image**: Continues with normal upload process
4. **Safety**: If deletion fails, upload still continues (non-blocking)

#### When Removing an Image:
1. **User clicks X button**: Triggers removal
2. **Deletes from S3**: Calls DELETE endpoint
3. **Clears UI**: Removes preview and updates state

### Listing Images Cleanup (`MultipleImageUpload.tsx`)

#### When Removing an Image:
1. **User clicks X on image**: Triggers removal
2. **Deletes from S3**: Calls DELETE endpoint for that specific image
3. **Updates array**: Removes image URL from the list

## How It Works

### Delete Function
```typescript
const deleteImage = async (imageUrl: string) => {
  await fetch(`http://localhost:5075/api/upload/image?imageUrl=${encodeURIComponent(imageUrl)}`, {
    method: 'DELETE',
  })
}
```

### Safety Checks
- ✅ Only deletes if URL contains `amazonaws.com` (S3 images)
- ✅ Won't try to delete Google profile images
- ✅ Doesn't block upload if deletion fails
- ✅ URL is properly encoded for query string

### Backend Endpoint
Already implemented in `UploadController.cs`:
```csharp
[HttpDelete("image")]
public async Task<IActionResult> DeleteImage([FromQuery] string imageUrl)
{
    await _s3Service.DeleteImageAsync(imageUrl);
    return Ok();
}
```

## Benefits

### Storage Savings
- 🗑️ Old profile images are automatically deleted
- 🗑️ Removed listing images don't clutter the bucket
- 💰 Reduces S3 storage costs
- 🧹 Keeps bucket clean and organized

### User Experience
- ✨ Seamless - happens in the background
- 🚀 Fast - doesn't block the upload
- 🔒 Safe - error handling prevents failures

## Testing

### Profile Image Replacement
1. Upload a profile image → Image A in S3
2. Upload another profile image → Image A deleted, Image B in S3
3. Result: Only latest image remains ✅

### Profile Image Removal
1. Upload a profile image → Image in S3
2. Click X to remove → Image deleted from S3
3. Result: No orphaned images ✅

### Listing Images Removal
1. Upload 3 listing images → 3 images in S3
2. Remove 1 image → 2 images remain in S3
3. Result: Removed image deleted ✅

## Edge Cases Handled

### Google Profile Images
- Won't try to delete external images
- Checks for `amazonaws.com` in URL
- Only deletes S3-hosted images

### Failed Deletions
- Logs error to console
- Continues with upload/removal
- Doesn't break user flow

### Empty/Invalid URLs
- Checks if URL exists before attempting deletion
- Validates URL format

## Manual Cleanup (If Needed)

If you have orphaned images from testing:

### Option 1: AWS Console
1. Go to S3 Console
2. Open `kaup-images` bucket
3. Navigate to `profiles/` folder
4. Delete old images manually

### Option 2: AWS CLI
```bash
aws s3 rm s3://kaup-images/profiles/old-image-id.jpg
```

## Future Enhancements

### Possible Improvements:
1. **Batch deletion**: Delete multiple images in one call
2. **Soft delete**: Move to archive folder instead of permanent delete
3. **Scheduled cleanup**: Background job to remove truly orphaned images
4. **Usage analytics**: Track storage usage per user

## Status
✅ **Fully Implemented**
- Profile image cleanup on upload
- Profile image cleanup on remove
- Listing image cleanup on remove
- Error handling and safety checks
