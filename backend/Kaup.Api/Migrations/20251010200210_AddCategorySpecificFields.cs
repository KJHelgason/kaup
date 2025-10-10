using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kaup.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCategorySpecificFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CategorySpecificFieldsJson",
                table: "Listings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategorySpecificFieldsJson",
                table: "Listings");
        }
    }
}
