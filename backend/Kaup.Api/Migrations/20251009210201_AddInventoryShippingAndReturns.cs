using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kaup.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryShippingAndReturns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HandlingTime",
                table: "Listings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InternationalShipping",
                table: "Listings",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ItemLocation",
                table: "Listings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Listings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QuantitySold",
                table: "Listings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReturnPeriod",
                table: "Listings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReturnShippingPaidBy",
                table: "Listings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ReturnsAccepted",
                table: "Listings",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "ShippingCost",
                table: "Listings",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ShippingMethod",
                table: "Listings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HandlingTime",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "InternationalShipping",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "ItemLocation",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "QuantitySold",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "ReturnPeriod",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "ReturnShippingPaidBy",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "ReturnsAccepted",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "ShippingCost",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "ShippingMethod",
                table: "Listings");
        }
    }
}
