import 'package:flutter/material.dart';
import 'package:local_education_app/provider/auth_provider.dart'; // Import your AuthProvider
import 'package:local_education_app/models/user/user.dart';
import 'package:provider/provider.dart'; // Import your User model

class EditProfile extends StatelessWidget {
  const EditProfile({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        return FutureBuilder<User?>(
          future: auth.getProfile(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Scaffold(
                appBar: AppBar(
                  title: const Text("Chỉnh sửa trang cá nhân"),
                  centerTitle: true,
                ),
                body: Center(
                  child: CircularProgressIndicator(
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              );
            } else {
              User? currentUser = snapshot.data;
              return Scaffold(
                appBar: AppBar(
                  title: const Text("Chỉnh thông tin cá nhân"),
                  centerTitle: true,
                ),
                body: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Display user's name
                        Text(
                          '${currentUser?.name}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 20),
                        // Display user's email

                        TextField(
                          decoration: InputDecoration(
                            labelText: 'Tên',
                            border: OutlineInputBorder(),
                          ),
                          controller:
                              TextEditingController(text: currentUser?.name),
                        ),
                        const SizedBox(height: 20),
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'Email',
                            border: OutlineInputBorder(),
                          ),
                          controller:
                              TextEditingController(text: currentUser?.email),
                        ),
                        const SizedBox(height: 20),
                        // Display user's phone number
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'Số điện thoại',
                            border: OutlineInputBorder(),
                          ),
                          controller:
                              TextEditingController(text: currentUser?.phone),
                        ),

                        const SizedBox(height: 20),
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'Địa chỉ',
                            border: OutlineInputBorder(),
                          ),
                          controller:
                              TextEditingController(text: currentUser?.address),
                        ),
                        const SizedBox(height: 20),
                        // Save button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {
                              // Functionality to save edited profile details
                            },
                            style: ElevatedButton.styleFrom(
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              backgroundColor: const Color(0xFF639854),
                            ),
                            child: const Text('Lưu'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }
          },
        );
      },
    );
  }
}
