using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Media;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.FileModel;
using LocalEducation.WebApi.Utilities;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace LocalEducation.WebApi.Endpoints;

public static class FolderEndpoints
{
	public static WebApplication MapFolderEndpoints(
		this WebApplication app)
	{
		RouteGroupBuilder builder = app.MapGroup("/api/folders");

		#region Get method

		builder.MapGet("/", GetCaseFolders)
			.WithName("GetCaseFolders")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<IList<FolderDto>>>();

		builder.MapGet("/activateCloudStorage", ActivateCloudStorage)
			.WithName("ActivateCloudStorage")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse>();
		#endregion

		#region Post method

		//routeGroupBuilder.MapPost("/Test", CreateFolder)
		//	.WithName("CreateFolder")
		//	.RequireAuthorization("RequireManagerRole")
		//	.Produces<ApiResponse<FolderItem>>();

		#endregion

		return app;
	}

	#region Get function

	private static async Task<IResult> GetCaseFolders(
		HttpContext context,
		[FromServices] IFileRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			Models.UserModel.UserDto user = context.GetCurrentUser();

			IList<Core.Dto.FolderItem> folders = await repository.GetFoldersAsync(user.Id);

			IList<FolderDto> foldersDto = mapper.Map<IList<FolderDto>>(folders);

			return Results.Ok(ApiResponse.Success(foldersDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> ActivateCloudStorage(
		HttpContext context,
		[FromServices] IFileRepository repository,
		[FromServices] IMapper mapper,
		[FromServices] IMediaManager media)
	{
		try
		{
			Models.UserModel.UserDto user = context.GetCurrentUser();

			if (await repository.CheckExistsFolderAsync(user.Id))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotModified,
					"Tài khoản của bạn đã được kích hoạt kho lưu trữ"));
			}

			string folderPath = await media.CreateFolderAsync(user.Id.ToString("N"));

			if (string.IsNullOrWhiteSpace(folderPath))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.InternalServerError,
					"Không thể lưu thư mục"));
			}

			await repository.ActivateCloudStorageAsync(user.Id);


			return Results.Ok(ApiResponse.Success("Tài khoản của bạn đã kích hoạt thành công"));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	#endregion
}