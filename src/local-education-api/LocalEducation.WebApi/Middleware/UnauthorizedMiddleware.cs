using LocalEducation.WebApi.Models;
using System.Net;
using System.Text.Json;

namespace LocalEducation.WebApi.Middleware;

public class UnauthorizedMiddleware
{
	private readonly RequestDelegate _next;

	public UnauthorizedMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		await _next(context);

		if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
		{
			context.Response.ContentType = "application/json";
			context.Response.StatusCode = StatusCodes.Status401Unauthorized;

			// Your custom error message
			HttpStatusCode statusCode = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), StatusCodes.Status401Unauthorized.ToString());
			ApiResponse apiRes = ApiResponse.Fail(statusCode, "Unauthorized");

			JsonSerializerOptions options = new()
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
			};

			string json = JsonSerializer.Serialize(apiRes, options);

			await context.Response.WriteAsync(json);
		}
	}
}