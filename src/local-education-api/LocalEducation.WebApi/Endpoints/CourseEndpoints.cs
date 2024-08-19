using Mapster;
using System.Net;
using MapsterMapper;
using LocalEducation.Core.Dto;
using Microsoft.AspNetCore.Mvc;
using LocalEducation.Core.Queries;
using LocalEducation.Core.Entities;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Utilities;
using LocalEducation.Core.Collections;
using LocalEducation.Services.Extensions;
using LocalEducation.WebApi.Models.CourseModel;
using LocalEducation.WebApi.Models.LessonModel;
using LocalEducation.Services.EducationRepositories.Interfaces;

namespace LocalEducation.WebApi.Endpoints;

public static class CourseEndpoints
{
    public static WebApplication MapCourseEndpoints(this WebApplication app)
    {
        var builder = app.MapGroup("/api/courses");

        #region Get Method

        builder.MapGet("/", GetPagedCourses)
            .WithName("GetPagedCourse")
            .Produces<ApiResponse<PaginationResult<CourseItem>>>();

        builder.MapGet("/byAuthor", GetPagedCourseByAuthor)
            .WithName("GetPagedCourseByAuthor")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<PaginationResult<CourseItem>>>();

        builder.MapGet("/byUser", GetPagedCourseByUser)
            .WithName("GetPagedCourseByUser")
            .RequireAuthorization("User")
            .Produces<ApiResponse<PaginationResult<CourseItem>>>();

        builder.MapGet("/getAll", GetCoursesByKeyword)
            .WithName("GetCoursesByKeyword")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<IList<CourseDto>>>();

        builder.MapGet("/bySlug/{slug:regex(^[a-z0-9_-]+$)}", GetCourseBySlug)
            .WithName("GetCourseBySlug")
            .Produces<ApiResponse<CourseDto>>();

        builder.MapGet("/related/{number:int}", GetRelatedCourse)
            .WithName("GetRelatedCourse")
            .Produces<ApiResponse<IList<CourseItem>>>();

        builder.MapGet("/togglePublish/{courseId:guid}", TogglePublishedStatus)
            .WithName("TogglePublishedStatusCourse")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        builder.MapGet("/takePartInCourse/{courseId:guid}", TakePartInCourse)
            .WithName("TakePartInCourse")
            .RequireAuthorization("User")
            .Produces<ApiResponse>();

        #endregion

        #region Post Method

        builder.MapPost("/", CreateCourse)
            .WithName("CreateCourse")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<CourseEditModel>>()
            .Produces<ApiResponse<CourseItem>>();

        #endregion

        #region Put Method

        builder.MapPut("/{courseId:guid}", UpdateCourse)
            .WithName("UpdateCourse")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<CourseEditModel>>()
            .Produces<ApiResponse<CourseItem>>();

        #endregion

        #region Delete Method

        builder.MapDelete("/toggleDelete/{courseId:guid}", ToggleDeleteStatus)
            .WithName("ToggleCourseDeleteStatus")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        builder.MapDelete("/{courseId:guid}", DeleteCourse)
            .WithName("DeleteCourse")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        return app;
    }

    #region Get functions

    private static async Task<IResult> GetPagedCourses(
        [AsParameters] CourseFilterByUser model,
        [FromServices] ICourseRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var courseQuery = mapper.Map<CourseQuery>(model);

            courseQuery.UserId = Guid.Empty;
            courseQuery.IsPublished = true;
            courseQuery.NonPublished = false;
            courseQuery.IsDeleted = false;

            var pagedCourses =
                await repo.GetPagedCoursesAsync(
                    courseQuery,
                    model,
                    p => p.ProjectToType<CourseItem>());

            var paginationResult = new PaginationResult<CourseItem>(pagedCourses);

            return Results.Ok(ApiResponse.Success(paginationResult));

        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetPagedCourseByAuthor(
        HttpContext context,
        [AsParameters] CourseFilterModel model,
        [FromServices] ICourseRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var courseQuery = mapper.Map<CourseQuery>(model);

            courseQuery.AuthorId = context.GetCurrentUser().Id;

            var pagedCourses =
                await repo.GetPagedCoursesAsync(
                    courseQuery,
                    model,
                    p => p.ProjectToType<CourseItem>());

            var paginationResult = new PaginationResult<CourseItem>(pagedCourses);

            return Results.Ok(ApiResponse.Success(paginationResult));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetPagedCourseByUser(
        HttpContext context,
        [AsParameters] CourseFilterByUser model,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var courseQuery = mapper.Map<CourseQuery>(model);

            courseQuery.UserId = context.GetCurrentUser().Id;

            var pagedCourses = await repository.GetPagedCoursesAsync(
                courseQuery,
                model,
                p => p.ProjectToType<CourseItem>());

            var paginationResult = new PaginationResult<CourseItem>(pagedCourses);

            return Results.Ok(ApiResponse.Success(paginationResult));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetCoursesByKeyword(
        [AsParameters] CourseFilter model,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var courses = await repository.GetCoursesByKeywordAsync(model.Keyword);

            var courseDtos = mapper.Map<IList<CourseDto>>(courses);

            return Results.Ok(ApiResponse.Success(courseDtos));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetCourseBySlug(
        HttpContext context,
        [FromRoute] string slug,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var course = await repository.GetCourseBySlugAsync(slug);

            if (course == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    $"Khoá học không tìm thấy hoặc đã bị xóa"));
            }

            var user = context?.GetCurrentUser();
            if (user != null && course.UserId != user.Id && !course.IsPublished)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable,
                    $"Khóa học đã được chuyển thành chế độ riêng tư"));
            }

