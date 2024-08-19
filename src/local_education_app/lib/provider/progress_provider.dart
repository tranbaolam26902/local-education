import 'package:flutter/material.dart';
import 'package:local_education_app/api/progress_api.dart';
import 'package:local_education_app/models/answer/answer.dart';
import 'package:local_education_app/models/api_response/api_response.dart';
import 'package:local_education_app/models/progress/progress.dart';
import 'package:local_education_app/provider/auth_provider.dart';

class ProgressProvider with ChangeNotifier {
  AuthProvider authProvider;
  List<Progress>? _progressList;
  Progress? _currentCourseProgress;

  List<Progress>? get progressList => _progressList;
  Progress? get currentCourseProgress => _currentCourseProgress;
  ProgressProvider({required this.authProvider});
  void setProgressList(List<Progress> progresses) {
    _progressList = progresses;
    notifyListeners();
  }

  void setCurrentCourseProgress(Progress? progress) {
    _currentCourseProgress = progress;
    notifyListeners();
  }

  void update(AuthProvider auth) {
    authProvider = auth;
  }

  Future<int> progressGetList() async {
    try {
      final response = await progressGetAll(authProvider.jwtToken!);
      if (response['statusCode'] == 401) {
        debugPrint("Unauthorized");
        await authProvider.refreshToken();
        return await progressGetList();
      } else if (response['statusCode'] == 200) {
        final result = response['result'];
        debugPrint("$result");
        return 200;
      } else {
        return 404;
      }
    } catch (e) {
      debugPrint("There is some error while getting Progress: $e");
      return -1;
    }
  }

  Future<ApiResponse> postProgressCompleted(
      String slideId, List<Answer> answers) async {
    try {
      final data = answers.map((e) {
        return e.toMap();
      }).toList();
      debugPrint("$data");
      final response =
          await progressPostCompleted(authProvider.jwtToken!, slideId, data);
      debugPrint("${response['statusCode']}");
      if (response['statusCode'] == 401) {
        debugPrint("Unauthorized");
        authProvider.refreshToken();
        return postProgressCompleted(slideId, answers);
      }
      return ApiResponse.fromMap(response);
    } catch (e, track) {
      debugPrint("There is some error while posting Completed Slide: $e");
      debugPrintStack(stackTrace: track);
      return ApiResponse(
          isSuccess: false, statusCode: 415, errors: ["Lỗi cmnr"]);
    }
  }

  Future<int> getProgressCompletionPercentage(String courseId) async {
    try {
      final response = await progressGetCompletionPercentage(
          authProvider.jwtToken!, courseId);
      if (response['statusCode'] == 401) {
        debugPrint("Unauthorized");
        await authProvider.refreshToken();
        return getProgressCompletionPercentage(courseId);
      } else if (response['statusCode'] == 200) {
        final result = response['result'];
        setCurrentCourseProgress(
          Progress.fromMap(result),
        );
        return 200;
      } else {
        setCurrentCourseProgress(null);
        return 404;
      }
    } catch (e, track) {
      debugPrint("There is some error while getting Progress: $e");
      debugPrintStack(stackTrace: track);
      return -1;
    }
  }
}
