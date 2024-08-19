import 'package:flutter/material.dart';

class AuthInputField extends StatelessWidget {
  const AuthInputField(
      {super.key,
      this.errorText,
      required this.onChanged,
      required this.hintText,
      required this.controller});
  final TextEditingController controller;
  final String hintText;
  final String? errorText;
  final Function(String) onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: TextField(
        onChanged: onChanged,
        controller: controller,
        decoration: InputDecoration(
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Theme.of(context).primaryColor,
            ),
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
          hintText: hintText,
          errorText: errorText,
          border: const OutlineInputBorder(
            borderSide: BorderSide(width: 1),
            borderRadius: BorderRadius.all(
              Radius.circular(10),
            ),
          ),
        ),
      ),
    );
  }
}

class AuthPasswordInputField extends StatefulWidget {
  const AuthPasswordInputField({
    super.key,
    this.errorText,
    required this.controller,
    required this.onChanged,
  });
  final TextEditingController controller;
  final String? errorText;
  final Function(String) onChanged;

  @override
  State<AuthPasswordInputField> createState() => _AuthPasswordInputFieldState();
}

class _AuthPasswordInputFieldState extends State<AuthPasswordInputField> {
  bool _visibility = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: TextField(
        onChanged: widget.onChanged,
        controller: widget.controller,
        obscureText: !_visibility,
        decoration: InputDecoration(
          hintText: "Password",
          suffixIcon: Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              icon: Icon(_visibility ? Icons.visibility_off : Icons.visibility),
              onPressed: () {
                setState(() {
                  _visibility = !_visibility;
                });
              },
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Theme.of(context).primaryColor,
            ),
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
          errorText: widget.errorText,
          border: const OutlineInputBorder(
            borderSide: BorderSide(width: 1),
            borderRadius: BorderRadius.all(
              Radius.circular(10),
            ),
          ),
        ),
      ),
    );
  }
}
