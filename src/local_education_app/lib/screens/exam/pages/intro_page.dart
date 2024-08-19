import 'package:local_education_app/screens/exam/components/button.dart';
import 'package:local_education_app/screens/exam/theme/color.dart';
import 'package:flutter/material.dart';

class IntroPage extends StatelessWidget {
  const IntroPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: primaryColor,
      body: Container(
        decoration: BoxDecoration(
            gradient: LinearGradient(
                colors: [primaryColor, primaryColor.withOpacity(0.5)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter)),
        width: double.infinity,
        height: double.infinity,
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              const SizedBox(height: 25),
              //Title
              const Text(
                'QUIZZ',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold),
              ),

              // Image
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: AspectRatio(
                  aspectRatio: 1,
                  child: Image.asset(
                    'assets/images/quiz.png',
                  ),
                ),
              ),

              // Intro text
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(20)),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    SizedBox(height: 10),
                    // Main text
                    Text(
                      'Interesting QUIZ Awaits',
                      style: TextStyle(
                        color: Color.fromARGB(255, 31, 85, 20),
                        fontSize: 44,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 10),
                    // Sub text
                    Text(
                      'Unleash Your Knowledge, \nIgnite Your Mind',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 10),
                  ],
                ),
              ),

              const SizedBox(height: 25),

              // Next button
              MyButton(
                  text: 'Get Started',
                  onTap: () {
                    navigateToSelectPage(context);
                  }),

              const SizedBox(height: 25)
            ],
          ),
        ),
      ),
    );
  }

  void navigateToSelectPage(BuildContext context) async {
    //Navigator.pushNamed(context, RouteName.examSelect);
    Navigator.pushNamed(context, '/selectpage');
  }
}
