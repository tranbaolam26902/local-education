using LocalEducation.Core.Entities;

namespace LocalEducation.Core.Constants;

public class LoginResult
{
	public LoginStatus Status { get; set; }

	public User User { get; set; }
}