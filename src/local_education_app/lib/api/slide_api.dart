import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

Future<dynamic> getSlidesByLesson(String lessonId) async {
  try {
    final response = await http.get(
        Uri.parse(ApiEndpoint.getSlideByLessonID(lessonId)),
        headers: <String, String>{
          'Content-Type': 'application.json',
        });
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint('There is error while calling slide API');
  }
}

Future<dynamic> getSlidebyId(String slideId) async {
  try {
    final response = await http.get(
        Uri.parse(ApiEndpoint.getSlideByiD(slideId)),
        headers: <String, String>{
          'Content-Type': 'application.json',
        });
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint('There is error while calling slide API');
  }
}
