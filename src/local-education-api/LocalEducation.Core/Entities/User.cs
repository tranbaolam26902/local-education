using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public enum LoginStatus
{
	None,
	Username,
	Password,
	Success
}

public class User : IEntity
{
	public Guid Id { get; set; }

	public string Name { get; set; }

	public DateTime CreatedDate { get; set; }

	public string Email { get; set; }

	public string Username { get; set; }

	public string Password { get; set; }

	public string Phone { get; set; }

	public string Address { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public IList<Role> Roles { get; set; }

	public IList<UserLogin> UserLogins { get; set; }

	public IList<Tour> Tours { get; set; }

	public IList<Progress> Progresses { get; set; }

	public IList<ResultDetail> ResultDetails { get; set; }

	public IList<Folder> Folders { get; set; }
}

public class Role
{
	public Guid Id { get; set; }

	public string Name { get; set; }

	public IList<User> Users { get; set; }
}

public class UserLogin : IEntity
{
	public Guid Id { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid UserId { get; set; }

	public string UserAgent { get; set; }

	public string IpAddress { get; set; }

	public string RefreshToken { get; set; }

	public DateTime TokenCreated { get; set; }

	public DateTime TokenExpires { get; set; }

	public User User { get; set; }
}