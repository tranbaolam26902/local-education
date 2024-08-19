import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

Future<dynamic> progressGetAll(String token) async {
  try {
    final response = await http
        .get(Uri.parse(ApiEndpoint.getAllProgress), headers: <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'bearer $token',
    });
    if (response.statusCode == 401) {
      return jsonDecode('{"statusCode":401}');
    }
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint("There is error while calling progress api: $e");
  }
}

Future<dynamic> progressGetDetail(String token, String progressId) async {
  try {
    final response = await http.get(
        Uri.parse(
          ApiEndpoint.getDetailProgress(progressId),
        ),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'bearer $token',
        });
    if (response.statusCode == 401) {
      return jsonDecode('{"statusCode":401}');
    }
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint("There is error while calling progress api: $e");
  }
}

Future<dynamic> progressGetCompletionPercentage(
    String token, String courseId) async {
  try {
    final url = ApiEndpoint.getCompletionPercentage(courseId);
    debugPrint(url);
    final response = await http.get(Uri.parse(url), headers: <String, String>{
      'Authorization': 'bearer $token',
    });
    debugPrint("${response.statusCode}");
    if (response.statusCode == 401) {
      return jsonDecode('{"statusCode":401}');
    }
    final body = response.body;
    debugPrint(body);
    return jsonDecode(body);
  } catch (e) {
    debugPrint("There is error while calling progress API: $e");
  }
}

Future<dynamic> progressPostCompleted(
    String token, String slideId, List<Map<String, dynamic>> answers) async {
  try {
    final url = ApiEndpoint.postComplete(slideId);
    debugPrint(url);
    final data = jsonEncode(answers);
    debugPrint(data);
    final response = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'bearer $token',
      },
      body: jsonEncode(answers),
    );
    debugPrint("${response.statusCode}");
    if (response.statusCode == 401) {
      return jsonDecode('{"statusCode":401}');
    }
    final body = response.body;
    debugPrint(body);
    return jsonDecode(body);
  } catch (e, stack) {
    debugPrint("There is error while calling progress API: $e");
    debugPrintStack(stackTrace: stack);
  }
}
