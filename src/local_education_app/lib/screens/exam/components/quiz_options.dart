import 'package:local_education_app/screens/exam/models/category.dart';
import 'package:local_education_app/screens/exam/models/question.dart';
import 'package:local_education_app/screens/exam/pages/error_page.dart';
import 'package:local_education_app/screens/exam/pages/quiz_page.dart';
import 'package:local_education_app/screens/exam/services/load_data.dart';
import 'package:local_education_app/screens/exam/theme/color.dart';
import 'package:flutter/material.dart';
import 'dart:io';

class QuizOptionsDialog extends StatefulWidget {
  final List<Question>? questions;
  final Category? category;

  const QuizOptionsDialog({super.key, this.questions, this.category});

  @override
  _QuizOptionsDialogState createState() => _QuizOptionsDialogState();
}

class _QuizOptionsDialogState extends State<QuizOptionsDialog> {
  int? timeLimit;
  late bool processing;

  @override
  void initState() {
    super.initState();
    timeLimit = 600;
    processing = false;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16.0),
            color: Colors.grey.shade200,
            child: Text(
              widget.category!.name,
              style: Theme.of(context).textTheme.titleLarge!.copyWith(),
            ),
          ),
          const SizedBox(height: 10.0),
          const Text("Select Time Limit (Minutes)"),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Wrap(
              alignment: WrapAlignment.center,
              runAlignment: WrapAlignment.center,
              runSpacing: 16.0,
              spacing: 16.0,
              children: <Widget>[
                ActionChip(
                  label: const Text("10"),
                  labelStyle: const TextStyle(color: Colors.white),
                  backgroundColor:
                      timeLimit == 600 ? primaryColor : Colors.grey.shade600,
                  onPressed: () => selectTimeLimit(600),
                ),
                ActionChip(
                  label: const Text("15"),
                  labelStyle: const TextStyle(color: Colors.white),
                  backgroundColor:
                      timeLimit == 900 ? primaryColor : Colors.grey.shade600,
                  onPressed: () => selectTimeLimit(900),
                ),
                ActionChip(
                  label: const Text("20"),
                  labelStyle: const TextStyle(color: Colors.white),
                  backgroundColor:
                      timeLimit == 1200 ? primaryColor : Colors.grey.shade600,
                  onPressed: () => selectTimeLimit(1200),
                ),
                ActionChip(
                  label: const Text("25"),
                  labelStyle: const TextStyle(color: Colors.white),
                  backgroundColor:
                      timeLimit == 1500 ? primaryColor : Colors.grey.shade600,
                  onPressed: () => selectTimeLimit(1500),
                ),
                ActionChip(
                  label: const Text("30"),
                  labelStyle: const TextStyle(color: Colors.white),
                  backgroundColor:
                      timeLimit == 1800 ? primaryColor : Colors.grey.shade600,
                  onPressed: () => selectTimeLimit(1800),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20.0),
          processing
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: startQuiz,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonColor,
                  ),
                  child: const Text("Start Quiz"),
                ),
          const SizedBox(height: 20.0),
        ],
      ),
    );
  }

  selectTimeLimit(int? t) {
    setState(() {
      timeLimit = t;
    });
  }

  void startQuiz() async {
    setState(() {
      processing = true;
    });
    try {
      List<Question> questions =
          await getQuestionsFromFile(widget.category!.questionPath);

      if (!mounted) return;
      if (questions.isEmpty) {
        Navigator.of(context).push(MaterialPageRoute(
            builder: (_) => const ErrorPage(
                  message:
                      "There are not enough questions in the category, with the options you selected.",
                )));
        return;
      }
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (_) => QuizPage(
                    questions: questions,
                    category: widget.category,
                    timeLimit: timeLimit!,
                  )));
    } on SocketException catch (_) {
      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (_) => const ErrorPage(
                    message:
                        "Can't reach the servers, \n Please check your internet connection.",
                  )));
    } catch (e) {
      print(e.toString());
      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (_) => const ErrorPage(
                    message: "Unexpected error trying to connect to the API",
                  )));
    }
    setState(() {
      processing = false;
    });
  }
}
