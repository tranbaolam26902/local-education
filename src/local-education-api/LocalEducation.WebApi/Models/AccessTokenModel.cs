using LocalEducation.WebApi.Models.UserModel;

namespace LocalEducation.WebApi.Models;

public class AccessTokenModel
{
	public string Token { get; set; }

	public string TokenType { get; set; } = "bearer";

	public DateTime ExpiresToken { get; set; } = DateTime.Now;

	public UserDto UserDto { get; set; }
}