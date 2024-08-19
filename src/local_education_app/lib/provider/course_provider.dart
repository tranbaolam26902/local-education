import 'package:flutter/material.dart';
import 'package:local_education_app/api/course_api.dart';
import 'package:local_education_app/models/course/course.dart';

class CourseProvider with ChangeNotifier {
  List<Course>? _courseList;

  void setCourseList(List<Course> list) {
    _courseList = list;
    notifyListeners();
  }

  List<Course>? get courseList => _courseList;

  Future<int> courseGetList({String keyword = ''}) async {
    try {
      final response = await getCourses(keyword: keyword);
      if (response['statusCode'] == 200) {
        final result = response['result'];

        final items = result['items'];
        debugPrint('$items');
        _courseList = items?.map<Course>((e) {
              return Course.fromMap(e);
            }).toList() ??
            [];
        notifyListeners();
        return 200;
      } else {
        return 300;
      }
    } catch (e, stack) {
      debugPrint("There is error while getting Courses: $e");
      debugPrintStack(stackTrace: stack);
      return 400;
    }
  }

  Future<Course?> courseGetSlug(String slug) async {
    try {
      final response = await getCourseBySlug(slug);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        return Course.fromMap(result);
      } else {
        return null;
      }
    } catch (e, stack) {
      debugPrint("There is error while getting course");
      debugPrintStack(stackTrace: stack);
      return null;
    }
  }
}
