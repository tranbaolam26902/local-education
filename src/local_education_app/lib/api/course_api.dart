import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

Future<dynamic> getCourses({String keyword = ''}) async {
  try {
    final response = await http.get(
        Uri.parse(ApiEndpoint.getCourse(keyword: keyword)),
        headers: <String, String>{
          'Content-Type': 'application.json',
        });
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint('There is error while getting courses');
  }

  //TODO: Add GetAll Method
}

Future<dynamic> getCourseBySlug(String slug) async {
  try {
    final response = await http.get(
        Uri.parse(
          ApiEndpoint.getCourseBySlug(slug),
        ),
        headers: <String, String>{
          'Content-Type': 'application.json',
        });
    final body = response.body;
    return jsonDecode(body);
  } catch (e, stack) {
    debugPrint("There is error while getting courses: $e");
    debugPrintStack(stackTrace: stack);
  }
}

Future<dynamic> getTakePartInCourse(String token, String courseId) async {
  try {
    final response = await http.get(
      Uri.parse(ApiEndpoint.enrollCourse(courseId)),
      headers: <String, String>{
        "Content-Type": "application/json",
        "Authorization": 'bearer $token',
      },
    );
    debugPrint("${response.statusCode}");
    if (response.statusCode == 401) {
      return jsonDecode('{"statusCode":401}');
    }
    final body = response.body;
    debugPrint(body);
    return jsonDecode(body);
  } catch (e, stack) {
    debugPrint("There is error while getting erolling course: $e");
    debugPrintStack(stackTrace: stack);
  }
}
