using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Models.AtlasModel;
using LocalEducation.WebApi.Models.SceneModel;
using LocalEducation.WebApi.Models.TourModel;
using LocalEducation.Services.Extensions;
using LocalEducation.WebApi.Utilities;
using LocalEducation.Core.Collections;
using LocalEducation.WebApi.Filters;
using LocalEducation.WebApi.Models;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;
using Microsoft.AspNetCore.Mvc;
using LocalEducation.Core.Dto;
using MapsterMapper;
using System.Net;

namespace LocalEducation.WebApi.Endpoints;

public static class TourEndpoints
{
    public static WebApplication MapTourEndpoints(this WebApplication app)
    {
        var builder = app.MapGroup("/api/tours");

        #region GET Method

        builder.MapGet("/", GetPagedTours)
            .WithName("GetPagedTours")
            .Produces<ApiResponse<PaginationResult<TourItem>>>();

        builder.MapGet("/byUser", GetPagedToursByUser)
            .WithName("GetPagedToursByUser")
            .RequireAuthorization()
            .Produces<ApiResponse<PaginationResult<TourItem>>>();

        builder.MapGet("/bySlug/{slug:regex(^[a-z0-9_-]+$)}", GetTourBySlug)
            .WithName("GetTourBySlug")
            .AllowAnonymous()
            .Produces<ApiResponse<TourDto>>();

        builder.MapGet("/togglePublish/{tourId:guid}", TogglePublishStatus)
            .WithName("TogglePublishStatus")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        #region POST Method

        builder.MapPost("/", CreateTour)
            .WithName("CreateTour")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<TourEditModel>>()
            .Produces<ApiResponse<TourItem>>();

        builder.MapPost("/scenesTour/{tourId:guid}", AddScenesTour)
            .WithName("AddScenesTour")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<TourDto>>();

        #endregion

        #region PUT Method

        builder.MapPut("/{tourId}", UpdateTour)
            .WithName("UpdateTour")
            .RequireAuthorization("Manager")
            .AddEndpointFilter<ValidatorFilter<TourEditModel>>()
            .Produces<ApiResponse<TourItem>>();

        builder.MapPut("/atlasTour/{tourId:guid}", UpdateAtlasTour)
            .WithName("UpdateAtlasTour")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<AtlasDto>>();
        #endregion

        #region Delete Method

        builder.MapDelete("/toggleDelete/{tourId:guid}", ToggleDeleteStatus)
            .WithName("ToggleTourDeleteStatus")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        builder.MapDelete("/delete/{tourId:guid}", DeleteTour)
            .WithName("DeleteTour")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        builder.MapDelete("/emptyRecycleBin", EmptyRecycleBin)
            .WithName("EmptyTourRecycleBin")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse>();

        #endregion

        return app;
    }

    #region GET Function

