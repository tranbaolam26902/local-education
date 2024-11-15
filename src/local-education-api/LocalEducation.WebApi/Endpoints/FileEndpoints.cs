using LocalEducation.Core.Collections;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Media;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.FileModel;
using LocalEducation.WebApi.Utilities;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using File = LocalEducation.Core.Entities.File;

namespace LocalEducation.WebApi.Endpoints;

public static class FileEndpoints
{
	public static WebApplication MapFileEndpoints(
		this WebApplication app)
	{
		RouteGroupBuilder builder = app.MapGroup("/api/files");

		#region Get method

		builder.MapGet("/", GetPagedFiles)
			.WithName("GetPagedFiles")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<PaginationResult<FileDto>>>();

		#endregion

		#region Post method

		builder.MapPost("/upload", UploadFile)
			.WithName("UploadFile")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<FileDto>>();

		#endregion

		#region Put method

		builder.MapPut("/rename/{fileId:guid}", RenameFile)
			.WithName("RenameFile")
			.RequireAuthorization("Manager")
			.AddEndpointFilter<ValidatorFilter<FileEditModel>>()
			.Produces<ApiResponse>();

		#endregion

		#region Delete method

		builder.MapDelete("/toggleDeleteFiles", ToggleDeleteFilesStatus)
			.WithName("ToggleDeleteFilesStatus")
			.RequireAuthorization("Manager")
		.Produces<ApiResponse>();

		builder.MapDelete("/deleteFiles", DeleteFiles)
			.WithName("DeleteFiles")
			.RequireAuthorization("Manager")
		.Produces<ApiResponse>();

		builder.MapDelete("/emptyRecycleBin", DeleteAllFiles)
			.WithName("DeleteAllFiles")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse>();

		#endregion

		return app;
	}

	#region Get function

	private static async Task<IResult> GetPagedFiles(
		HttpContext context,
		[AsParameters] FileFilterModel model,
		[FromServices] IFileRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			Models.UserModel.UserDto identity = context.GetCurrentUser();

			FileQuery fileQuery = mapper.Map<FileQuery>(model);

			Core.Contracts.IPagedList<FileDto> fileList = await repository.GetPagedFilesAsync(
				identity.Id,
				fileQuery,
				model,
				p => p.ProjectToType<FileDto>());

			PaginationResult<FileDto> paginationResult = new(fileList);

			return Results.Ok(ApiResponse.Success(paginationResult));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	#endregion

	#region Post function

	private static async Task<IResult> UploadFile(
		HttpContext context,
		HttpRequest request,
		[FromServices] IFileRepository repository,
		[FromServices] IUserRepository userRepository,
		[FromServices] IMediaManager media,
		[FromServices] IMapper mapper)
	{
		try
		{
			Models.UserModel.UserDto identity = context.GetCurrentUser();
			User user = await userRepository.GetUserByIdAsync(identity.Id);

			if (!await repository.CheckExistsFolderAsync(user.Id))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
					"Thư mục không tồn tại hoặc chưa được kích hoạt"));
			}

			string folderPath = "uploads/media/" + user.Id.ToString("N");

			IFormFile formFile = context.Request.Form.Files[0];

