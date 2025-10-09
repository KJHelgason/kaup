using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kaup.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAcceptOffersToListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AcceptOffers",
                table: "Listings",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptOffers",
                table: "Listings");
        }
    }
}
