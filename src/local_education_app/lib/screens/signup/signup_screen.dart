import 'package:flutter/material.dart';
import 'package:local_education_app/screens/signup/widgets/login_suggestion.dart';
import 'package:local_education_app/screens/signup/widgets/signup_button.dart';
import 'package:local_education_app/services/email/email_validator.dart';
import 'package:local_education_app/widgets/auth_text_field.dart';
import 'package:local_education_app/widgets/header.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  String? _nameErrorText;
  String? _passwordErrorText;
  String? _usernameErrorText;
  String? _emailErrorText;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 8,
          vertical: 16,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Header
              appHeader("Đăng ký", context),

              // Fields
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Column(
                  children: [
                    //Name
                    AuthInputField(
                      onChanged: (value) {
                        setState(() {
                          _nameErrorText =
                              value.isEmpty ? 'Name is required' : null;
                        });
                      },
                      hintText: "Họ và tên",
                      controller: _nameController,
                      errorText: _nameErrorText,
                    ),

                    // Username
                    AuthInputField(
                      onChanged: (value) {
                        setState(() {
                          _usernameErrorText =
                              value.isEmpty ? 'Username is required' : null;
                        });
                      },
                      hintText: 'Tên tài khoản',
                      errorText: _usernameErrorText,
                      controller: _usernameController,
                    ),

                    // Email
                    AuthInputField(
                      onChanged: (value) {
                        setState(() {
                          _emailErrorText = value.isEmpty
                              ? 'Email is required'
                              : EmailValidator.isValid(value)
                                  ? null
                                  : 'Invalid Email';
                        });
                      },
                      hintText: 'Email',
                      errorText: _emailErrorText,
                      controller: _emailController,
                    ),
                    // Password
                    AuthPasswordInputField(
                        controller: _passwordController,
                        errorText: _passwordErrorText,
                        onChanged: (value) {
                          setState(() {
                            _passwordErrorText =
                                value.isEmpty ? 'Email is required' : null;
                          });
                        })
                  ],
                ),
              ),

              // Button
              signUpButton(context, () => null),

              // Suggestion

              const LoginSuggestion(),
            ],
          ),
        ),
      ),
    );
  }
}
