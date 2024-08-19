import 'package:flutter/material.dart';
import 'package:local_education_app/api/auth_api.dart';
import 'package:local_education_app/api/course_api.dart';
import 'package:local_education_app/models/api_response/api_response.dart';
import 'package:local_education_app/models/user/user.dart';
import 'package:local_education_app/services/storage/auth_storage.dart';

class AuthProvider with ChangeNotifier {
  String? _token;
  void setJwtToken(String token) async {
    _token = token;
    await AuthStorage.saveToken(_token!);
    notifyListeners();
  }

  String? get jwtToken => _token;
  Future<int> login(String username, String password) async {
    try {
      final response = await AuthApi.authLogin(username, password);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        setJwtToken(result['token']);
        return 200;
      } else {
        return 400;
      }
    } catch (e) {
      debugPrint('Error while login in : $e');
      return -1;
    }
  }

  Future<void> logOut() async {
    _token = "";
    notifyListeners();
    await AuthStorage.deleteToken();
  }

  Future<User?> getProfile() async {
    try {
      final response = await AuthApi.authGetProfile(_token!);
      debugPrint("$response");
      if (response['statusCode'] == 200) {
        final result = response['result'];
        return User.fromMap(result);
      } else if (response['statusCode'] == 401) {
        debugPrint("Unauthorized");
        await refreshToken();
        return await getProfile();
      }
    } catch (e) {
      debugPrint("There is Error: $e");
      return null;
    }
  }

  Future refreshToken() async {
    try {
      debugPrint("$_token");
      final response = await AuthApi.authRefreshToken(_token!);
      if (response['statusCode'] == 200) {
        final result = response['result'];
        setJwtToken(result['token']);
      } else {
        debugPrint("failed");
      }
    } catch (e) {
      debugPrint("There is Error: $e");
    }
  }

  Future<ApiResponse?> enrollCourse(String courseId) async {
    try {
      final response = await getTakePartInCourse(_token!, courseId);
      if (response['statusCode'] == 401) {
        debugPrint("Unauthorized");
        await refreshToken();
        return await enrollCourse(courseId);
      }
      return ApiResponse.fromMap(response);
    } catch (e, stack) {
      debugPrint("There is Error: $e");
      debugPrintStack(stackTrace: stack);
      return null;
    }
  }
}
