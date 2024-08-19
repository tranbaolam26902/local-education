namespace LocalEducation.WebApi.Models;

public class ValidationFailureResponse
{
	public IEnumerable<string> Errors { get; set; }

	public ValidationFailureResponse(IEnumerable<string> errors)
	{
		Errors = errors;
	}
}