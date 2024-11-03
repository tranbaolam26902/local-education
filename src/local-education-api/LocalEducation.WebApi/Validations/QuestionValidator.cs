using FluentValidation;
using LocalEducation.WebApi.Models.QuestionModel;

namespace LocalEducation.WebApi.Validations;

public class QuestionValidator : AbstractValidator<QuestionEditModel>
{
	public QuestionValidator()
	{
		RuleFor(q => q.Content)
			.NotEmpty()
			.WithMessage("Đề bài không được để trống")
			.MaximumLength(2048)
			.WithMessage("Đề bài không được vượt quá 2048 ký tự");

		RuleFor(q => q.Url)
			.MaximumLength(512)
			.WithMessage("Đường dẫn ảnh không được vượt quá 512 ký tự");

		RuleFor(q => q.Index)
			.NotNull()
			.WithMessage("Câu không được để trống");

		RuleFor(q => q.IndexCorrect)
			.NotNull()
			.WithMessage("Đáp án không được để trống");

	}
}