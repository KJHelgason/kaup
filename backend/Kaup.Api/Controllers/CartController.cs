using Kaup.Api.Data;
using Kaup.Api.DTOs;
using Kaup.Api.Models;
using Kaup.Api.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Kaup.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly ILogger<CartController> _logger;

    public CartController(KaupDbContext context, ILogger<CartController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/cart
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var cartItems = await _context.CartItems
            .Include(c => c.Listing)
            .ThenInclude(l => l.Seller)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var cartItemDtos = cartItems.Select(c => new CartItemDto
        {
            Id = c.Id,
            ListingId = c.Listing.Id,
            ListingTitle = c.Listing.Title,
            ListingPrice = c.Listing.Price,
            ListingImageUrl = c.Listing.ImageUrls.Length > 0 ? c.Listing.ImageUrls[0] : null,
            ListingStatus = c.Listing.Status.ToString(),
            SellerName = $"{c.Listing.Seller.FirstName} {c.Listing.Seller.LastName}",
            SellerId = c.Listing.SellerId,
            AddedAt = c.CreatedAt
        }).ToList();

        return Ok(cartItemDtos);
    }

    // GET: api/cart/count
    [HttpGet("count")]
    public async Task<ActionResult<int>> GetCartCount()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Ok(0);

        var count = await _context.CartItems
            .Where(c => c.UserId == userId)
            .CountAsync();

        return Ok(count);
    }

    // POST: api/cart
    [HttpPost]
    public async Task<ActionResult<CartItemDto>> AddToCart(AddToCartDto addToCartDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        // Check if listing exists and is available
        var listing = await _context.Listings
            .Include(l => l.Seller)
            .FirstOrDefaultAsync(l => l.Id == addToCartDto.ListingId);

        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        // Validation
        if (listing.Status != ListingStatus.Active)
            return BadRequest(new { message = "This listing is no longer available" });

        if (listing.ListingType == ListingType.Auction)
            return BadRequest(new { message = "Auction items cannot be added to cart. Please place a bid instead." });

        if (listing.SellerId == userId)
            return BadRequest(new { message = "You cannot add your own listing to cart" });

        // Check if already in cart
        var existingCartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ListingId == addToCartDto.ListingId);

        if (existingCartItem != null)
            return BadRequest(new { message = "Item is already in your cart" });

        // Create cart item
        var cartItem = new CartItem
        {
            UserId = userId,
            ListingId = addToCartDto.ListingId,
            CreatedAt = DateTime.UtcNow
        };

        _context.CartItems.Add(cartItem);
        await _context.SaveChangesAsync();

        var cartItemDto = new CartItemDto
        {
            Id = cartItem.Id,
            ListingId = listing.Id,
            ListingTitle = listing.Title,
            ListingPrice = listing.Price,
            ListingImageUrl = listing.ImageUrls.Length > 0 ? listing.ImageUrls[0] : null,
            ListingStatus = listing.Status.ToString(),
            SellerName = $"{listing.Seller.FirstName} {listing.Seller.LastName}",
            SellerId = listing.SellerId,
            AddedAt = cartItem.CreatedAt
        };

        _logger.LogInformation("Item added to cart: {CartItemId} for user {UserId}", cartItem.Id, userId);

        return CreatedAtAction(nameof(GetCart), new { }, cartItemDto);
    }

    // DELETE: api/cart/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (cartItem == null)
            return NotFound(new { message = "Cart item not found" });

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Item removed from cart" });
    }

    // DELETE: api/cart/clear
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var cartItems = await _context.CartItems
            .Where(c => c.UserId == userId)
            .ToListAsync();

        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cart cleared" });
    }
}
