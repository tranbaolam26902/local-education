using FluentValidation;
using LocalEducation.WebApi.Models.SlideModel;

namespace LocalEducation.WebApi.Validations;

public class SlideValidator : AbstractValidator<SlideEditModel>
{
	public SlideValidator()
	{
		RuleFor(s => s.Title)
			.NotEmpty()
			.WithMessage("Tên không được để trống")
			.MaximumLength(512)
			.WithMessage("Không được vượt quá 512 ký tự");

		RuleFor(s => s.Content)
			.NotEmpty()
			.WithMessage("Nội dung không được để trống");

		RuleFor(s => s.Index)
			.NotNull()
			.WithMessage("Thứ tự không được để trống");
	}
}