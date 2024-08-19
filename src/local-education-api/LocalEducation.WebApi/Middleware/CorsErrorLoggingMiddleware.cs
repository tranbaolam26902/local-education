namespace LocalEducation.WebApi.Middleware;

public class CorsErrorLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CorsErrorLoggingMiddleware> _logger;

    public CorsErrorLoggingMiddleware(RequestDelegate next, ILogger<CorsErrorLoggingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Log CORS-related errors
            if (context.Request.Headers.TryGetValue("Origin", out var header))
            {
                _logger.LogError($"CORS error: {ex.Message}, Origin: {header}");
            }

            throw; // Rethrow the exception after logging
        }
    }
}