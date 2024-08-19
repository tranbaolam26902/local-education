using System.Net;
using MapsterMapper;
using System.Globalization;
using LocalEducation.Core.Dto;
using Microsoft.AspNetCore.Mvc;
using LocalEducation.Core.Queries;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.DashboardModel;
using LocalEducation.Services.EducationRepositories.Interfaces;

namespace LocalEducation.WebApi.Endpoints;

public static class DashboardEndpoints
{
    public static WebApplication MapDashboardEndpoints(
        this WebApplication app)
    {
        var builder = app.MapGroup("/api/dashboard");

        #region Get method

        builder.MapGet("/QuantityStatistics", GetTotalQuantityStatistics)
            .WithName("GetTotalQuantityStatistics")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<QuantityStatisticsDto>>();
        
        builder.MapPost("/CourseChartStatistics", GetCourseChartStatistics)
            .WithName("GetCourseChartStatistics")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<CourseChartItem>>();

        builder.MapPost("/TourChartStatistics", GetTourChartStatistics)
            .WithName("TourChartStatistics")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<TourChartItem>>();

        builder.MapPost("/FileChartStatistics", GetFileChartStatistics)
            .WithName("GetFileChartStatistics")
            .RequireAuthorization("Manager")
            .Produces<ApiResponse<FileChartItem>>();

        #endregion

        return app;
    }

    #region Get function

    private static async Task<IResult> GetTotalQuantityStatistics(
        [FromServices] IDashboardRepository repository,
        [FromServices] IMapper mapper)
    {
        try
        {
            var quantityStatistics = await repository.GetTotalQuantityStatisticsAsync();

            var statisticsDto = mapper.Map<QuantityStatisticsDto>(quantityStatistics);


            return Results.Ok(ApiResponse.Success(statisticsDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetCourseChartStatistics(
        [FromBody] DashboardFilterModel query,
        [FromServices] IDashboardRepository repository)
    {
        try
        {
            var fotmatDate = "yyyy-MM-dd";

            var startDate = DateTime.ParseExact(query.StartDate, fotmatDate, CultureInfo.InvariantCulture);
            var endDate = DateTime.ParseExact(query.EndDate, fotmatDate, CultureInfo.InvariantCulture);

            var condition = new DashboardQuery
            {
                StartDate = startDate == DateTime.MinValue ? DateTime.Now.AddMonths(-1) : startDate,
                EndDate = startDate == DateTime.MinValue ? DateTime.Now : endDate
            };

            var statisticsDto = await repository.GetCourseChartStatisticsAsync(condition);

            return Results.Ok(ApiResponse.Success(statisticsDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetTourChartStatistics(
        [FromBody] DashboardFilterModel query,
        [FromServices] IDashboardRepository repository)
    {
        try
        {
            var fotmatDate = "yyyy-MM-dd";

            var startDate = DateTime.ParseExact(query.StartDate, fotmatDate, CultureInfo.InvariantCulture);
            var endDate = DateTime.ParseExact(query.EndDate, fotmatDate, CultureInfo.InvariantCulture);

            var condition = new DashboardQuery
            {
                StartDate = startDate == DateTime.MinValue ? DateTime.Now.AddMonths(-1) : startDate,
                EndDate = startDate == DateTime.MinValue ? DateTime.Now : endDate
            };

            var statisticsDto = await repository.GetTourChartStatisticsAsync(condition);

            return Results.Ok(ApiResponse.Success(statisticsDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }

    private static async Task<IResult> GetFileChartStatistics(
        [FromBody] DashboardFilterModel query,
        [FromServices] IDashboardRepository repository)
    {
        try
        {
            var fotmatDate = "yyyy-MM-dd";

            var startDate = DateTime.ParseExact(query.StartDate, fotmatDate, CultureInfo.InvariantCulture);
            var endDate = DateTime.ParseExact(query.EndDate, fotmatDate, CultureInfo.InvariantCulture);

            var condition = new DashboardQuery
            {
                StartDate = startDate == DateTime.MinValue ? DateTime.Now.AddMonths(-1) : startDate,
                EndDate = startDate == DateTime.MinValue ? DateTime.Now : endDate
            };

            var statisticsDto = await repository.GetFileChartStatisticsAsync(condition);


            return Results.Ok(ApiResponse.Success(statisticsDto));
        }
        catch (Exception e)
        {
            return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
        }
    }
    #endregion
}