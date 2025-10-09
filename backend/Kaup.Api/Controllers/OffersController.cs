using Kaup.Api.Data;
using Kaup.Api.DTOs;
using Kaup.Api.Models;
using Kaup.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OffersController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly INotificationService _notificationService;

    public OffersController(KaupDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    private Guid? GetCurrentUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            return null;
        }
        return userId;
    }

    // GET: api/offers/listing/{listingId}
    [HttpGet("listing/{listingId}")]
    public async Task<ActionResult<List<OfferDto>>> GetListingOffers(Guid listingId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var listing = await _context.Listings.FindAsync(listingId);
        if (listing == null)
        {
            return NotFound("Listing not found");
        }

        // Only seller or buyers who made offers can see offers
        var offers = await _context.Offers
            .Include(o => o.Buyer)
            .Include(o => o.Seller)
            .Include(o => o.Listing)
            .Where(o => o.ListingId == listingId && 
                       (o.SellerId == userId || o.BuyerId == userId))
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OfferDto
            {
                Id = o.Id,
                ListingId = o.ListingId,
                ListingTitle = o.Listing.Title,
                ListingPrice = o.Listing.Price,
                BuyerId = o.BuyerId,
                BuyerName = $"{o.Buyer.FirstName} {o.Buyer.LastName}",
                SellerId = o.SellerId,
                SellerName = $"{o.Seller.FirstName} {o.Seller.LastName}",
                Amount = o.Amount,
                Message = o.Message,
                Status = o.Status.ToString(),
                ParentOfferId = o.ParentOfferId,
                ExpiresAt = o.ExpiresAt,
                CreatedAt = o.CreatedAt,
                RespondedAt = o.RespondedAt
            })
            .ToListAsync();

        return Ok(offers);
    }

    // GET: api/offers/my-offers
    [Authorize]
    [HttpGet("my-offers")]
    public async Task<ActionResult<List<OfferDto>>> GetMyOffers([FromQuery] string? type = null)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var query = _context.Offers
            .Include(o => o.Buyer)
            .Include(o => o.Seller)
            .Include(o => o.Listing)
            .AsQueryable();

        // Filter by type: "sent" (buyer) or "received" (seller)
        // For counter-offers (ParentOfferId != null), the roles are reversed
        if (type == "sent")
        {
            // Show offers where user is the buyer (original offers they sent)
            // OR counter-offers where user is the seller (counter-offers they sent)
            query = query.Where(o => 
                (o.BuyerId == userId.Value && !o.ParentOfferId.HasValue) ||  // Original offers sent by user
                (o.SellerId == userId.Value && o.ParentOfferId.HasValue));    // Counter-offers sent by user
        }
        else if (type == "received")
        {
            // Show offers where user is the seller (original offers they received)
            // OR counter-offers where user is the buyer (counter-offers they received)
            query = query.Where(o => 
                (o.SellerId == userId.Value && !o.ParentOfferId.HasValue) ||  // Original offers received by user
                (o.BuyerId == userId.Value && o.ParentOfferId.HasValue));      // Counter-offers received by user
        }
        else
        {
            query = query.Where(o => o.BuyerId == userId.Value || o.SellerId == userId.Value);
        }

        var offers = await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OfferDto
            {
                Id = o.Id,
                ListingId = o.ListingId,
                ListingTitle = o.Listing.Title,
                ListingPrice = o.Listing.Price,
                BuyerId = o.BuyerId,
                BuyerName = $"{o.Buyer.FirstName} {o.Buyer.LastName}",
                SellerId = o.SellerId,
                SellerName = $"{o.Seller.FirstName} {o.Seller.LastName}",
                Amount = o.Amount,
                Message = o.Message,
                Status = o.Status.ToString(),
                ParentOfferId = o.ParentOfferId,
                ExpiresAt = o.ExpiresAt,
                CreatedAt = o.CreatedAt,
                RespondedAt = o.RespondedAt
            })
            .ToListAsync();

        return Ok(offers);
    }

    // POST: api/offers
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<OfferDto>> CreateOffer([FromBody] CreateOfferRequest request)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var listing = await _context.Listings.FindAsync(request.ListingId);
        if (listing == null)
        {
            return NotFound("Listing not found");
        }

        if (listing.SellerId == userId.Value)
        {
            return BadRequest("You cannot make an offer on your own listing");
        }

        if (listing.Status != ListingStatus.Active)
        {
            return BadRequest("Listing is not active");
        }

        // Check if listing accepts offers
        if (!listing.AcceptOffers)
        {
            return BadRequest("This listing does not accept offers");
        }

        if (request.Amount <= 0 || request.Amount >= listing.Price)
        {
            return BadRequest("Offer amount must be greater than 0 and less than listing price");
        }

        // Check for existing pending offer from this user
        var existingOffer = await _context.Offers
            .Where(o => o.ListingId == request.ListingId && 
                       o.BuyerId == userId.Value && 
                       o.Status == OfferStatus.Pending)
            .FirstOrDefaultAsync();

        if (existingOffer != null)
        {
            return BadRequest("You already have a pending offer on this listing");
        }

        var offer = new Offer
        {
            ListingId = request.ListingId,
            BuyerId = userId.Value,
            SellerId = listing.SellerId,
            Amount = request.Amount,
            Message = request.Message,
            Status = OfferStatus.Pending,
            ExpiresAt = DateTime.UtcNow.AddHours(48) // 48 hour expiration
        };

        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        // Create notification for seller
        await _notificationService.CreateNotificationAsync(
            listing.SellerId,
            NotificationType.OfferReceived,
            "New Offer Received",
            $"You received an offer of {offer.Amount:N0} kr on \"{listing.Title}\"",
            $"/offers?tab=received",
            offer.Id.ToString()
        );

        // Load navigation properties for response
        await _context.Entry(offer).Reference(o => o.Buyer).LoadAsync();
        await _context.Entry(offer).Reference(o => o.Seller).LoadAsync();
        await _context.Entry(offer).Reference(o => o.Listing).LoadAsync();

        var offerDto = new OfferDto
        {
            Id = offer.Id,
            ListingId = offer.ListingId,
            ListingTitle = offer.Listing.Title,
            ListingPrice = offer.Listing.Price,
            BuyerId = offer.BuyerId,
            BuyerName = $"{offer.Buyer.FirstName} {offer.Buyer.LastName}",
            SellerId = offer.SellerId,
            SellerName = $"{offer.Seller.FirstName} {offer.Seller.LastName}",
            Amount = offer.Amount,
            Message = offer.Message,
            Status = offer.Status.ToString(),
            ParentOfferId = offer.ParentOfferId,
            ExpiresAt = offer.ExpiresAt,
            CreatedAt = offer.CreatedAt,
            RespondedAt = offer.RespondedAt
        };

        return CreatedAtAction(nameof(GetListingOffers), new { listingId = offer.ListingId }, offerDto);
    }

    // POST: api/offers/{id}/respond
    [Authorize]
    [HttpPost("{id}/respond")]
    public async Task<ActionResult<OfferDto>> RespondToOffer(Guid id, [FromBody] RespondToOfferRequest request)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var offer = await _context.Offers
            .Include(o => o.Buyer)
            .Include(o => o.Seller)
            .Include(o => o.Listing)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (offer == null)
        {
            return NotFound("Offer not found");
        }

        // Determine who can respond based on whether this is a counter-offer
        // If it's a counter-offer (has ParentOfferId), the buyer can respond
        // Otherwise, only the seller can respond
        bool isCounterOffer = offer.ParentOfferId.HasValue;
        bool canRespond = isCounterOffer 
            ? offer.BuyerId == userId.Value  // Buyer can respond to counter-offers
            : offer.SellerId == userId.Value; // Seller can respond to original offers

        if (!canRespond)
        {
            return Forbid(isCounterOffer 
                ? "Only the buyer can respond to counter-offers" 
                : "Only the seller can respond to offers");
        }

        if (offer.Status != OfferStatus.Pending)
        {
            return BadRequest("This offer has already been responded to");
        }

        if (DateTime.UtcNow > offer.ExpiresAt)
        {
            offer.Status = OfferStatus.Expired;
            await _context.SaveChangesAsync();
            return BadRequest("This offer has expired");
        }

        offer.RespondedAt = DateTime.UtcNow;

        switch (request.Action.ToLower())
        {
            case "accept":
                offer.Status = OfferStatus.Accepted;
                
                // Mark listing as sold
                offer.Listing.Status = ListingStatus.Sold;
                
                await _notificationService.CreateNotificationAsync(
                    offer.BuyerId,
                    NotificationType.OfferAccepted,
                    "Offer Accepted!",
                    $"Your offer of {offer.Amount:N0} kr on \"{offer.Listing.Title}\" was accepted!",
                    $"/offers?tab=sent",
                    offer.Id.ToString()
                );
                break;

            case "decline":
                offer.Status = OfferStatus.Declined;
                
                await _notificationService.CreateNotificationAsync(
                    offer.BuyerId,
                    NotificationType.OfferDeclined,
                    "Offer Declined",
                    $"Your offer on \"{offer.Listing.Title}\" was declined",
                    $"/offers?tab=sent",
                    offer.Id.ToString()
                );
                break;

            case "counter":
                if (!request.CounterAmount.HasValue || request.CounterAmount.Value <= 0)
                {
                    return BadRequest("Counter offer amount is required");
                }

                if (request.CounterAmount.Value >= offer.Listing.Price)
                {
                    return BadRequest("Counter offer must be less than listing price");
                }

                offer.Status = OfferStatus.Countered;

                // Create counter offer - buyer/seller stay the same, but now seller is proposing a different amount
                // The buyer can then accept/decline this counter amount
                var counterOffer = new Offer
                {
                    ListingId = offer.ListingId,
                    BuyerId = offer.BuyerId,    // Same buyer
                    SellerId = offer.SellerId,  // Same seller (still owns the listing)
                    Amount = request.CounterAmount.Value,
                    Message = request.Message,
                    Status = OfferStatus.Pending,
                    ParentOfferId = offer.Id,
                    ExpiresAt = DateTime.UtcNow.AddHours(48)
                };

                _context.Offers.Add(counterOffer);

                await _notificationService.CreateNotificationAsync(
                    offer.BuyerId,
                    NotificationType.OfferCountered,
                    "Counter Offer Received",
                    $"Seller countered with {counterOffer.Amount:N0} kr on \"{offer.Listing.Title}\"",
                    $"/offers?tab=sent",
                    counterOffer.Id.ToString()
                );
                break;

            default:
                return BadRequest("Invalid action. Must be 'accept', 'decline', or 'counter'");
        }

        await _context.SaveChangesAsync();

        var offerDto = new OfferDto
        {
            Id = offer.Id,
            ListingId = offer.ListingId,
            ListingTitle = offer.Listing.Title,
            ListingPrice = offer.Listing.Price,
            BuyerId = offer.BuyerId,
            BuyerName = $"{offer.Buyer.FirstName} {offer.Buyer.LastName}",
            SellerId = offer.SellerId,
            SellerName = $"{offer.Seller.FirstName} {offer.Seller.LastName}",
            Amount = offer.Amount,
            Message = offer.Message,
            Status = offer.Status.ToString(),
            ParentOfferId = offer.ParentOfferId,
            ExpiresAt = offer.ExpiresAt,
            CreatedAt = offer.CreatedAt,
            RespondedAt = offer.RespondedAt
        };

        return Ok(offerDto);
    }

    // DELETE: api/offers/{id}
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> WithdrawOffer(Guid id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var offer = await _context.Offers.FindAsync(id);
        if (offer == null)
        {
            return NotFound("Offer not found");
        }

        if (offer.BuyerId != userId.Value)
        {
            return Forbid("You can only withdraw your own offers");
        }

        if (offer.Status != OfferStatus.Pending)
        {
            return BadRequest("Only pending offers can be withdrawn");
        }

        offer.Status = OfferStatus.Withdrawn;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
