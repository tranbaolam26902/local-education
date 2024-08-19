import 'package:flutter/material.dart';
import 'package:local_education_app/config/routes/routes.dart';

class SignUpSuggestion extends StatelessWidget {
  const SignUpSuggestion({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text("Chưa có tài khoản?"),
          InkWell(
            onTap: () {
              Navigator.pushNamed(context, RouteName.signupScreen);
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: Text(
                "Đăng ký",
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
