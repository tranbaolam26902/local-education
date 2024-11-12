using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface IQuestionRepository
{
	Task<IList<Question>> GetQuestionBySlideIdAsync(Guid slideId, CancellationToken cancellationToken = default);

	Task<Slide> GetSlideByIdAsync(Guid slideId, CancellationToken cancellationToken = default);

	Task<IList<Question>> AddQuestionsAsync(Slide slide, IList<Question> questions, int minPoint, CancellationToken cancellationToken = default);

	Task<ResultDetail> CheckAnswerAsync(Guid userId, Guid slideId, IList<AnswerItem> answers, CancellationToken cancellation = default);

	Task<ResultDetail> GetResultDetailAsync(Guid userId, Guid slideId, CancellationToken cancellation = default);
}