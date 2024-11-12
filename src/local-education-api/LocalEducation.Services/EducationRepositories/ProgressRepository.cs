using LocalEducation.Core.Constants;
using LocalEducation.Core.Contracts;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Services.Extensions;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace LocalEducation.Services.EducationRepositories;

public class ProgressRepository : IProgressRepository
{
	private readonly LocalEducationDbContext _context;

	public ProgressRepository(LocalEducationDbContext context)
	{
		_context = context;
	}

	#region Get data

	public async Task<IPagedList<T>> GetPagedProgressAsync<T>(string keyword, Guid userId, IPagingParams pagingParams, Func<IQueryable<Progress>, IQueryable<T>> mapper,
		CancellationToken cancellationToken = default)
	{
		IQueryable<Progress> progresses = _context.Set<Progress>()
			.Include(s => s.Course)
			.Where(p => p.UserId == userId)
			.WhereIf(!string.IsNullOrWhiteSpace(keyword), p =>
				p.Course.Description.ToLower().Contains(keyword.ToLower()) ||
				p.Course.Title.ToLower().Contains(keyword.ToLower()) ||
				p.Course.UrlSlug.ToLower().Contains(keyword.ToLower()));

		IQueryable<T> projectedProgresses = mapper(progresses);

		return await projectedProgresses.ToPagedListAsync(pagingParams, cancellationToken);
	}

	public async Task<Progress> GetProgressByIdAsync(Guid userId, Guid progressId, CancellationToken cancellationToken = default)
	{
		return await _context.Progresses
			.Include(p => p.Course)
			.Include(p => p.User)
			.FirstOrDefaultAsync(p =>
				p.Id == progressId &&
				p.UserId == userId, cancellationToken);
	}

	public async Task<Progress> GetProgressByUserIdAsync(Guid userId, Guid courseId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Progress>()
			.Include(p => p.Course)
			.Include(p => p.User)
			.FirstOrDefaultAsync(p => p.UserId == userId && p.CourseId == courseId, cancellationToken);
	}

	public async Task<double> GetProgressPercentageAsync(Guid progressId, CancellationToken cancellationToken = default)
	{
		Progress progress = await _context.Set<Progress>()
			.FirstOrDefaultAsync(p => p.Id == progressId, cancellationToken);

		if (progress == null)
		{
			return 0.0;
		}

		IList<SlideProgress> slides = JsonConvert.DeserializeObject<IList<SlideProgress>>(progress.Slides) ?? [];

		if (slides.Count == 0)
		{
			return 0.0;
		}

		List<Guid> completedSlides = slides.Select(s => s.Id).ToList();

		List<Slide> totalSlides = await _context.Set<Slide>()
			.Include(s => s.Lesson)
			.Where(s => s.Lesson.CourseId == progress.CourseId).ToListAsync(cancellationToken);

		List<Guid> slideUnPublished = totalSlides.Where(s => !s.IsPublished).Select(s => s.Id).ToList();

		completedSlides = completedSlides.Except(slideUnPublished).ToList();

		IEnumerable<Guid> duplicateIds = completedSlides.Intersect(totalSlides.Select(s => s.Id));

		int totalCount = totalSlides.Count - slideUnPublished.Count;

		if (totalCount == 0)
		{
			return 0.0;
		}

		double percentage = (double)duplicateIds.Count() / totalCount;

		return Math.Round(percentage * 100, 2);
	}

	#endregion

	#region Add, update, or delete

	public async Task<ProgressStatus> SetCompletedSlideAsync(Guid progressId, Slide slide, ResultDetail result, CancellationToken cancellation = default)
	{
		Progress progress = _context.Set<Progress>()
			.FirstOrDefault(p => p.Id == progressId);

		if (progress != null)
		{
			IList<SlideProgress> oldProgress = JsonConvert.DeserializeObject<IList<SlideProgress>>(progress.Slides) ?? [];
			IList<AnswerItem> correctAnswers = JsonConvert.DeserializeObject<IList<AnswerItem>>(result.CorrectAnswer ?? "") ?? [];

			if (oldProgress.Any(s => s.Id == slide.Id && s.IsCompleted))
			{
				SlideProgress inProgress = oldProgress.FirstOrDefault(s => s.Id == slide.Id);

				if (inProgress != null)
				{
					inProgress.IsCompleted = true;
					inProgress.ResultId = result?.Id ?? Guid.Empty;
					inProgress.PointCorrect = correctAnswers.Count;

					progress.Slides = JsonConvert.SerializeObject(oldProgress);

					_context.Entry(progress).State = EntityState.Modified;
					await _context.SaveChangesAsync(cancellation);
				}

				return ProgressStatus.InProgress;
			}


			oldProgress.Add(new SlideProgress()
			{
				Id = slide.Id,
				SlideIndex = slide.Index,
				LessonId = slide.LessonId,
				ResultId = result?.Id ?? Guid.Empty,
				PointCorrect = correctAnswers.Count,
				IsCompleted = true
			});


			progress.Slides = JsonConvert.SerializeObject(oldProgress);

			_context.Entry(progress).State = EntityState.Modified;

			await _context.SaveChangesAsync(cancellation);
			return ProgressStatus.Completed;
		}
		return ProgressStatus.NotStarted;
	}

	#endregion
}