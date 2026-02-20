namespace Kaup.Api.Models.Enums;

public enum PaymentStatus
{
    Pending = 0,
    Authorized = 1,
    Captured = 2,
    Released = 3,
    Refunded = 4,
    Failed = 5
}
