using Kaup.Api.Data;
using Kaup.Api.Services;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon.Runtime;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Database - Use SQLite for development
builder.Services.AddDbContext<KaupDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection")));

Console.WriteLine("✓ Using SQLite database (kaup.db)");

// Configure AWS S3
var awsOptions = builder.Configuration.GetSection("AWS");
var accessKey = awsOptions["AccessKey"];
var secretKey = awsOptions["SecretKey"];
var region = awsOptions["Region"] ?? "us-east-1";

if (!string.IsNullOrEmpty(accessKey) && !string.IsNullOrEmpty(secretKey))
{
    var credentials = new BasicAWSCredentials(accessKey, secretKey);
    var config = new AmazonS3Config { RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(region) };
    builder.Services.AddSingleton<IAmazonS3>(new AmazonS3Client(credentials, config));
    builder.Services.AddScoped<S3Service>();
    Console.WriteLine("✓ AWS S3 configured");
}
else
{
    Console.WriteLine("⚠ AWS S3 not configured - image upload will not work");
}

// Register services
builder.Services.AddScoped<INotificationService, NotificationService>();
Console.WriteLine("✓ Notification service registered");

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "your-super-secret-key-change-this-in-production-min-32-chars";
var jwtKey = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

Console.WriteLine("✓ JWT authentication configured");

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithExposedHeaders("X-Total-Count", "X-Page", "X-Page-Size");
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-migrate database on startup in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<KaupDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("✓ Database migrated successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database migration failed: {ex.Message}");
    }
}

app.Run();
