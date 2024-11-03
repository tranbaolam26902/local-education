using LocalEducation.Core.Entities;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface ISlideRepository
{
	#region Get data

	Task<IList<Slide>> GetListSlideByLessonIdAsync(Guid lessonId, bool isManager = false, CancellationToken cancellationToken = default);

	Task<Slide> GetSlideByIdAsync(Guid slideId, bool getAll = false, CancellationToken cancellationToken = default);


	#endregion

	#region Add, Update & Delete

	Task<Slide> AddOrUpdateSlideAsync(Slide slide, CancellationToken cancellationToken = default);


	Task<bool> DeleteSlideAsync(Guid slideId, CancellationToken cancellationToken = default);

	Task<bool> TogglePublicStatusAsync(Guid slideId, CancellationToken cancellationToken = default);

	#endregion
}