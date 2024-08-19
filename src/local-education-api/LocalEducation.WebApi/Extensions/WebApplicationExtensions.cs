using NLog.Web;
using System.Text;
using System.Security.Claims;
using Microsoft.OpenApi.Models;
using LocalEducation.Data.Seeders;
using LocalEducation.WebApi.Media;
using LocalEducation.Data.Contexts;
using LocalEducation.Core.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using LocalEducation.WebApi.Middleware;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using LocalEducation.Services.EducationRepositories;
using LocalEducation.Services.EducationRepositories.Interfaces;

namespace LocalEducation.WebApi.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplicationBuilder ConfigureServices(
        this WebApplicationBuilder builder)
    {
        builder.Services.AddMemoryCache();

        builder.Services.AddDbContext<LocalEducationDbContext>(
            option =>
                option.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

        // Services
        builder.Services.AddScoped<IDataSeeder, DataSeeder>();
        builder.Services.AddScoped<MediaConfiguration>();
        builder.Services.AddScoped<IMediaManager, LocalFileSystemMediaManager>();
        builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<ITourRepository, TourRepository>();
        builder.Services.AddScoped<IFileRepository, FileRepository>();
        builder.Services.AddScoped<ICourseRepository, CourseRepository>();
        builder.Services.AddScoped<ILessonRepository, LessonRepository>();
        builder.Services.AddScoped<ISlideRepository, SlideRepository>();
        builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
        builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
        builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();

        return builder;
    }

    public static WebApplicationBuilder ConfigureConfigureIdentity(
        this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(option =>
                option.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"] ?? "")),
                    ClockSkew = TimeSpan.Zero
                });

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policy =>
                policy.RequireRole(ClaimTypes.Role, "Admin"));
            options.AddPolicy("Manager", policy =>
                policy.RequireRole(ClaimTypes.Role, "Manager"));
            options.AddPolicy("User", policy =>
                policy.RequireRole(ClaimTypes.Role, "User"));
        });

        return builder;
    }

    public static WebApplicationBuilder ConfigureNLog(
        this WebApplicationBuilder builder)
    {
        builder.Logging.ClearProviders();
        builder.Host.UseNLog();
        return builder;
    }

    public static WebApplicationBuilder ConfigureCors(
        this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policyBuilder =>
                policyBuilder
                    /*.WithOrigins(builder.Configuration["AllowLocalHost"] ?? "")*/
                    .SetIsOriginAllowed(_ => true)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());
        });

        return builder;
    }

    public static WebApplicationBuilder ConfigureAuthentication(
        this WebApplicationBuilder builder)
    {
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Local Education API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });

        return builder;
    }

    public static WebApplicationBuilder ConfigureFileUpload(
        this WebApplicationBuilder builder)
    {
        builder.Services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = 1073741824; // 1GB in bytes
        });

        //builder.WebHost.UseKestrel(option =>
        //{
        //    option.Limits.MaxRequestBodySize = 1073741824;
        //});

        return builder;
    }

    public static WebApplication SetupContext(
        this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            context.Request.EnableBuffering(); // Enable buffering to allow reading the body multiple times

            var length = context.Request.ContentLength;
            long maxRequestBodySizeBytes = 1073741824; // 1GB in bytes
            if (length is > 0 && length >= maxRequestBodySizeBytes) // Check if the length of the request body exceeds the limit
            {
                context.Response.StatusCode = StatusCodes.Status413RequestEntityTooLarge;
                await context.Response.WriteAsync("Request body too large");
                return;
            }

            await next();
        });

        return app;
    }

    public static IApplicationBuilder UseDataSeeder(
        this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        try
        {
            scope.ServiceProvider.GetRequiredService<IDataSeeder>().Initialize();
        }
        catch (Exception e)
        {
            scope.ServiceProvider.GetRequiredService<ILogger<Program>>()
                .LogError(e, "Count not insert data into database");
        }

        return app;
    }

    public static IApplicationBuilder SetupLocalMedia(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        try
        {
            scope.ServiceProvider.GetRequiredService<MediaConfiguration>().Initialize();
        }
        catch (Exception e)
        {
            scope.ServiceProvider.GetRequiredService<ILogger<Program>>()
                .LogError(e, "Count not create initial folder");
        }

        return app;
    }

    public static WebApplicationBuilder ConfigureSwaggerOpenApi(
        this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        return builder;
    }

    public static WebApplication SetupMiddleware(
        this WebApplication app)
    {
        app.UseMiddleware<UnauthorizedMiddleware>();
        app.UseMiddleware<ForbiddenMiddleware>();
        app.UseMiddleware<CorsErrorLoggingMiddleware>();

        return app;
    }
    
    public static WebApplication SetupRequestPipeline(
        this WebApplication app)
    {

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(s =>
                s.SwaggerEndpoint("/swagger/v1/swagger.json", "Local Education API V1"));
        }

        app.UseCors("AllowAll");

        app.UseStaticFiles();
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }
}
