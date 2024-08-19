using System.Text.RegularExpressions;

namespace LocalEducation.WebApi.Validations;

public static class ValidationHelpers
{
	public static bool BeAValidUsername(string username)
	{
		// Define the regular expression pattern for a valid username (no spaces)
		string pattern = @"^\S+$";

		// Use Regex.IsMatch to check if the username matches the pattern
		return Regex.IsMatch(username, pattern);
	}
}