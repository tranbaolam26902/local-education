using LocalEducation.Core.Entities;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LocalEducation.Services.EducationRepositories;

public class SlideRepository : ISlideRepository
{
	private readonly LocalEducationDbContext _context;

	public SlideRepository(LocalEducationDbContext context)
	{
		_context = context;
	}

	#region Get data

	public async Task<IList<Slide>> GetListSlideByLessonIdAsync(Guid lessonId, bool isManager = false, CancellationToken cancellationToken = default)
	{
		return isManager
			? await _context.Set<Slide>()
				.Where(s => s.LessonId == lessonId)
				.ToListAsync(cancellationToken)
			: (IList<Slide>)await _context.Set<Slide>()
			.Include(s => s.Lesson)
			.Where(s => s.IsPublished && s.Lesson.IsPublished &&
						s.LessonId == lessonId)
			.ToListAsync(cancellationToken);
	}

	public async Task<Slide> GetSlideByIdAsync(Guid slideId, bool getAll = false, CancellationToken cancellationToken = default)
	{
		return getAll
			? await _context.Set<Slide>()
				.Include(s => s.Lesson)
				.FirstOrDefaultAsync(s => s.Id == slideId, cancellationToken)
			: await _context.Set<Slide>()
			.FirstOrDefaultAsync(s => s.Id == slideId, cancellationToken);
	}

	#endregion

	#region Add, update or delete

	public async Task<Slide> AddOrUpdateSlideAsync(Slide slide, CancellationToken cancellationToken = default)
	{
		List<Slide> listSlides = _context.Set<Slide>().Where(l => l.LessonId == slide.LessonId).ToList();

		// check if index = 0, then set index = max index + 1
		if (slide.Index == 0)
		{
			slide.Index = listSlides.Count == 0 ? 1 : listSlides.Max(l => l.Index) + 1;
		}

		if (slide.Id == Guid.Empty)
		{
			slide.CreatedDate = DateTime.Now;

			_context.Set<Slide>().Add(slide);
		}
		else
		{
			_context.Set<Slide>().Update(slide);
		}

		await _context.SaveChangesAsync(cancellationToken);

		return slide;
	}

	public async Task<bool> TogglePublicStatusAsync(Guid slideId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Slide>()
			.Where(s => s.Id == slideId)
			.ExecuteUpdateAsync(t => t.SetProperty(s => s.IsPublished, x => !x.IsPublished), cancellationToken) > 0;
	}

	public async Task<bool> DeleteSlideAsync(Guid slideId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Slide>()
			.Where(s => s.Id == slideId)
			.ExecuteDeleteAsync(cancellationToken) > 0;
	}

	#endregion
}