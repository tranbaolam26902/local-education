using LocalEducation.Core.Collections;
using LocalEducation.Core.Constants;
using LocalEducation.Core.Entities;
using LocalEducation.WebApi.Models.UserModel;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using LocalEducation.Services.EducationRepositories.Interfaces;

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
				var userClaims = identity.Claims;

                var enumerable = userClaims.ToList();
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
		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? ""));
		var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

		var claims = new List<Claim>()
		{
			new (ClaimTypes.Sid, user.Id.ToString()),
			new (ClaimTypes.NameIdentifier, user.Username),
			new (ClaimTypes.Email, user.Email),
			new (ClaimTypes.Name, user.Name),
		};

		foreach (var role in user.Roles)
		{
			claims.Add(new Claim(ClaimTypes.Role, role.Name));
		}

		_ = int.TryParse(config["Jwt:ExprToken"], out int tokenValidityInMinutes);

		var token = new JwtSecurityToken(config["Jwt:Issuer"],
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
		if (status == LoginStatus.Username)
		{
			return "Tên đăng nhập không chính xác.";
		}

		return "Mật khẩu không chính xác.";
	}

	public static RefreshToken GenerateRefreshToken(this string userAgent, string ipAddress, IConfiguration config)
	{
		_ = int.TryParse(config["JWT:ExprRefresh"], out int exprRefresh);
		var refreshToken = new RefreshToken
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
		var cookieOptions = new CookieOptions()
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