			if (formFile is null || formFile.Length == 0)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Không có tập tin được gửi lên"));
			}

			string filePath = await media.UploadFileAsync(
				formFile.OpenReadStream(),
				folderPath,
				formFile.FileName,
				formFile.ContentType);

			if (string.IsNullOrWhiteSpace(filePath))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.InternalServerError,
					"Đã xảy ra lỗi trong quá trình lưu tập tin. Vui lòng thử lại sau!"));
			}

			File model = new()
			{
				Name = formFile.FileName,
				Path = filePath,
				Size = formFile.Length,
				FileType = formFile.ContentType.GetFileType(formFile.OpenReadStream()),
				CreatedDate = DateTime.Now,
			};

			Folder folder = await repository.GetFolderByUserIdAsync(user.Id, model.FileType);

			if (folder == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
					"Không tìm thấy thư mục"));
			}

			model.FolderId = folder.Id;

			model.ThumbnailPath = await media.SaveThumbnailAsync(
				model.FileType,
				formFile,
				formFile.FileName,
				folderPath);

			File file = mapper.Map<File>(model);

			file.Id = Guid.Empty;
			await repository.AddOrUpdateFileAsync(file);

			FileDto fileDto = mapper.Map<FileDto>(file);

			return Results.Ok(ApiResponse.Success(fileDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	#endregion

	#region Put function

	private static async Task<IResult> RenameFile(
		HttpContext context,
		[FromRoute] Guid fileId,
		[FromBody] FileEditModel model,
		[FromServices] IFileRepository repository)
	{
		try
		{
			Models.UserModel.UserDto identity = context.GetCurrentUser();

			File file = await repository.GetFileByIdAsync(fileId);

			if (file == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy tập tin"));
			}

			if (!await repository.CheckAuthorizeFileAsync(identity.Id, fileId))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Forbidden, "Bạn không được phép thực hiện yêu cầu này"));
			}

			file.Name = model.Name;

			await repository.AddOrUpdateFileAsync(file);

			return Results.Ok(ApiResponse.Success("Đổi tên tập tin thành công"));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}
	#endregion

	#region Delete function

	private static async Task<IResult> ToggleDeleteFilesStatus(
		HttpContext context,
		[FromBody] IList<Guid> fileIdList,
		[FromServices] IFileRepository repository)
	{
		try
		{
			Guid userId = context.GetCurrentUser().Id;

			foreach (Guid fileId in fileIdList)
			{
				File file = await repository.GetFileByIdAsync(fileId);
				if (file == null)
				{
					return Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound,
						$"Tập tin không tồn tại hoặc đã bị xóa"));
				}
				else if (file.Folder.UserId != userId)
				{
					return Results.Ok(ApiResponse.Fail(
						HttpStatusCode.Forbidden,
						$"Bạn không được phép thực hiện yêu cầu này"));
				}

				await repository.ToggleDeleteFilesStatusAsync(fileId);
			}

			return Results.Ok(ApiResponse.Success("Tập tin đã được chuyển."));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> DeleteFiles(
		HttpContext context,
		[FromBody] IList<Guid> fileIdList,
		[FromServices] IFileRepository repository,
		[FromServices] IMediaManager media)
	{
		try
		{
			Guid userId = context.GetCurrentUser().Id;
			foreach (Guid fileId in fileIdList)
			{
				File file = await repository.GetFileIsDeletedAsync(fileId);
				if (file == null)
				{
					return Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound,
						$"Tập tin đã được xóa hoặc không tồn tại"));
				}
				else if (file.Folder.UserId != userId)
				{
					return Results.Ok(ApiResponse.Fail(
						HttpStatusCode.Forbidden,
						$"Bạn không được phép thực hiện yêu cầu này"));
				}

				await media.DeleteFileAsync(file.Path);
				if (file.FileType is not FileType.Other and not FileType.Audio)
				{
					await media.DeleteFileAsync(file.ThumbnailPath);
				}

				bool checkDelete = await repository.DeleteFileAsync(fileId);

				if (!checkDelete)
				{
					Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Xóa tập tin không thành công."));
				}
			}

			return Results.Ok(ApiResponse.Success("Xóa tập tin thành công."));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> DeleteAllFiles(
		HttpContext context,
		[FromServices] IFileRepository repository,
		[FromServices] IMediaManager media)
	{
		try
		{
			Models.UserModel.UserDto identity = context.GetCurrentUser();

			IList<File> files = await repository.GetFilesIsDeletedAsync(identity.Id);

			foreach (File file in files)
			{
				await media.DeleteFileAsync(file.Path);

				if (file.FileType is not FileType.Other and not FileType.Audio)
				{
					await media.DeleteFileAsync(file.ThumbnailPath);
				}

				await repository.DeleteFileAsync(file.Id);
			}

			return Results.Ok(ApiResponse.Success("Thùng rác đã được dọn."));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	#endregion
}