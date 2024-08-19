import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_education_app/constants/api_constant.dart';

class AuthApi {
  static Map<String, String> cookieHeaders = {};

  static void updateCookie(http.Response response) {
    String? rawCookie = response.headers['set-cookie'];
    if (rawCookie != null) {
      int index = rawCookie.indexOf(";");
      cookieHeaders['cookie'] =
          (index == -1) ? rawCookie : rawCookie.substring(0, index);
    }
  }

  static Future<dynamic> authLogin(String userName, String password) async {
    try {
      final response = await http.post(
        Uri.parse(ApiEndpoint.authLogin),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'username': userName,
          'password': password,
        }),
      );
      debugPrint(response.statusCode.toString());
      updateCookie(response);
      final body = response.body;
      debugPrint(body);
      return jsonDecode(body);
    } catch (e) {
      debugPrint("There is error while posting $e");
      return null;
    }
  }

  static Future<dynamic> authRegister(
    String name,
    String username,
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse(ApiEndpoint.authRegister),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'name': name,
          'email': email,
          'username': username,
          'password': password,
        }),
      );
      final body = response.body;
      return jsonDecode(body);
    } catch (e) {
      debugPrint("There is error while posting $e");
    }
  }

  static Future<dynamic> authRefreshToken(String token) async {
    debugPrint("$cookieHeaders");
    final firstHeader = <String, String>{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
    try {
      final response = await http.get(Uri.parse(ApiEndpoint.authRefreshToken),
          headers: {...firstHeader, ...cookieHeaders});
      updateCookie(response);
      final body = response.body;
      return jsonDecode(body);
    } catch (e) {
      debugPrint("There is error while getting refreshToken: $e");
    }
  }

  static Future<dynamic> authGetProfile(String token) async {
    try {
      final response = await http
          .get(Uri.parse(ApiEndpoint.authGetProfile), headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      });
      if (response.statusCode == 401) {
        return jsonDecode('{"statusCode":401}');
      }
      final body = response.body;
      return jsonDecode(body);
    } catch (e) {
      debugPrint("There is error while getting profile: $e");
      return null;
    }
  }
}
