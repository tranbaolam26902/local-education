using System.Net;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using LocalEducation.WebApi.Models;
using LocalEducation.Core.Entities;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Utilities;
using LocalEducation.WebApi.Models.LessonModel;
using LocalEducation.Services.EducationRepositories.Interfaces;

namespace LocalEducation.WebApi.Endpoints;

public static class LessonEndpoints
{
    public static WebApplication MapLessonEndpoints(this WebApplication app)
    {
        var builder = app.MapGroup("/api/lessons");

        #region Get Method

        builder.MapGet("/manager/getLessons/{courseId:guid}", GetLessonsByCourseId)
            .WithName("GetLessonsByCourseIdAsync")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<IList<LessonDto>>>();

        builder.MapGet("/manager/{lessonId:guid}", GetLessonById)
            .WithName("GetLessonById")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<LessonDto>>();

        builder.MapGet("/{lessonId:guid}", GetLessonByUser)
            .WithName("GetLessonByUser")
            .Produces<ApiResponse<LessonDto>>();

        builder.MapGet("/getLessons/{courseSlug}", GetLessonsByCourseSlug)
            .WithName("GetLessonsByCourseSlug")
            .Produces<ApiResponse<IList<LessonDto>>>();

        builder.MapGet("/togglePublish/{lessonId:guid}", TogglePublishedStatus)
            .WithName("TogglePublishedStatusLesson")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        #region Post Method

        builder.MapPost("/{courseId:guid}", AddLesson)
            .WithName("AddLesson")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<LessonEditModel>>()
            .Produces<ApiResponse<LessonDto>>();

        #endregion

        #region Put Method

        builder.MapPut("/{lessonId:guid}", UpdateLesson)
            .WithName("UpdateLesson")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<LessonEditModel>>()
            .Produces<ApiResponse<LessonDto>>();

        #endregion

        #region Delete Method

        builder.MapDelete("/{lessonId:guid}", DeleteLesson)
            .WithName("DeleteLesson")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        return app;
    }

    #region Get functions

    private static async Task<IResult> GetLessonsByCourseId(
        [FromRoute] Guid courseId,
        [FromServices] ILessonRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var lessons = await repository.GetLessonsByCourseIdAsync(courseId, true, true);

            if (lessons == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            return Results.Ok(ApiResponse.Success(lessons));

        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetLessonById(
        [FromRoute] Guid lessonId,
        [FromServices] ILessonRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var lesson = await repository.GetLessonByIdAsync(lessonId, true);

            if (lesson == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            return Results.Ok(ApiResponse.Success(mapper.Map<LessonDto>(lesson)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetLessonByUser(
        [FromRoute] Guid lessonId,
        [FromServices] ILessonRepository repository,
        [FromServices] ISlideRepository slideRepository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var lesson = await repository.GetLessonByIdAsync(lessonId, true);

            if (lesson == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            lesson.Slides = await slideRepository.GetListSlideByLessonIdAsync(lessonId);

            return Results.Ok(ApiResponse.Success(mapper.Map<LessonDto>(lesson)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetLessonsByCourseSlug(
        [FromRoute] string courseSlug,
        [FromServices] ILessonRepository repository,
        [FromServices] ICourseRepository courseRepository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var course = await courseRepository.GetCourseBySlugAsync(courseSlug);
            if (course == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy khóa học nào"));
            }
            else if (!course.IsPublished)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Khóa học chưa được xuất bản"));
            }

            var lessons = await repository.GetLessonsByCourseIdAsync(course.Id);
            if (lessons == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            foreach (var lesson in lessons)
            {
                lesson.Slides = lesson.Slides.Where(s => s.IsPublished).ToList();
                lesson.TotalSlide = lesson.Slides.Count;
            }

            return Results.Ok(ApiResponse.Success(lessons));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> TogglePublishedStatus(
        [FromRoute] Guid lessonId,
        [FromServices] ILessonRepository repository)
    {
        try
        {
            var lesson = await repository.GetLessonByIdAsync(lessonId, true);

            if (lesson == null)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    "Không tìm thấy bài học nào"));
            }

            if (await repository.TogglePublicStatusAsync(lessonId))
            {
                if (lesson.IsPublished)
                {
                    return Results.Ok(ApiResponse.Success("Bài học đã được chuyển sang riêng tư"));
                }
                return Results.Ok(ApiResponse.Success("Bài học đã được chuyển sang công khai"));
            }

            return Results.Ok(ApiResponse.Success("Cập nhật trạng thái thất bại", HttpStatusCode.NoContent));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Post functions

    private static async Task<IResult> AddLesson(
        [FromRoute] Guid courseId,
        [FromBody] LessonEditModel model,
        [FromServices] ILessonRepository repository,
        [FromServices] ICourseRepository courseRepository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var course = await courseRepository.GetCourseByIdAsync(courseId);

            if (course == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Khóa học không tìm thấy hoặc đã bị xóa"));
            }

            var listLessons = await repository.GetLessonsByCourseIdAsync(courseId, isManager: true);

            if (model.Index != 0)
            {
                foreach (var item in listLessons)
                {
                    if (item.Index == model.Index)
                    {
                        return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Thứ tự bài học đã tồn tại"));
                    }
                }
            }

            var lesson = mapper.Map<Lesson>(model);
            lesson.CourseId = course.Id;

            var result = await repository.AddOrUpdateLessonAsync(lesson);

            return Results.Ok(ApiResponse.Success(mapper.Map<LessonDto>(result)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Put functions

    private static async Task<IResult> UpdateLesson(
        [FromRoute] Guid lessonId,
        [FromBody] LessonEditModel model,
        [FromServices] ILessonRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var lesson = await repository.GetLessonByIdAsync(lessonId, true);
            if (lesson == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            var listLessons = await repository.GetLessonsByCourseIdAsync(lesson.CourseId, isManager: true);
            var currentLesson = listLessons.FirstOrDefault(l => l.Id == lesson.Id);

            if (model.Index != 0)
            {
                if (listLessons.Any(item => item.Index == model.Index && item != currentLesson))
                {
                    return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Thứ tự bài học đã tồn tại"));
                }
            }

            mapper.Map(model, lesson);
            lesson.TourSlug ??= "";

            await repository.AddOrUpdateLessonAsync(lesson);

            return Results.Ok(ApiResponse.Success(mapper.Map<LessonDto>(lesson)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Delete functions

    private static async Task<IResult> DeleteLesson(
        HttpContext context,
        [FromRoute] Guid lessonId,
        [FromServices] ILessonRepository repository)
    {
        try
        {
            var lesson = await repository.GetLessonByIdAsync(lessonId, true);

            if (lesson == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy bài học nào"));
            }

            if (lesson.IsPublished)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Bài học đã được xuất bản"));
            }
            else if (lesson.Course.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.Forbidden,
                    "Bạn không phải tác giả khóa học này"));
            }

            return await repository.DeleteLessonAsync(lessonId)
                ? Results.Ok(ApiResponse.Success("Xóa bài học thành công"))
                : Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Xóa bài học thất bại"));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion
}