import 'dart:convert';
import 'package:local_education_app/screens/exam/models/question.dart';
import 'package:flutter/services.dart' show rootBundle;

Future<List<Question>> getQuestionsFromFile(String path) async {
  final String response = await rootBundle.loadString(path);
  final List<dynamic> jsonData = json.decode(response);
  final List<Map<String, dynamic>> data =
      List<Map<String, dynamic>>.from(jsonData);
  return Question.fromData(data);
}
