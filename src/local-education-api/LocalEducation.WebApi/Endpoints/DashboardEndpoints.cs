using LocalEducation.Core.Dto;
using LocalEducation.Core.Queries;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.DashboardModel;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Net;

namespace LocalEducation.WebApi.Endpoints;

public static class DashboardEndpoints
{
	public static WebApplication MapDashboardEndpoints(
		this WebApplication app)
	{
		RouteGroupBuilder builder = app.MapGroup("/api/dashboard");

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
			Core.Constants.QuantityStatistics quantityStatistics = await repository.GetTotalQuantityStatisticsAsync();

			QuantityStatisticsDto statisticsDto = mapper.Map<QuantityStatisticsDto>(quantityStatistics);


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
			string fotmatDate = "yyyy-MM-dd";

			DateTime startDate = DateTime.ParseExact(query.StartDate, fotmatDate, CultureInfo.InvariantCulture);
			DateTime endDate = DateTime.ParseExact(query.EndDate, fotmatDate, CultureInfo.InvariantCulture);

			DashboardQuery condition = new()
			{
				StartDate = startDate == DateTime.MinValue ? DateTime.Now.AddMonths(-1) : startDate,
				EndDate = startDate == DateTime.MinValue ? DateTime.Now : endDate
			};

			CourseChartItem statisticsDto = await repository.GetCourseChartStatisticsAsync(condition);

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
			string fotmatDate = "yyyy-MM-dd";

			DateTime startDate = DateTime.ParseExact(query.StartDate, fotmatDate, CultureInfo.InvariantCulture);
			DateTime endDate = DateTime.ParseExact(query.EndDate, fotmatDate, CultureInfo.InvariantCulture);

			DashboardQuery condition = new()
			{
				StartDate = startDate == DateTime.MinValue ? DateTime.Now.AddMonths(-1) : startDate,
				EndDate = startDate == DateTime.MinValue ? DateTime.Now : endDate
			};

			TourChartItem statisticsDto = await repository.GetTourChartStatisticsAsync(condition);

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
			string fotmatDate = "yyyy-MM-dd";

			DateTime startDate = DateTime.ParseExact(query.StartDate, fotmatDate, CultureInfo.InvariantCulture);
			DateTime endDate = DateTime.ParseExact(query.EndDate, fotmatDate, CultureInfo.InvariantCulture);

			DashboardQuery condition = new()
			{
				StartDate = startDate == DateTime.MinValue ? DateTime.Now.AddMonths(-1) : startDate,
				EndDate = startDate == DateTime.MinValue ? DateTime.Now : endDate
			};

			FileChartItem statisticsDto = await repository.GetFileChartStatisticsAsync(condition);


			return Results.Ok(ApiResponse.Success(statisticsDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.BadRequest, e.Message));
		}
	}
	#endregion
}