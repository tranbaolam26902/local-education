import 'package:flutter/material.dart';

Widget loginButton(BuildContext context, Function() onPressed) {
  return SizedBox(
    width: double.infinity,
    child: ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Theme.of(context).indicatorColor,
        padding: const EdgeInsets.symmetric(vertical: 16),
      ),
      child: const Text("Đăng nhập"),
    ),
  );
}
