import 'package:flutter/material.dart';
import 'package:local_education_app/api/lesson_api.dart';
import 'package:local_education_app/models/lesson/lesson.dart';

class LessonProvider with ChangeNotifier {
  List<Lesson>? _lessonList;
  void setLessonList(List<Lesson> list) {
    _lessonList = list;
    notifyListeners();
  }

  List<Lesson>? get lessonList => _lessonList;

  Future<int> lessonGetList(String slug) async {
    try {
      final response = await getLessons(slug);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        _lessonList = result?.map<Lesson>((e) {
              return Lesson.fromMap(e);
            }).toList() ??
            [];
        notifyListeners();
        return 200;
      } else {
        return 300;
      }
    } catch (e, stack) {
      debugPrint("There is error while getting Lessons: $e");
      debugPrintStack(stackTrace: stack);
      return 400;
    }
  }
}
