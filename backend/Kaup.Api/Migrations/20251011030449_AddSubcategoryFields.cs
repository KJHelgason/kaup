using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kaup.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSubcategoryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SubSubcategory",
                table: "Listings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subcategory",
                table: "Listings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubSubcategory",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Subcategory",
                table: "Listings");
        }
    }
}
