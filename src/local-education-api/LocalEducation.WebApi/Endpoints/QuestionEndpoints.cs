using System.Net;
using System.Text.RegularExpressions;
using LocalEducation.Core.Entities;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Services.Extensions;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.FileModel;
using LocalEducation.WebApi.Models.QuestionModel;
using LocalEducation.WebApi.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using File = LocalEducation.Core.Entities.File;
using IMapper = MapsterMapper.IMapper;

namespace LocalEducation.WebApi.Endpoints;

public static class QuestionEndpoints
{
    public static WebApplication MapQuestionEndpoint(this WebApplication app)
    {
        var builder = app.MapGroup("/api/Questions");

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
            var questions = await repository.GetQuestionBySlideIdAsync(slideId);
            if (questions == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Bạn chưa tham gia khóa học"));
            }

            var user = context?.GetCurrentUser();
            if (user is { RoleName: "User" } || user == null)
            {
                foreach (var question in questions)
                {
                    question.IndexCorrect = -1;
                }
            }

            var result = mapper.Map<IList<QuestionDto>>(questions);

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
            var fileExcel = await fileRepo.GetFileByIdAsync(fileId);

            if (fileExcel == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy file"));
            } 
            else if (fileExcel.FileType != FileType.Other)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "File không hợp lệ"));
            }

            var questions = ExcelExporter.ImportQuestionsFromExcel(fileExcel.Path);

            if (questions == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Tập tin không đúng định dạng"));
            }

            return Results.Ok(ApiResponse.Success(mapper.Map<IList<QuestionEditModel>>(questions)));
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

            var slide = await repository.GetSlideByIdAsync(slideId);
            if (slide == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Không tìm thấy nội dung bài học"));
            }

            if (models.Count < minPoint)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, $@"Số câu hỏi ít hơn điểm tối thiểu ({minPoint})"));
            }


            var questions = mapper.Map<IList<Question>>(models);

            var result = await repository.AddQuestionsAsync(slide, questions, minPoint);


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
            var identity = context.GetCurrentUser();
            var user = await userRepo.GetUserByIdAsync(identity.Id);

            if (!await fileRepo.CheckExistsFolderAsync(user.Id))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    "Thư mục không tồn tại hoặc chưa được kích hoạt"));
            }

            var folderPath = "uploads/media/" + user.Id.ToString("N");

            var filePath = folderPath + "/others/" + model.FileName.Replace(".xlsx", "").GenerateSlug() + "_" + Guid.NewGuid().ToString("D") + ".xlsx";

            var size = ExcelExporter.ExportQuestionsToExcel(model.Questions, filePath);

            var file = new File()
            {
                Name = !Regex.IsMatch(model.FileName, @"\.xlsx$") ? model.FileName + ".xlsx" : model.FileName,
                Path = filePath,
                Size = size,
                FileType = FileType.Other,
                CreatedDate = DateTime.Now,
                ThumbnailPath = "app_data/excel-logo.png"
            };

            var folder = await fileRepo.GetFolderByUserIdAsync(user.Id, file.FileType);

            if (folder == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    "Không tìm thấy thư mục"));
            }

            file.FolderId = folder.Id;
            await fileRepo.AddOrUpdateFileAsync(file);


            var fileDto = mapper.Map<FileDto>(file);

            return Results.Ok(ApiResponse.Success(fileDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

}