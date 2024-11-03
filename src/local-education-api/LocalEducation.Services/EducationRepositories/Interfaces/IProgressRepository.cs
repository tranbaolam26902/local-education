using LocalEducation.Core.Constants;
using LocalEducation.Core.Contracts;
using LocalEducation.Core.Entities;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface IProgressRepository
{
	#region Get data

	Task<Progress> GetProgressByIdAsync(Guid userId, Guid progressId, CancellationToken cancellationToken = default);

	Task<IPagedList<T>> GetPagedProgressAsync<T>(
		string keyword,
		Guid userId,
		IPagingParams pagingParams,
		Func<IQueryable<Progress>, IQueryable<T>> mapper,
		CancellationToken cancellationToken = default);

	Task<Progress> GetProgressByUserIdAsync(Guid userId, Guid courseId, CancellationToken cancellationToken = default);

	Task<double> GetProgressPercentageAsync(Guid progressId, CancellationToken cancellationToken = default);
	#endregion

	#region Add, update, or delete

	Task<ProgressStatus> SetCompletedSlideAsync(Guid progressId, Slide slide, ResultDetail result, CancellationToken cancellation = default);

	#endregion
}