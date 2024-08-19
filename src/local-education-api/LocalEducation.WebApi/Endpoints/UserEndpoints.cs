using Mapster;
using System.Net;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using LocalEducation.Core.Queries;
using LocalEducation.Core.Entities;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Utilities;
using LocalEducation.Core.Collections;
using System.IdentityModel.Tokens.Jwt;
using LocalEducation.WebApi.Models.UserModel;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Core.Dto;

namespace LocalEducation.WebApi.Endpoints;

public static class UserEndpoints
{
	public static WebApplication MapUserEndpoints(
		this WebApplication app)
	{
		var builder = app.MapGroup("/api/users");

		#region Get Method

		builder.MapGet("/refreshToken", RefreshToken)
			.WithName("RefreshToken")
			.AllowAnonymous()
			.Produces<ApiResponse<AccessTokenModel>>();

		builder.MapGet("/logout", Logout)
			.WithName("DeleteRefreshTokenAsync")
			.AllowAnonymous();

		builder.MapGet("/getUsers", GetUsers)
			.WithName("GetUsers")
			.RequireAuthorization("Admin")
			.Produces<ApiResponse<PaginationResult<UserDto>>>();

		builder.MapGet("/roles", GetRoles)
			.WithName("GetRolesAsync")
			.RequireAuthorization("Admin")
			.Produces<ApiResponse<IList<RoleDto>>>()
			.Produces(StatusCodes.Status401Unauthorized)
			.Produces(StatusCodes.Status403Forbidden);

		builder.MapGet("/getProfile", GetProfile)
			.WithName("GetProfile")
			.RequireAuthorization()
			.Produces<ApiResponse<UserDto>>();

		#endregion

		#region Post Method

		builder.MapPost("/login", Login)
			.WithName("LoginAsync")
			.AddEndpointFilter<ValidatorFilter<UserLoginModel>>()
			.AllowAnonymous()
			.Produces<ApiResponse<AccessTokenModel>>();

		builder.MapPost("/register", Register)
			.WithName("Register")
			.AddEndpointFilter<ValidatorFilter<RegisterModel>>()
			.Produces<ApiResponse<UserDto>>()
			.Produces(StatusCodes.Status401Unauthorized)
			.Produces(StatusCodes.Status403Forbidden);

		#endregion

		#region Put Method

		builder.MapPut("/updateUserRoles", UpdateUserRoles)
			.WithName("UpdateUserRoles")
			.RequireAuthorization("Admin")
			.Produces<ApiResponse<UserDto>>()
			.Produces(StatusCodes.Status401Unauthorized)
			.Produces(StatusCodes.Status403Forbidden);

		builder.MapPut("/updateProfile", UpdateProfile)
			.WithName("UpdateProfile")
			.AddEndpointFilter<ValidatorFilter<UserEditModel>>()
			.RequireAuthorization()
			.Produces<ApiResponse<UserDto>>();

		builder.MapPut("/changePassword", ChangePassword)
			.WithName("ChangePassword")
			.AddEndpointFilter<ValidatorFilter<PasswordEditModel>>()
			.RequireAuthorization()
			.Produces<ApiResponse>();

		#endregion

		return app;
	}

