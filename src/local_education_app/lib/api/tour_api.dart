import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

Future<dynamic> getTours({String keyword = ""}) async {
  try {
    final response = await http.get(
        Uri.parse(ApiEndpoint.getTour(keyword: keyword)),
        headers: <String, String>{
          'Content-Type': 'application/json',
        });
    final body = response.body;
    return jsonDecode(body);
  } catch (e) {
    debugPrint("There is error while getting tours: $e");
  }
}

Future<dynamic> getTourBySlug(String slug) async {
  try {
    final response = await http.get(
      Uri.parse(
        ApiEndpoint.getTourBySlug(slug),
      ),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
    );
    final body = response.body;
    debugPrint(body);
    return jsonDecode(body);
  } catch (e, stack) {
    debugPrint("There is error while getting profile: $e");
    debugPrintStack(stackTrace: stack);
  }
}
