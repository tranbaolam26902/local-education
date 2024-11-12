using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace LocalEducation.Services.EducationRepositories;

public class QuestionRepository : IQuestionRepository
{
	private readonly LocalEducationDbContext _context;

	public QuestionRepository(LocalEducationDbContext context)
	{
		this._context = context;
	}

	#region Get data

	public async Task<IList<Question>> GetQuestionBySlideIdAsync(Guid slideId, CancellationToken cancellationToken = default)
	{
		return await _context.Questions
			.Include(q => q.Options)
			.Where(q => q.SlideId == slideId)
			.ToListAsync(cancellationToken);
	}

	public async Task<Slide> GetSlideByIdAsync(Guid slideId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Slide>()
			.Include(s => s.Questions)
			.ThenInclude(s => s.Options)
			.FirstOrDefaultAsync(s => s.Id == slideId, cancellationToken);
	}

	public async Task<ResultDetail> GetResultDetailAsync(Guid userId, Guid slideId, CancellationToken cancellation = default)
	{
		return await _context.ResultDetails
			.FirstOrDefaultAsync(r =>
				r.UserId == userId &&
				r.SlideId == slideId, cancellation);
	}
	#endregion

	#region Update data

	public async Task<IList<Question>> AddQuestionsAsync(Slide slide, IList<Question> questions, int minPoint, CancellationToken cancellationToken = default)
	{
		List<Question> oldQuestion = _context.Questions
			.Where(s => s.SlideId == slide.Id)
			.ToList();

		foreach (Question question in oldQuestion)
		{
			slide.Questions.Remove(question);
		}

		if (questions == null || questions.Count == 0)
		{
			slide.IsTest = false;
			slide.MinPoint = 0;
			_context.Entry(slide).State = EntityState.Modified;
			await _context.SaveChangesAsync(cancellationToken);
			return null;
		}
		else
		{
			slide.IsTest = true;
		}

		foreach (Question item in questions)
		{
			item.CreatedDate = DateTime.Now;
			item.Point = item.Point == 0 ? 1 : item.Point;
			slide.Questions.Add(item);
		}

		slide.MinPoint = minPoint;
		_context.Entry(slide).State = EntityState.Modified;
		await _context.SaveChangesAsync(cancellationToken);

		return slide.Questions;
	}

	public async Task<ResultDetail> CheckAnswerAsync(Guid userId, Guid slideId, IList<AnswerItem> answers, CancellationToken cancellation = default)
	{
		IList<Question> question = await GetQuestionBySlideIdAsync(slideId, cancellation);

		if (question == null || question.Count == 0)
		{
			return null;
		}

		double point = 0.0;
		List<AnswerItem> correctAnswers = [];
		List<AnswerItem> wrongAnswers = [];
		foreach (Question item in question)
		{
			AnswerItem answer = answers.FirstOrDefault(a => a.QuestionIndex == item.Index);
			if (answer == null)
			{
				continue;
			}

			if (answer.OptionIndex == item.IndexCorrect)
			{
				point += item.Point;
				correctAnswers.Add(new AnswerItem
				{
					QuestionIndex = item.Index,
					OptionIndex = item.IndexCorrect
				});
			}
			else
			{
				wrongAnswers.Add(new AnswerItem
				{
					QuestionIndex = item.Index,
					OptionIndex = item.IndexCorrect
				});
			}
		}

		ResultDetail result = new()
		{
			CreatedDate = DateTime.Now,
			SlideId = slideId,
			Point = point,
			UserId = userId,
			Answer = JsonConvert.SerializeObject(wrongAnswers),
			CorrectAnswer = JsonConvert.SerializeObject(correctAnswers),
		};

		_context.ResultDetails.Add(result);
		await _context.SaveChangesAsync(cancellation);

		Slide slide = await GetSlideByIdAsync(slideId, cancellation);

		return result;
	}

	#endregion

}