using FluentValidation;
using LocalEducation.WebApi.Models;
using System.Net;

namespace LocalEducation.WebApi.Filters;

public class ValidatorFilter<T> : IEndpointFilter where T : class
{
	private readonly IValidator<T> _validator;

	public ValidatorFilter(IValidator<T> validator)
	{
		_validator = validator;
	}

	public async ValueTask<object> InvokeAsync(
		EndpointFilterInvocationContext context,
		EndpointFilterDelegate next)
	{
		if (context.Arguments
			.SingleOrDefault(s => s?.GetType() == typeof(T)) is not T model)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, new[]
			{
				"Không thể khởi tạo đối tượng"
			}));
		}

		FluentValidation.Results.ValidationResult validationResult = await _validator.ValidateAsync(model);

		return !validationResult.IsValid
			? Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest,
				validationResult))
			: await next(context);
	}
}