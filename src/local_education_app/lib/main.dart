import 'dart:io';
import 'package:flutter/material.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/provider/auth_provider.dart';
import 'package:local_education_app/provider/course_provider.dart';
import 'package:local_education_app/provider/lesson_provider.dart';
import 'package:local_education_app/provider/progress_provider.dart';
import 'package:local_education_app/provider/question_provider.dart';
import 'package:local_education_app/provider/slide_provider.dart';
import 'package:local_education_app/provider/tour_provider.dart';
import 'package:local_education_app/screens/login/login_screen.dart';
import 'package:local_education_app/widgets/app_main_navigation.dart';
import 'package:local_education_app/screens/exam/pages/intro_page.dart';
import 'package:local_education_app/screens/exam/pages/select_page.dart';
import 'package:provider/provider.dart';

void main(List<String> args) {
  HttpOverrides.global = MyHttpOverrides();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => AuthProvider(),
        ),
        ChangeNotifierProxyProvider<AuthProvider, ProgressProvider>(
          create: (context) => ProgressProvider(
            authProvider: Provider.of<AuthProvider>(context, listen: false),
          ),
          update: (context, auth, previousProgress) =>
              previousProgress!..update(auth),
        ),
        ChangeNotifierProvider(
          create: (context) => TourProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => CourseProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => LessonProvider(),
        ),
        ChangeNotifierProvider(
          create: (context) => SlideProivder(),
        ),
        ChangeNotifierProvider(
          create: (context) => QuestionProvider(),
        )
      ],
      child: const MyApp(),
    ),
  );
}

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Colors.green,
      ),
      home: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          final String? token = auth.jwtToken;
          return token == null || token.isEmpty
              ? const LoginScreen()
              : const AppMainNav();
        },
      ),
      onGenerateRoute: AppRouter.generateRoute,
      routes: {
        '/intropage': (context) => const IntroPage(),
        '/selectpage': (context) => const SelectPage(),
      },
    );
  }
}
