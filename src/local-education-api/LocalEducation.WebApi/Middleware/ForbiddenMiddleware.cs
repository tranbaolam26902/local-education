using LocalEducation.WebApi.Models;
using System.Net;
using System.Text.Json;

namespace LocalEducation.WebApi.Middleware;

public class ForbiddenMiddleware
{
	private readonly RequestDelegate _next;

	public ForbiddenMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		await _next(context);

		if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
		{
			context.Response.ContentType = "application/json";
			context.Response.StatusCode = StatusCodes.Status403Forbidden;

			// Your custom error message
			HttpStatusCode statusCode = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), StatusCodes.Status403Forbidden.ToString());
			ApiResponse apiRes = ApiResponse.Fail(statusCode, "Forbidden");

			JsonSerializerOptions options = new()
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
			};

			string json = JsonSerializer.Serialize(apiRes, options);

			await context.Response.WriteAsync(json);
		}
	}
}