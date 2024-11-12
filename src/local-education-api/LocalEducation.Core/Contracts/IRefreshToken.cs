namespace LocalEducation.Core.Contracts;

public interface IRefreshToken
{
	public string Token { get; set; }

	public DateTime TokenCreated { get; set; }

	public DateTime TokenExpires { get; set; }

	public string UserAgent { get; set; }

	public string IpAddress { get; set; }
}