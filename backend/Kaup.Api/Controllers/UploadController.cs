using Microsoft.AspNetCore.Mvc;
using Kaup.Api.Services;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly S3Service _s3Service;
    private readonly ILogger<UploadController> _logger;

    public UploadController(S3Service s3Service, ILogger<UploadController> logger)
    {
        _s3Service = s3Service;
        _logger = logger;
    }

    [HttpPost("profile-image")]
    public async Task<ActionResult<UploadResponse>> UploadProfileImage(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided");
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest("Only JPG, PNG, and WebP images are allowed");
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest("File size must not exceed 5MB");
            }

            var imageUrl = await _s3Service.UploadImageAsync(file, "profiles");
            
            return Ok(new UploadResponse { Url = imageUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading profile image");
            return StatusCode(500, "Error uploading image");
        }
    }

    [HttpPost("listing-images")]
    public async Task<ActionResult<MultipleUploadResponse>> UploadListingImages([FromForm] IFormFileCollection files)
    {
        try
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files provided");
            }

            // Validate max 10 images
            if (files.Count > 10)
            {
                return BadRequest("Maximum 10 images allowed per listing");
            }

            // Validate each file
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
            foreach (var file in files)
            {
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return BadRequest($"File {file.FileName}: Only JPG, PNG, and WebP images are allowed");
                }

                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest($"File {file.FileName}: File size must not exceed 5MB");
                }
            }

            var imageUrls = await _s3Service.UploadMultipleImagesAsync(files, "listings");
            
            return Ok(new MultipleUploadResponse { Urls = imageUrls });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading listing images");
            return StatusCode(500, "Error uploading images");
        }
    }

    [HttpDelete("image")]
    public async Task<ActionResult> DeleteImage([FromQuery] string imageUrl)
    {
        try
        {
            if (string.IsNullOrEmpty(imageUrl))
            {
                return BadRequest("Image URL is required");
            }

            var success = await _s3Service.DeleteImageAsync(imageUrl);
            
            if (success)
            {
                return Ok(new { message = "Image deleted successfully" });
            }
            
            return NotFound("Image not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image");
            return StatusCode(500, "Error deleting image");
        }
    }
}

public class UploadResponse
{
    public string Url { get; set; } = string.Empty;
}

public class MultipleUploadResponse
{
    public List<string> Urls { get; set; } = new();
}
