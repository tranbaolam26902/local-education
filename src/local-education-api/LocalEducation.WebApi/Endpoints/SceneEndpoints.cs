using LocalEducation.Core.Entities;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.WebApi.Models;
using LocalEducation.WebApi.Models.AudioModel;
using LocalEducation.WebApi.Models.SceneModel;
using LocalEducation.WebApi.Utilities;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace LocalEducation.WebApi.Endpoints;

public static class SceneEndpoints
{
	public static WebApplication MapSceneEndpoints(
		this WebApplication app)
	{
		RouteGroupBuilder builder = app.MapGroup("/api/scenes");

		#region Get method

		builder.MapGet("/", GetScenesByTour)
			.WithName("GetScenesByTour")
			.Produces<ApiResponse<IList<SceneDto>>>();

		#endregion

		#region Put method

		builder.MapPut("/{sceneId:guid}/audio", UpdateAudioScene)
			.WithName("UpdateAudioScene")
			.RequireAuthorization("Manager")
			.Produces<ApiResponse<SceneDto>>();

		#endregion

		return app;
	}

	#region Get function

	private static async Task<IResult> GetScenesByTour(
		[AsParameters] SceneFilterModel model,
		[FromServices] ITourRepository repository,
		[FromServices] IMapper mapper)
	{
		Tour tour = await repository.GetTourBySlugAsync(model.TourSlug);
		if (tour == null)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, $"Tour is not found with slug: '{model.TourSlug}'"));
		}

		IList<Scene> scenes = await repository.GetSceneByQueryAsync(tour, model.Keyword);

		IList<SceneDto> scenesDto = mapper.Map<IList<SceneDto>>(scenes);

		return Results.Ok(ApiResponse.Success(scenesDto));
	}

	#endregion

	#region Put function

	private static async Task<IResult> UpdateAudioScene(
		HttpContext context,
		[FromRoute] Guid sceneId,
		[FromBody] AudioEditModel model,
		[FromServices] ITourRepository repository,
		[FromServices] IMapper mapper)
	{
		try
		{
			Scene scene = await repository.GetSceneByIdAsync(sceneId);

			if (scene == null)
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, $"Scene không tồn tại"));
			}
			else if (scene.Tour.UserId != context.GetCurrentUser().Id)
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.Forbidden,
					$"Bạn không được phép thực hiện yêu cầu này"));
			}

			Audio audio = mapper.Map<Audio>(model);

			scene.Audio = audio;

			await repository.UpdateSceneAsync(scene);

			SceneDto sceneDto = mapper.Map<SceneDto>(scene);

			return Results.Ok(ApiResponse.Success(sceneDto));
		}
		catch (Exception e)
		{
			return Results.Ok(ApiResponse.Fail(HttpStatusCode.InternalServerError, e.Message));
		}
	}

	#endregion
}