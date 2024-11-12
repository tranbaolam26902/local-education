using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Collections;

public class RefreshToken : IRefreshToken
{
	public string Token { get; set; } = string.Empty;

	public DateTime TokenCreated { get; set; } = DateTime.Now;

	public DateTime TokenExpires { get; set; } = DateTime.Now;

	public string UserAgent { get; set; } = string.Empty;

	public string IpAddress { get; set; } = string.Empty;
}