	private static async Task<IResult> Login(
		HttpContext context,
		[FromBody] UserLoginModel model,
		[FromServices] IUserRepository repository,
		[FromServices] IConfiguration configuration,
		[FromServices] IMapper mapper)
	{
		try
		{
			var ipAddress = context.Connection.RemoteIpAddress?.ToString();
			var userAgent = context.Request.Headers["User-Agent"].ToString();

			// Authenticate user with provided username and password

			var user = mapper.Map<User>(model);
			var result = await user.Authenticate(repository);

			// Check if authentication was successful
			if (result.Status == LoginStatus.Success)
			{
				var userDto = mapper.Map<UserDto>(result.User);

				// Generate a new access token and refresh token
				var token = userDto.Generate(configuration);
				var refreshToken = userAgent.GenerateRefreshToken(ipAddress, configuration);

				// Set the new refresh token in the HTTP response's cookies
				var userLogin = mapper.Map<UserLogin>(refreshToken);

				await repository.SetRefreshToken(userDto.Id, userLogin, context);

				// Return the new access token
				var accessToken = new AccessTokenModel()
				{
					Token = new JwtSecurityTokenHandler().WriteToken(token),
					ExpiresToken = token.ValidTo,
					UserDto = userDto,
				};

				return Results.Ok(ApiResponse.Success(accessToken));
			}

			// Return error response
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, result.Status.LoginResult()));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> RefreshToken(
		HttpContext context,
		[FromServices] IUserRepository repository,
		[FromServices] IMapper mapper,
		[FromServices] IConfiguration configuration)
	{
		try
		{
			var userAgent = context.Request.Headers["User-Agent"].ToString();
			var ipAddress = context.Connection.RemoteIpAddress?.ToString();
			var refreshToken = context.Request.Cookies["refreshToken"];
			// Check if the incoming request has a valid refresh token

			// Retrieve user information using the refresh token
			var userLogin = await repository.GetRefreshTokenAsync(refreshToken, userAgent, ipAddress);

			// Handle different cases depending on the validity of the refresh token
			if (userLogin == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Unauthorized, "Refresh Token không tồn tại."));
			}
			else if (userLogin.TokenExpires < DateTime.Now)
			{
				var lastLoginDate = userLogin.TokenExpires;
				var currentDate = DateTime.Now;

				var daysSinceLastLogin = (currentDate - lastLoginDate).Days;
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Unauthorized, $"Refresh token đã hết hạn vào {daysSinceLastLogin} ngày trước."));
			}

			var user = await repository.GetUserByIdAsync(userLogin.UserId, true);

			// Generate a new access token and refresh token
			var userDto = mapper.Map<UserDto>(user);
			var token = userDto.Generate(configuration);
			var newRefreshToken = userAgent.GenerateRefreshToken(ipAddress, configuration);

			// Set the new refresh token in the HTTP response's cookies
			await repository.SetRefreshToken(userDto.Id, mapper.Map<UserLogin>(newRefreshToken), context);

			// Return the new access token
			var accessToken = new AccessTokenModel()
			{
				Token = new JwtSecurityTokenHandler().WriteToken(token),
				UserDto = userDto,
                ExpiresToken = token.ValidTo,
            };

			return Results.Ok(ApiResponse.Success(accessToken));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> Logout(
		HttpContext context,
		[FromServices] IUserRepository repository)
	{
		try
		{
			var refreshToken = context.Request.Cookies["refreshToken"];

			if (await repository.DeleteRefreshTokenAsync(refreshToken))
			{
				context.Response.Cookies.Delete("refreshToken");
				return Results.Ok(ApiResponse.Success("Cookie đã được xóa."));
			}

			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Cookie không tồn tại."));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> ChangePassword(
		PasswordEditModel model,
		HttpContext context,
		[FromServices] IUserRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			var identity = context.GetCurrentUser();
			var user = await repository.GetUserByIdAsync(identity.Id, true);

			if (await repository.ChangePasswordAsync(user, model.OldPassword, model.NewPassword))
			{
				return Results.Ok(ApiResponse.Success("Thay đổi mật khẩu thành công"));
			}
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Mật khẩu không chính xác."));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> Register(
		[FromBody] RegisterModel model,
		[FromServices] IUserRepository repository,
		[FromServices] IConfiguration configuration,
		[FromServices] IMapper mapper)
	{
		try
		{
			var user = mapper.Map<User>(model);

			var userExist = await repository.IsUserExistedAsync(user.Username);

			if (userExist)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Tài khoản đã tồn tại."));
			}

			var newUser = await repository.Register(user);

			var userDto = mapper.Map<UserDto>(newUser);

			return Results.Ok(ApiResponse.Success(userDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> UpdateUserRoles(
		[FromBody] UserRolesEditModel model,
		[FromServices] IUserRepository repository,
		[FromServices] IConfiguration configuration,
		[FromServices] IMapper mapper)
	{
		try
		{
			var user = await repository.GetUserByIdAsync(model.UserId, true);
			if (user == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Tài khoản không tồn tại."));
			}

			var newUser = await repository.SetUserRolesAsync(user.Id, model.RoleIdList);

			var userDto = mapper.Map<UserDto>(newUser);

			return Results.Ok(ApiResponse.Success(userDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> UpdateProfile(
		UserEditModel model,
		HttpContext context,
		[FromServices] IUserRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			var identity = context.GetCurrentUser();

			var user = await repository.GetUserByIdAsync(identity.Id);

			mapper.Map(model, user);

			var result = await repository.UpdateProfileAsync(user);

			if (result == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Cập nhật thất bại."));
			}

			var userDto = mapper.Map<UserDto>(user);
			return Results.Ok(ApiResponse.Success(userDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> GetUsers(
		[AsParameters] UserFilterModel model,
		[FromServices] IUserRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			var userQuery = mapper.Map<UserQuery>(model);

			var userList = await repository.GetPagedUsersAsync(
				userQuery,
				model,
				p => p.ProjectToType<UserDto>());

            var paginationResult = new PaginationResult<UserDto>(userList);

            return Results.Ok(ApiResponse.Success(paginationResult));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> GetProfile(
		HttpContext context,
		[FromServices] IUserRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			var identity = context.GetCurrentUser();

			var user = await repository.GetUserByIdAsync(identity.Id);
			var userDto = mapper.Map<UserDto>(user);

			return Results.Ok(ApiResponse.Success(userDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> GetRoles(
		[FromServices] IUserRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			var roles = await repository.GetRolesAsync();
			var listRoles = mapper.Map<IList<RoleDto>>(roles);

			return Results.Ok(ApiResponse.Success(listRoles));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}
}