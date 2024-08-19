using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Models.SlideModel;
using LocalEducation.WebApi.Filters;
using LocalEducation.Core.Entities;
using LocalEducation.WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using MapsterMapper;
using System.Net;
using LocalEducation.WebApi.Utilities;

namespace LocalEducation.WebApi.Endpoints;

public static class SlideEndpoints
{
    public static WebApplication MapSlideEndpoints(this WebApplication app)
    {
        var builder = app.MapGroup("/api/slides");

        #region Get Method

        builder.MapGet("/{slideId:guid}", GetSlideById)
            .WithName("GetSlideById")
            .Produces<ApiResponse<SlideDto>>();

        builder.MapGet("/list/{lessonId:guid}", GetSlidesByLessonId)
            .WithName("GetSlidesByLessonId")
            .Produces<ApiResponse<SlideDto>>();

        builder.MapGet("/manager/{slideId:guid}", GetSlideByManager)
            .WithName("GetSlideByManager")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<SlideDto>>();

        builder.MapGet("/togglePublish/{slideId:guid}", TogglePublishedStatus)
            .WithName("TogglePublishedStatusSlide")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        #region Post Method

        builder.MapPost("/{lessonId:guid}", AddSlide)
            .WithName("AddSlide")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<SlideEditModel>>()
            .Produces<ApiResponse<SlideDto>>();

        #endregion

        #region Put Method
        builder.MapPut("/{slideId:guid}", UpdateSlide)
            .WithName("UpdateSlide")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<SlideEditModel>>()
            .Produces<ApiResponse<SlideDto>>();

        #endregion

        #region Delete Method
        builder.MapDelete("/{slideId:guid}", DeleteSlide)
            .WithName("DeleteSlide")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        return app;
    }

    #region Get functions

    private static async Task<IResult> GetSlidesByLessonId(
        HttpContext context,
        [FromRoute] Guid lessonId,
        [FromServices] ISlideRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var user = context.GetCurrentUser();


            IList<Slide> slides;

            if (user != null && user.Roles.Any(s => s.Name.ToLower() == "Manager".ToLower()))
            {
                slides = await repository.GetListSlideByLessonIdAsync(lessonId, true);
            }
            else
            {
                slides = await repository.GetListSlideByLessonIdAsync(lessonId);
            }


            var result = mapper.Map<IList<SlideDto>>(slides);

            return Results.Ok(ApiResponse.Success(result));

        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetSlideById(
        [FromRoute] Guid slideId,
        [FromServices] ISlideRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var slide = await repository.GetSlideByIdAsync(slideId);
            if (slide == null)
            {
                return Results.Ok(
                    ApiResponse.Fail(HttpStatusCode.NotFound,
                        "Bài học không tồn tại."));
            }
            else if (!slide.IsPublished)
            {
                return Results.Ok(
                    ApiResponse.Fail(HttpStatusCode.NotFound,
                        "Bài học chưa được xuất bản."));
            }

            var result = mapper.Map<SlideDto>(slide);

            return Results.Ok(ApiResponse.Success(result));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetSlideByManager(
        [FromRoute] Guid slideId,
        [FromServices] ISlideRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var slide = await repository.GetSlideByIdAsync(slideId);
            if (slide == null)
            {
                return Results.Ok(
                    ApiResponse.Fail(HttpStatusCode.NotFound,
                        "Bài học không tồn tại."));
            }

            var result = mapper.Map<SlideDto>(slide);

            return Results.Ok(ApiResponse.Success(result));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> TogglePublishedStatus(
        [FromRoute] Guid slideId,
        [FromServices] ISlideRepository repository)
    {
        try
        {
            var slide = await repository.GetSlideByIdAsync(slideId);

            if (slide == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    "Nội dung bài học không tồn tại"));

            }

            if (await repository.TogglePublicStatusAsync(slideId))
            {
                if (slide.IsPublished)
                {
                    return Results.Ok(ApiResponse.Success("Nội dung bài học đã được chuyển sang riêng tư"));
                }
                return Results.Ok(ApiResponse.Success("Nội dung bài học đã được chuyển sang công khai"));
            }

            return Results.Ok(ApiResponse.Success("Cập nhật trang thái thất bại", HttpStatusCode.NoContent));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Post functions

    private static async Task<IResult> AddSlide(
        [FromRoute] Guid lessonId,
        [FromBody] SlideEditModel model,
        [FromServices] ISlideRepository repository,
        [FromServices] ILessonRepository lessonRepository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var lesson = await lessonRepository.GetLessonByIdAsync(lessonId, true);
            if (lesson == null)
            {
                return Results.Ok(
                    ApiResponse.Fail(HttpStatusCode.NotFound,
                        "Bài học không tồn tại."));
            }

            var listSlides = await repository.GetListSlideByLessonIdAsync(lessonId, true);

            if (model.Index != 0)
            {
                foreach (var item in listSlides)
                {
                    if (item.Index == model.Index)
                    {
                        return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Thứ tự nội dung bài học đã tồn tại"));
                    }
                }
            }

            var slide = mapper.Map<Slide>(model);

            slide.LessonId = lesson.Id;

            await repository.AddOrUpdateSlideAsync(slide);

            var result = mapper.Map<SlideDto>(slide);

            return Results.Ok(ApiResponse.Success(result));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Put functions

    private static async Task<IResult> UpdateSlide(
        [FromRoute] Guid slideId,
        [FromBody] SlideEditModel model,
        [FromServices] ISlideRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var slide = await repository.GetSlideByIdAsync(slideId);
            if (slide == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            var listSlides = await repository.GetListSlideByLessonIdAsync(slide.LessonId, true);
            var currentSlide = listSlides.FirstOrDefault(l => l.Id == slide.Id);

            if (model.Index != 0)
            {
                if (listSlides.Any(item => item.Index == model.Index && item != currentSlide))
                {
                    return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Thứ tự nội dung bài học đã tồn tại"));
                }
            }


            slide = mapper.Map(model, slide);

            await repository.AddOrUpdateSlideAsync(slide);

            return Results.Ok(ApiResponse.Success(mapper.Map<SlideDto>(slide)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Delete functions

    private static async Task<IResult> DeleteSlide(
        [FromRoute] Guid slideId,
        [FromServices] ISlideRepository repository)
    {
        try
        {
            var slide = await repository.GetSlideByIdAsync(slideId);
            if (slide == null)
            {
                return Results.Ok(
                    ApiResponse.Fail(HttpStatusCode.NotFound,
                        "Slide không tồn tại."));
            }

            if (slide.IsPublished)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Nội dung bài học đã được xuất bản"));
            }

            return await repository.DeleteSlideAsync(slide.Id) ?
                Results.Ok(ApiResponse.Success("Xóa nội dung thành công")) :
                Results.Ok(ApiResponse.Success("Xóa nội dung bài học thất bại", HttpStatusCode.NoContent));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion
}