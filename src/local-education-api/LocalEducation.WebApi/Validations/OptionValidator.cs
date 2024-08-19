using FluentValidation;
using LocalEducation.WebApi.Models.QuestionModel;

namespace LocalEducation.WebApi.Validations;

public class OptionValidator : AbstractValidator<OptionEditModel>
{
    public OptionValidator()
    {
        RuleFor(o => o.Content)
            .NotEmpty()
            .WithMessage("Nội dung đáp án không được để trống")
            .MaximumLength(1024)
            .WithMessage("Nội dung đáp án không được vượt quá 1024 ký tự");

        RuleFor(o => o.Index)
            .NotEmpty()
            .WithMessage("Index không được để trống");
    }
}