using Slugify;

namespace LocalEducation.Services.Extensions;

public static class FriendlyUrls
{
	public static string GenerateSlug(this string input)
	{
		var slugHelper = new SlugHelper();
		
		input = input.ToLowerInvariant();
		input = input.Replace("đ", "d");
		input = input.Replace(".", "");

		return slugHelper.GenerateSlug(input);
	}
}