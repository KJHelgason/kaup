using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon.S3.Model;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace Kaup.Api.Services;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly IConfiguration _configuration;

    public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _configuration = configuration;
        _bucketName = configuration["AWS:BucketName"] ?? "kaup-images";
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder)
    {
        // Generate unique filename
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{folder}/{Guid.NewGuid()}{fileExtension}";

        using var stream = file.OpenReadStream();
        
        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = stream,
            Key = fileName,
            BucketName = _bucketName,
            ContentType = file.ContentType
            // ACL removed - rely on bucket policy for public access
        };

        var transferUtility = new TransferUtility(_s3Client);
        await transferUtility.UploadAsync(uploadRequest);

        // Return the public URL
        var region = _configuration["AWS:Region"] ?? "us-east-1";
        return $"https://{_bucketName}.s3.{region}.amazonaws.com/{fileName}";
    }

    public async Task<List<string>> UploadMultipleImagesAsync(IFormFileCollection files, string folder)
    {
        var urls = new List<string>();
        
        foreach (var file in files)
        {
            var url = await UploadImageAsync(file, folder);
            urls.Add(url);
        }

        return urls;
    }

    /// <summary>
    /// Upload listing image with automatic thumbnail generation
    /// Returns the original (optimized) image URL
    /// </summary>
    public async Task<string> UploadListingImageWithThumbnailAsync(IFormFile file, string folder)
    {
        // Generate unique base filename
        var fileId = Guid.NewGuid().ToString();
        var fileName = $"{folder}/{fileId}.jpg"; // Always save as JPEG for consistency
        var thumbnailName = $"{folder}/thumbs/{fileId}.jpg";

        using var originalStream = file.OpenReadStream();
        using var image = await Image.LoadAsync(originalStream);

        // Process original image: resize if too large, compress
        var originalProcessed = await ProcessOriginalImage(image);

        // Create thumbnail: 200x200 center-cropped square
        var thumbnail = await CreateThumbnail(image, 200, 200);

        // Upload both versions
        await UploadProcessedImageAsync(originalProcessed, fileName, "image/jpeg");
        await UploadProcessedImageAsync(thumbnail, thumbnailName, "image/jpeg");

        // Dispose
        originalProcessed.Dispose();
        thumbnail.Dispose();

        // Return the original image URL (thumbnail can be constructed from it)
        var region = _configuration["AWS:Region"] ?? "us-east-1";
        return $"https://{_bucketName}.s3.{region}.amazonaws.com/{fileName}";
    }

    /// <summary>
    /// Upload multiple listing images with thumbnails
    /// </summary>
    public async Task<List<string>> UploadListingImagesWithThumbnailsAsync(IFormFileCollection files, string folder)
    {
        var urls = new List<string>();
        
        foreach (var file in files)
        {
            var url = await UploadListingImageWithThumbnailAsync(file, folder);
            urls.Add(url);
        }

        return urls;
    }

    /// <summary>
    /// Process original image: resize if too large (max 1600x1600), compress to JPEG
    /// </summary>
    private async Task<Image> ProcessOriginalImage(Image image)
    {
        const int maxSize = 1600;
        var processed = image.Clone(ctx =>
        {
            // Resize if larger than max size while maintaining aspect ratio
            if (image.Width > maxSize || image.Height > maxSize)
            {
                ctx.Resize(new ResizeOptions
                {
                    Size = new Size(maxSize, maxSize),
                    Mode = ResizeMode.Max
                });
            }
        });

        return await Task.FromResult(processed);
    }

    /// <summary>
    /// Create a square thumbnail with center cropping
    /// </summary>
    private async Task<Image> CreateThumbnail(Image image, int width, int height)
    {
        var thumbnail = image.Clone(ctx =>
        {
            // Resize and crop to square
            ctx.Resize(new ResizeOptions
            {
                Size = new Size(width, height),
                Mode = ResizeMode.Crop,
                Position = AnchorPositionMode.Center
            });
        });

        return await Task.FromResult(thumbnail);
    }

    /// <summary>
    /// Upload processed image to S3
    /// </summary>
    private async Task UploadProcessedImageAsync(Image image, string key, string contentType)
    {
        using var memoryStream = new MemoryStream();
        
        // Save as JPEG with quality 85 (good balance between quality and file size)
        await image.SaveAsJpegAsync(memoryStream, new JpegEncoder { Quality = 85 });
        memoryStream.Position = 0;

        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = memoryStream,
            Key = key,
            BucketName = _bucketName,
            ContentType = contentType
        };

        var transferUtility = new TransferUtility(_s3Client);
        await transferUtility.UploadAsync(uploadRequest);
    }

    /// <summary>
    /// Get thumbnail URL from original listing image URL
    /// </summary>
    public string GetThumbnailUrl(string originalUrl)
    {
        // Convert: .../listings/abc123.jpg -> .../listings/thumbs/abc123.jpg
        var uri = new Uri(originalUrl);
        var path = uri.AbsolutePath.TrimStart('/');
        var parts = path.Split('/');
        
        if (parts.Length >= 2)
        {
            var folder = parts[0]; // "listings"
            var filename = parts[1]; // "abc123.jpg"
            var thumbnailPath = $"{folder}/thumbs/{filename}";
            
            var region = _configuration["AWS:Region"] ?? "us-east-1";
            return $"https://{_bucketName}.s3.{region}.amazonaws.com/{thumbnailPath}";
        }

        return originalUrl; // Fallback to original if parsing fails
    }

    public async Task<bool> DeleteImageAsync(string imageUrl)
    {
        try
        {
            // Extract the key from the URL
            var uri = new Uri(imageUrl);
            var key = uri.AbsolutePath.TrimStart('/');

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
