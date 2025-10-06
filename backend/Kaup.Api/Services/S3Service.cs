using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon.S3.Model;

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
