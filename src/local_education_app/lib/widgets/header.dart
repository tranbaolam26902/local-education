import 'package:flutter/material.dart';

Widget appHeader(String title, BuildContext context) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 24),
    child: Text(
      title,
      style: TextStyle(
        fontWeight: FontWeight.bold,
        color: Theme.of(context).primaryColor,
        fontSize: 32,
      ),
    ),
  );
}
