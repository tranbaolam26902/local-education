using FluentValidation;
using LocalEducation.WebApi.Models.FileModel;

namespace LocalEducation.WebApi.Validations;

public class FileValidator : AbstractValidator<FileEditModel>
{
	public FileValidator()
	{
		RuleFor(s => s.Name)
			.NotEmpty()
			.WithMessage("Tên không được để trống");
	}
}