import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

Future<dynamic> getLessons(String slug) async {
  try {
    final response = await http.get(
        Uri.parse(ApiEndpoint.getLessonsBySlug(slug)),
        headers: <String, String>{
          'Content-Type': 'application.json',
        });
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint('There is error while getting lessons');
  }
}
