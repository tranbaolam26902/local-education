using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Services.Extensions;
using Microsoft.EntityFrameworkCore;

namespace LocalEducation.Services.EducationRepositories;

public class LessonRepository : ILessonRepository
{
	private readonly LocalEducationDbContext _context;

	public LessonRepository(LocalEducationDbContext context)
	{
		_context = context;
	}

	#region Get data

	public async Task<IList<LessonItem>> GetLessonsByCourseIdAsync(Guid courseId, bool getAll = false, bool isManager = false, CancellationToken cancellationToken = default)
	{
		IQueryable<Lesson> lessons = _context.Set<Lesson>()
			.WhereIf(!isManager, l => l.IsPublished);

		return getAll
			? await lessons
				.Include(l => l.Slides)
				.Where(l => l.CourseId == courseId)
				.OrderBy(s => s.Index)
				.Select(s => new LessonItem(s))
				.ToListAsync(cancellationToken)
			: (IList<LessonItem>)await lessons
			.Where(l => l.CourseId == courseId)
			.OrderBy(s => s.Index)
			.Select(s => new LessonItem(s))
			.ToListAsync(cancellationToken);
	}

	public Task<Lesson> GetLessonByIdAsync(Guid lessonId, bool getAll = false, CancellationToken cancellationToken = default)
	{
		DbSet<Lesson> lesson = _context.Set<Lesson>();

		return getAll
			? lesson
				.Include(l => l.Slides)
				.Include(l => l.Course)

				.FirstOrDefaultAsync(s => s.Id == lessonId, cancellationToken)
			: lesson
			.FirstOrDefaultAsync(s => s.Id == lessonId, cancellationToken);
	}

	#endregion

	#region Add, Update & Delete

	public async Task<Lesson> AddOrUpdateLessonAsync(Lesson lesson, CancellationToken cancellationToken = default)
	{
		lesson.UrlSlug = lesson.Title.GenerateSlug();

		List<Lesson> listLesson = _context.Set<Lesson>().Where(l => l.CourseId == lesson.CourseId).ToList();

		// check if index = 0, then set index = max index + 1
		if (lesson.Index == 0)
		{
			lesson.Index = listLesson.Count == 0 ? 1 : listLesson.Max(l => l.Index) + 1;
		}

		if (lesson.Id == Guid.Empty)
		{
			lesson.CreatedDate = DateTime.Now;

			_context.Set<Lesson>().Add(lesson);
		}
		else
		{
			_context.Set<Lesson>().Update(lesson);
		}

		await _context.SaveChangesAsync(cancellationToken);

		return lesson;
	}

	public async Task<bool> TogglePublicStatusAsync(Guid lessonId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Lesson>()
			.Where(s => s.Id == lessonId)
			.ExecuteUpdateAsync(t => t.SetProperty(s => s.IsPublished, x => !x.IsPublished), cancellationToken) > 0;
	}

	public async Task<bool> DeleteLessonAsync(Guid lessonId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Lesson>()
			.Where(s => s.Id == lessonId)
			.ExecuteDeleteAsync(cancellationToken) > 0;
	}

	#endregion
}