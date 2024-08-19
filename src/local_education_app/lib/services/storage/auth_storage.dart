import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  static Future<bool> saveToken(String token) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString('token', token);
      return true;
    } on Exception catch (e) {
      debugPrint("Error while saving token in local storage: $e");
      return false;
    }
  }

  static Future<String?> loadToken() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      return prefs.getString('token');
    } on Exception catch (e) {
      debugPrint("Error while getting token in local storage: $e");
      return null;
    }
  }

  static Future<bool> deleteToken() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.remove('token');
      return true;
    } on Exception catch (e) {
      debugPrint('Error while deleting token in local storage: $e');
      return false;
    }
  }
}
