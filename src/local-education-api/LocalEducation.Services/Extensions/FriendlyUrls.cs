using Slugify;

namespace LocalEducation.Services.Extensions;

public static class FriendlyUrls
{
	public static string GenerateSlug(this string input)
	{
		SlugHelper slugHelper = new();

		input = input.ToLowerInvariant();
		input = input.Replace("đ", "d");
		input = input.Replace(".", "");

		return slugHelper.GenerateSlug(input);
	}
}