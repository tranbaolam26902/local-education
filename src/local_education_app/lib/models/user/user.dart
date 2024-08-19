// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:local_education_app/models/user/user_role.dart';

class User {
  String id;
  String name;
  String email;
  String username;
  String phone;
  String address;
  DateTime createdDate;
  List<Role> roles;
  String roleName;
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.username,
    required this.phone,
    required this.address,
    required this.createdDate,
    required this.roles,
    required this.roleName,
  });
  factory User.fromMap(Map<String, dynamic> json) {
    final List<Role> roles = json['roles']?.map((e) {
          return Role.fromMap(e);
        }).toList() ??
        [];
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      username: json['username'],
      phone: json['phone'],
      address: json['address'],
      createdDate: DateTime.parse(json['createdDate']),
      roles: roles,
      roleName: json['roleName'],
    );
  }
}