    private static async Task<IResult> GetPagedTours(
        [AsParameters] TourFilterModel model,
        [FromServices] ITourRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var condition = mapper.Map<TourQuery>(model);

            condition.IsPublished = true;

            var pagedTours = await repo.GetPagedToursAsync(condition, model);

            var paginationResult = new PaginationResult<TourItem>(pagedTours);

            return Results.Ok(ApiResponse.Success(paginationResult));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetPagedToursByUser(
        HttpContext context,
        [AsParameters] TourFilterByUser model,
        [FromServices] ITourRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var condition = mapper.Map<TourQuery>(model);
            var user = context.GetCurrentUser();

            var pagedTours = await repo.GetPagedToursAsync(condition, model, user.Id);

            var paginationResult = new PaginationResult<TourItem>(pagedTours);

            return Results.Ok(ApiResponse.Success(paginationResult));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetTourBySlug(
        HttpContext context,
        [FromRoute] string slug,
        [FromServices] ITourRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var tour = await repo.GetTourBySlugAsync(slug);

            if (tour == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    $"Tour không được tìm thấy với đường dẫn: '{slug}'"));
            }

            var user = context?.GetCurrentUser();
            if (user != null && tour.UserId != user.Id && !tour.IsPublished)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable,
                    $"Tour đã được chuyển thành chế độ riêng tư"));
            }

            if (context != null)
            {
                var cookie = context.Request.Cookies;

                if (!cookie.ContainsKey($"viewed_{tour.Id}"))
                {
                    await repo.IncreaseViewAsync(tour.Id);

                    var option = new CookieOptions()
                    {
                        Expires = DateTime.Now.AddMinutes(5)
                    };

                    context.Response.Cookies.Append($"viewed_{tour.Id}", "true", option);
                    tour.ViewCount += 1;
                }
            }

            var tourDto = mapper.Map<TourDto>(tour);

            return Results.Ok(ApiResponse.Success(tourDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region POST Function

    private static async Task<IResult> CreateTour(
        HttpContext context,
        [FromBody] TourEditModel model,
        [FromServices] ITourRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var user = context.GetCurrentUser();

            if (string.IsNullOrWhiteSpace(model.Title.GenerateSlug()))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable, "Tên tour không hợp lệ"));
            }

            if (await repo.IsExistTourSlugAsync(Guid.Empty, model.Title.GenerateSlug()))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotAcceptable,
                    $"Tour đã được tạo với tên: '{model.Title}'"));
            }

            var tour = mapper.Map<Tour>(model);
            tour.UserId = user.Id;

            await repo.AddOrUpdateTourAsync(tour);

            var result = mapper.Map<TourItem>(tour);
            result.Username = user.Name ?? "";

            return Results.Ok(ApiResponse.Success(result, HttpStatusCode.Created));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> UpdateAtlasTour(
        HttpContext context,
        [FromRoute] Guid tourId,
        [FromBody] AtlasEditModel model,
        [FromServices] ITourRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var check = await repository.GetTourByIdAsync(tourId);
            if (check == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    $"Tour không được tìm thấy với mã: '{tourId}'"));
            }
            else if (check.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden, "Bạn không được phép thực hiện yêu cầu này"));
            }

            var atlas = mapper.Map<Atlas>(model);

            atlas.Id = tourId;
            var result = await repository.AddOrUpdateAtlasAsync(atlas);

            return Results.Ok(ApiResponse.Success(mapper.Map<AtlasDto>(result)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> AddScenesTour(
        HttpContext context,
        [FromRoute] Guid tourId,
        [FromBody] IList<SceneEditModel> models,
        [FromServices] ITourRepository repository,
        [FromServices] ILessonRepository lessonRepository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var tourCheck = await repository.GetTourByIdAsync(tourId);
            if (tourCheck == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                    $"Tour không được tìm thấy với mã: '{tourId}'"));
            }
            else if (tourCheck.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden, "Bạn không được phép thực hiện yêu cầu này"));
            }

            var newScenes = mapper.Map<IList<Scene>>(models);
           
            var listLessonsId = newScenes
                .SelectMany(scene => scene.InfoHotspots, (_, hotspot) => hotspot.LessonId)
                .Distinct()
                .ToList();


            foreach (var lessonId in listLessonsId)
            {
                var lesson = await lessonRepository.GetLessonByIdAsync(lessonId);
                if (lesson == null)
                {
                    return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound,
                                               $"Bài học không được tìm thấy"));
                }

                lesson.TourSlug = tourCheck.UrlSlug;
                lesson.IsVr = true;

                await lessonRepository.AddOrUpdateLessonAsync(lesson);
            }


            var tour = await repository.AddOrUpdatesSceneAsync(tourId, newScenes);

            return Results.Ok(ApiResponse.Success(mapper.Map<TourDto>(tour)));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region PUT Function

    private static async Task<IResult> UpdateTour(
        HttpContext context,
        [FromRoute] Guid tourId,
        [FromBody] TourEditModel model,
        [FromServices] ITourRepository repo,
        [FromServices] IMapper mapper)
    {
        try
        {
            var tour = await repo.GetTourByIdAsync(tourId);

            if (tour == null)
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, $"Tour không được tìm thấy với mã: '{tourId}'"));
            }
            else if (tour.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden,
                    $"Bạn không được phép thực hiện yêu cầu này"));
            }

            if (await repo.IsExistTourSlugAsync(tour.Id, model.Title.GenerateSlug()))
            {
                return Results.Ok(ApiResponse.Fail(HttpStatusCode.Conflict, $"Tour đã được tạo với tên: '{model.Title}'"));
            }

            tour.Title = model.Title;

            await repo.AddOrUpdateTourAsync(tour);

            var tourDto = mapper.Map<TourItem>(tour);

            return Results.Ok(ApiResponse.Success(tourDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Tour Handlers

    private static async Task<IResult> TogglePublishStatus(
        HttpContext context,
        [FromRoute] Guid tourId,
        [FromServices] ITourRepository repository)
    {
        try
        {
            var tour = await repository.GetTourByIdAsync(tourId);

            if (tour == null)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    $"Tour không được tìm thấy hoặc đã bị xóa"));
            }
            else if (tour.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden,
                    $"Bạn không được phép thực hiện yêu cầu này"));
            }

            if (await repository.TogglePublicStatusAsync(tourId))
            {
                if (tour.IsPublished)
                {
                    return Results.Ok(ApiResponse.Success("Tour đã được chuyển sang riêng tư"));
                }
                return Results.Ok(ApiResponse.Success("Tour đã được chuyển sang công khai"));
            }

            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Chuyển đổi trạng thái thất bại"));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> ToggleDeleteStatus(
        HttpContext context,
        [FromRoute] Guid tourId,
        [FromServices] ITourRepository repository)
    {
        try
        {
            var tour = await repository.GetTourByIdAsync(tourId, true);
            if (tour == null)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    $"Tour không được tìm thấy hoặc đã bị xóa"));
            }
            else if (tour.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden,
                    $"Bạn không được phép thực hiện yêu cầu này"));
            }

            if (await repository.ToggleDeleteStatusAsync(tourId))
            {
                if (tour.IsDeleted)
                {
                    return Results.Ok(ApiResponse.Success("Tour đã được khôi phục từ thùng rác"));
                }
                return Results.Ok(ApiResponse.Success("Tour đã được chuyển vào thùng rác"));
            }

            return Results.Ok(ApiResponse.Success("Chuyển đổi trạng thái thất bại"));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion

    #region Delete function

    private static async Task<IResult> DeleteTour(
        HttpContext context,
        [FromRoute] Guid tourId,
        [FromServices] ITourRepository repository)
    {
        try
        {
            var tour = await repository.GetTourIsDeletedAsync(tourId);
            if (tour == null)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.NotFound,
                    $"Tour không tồn tại hoặc chưa được được chuyển vào thùng rác"));
            }
            else if (tour.UserId != context.GetCurrentUser().Id)
            {
                return Results.Ok(ApiResponse.Fail(
                    HttpStatusCode.Forbidden,
                    $"Bạn không được phép thực hiện yêu cầu này"));
            }

            return await repository.DeleteTourAsync(tourId) ?
                Results.Ok(ApiResponse.Success("Tour đã được xóa thành công")) :
                Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Xóa tour thất bại."));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> EmptyRecycleBin(
        HttpContext context,
        [FromServices] ITourRepository repository)
    {
        try
        {
            var identity = context.GetCurrentUser();

            return await repository.EmptyRecycleBinAsync(identity.Id) ?
                Results.Ok(ApiResponse.Success("Đã dọn sạch thùng rác")) :
                Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, "Dọn thùng rác thất bại"));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    #endregion
}