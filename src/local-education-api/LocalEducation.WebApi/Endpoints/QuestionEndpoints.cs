using LocalEducation.Core.Entities;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Services.Extensions;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.FileModel;
using LocalEducation.WebApi.Models.QuestionModel;
using LocalEducation.WebApi.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.RegularExpressions;
using File = LocalEducation.Core.Entities.File;
using IMapper = MapsterMapper.IMapper;

namespace LocalEducation.WebApi.Endpoints;

public static class QuestionEndpoints
{
	public static WebApplication MapQuestionEndpoint(this WebApplication app)
	{
		RouteGroupBuilder builder = app.MapGroup("/api/Questions");

		#region GET Method

		builder.MapGet("/{slideId:Guid}", GetQuestionById)
			.WithName("GetQuestionById")
			.Produces<ApiResponse<QuestionDto>>();

		builder.MapGet("/ImportQuestionsFromExcel/{fileId:Guid}", ImportQuestionsFromExcel)
			.WithName("ImportQuestionsFromExcel")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<IList<QuestionEditModel>>>();

		#endregion

		#region POST Method

		builder.MapPost("/{slideId:Guid}/{minPoint:int}", AddQuestion)
			.WithName("AddQuestionsAsync")
			//.AddEndpointFilter<ValidatorFilter<QuestionEditModel>>()
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<List<QuestionDto>>>();

		builder.MapPost("/ExportQuestionsToExcel", ExportQuestionsToExcel)
			.WithName("ExportQuestionsToExcel")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<FileDto>>();

		#endregion
		return app;
	}

	#region GET function



	private static async Task<IResult> GetQuestionById(
		HttpContext context,
		[FromRoute] Guid slideId,
		[FromServices] IQuestionRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			IList<Question> questions = await repository.GetQuestionBySlideIdAsync(slideId);
			if (questions == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Bạn chưa tham gia khóa học"));
			}

			Models.UserModel.UserDto user = context?.GetCurrentUser();
			if (user is
			{ RoleName: "User" } or null)
			{
				foreach (Question question in questions)
				{
					question.IndexCorrect = -1;
				}
			}

			IList<QuestionDto> result = mapper.Map<IList<QuestionDto>>(questions);

			return Results.Ok(ApiResponse.Success(result));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> ImportQuestionsFromExcel(
		[FromRoute] Guid fileId,
		[FromServices] IQuestionRepository repository,
		[FromServices] IFileRepository fileRepo,
		[FromServices] IMapper mapper)
	{
		try
		{
			File fileExcel = await fileRepo.GetFileByIdAsync(fileId);

			if (fileExcel == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy file"));
			}
			else if (fileExcel.FileType != FileType.Other)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "File không hợp lệ"));
			}

			List<Question> questions = ExcelExporter.ImportQuestionsFromExcel(fileExcel.Path);

			return questions == null
				? Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Tập tin không đúng định dạng"))
				: Results.Ok(ApiResponse.Success(mapper.Map<IList<QuestionEditModel>>(questions)));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	#endregion

	#region POST function

	private static async Task<IResult> AddQuestion(
		[FromRoute] Guid slideId,
		[FromRoute] int minPoint,
		[FromBody] IList<QuestionEditModel> models,
		[FromServices] IQuestionRepository repository,
		[FromServices] ISlideRepository slideRepo,
		[FromServices] IMapper mapper)
	{
		try
		{
			if (models == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Dữ liệu không hợp lệ"));
			}

			Slide slide = await repository.GetSlideByIdAsync(slideId);
			if (slide == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Không tìm thấy nội dung bài học"));
			}

			if (models.Count < minPoint)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, $@"Số câu hỏi ít hơn điểm tối thiểu ({minPoint})"));
			}


			IList<Question> questions = mapper.Map<IList<Question>>(models);

			IList<Question> result = await repository.AddQuestionsAsync(slide, questions, minPoint);


			return Results.Ok(ApiResponse.Success(mapper.Map<IList<QuestionDto>>(result)));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	private static async Task<IResult> ExportQuestionsToExcel(
		HttpContext context,
		[FromBody] ExportQuestionDto model,
		[FromServices] IFileRepository fileRepo,
		[FromServices] IUserRepository userRepo,
		[FromServices] IMapper mapper)
	{
		try
		{
			Models.UserModel.UserDto identity = context.GetCurrentUser();
			User user = await userRepo.GetUserByIdAsync(identity.Id);

			if (!await fileRepo.CheckExistsFolderAsync(user.Id))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
					"Thư mục không tồn tại hoặc chưa được kích hoạt"));
			}

			string folderPath = "uploads/media/" + user.Id.ToString("N");

			string filePath = folderPath + "/others/" + model.FileName.Replace(".xlsx", "").GenerateSlug() + "_" + Guid.NewGuid().ToString("D") + ".xlsx";

			float size = ExcelExporter.ExportQuestionsToExcel(model.Questions, filePath);

			File file = new()
			{
				Name = !Regex.IsMatch(model.FileName, @"\.xlsx$") ? model.FileName + ".xlsx" : model.FileName,
				Path = filePath,
				Size = size,
				FileType = FileType.Other,
				CreatedDate = DateTime.Now,
				ThumbnailPath = "app_data/excel-logo.png"
			};

			Folder folder = await fileRepo.GetFolderByUserIdAsync(user.Id, file.FileType);

			if (folder == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
					"Không tìm thấy thư mục"));
			}

			file.FolderId = folder.Id;
			await fileRepo.AddOrUpdateFileAsync(file);


			FileDto fileDto = mapper.Map<FileDto>(file);

			return Results.Ok(ApiResponse.Success(fileDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}

	#endregion

}