using LocalEducation.Core.Collections;
using LocalEducation.Core.Constants;
using LocalEducation.Core.Entities;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Models.UserModel;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LocalEducation.WebApi.Utilities;

public static class IdentityManager
{
	public static UserDto GetCurrentUser(
		this HttpContext context)
	{
		try
		{
			if (context.User.Identity is ClaimsIdentity identity)
			{
				IEnumerable<Claim> userClaims = identity.Claims;

				List<Claim> enumerable = userClaims.ToList();
				return new UserDto
				{
					Username = enumerable.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
					Email = enumerable.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
					Name = enumerable.FirstOrDefault(o => o.Type == ClaimTypes.Name)?.Value,
					Id = Guid.Parse(enumerable.FirstOrDefault(o => o.Type == ClaimTypes.Sid)?.Value!),
					RoleName = enumerable.Where(c => c.Type == ClaimTypes.Role)
						.Any(c => c.Value == "Admin") ? "Admin" :
						enumerable.Where(c => c.Type == ClaimTypes.Role)
						.Any(c => c.Value == "Manger") ? "Manager" : "User",
					Roles = enumerable.Where(c => c.Type == ClaimTypes.Role)
					.Select(c => new RoleDto { Name = c.Value }).ToList()

				};
			}
			return null;
		}
		catch
		{
			return null;
		}
	}

	public static JwtSecurityToken Generate(
		this UserDto user,
		IConfiguration config)
	{
		SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? ""));
		SigningCredentials credentials = new(securityKey, SecurityAlgorithms.HmacSha256);

		List<Claim> claims =
		[
			new (ClaimTypes.Sid, user.Id.ToString()),
			new (ClaimTypes.NameIdentifier, user.Username),
			new (ClaimTypes.Email, user.Email),
			new (ClaimTypes.Name, user.Name),
		];

		foreach (RoleDto role in user.Roles)
		{
			claims.Add(new Claim(ClaimTypes.Role, role.Name));
		}

		_ = int.TryParse(config["Jwt:ExprToken"], out int tokenValidityInMinutes);

		JwtSecurityToken token = new(config["Jwt:Issuer"],
			config["Jwt:Audience"],
			claims,
			expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
			signingCredentials: credentials);

		return token;
	}

	public static async Task<LoginResult> Authenticate(this User userLogin, IUserRepository repository)
	{
		return await repository.LoginAsync(userLogin);
	}

	public static string LoginResult(this LoginStatus status)
	{
		return status == LoginStatus.Username ? "Tên đăng nhập không chính xác." : "Mật khẩu không chính xác.";
	}

	public static RefreshToken GenerateRefreshToken(this string userAgent, string ipAddress, IConfiguration config)
	{
		_ = int.TryParse(config["JWT:ExprRefresh"], out int exprRefresh);
		RefreshToken refreshToken = new()
		{
			Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(128)),
			TokenExpires = DateTime.Now.AddDays(exprRefresh),
			TokenCreated = DateTime.Now,
			IpAddress = ipAddress,
			UserAgent = userAgent
		};

		return refreshToken;
	}

	public static async Task SetRefreshToken(
		this IUserRepository repository,
		Guid userId,
		UserLogin userLogin,
		HttpContext context)
	{
		// Sets the options for the refresh token cookie
		CookieOptions cookieOptions = new()
		{
			HttpOnly = true,
			Expires = userLogin.TokenExpires,
			Secure = true,
			SameSite = SameSiteMode.None,
			Domain = context.Request.Host.Host
		};

		// Adds the refresh token to the response cookies with the specified options
		context.Response.Cookies.Append("refreshToken", userLogin.RefreshToken, cookieOptions);

		// Sets the refresh token in the database for the specified user
		await repository.SetRefreshTokenAsync(userId, userLogin);
	}
}