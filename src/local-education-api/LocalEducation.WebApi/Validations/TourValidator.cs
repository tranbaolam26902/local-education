using FluentValidation;
using LocalEducation.WebApi.Models.TourModel;

namespace LocalEducation.WebApi.Validations;

public class TourValidator : AbstractValidator<TourEditModel>
{
	public TourValidator()
	{
		RuleFor(s => s.Title)
			.NotEmpty()
			.WithMessage("Tên không được để trống")
			.MaximumLength(512)
			.WithMessage("Không được vượt quá 512 ký tự");
	}
}