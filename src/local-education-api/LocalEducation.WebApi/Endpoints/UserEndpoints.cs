using LocalEducation.Core.Collections;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.UserModel;
using LocalEducation.WebApi.Utilities;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace LocalEducation.WebApi.Endpoints;

public static class UserEndpoints
{
	public static WebApplication MapUserEndpoints(
		this WebApplication app)
	{
		RouteGroupBuilder builder = app.MapGroup("/api/users");

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
			string ipAddress = context.Connection.RemoteIpAddress?.ToString();
			string userAgent = context.Request.Headers["User-Agent"].ToString();

			// Authenticate user with provided username and password

			User user = mapper.Map<User>(model);
			Core.Constants.LoginResult result = await user.Authenticate(repository);

			// Check if authentication was successful
			if (result.Status == LoginStatus.Success)
			{
				UserDto userDto = mapper.Map<UserDto>(result.User);

				// Generate a new access token and refresh token
				JwtSecurityToken token = userDto.Generate(configuration);
				RefreshToken refreshToken = userAgent.GenerateRefreshToken(ipAddress, configuration);

				// Set the new refresh token in the HTTP response's cookies
				UserLogin userLogin = mapper.Map<UserLogin>(refreshToken);

				await repository.SetRefreshToken(userDto.Id, userLogin, context);

				// Return the new access token
				AccessTokenModel accessToken = new()
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
			string userAgent = context.Request.Headers["User-Agent"].ToString();
			string ipAddress = context.Connection.RemoteIpAddress?.ToString();
			string refreshToken = context.Request.Cookies["refreshToken"];
			// Check if the incoming request has a valid refresh token

			// Retrieve user information using the refresh token
			UserLogin userLogin = await repository.GetRefreshTokenAsync(refreshToken, userAgent, ipAddress);

			// Handle different cases depending on the validity of the refresh token
			if (userLogin == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Unauthorized, "Refresh Token không tồn tại."));
			}
			else if (userLogin.TokenExpires < DateTime.Now)
			{
				DateTime lastLoginDate = userLogin.TokenExpires;
				DateTime currentDate = DateTime.Now;

				int daysSinceLastLogin = (currentDate - lastLoginDate).Days;
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Unauthorized, $"Refresh token đã hết hạn vào {daysSinceLastLogin} ngày trước."));
			}

			User user = await repository.GetUserByIdAsync(userLogin.UserId, true);

			// Generate a new access token and refresh token
			UserDto userDto = mapper.Map<UserDto>(user);
			JwtSecurityToken token = userDto.Generate(configuration);
			RefreshToken newRefreshToken = userAgent.GenerateRefreshToken(ipAddress, configuration);

			// Set the new refresh token in the HTTP response's cookies
			await repository.SetRefreshToken(userDto.Id, mapper.Map<UserLogin>(newRefreshToken), context);

			// Return the new access token
			AccessTokenModel accessToken = new()
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
			string refreshToken = context.Request.Cookies["refreshToken"];

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
			UserDto identity = context.GetCurrentUser();
			User user = await repository.GetUserByIdAsync(identity.Id, true);

			return await repository.ChangePasswordAsync(user, model.OldPassword, model.NewPassword)
				? Results.Ok(ApiResponse.Success("Thay đổi mật khẩu thành công"))
				: Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Mật khẩu không chính xác."));
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
			User user = mapper.Map<User>(model);

			bool userExist = await repository.IsUserExistedAsync(user.Username);

			if (userExist)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Tài khoản đã tồn tại."));
			}

			User newUser = await repository.Register(user);

			UserDto userDto = mapper.Map<UserDto>(newUser);

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
			User user = await repository.GetUserByIdAsync(model.UserId, true);
			if (user == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Tài khoản không tồn tại."));
			}

			User newUser = await repository.SetUserRolesAsync(user.Id, model.RoleIdList);

			UserDto userDto = mapper.Map<UserDto>(newUser);

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
			UserDto identity = context.GetCurrentUser();

			User user = await repository.GetUserByIdAsync(identity.Id);

			mapper.Map(model, user);

			User result = await repository.UpdateProfileAsync(user);

			if (result == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Cập nhật thất bại."));
			}

			UserDto userDto = mapper.Map<UserDto>(user);
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
			UserQuery userQuery = mapper.Map<UserQuery>(model);

			Core.Contracts.IPagedList<UserDto> userList = await repository.GetPagedUsersAsync(
				userQuery,
				model,
				p => p.ProjectToType<UserDto>());

			PaginationResult<UserDto> paginationResult = new(userList);

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
			UserDto identity = context.GetCurrentUser();

			User user = await repository.GetUserByIdAsync(identity.Id);
			UserDto userDto = mapper.Map<UserDto>(user);

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
			IList<Role> roles = await repository.GetRolesAsync();
			IList<RoleDto> listRoles = mapper.Map<IList<RoleDto>>(roles);

			return Results.Ok(ApiResponse.Success(listRoles));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}
}