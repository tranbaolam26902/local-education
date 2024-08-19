using System.Net;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using LocalEducation.WebApi.Media;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Utilities;
using LocalEducation.WebApi.Models.FileModel;
using LocalEducation.Services.EducationRepositories.Interfaces;

namespace LocalEducation.WebApi.Endpoints;

public static class FolderEndpoints
{
	public static WebApplication MapFolderEndpoints(
		this WebApplication app)
	{
		var builder = app.MapGroup("/api/folders");

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
            var user = context.GetCurrentUser();

            var folders = await repository.GetFoldersAsync(user.Id);

            var foldersDto = mapper.Map<IList<FolderDto>>(folders);

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
            var user = context.GetCurrentUser();

            if (await repository.CheckExistsFolderAsync(user.Id))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotModified,
                    "Tài khoản của bạn đã được kích hoạt kho lưu trữ"));
            }

            var folderPath = await media.CreateFolderAsync(user.Id.ToString("N"));

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