            if (context != null)
            {
                var cookie = context.Request.Cookies;

                if (!cookie.ContainsKey($"viewed_{course.Id}"))
                {
                    await repository.IncreaseViewAsync(course.Id);

                    var option = new CookieOptions()
                    {
                        Expires = DateTime.Now.AddMinutes(5)
                    };

                    context.Response.Cookies.Append($"viewed_{course.Id}", "true", option);
                    course.ViewCount += 1;
                }
            }

            course.Lessons = course.Lessons.Where(s => s.IsPublished).ToList();

            var courseDto = mapper.Map<CourseDto>(course);
            courseDto.Lessons = new List<LessonDto>();
            return Results.Ok(ApiResponse.Success(courseDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetRelatedCourse(
        [FromRoute] int number,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var courses = await repository.GetRelatedCourses(number);

            var courseDtos = mapper.Map<IList<CourseItem>>(courses);
            

            return Results.Ok(ApiResponse.Success(courseDtos));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }


    // take part in the course
    private static async Task<IResult> TakePartInCourse(
        HttpContext context,
        [FromRoute] Guid courseId,
        [FromServices] ICourseRepository repository)
    {
        try
        {
            var course = await repository.GetCourseByIdAsync(courseId);

            if (course == null || course.IsDeleted)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    $"Khóa học không được tìm thấy hoặc đã bị xóa"));
            }
            else if (!course.IsPublished)
            {
                return Results.Ok(ApiResponse.Fail(
                   HttpStatusCode.Forbidden,
                   $"Khóa học đã bị khóa không thể tham gia"));
            }

            var user = context.GetCurrentUser();
            var result = await repository.TakePartInCourseAsync(courseId, user.Id);

            return result
                ? Results.Ok(ApiResponse.Success("Tham gia khóa học thành công"))
                : Results.Ok(ApiResponse.Success("Bạn đã tham gia khóa học này", HttpStatusCode.NoContent));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }


    private static async Task<IResult> TogglePublishedStatus(
        HttpContext context,
        [FromRoute] Guid courseId,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var course = await repository.GetCourseByIdAsync(courseId);

            if (course == null)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    $"Khóa học không được tìm thấy hoặc đã bị xóa"));
            }
            else if (course.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden,
                    $"Bạn không được phép thực hiện yêu cầu này"));
            }

            if (await repository.TogglePublicStatusAsync(courseId))
            {
                if (course.IsPublished)
                {
                    return Results.Ok(ApiResponse.Success("Đã chuyển sang chế độ riêng tư"));
                }
                return Results.Ok(ApiResponse.Success("Đã chuyển sang chế độ công khai"));
            }

            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Chuyển đổi trạng thái thất bại"));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Post functions

    private static async Task<IResult> CreateCourse(
        HttpContext context,
        [FromBody] CourseEditModel model,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            if (await repository.IsExistCourseBySlugAsync(Guid.Empty, model.Title.GenerateSlug()))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable,
                    $"Khóa học đã được tạo với tên: '{model.Title}'"));
            }

            var course = mapper.Map<Course>(model);
            course.UserId = context.GetCurrentUser().Id;

            await repository.AddOrUpdateCourseAsync(course);

            var courseDto = mapper.Map<CourseDto>(course);

            return Results.Ok(ApiResponse.Success(courseDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Put functions

    private static async Task<IResult> UpdateCourse(
        HttpContext context,
        [FromRoute] Guid courseId,
        [FromBody] CourseEditModel model,
        [FromServices] ICourseRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var course = await repository.GetCourseByIdAsync(courseId);

            if (course == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, "Không tìm thấy khóa học hoặc đã bị xóa"));
            }
            else if (course.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.Forbidden,
                    "Bạn không được phép thực hiện yêu cầu này"));
            }

            course = mapper.Map(model, course);

            course.UrlSlug = course.Title.GenerateSlug();

            if (await repository.IsExistCourseBySlugAsync(course.Id, course.UrlSlug))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable,
                                       $"Khóa học đã được tạo với tên: '{model.Title}'"));
            }

            await repository.AddOrUpdateCourseAsync(course);

            var courseDto = mapper.Map<CourseDto>(course);

            return Results.Ok(ApiResponse.Success(courseDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Delete functions

    private static async Task<IResult> ToggleDeleteStatus(
        HttpContext context,
        [FromRoute] Guid courseId,
        [FromServices] ICourseRepository repository)
    {
        try
        {
            var course = await repository.GetCourseByIdAsync(courseId);
            if (course == null)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    $"Khóa học không được tìm thấy hoặc đã bị xóa"));
            }
            else if (course.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden,
                    $"Bạn không được phép thực hiện yêu cầu này"));
            }

            return await repository.ToggleDeleteStatusAsync(courseId) ?
                Results.Ok(ApiResponse.Success("Chuyển đổi trạng thái thành công")) :
                Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Chuyển đổi trạng thái thất bại"));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> DeleteCourse(
        HttpContext context,
        [FromRoute] Guid courseId,
        [FromServices] ICourseRepository repository)
    {
        try
        {
            var course = await repository.GetCourseByIdAsync(courseId);
            if (course == null || !course.IsDeleted)
            {
                return Results.Ok(ApiResponse.Fail(
                                       HttpStatusCode.NotFound,
                                                          $"Khóa học không được tìm thấy hoặc chưa đánh dấu xóa"));
            }
            else if (course.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                                       HttpStatusCode.Forbidden,
                                                          $"Bạn không được phép thực hiện yêu cầu này"));
            }

            return await repository.DeleteCourseAsync(course.Id) ?
                Results.Ok(ApiResponse.Success("Khóa học đã được xóa thành công")) :
                Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Xóa khóa học thất bại."));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion
}