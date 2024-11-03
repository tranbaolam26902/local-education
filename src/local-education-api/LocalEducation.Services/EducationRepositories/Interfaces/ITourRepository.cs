using LocalEducation.Core.Contracts;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface ITourRepository
{
	#region Get Data

	Task<Tour> GetTourByIdAsync(Guid tourId, bool getAll = false, CancellationToken cancellationToken = default);

	Task<Tour> GetTourBySlugAsync(string slug, CancellationToken cancellationToken = default);

	Task<Scene> GetSceneByIdAsync(Guid sceneId, CancellationToken cancellationToken = default);

	Task<Tour> GetTourIsDeletedAsync(Guid tourId, CancellationToken cancellationToken = default);

	Task<Scene> UpdateSceneAsync(Scene scene, CancellationToken cancellationToken = default);


	Task<IList<Scene>> GetSceneByQueryAsync(Tour tour, string keyword, CancellationToken cancellationToken = default);

	Task<Tour> GetCachedTourBySlugAsync(
			string slug, CancellationToken cancellationToken = default);

	Task<IPagedList<TourItem>> GetPagedToursAsync(
		TourQuery condition,
		IPagingParams pagingParams,
		Guid? userId = null,
		CancellationToken cancellationToken = default);

	Task<bool> IsExistTourSlugAsync(Guid tourId, string slug, CancellationToken cancellationToken = default);



	#endregion

	#region Add, Update & Delete

	Task<Tour> AddOrUpdateTourAsync(Tour tour, CancellationToken cancellationToken = default);

	Task<Atlas> AddOrUpdateAtlasAsync(Atlas atlas, CancellationToken cancellationToken = default);

	Task<Tour> AddOrUpdatesSceneAsync(Guid tourId, IList<Scene> scenes, CancellationToken cancellationToken = default);

	Task<Scene> SetImageSceneAsync(Scene scene, string urlImage, string urlPreview,
		CancellationToken cancellationToken = default);

	Task<bool> TogglePublicStatusAsync(Guid tourId, CancellationToken cancellationToken = default);

	Task<bool> ToggleDeleteStatusAsync(Guid tourId, CancellationToken cancellationToken = default);

	Task<bool> DeleteTourAsync(Guid tourId, CancellationToken cancellationToken = default);

	Task<bool> EmptyRecycleBinAsync(Guid userId, CancellationToken cancellationToken = default);

	Task IncreaseViewAsync(Guid tourId, CancellationToken cancellationToken = default);

	#endregion
}