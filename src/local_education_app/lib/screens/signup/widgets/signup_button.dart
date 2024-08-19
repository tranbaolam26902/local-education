import 'package:flutter/material.dart';

Widget signUpButton(BuildContext context, Function() onPressed) {
  return SizedBox(
    width: double.infinity,
    child: OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: Theme.of(context).primaryColor,
        side: BorderSide(
          width: 1.5,
          color: Theme.of(context).primaryColor,
        ),
        padding: const EdgeInsets.symmetric(vertical: 16),
      ),
      child: const Text("Đăng ký"),
    ),
  );
}
