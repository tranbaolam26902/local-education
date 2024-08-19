import 'package:flutter/material.dart';
import 'package:local_education_app/provider/auth_provider.dart';
import 'package:local_education_app/screens/login/widgets/login_button.dart';
import 'package:local_education_app/screens/login/widgets/signup_suggestion.dart';
import 'package:local_education_app/widgets/auth_text_field.dart';
import 'package:local_education_app/widgets/header.dart';
import 'package:provider/provider.dart';
import 'package:top_snackbar_flutter/custom_snack_bar.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String? _usernameErrorText;
  String? _passwordErrorText;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(
          vertical: 16,
          horizontal: 8,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Header
              appHeader('Đăng nhập', context),

              // Fields
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Column(
                  children: [
                    // Login field
                    AuthInputField(
                      onChanged: (value) {
                        setState(() {
                          _usernameErrorText =
                              value.isEmpty ? "Vui lòng nhập tên tài khoản" : null;
                        });
                      },
                      hintText: "Tên tài khoản",
                      controller: _usernameController,
                      errorText: _usernameErrorText,
                    ),

                    // Password field
                    AuthPasswordInputField(
                      controller: _passwordController,
                      onChanged: (value) {
                        setState(() {
                          _passwordErrorText =
                              value.isEmpty ?"Vui lòng nhập mật khẩu"  : null;
                        });
                      },
                      errorText: _passwordErrorText,
                    )
                  ],
                ),
              ),

              // Button
              loginButton(context, handleLogin),

              // Signup suggestion
              const SignUpSuggestion(),
            ],
          ),
        ),
      ),
    );
  }

  void handleLogin() async {
    FocusManager.instance.primaryFocus?.unfocus();
    if (_usernameController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() {
        _usernameErrorText =
            _usernameController.text.isEmpty ? "Vui lòng nhập tên tài khoản" : null;
        _passwordErrorText =
            _passwordController.text.isEmpty ? "Vui lòng nhập mật khẩu" : null;
      });
    } else {
      final String username = _usernameController.text;
      final String password = _passwordController.text;
      final int result = await Provider.of<AuthProvider>(context, listen: false)
          .login(username, password);
      // if (!mounted) return;
      if (result == 200 && mounted) {
        showTopSnackBar(
          Overlay.of(context),
          const CustomSnackBar.success(
            message: "Đăng nhập thành công !",
          ),
          displayDuration: const Duration(seconds: 1),
        );
      } else if (result == 400 && mounted) {
        showTopSnackBar(
          Overlay.of(context),
          const CustomSnackBar.error(message: "Sai tên tài khoản hoặc mật khẩu"),
        );
      }
    }
  }
}
