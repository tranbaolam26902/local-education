using FluentValidation;
using LocalEducation.WebApi.Models.UserModel;

namespace LocalEducation.WebApi.Validations;

public class UserValidator : AbstractValidator<UserEditModel>
{
	public UserValidator()
	{

		RuleFor(s => s.Email)
			.EmailAddress()
			.WithMessage("Email không đúng định dạng")
			.NotEmpty()
			.WithMessage("Email không được để trống.");

		RuleFor(s => s.Name)
			.NotEmpty()
			.WithMessage("Tên không được để trống.")
			.MaximumLength(128)
			.WithMessage("Tên không được nhiều hơn 128 ký tự.");

		RuleFor(s => s.Phone)
			.Matches(@"(84|0[3|5|7|8|9])+([0-9]{8})\b")
			.When(s => !string.IsNullOrWhiteSpace(s.Phone))
			.WithMessage("Không đúng định dạng số điện thoại.");

		RuleFor(s => s.Address)
			.MaximumLength(512)
			.WithMessage("Địa chỉ không được nhiều hơn 512 ký tự.");
	}
}

public class PasswordEditModelValidator : AbstractValidator<PasswordEditModel>
{
    public PasswordEditModelValidator()
    {
        RuleFor(s => s.OldPassword)
            .NotEmpty()
            .WithMessage("Mật khẩu cũ không được để trống.");

        RuleFor(s => s.NewPassword)
            .NotEmpty()
            .WithMessage("Mật khẩu mới không được để trống.")
            .MinimumLength(6)
            .WithMessage("Mật khẩu mới phải nhiều hơn 6 ký tự.");

        RuleFor(s => s.ConfirmPassword)
            .Equal(s => s.NewPassword)
            .WithMessage("Mật khẩu xác nhận không khớp.");
    }
}