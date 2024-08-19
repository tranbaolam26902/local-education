import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

Future<dynamic> getQuestionsBySlideId(String slideId) async {
  try {
    final response = await http.get(
        Uri.parse(ApiEndpoint.getQuestionsBySlide(slideId)),
        headers: <String, String>{
          'Content-Type': 'application.json',
        });
    final body = response.body;
    debugPrint(body);
    return jsonDecode(body);
  } catch (e) {
    debugPrint("There is error while fetching question: $e");
  }
}
