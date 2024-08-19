import 'package:local_education_app/screens/exam/components/button.dart';
import 'package:local_education_app/screens/exam/components/quiz_options.dart';
import 'package:local_education_app/screens/exam/models/category.dart';
import 'package:local_education_app/screens/exam/models/question.dart';
import 'package:local_education_app/screens/exam/theme/color.dart';
import 'package:flutter/material.dart';

class QuizDetailsPage extends StatefulWidget {
  final Category selectedCategory;
  final List<Question> questions;

  const QuizDetailsPage({
    super.key,
    required this.selectedCategory,
    required this.questions,
  });

  @override
  State<QuizDetailsPage> createState() => _QuizDetailsPageState();
}

class _QuizDetailsPageState extends State<QuizDetailsPage> {
  @override
  Widget build(BuildContext context) {
    List<String> splittedTitle = widget.selectedCategory.name.split(".");
    String title = splittedTitle[0];
    return Scaffold(
      backgroundColor: primaryColor,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: primaryColor,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(10),
          ),
        ),
        title: Text(
          title,
        ),
      ),
      body: Container(
        height: double.infinity,
        width: double.infinity,
        decoration: BoxDecoration(
            gradient: LinearGradient(
                colors: [primaryColor, primaryColor.withOpacity(0.5)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            //mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Image
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.asset(widget.selectedCategory.displayPicturePath),
              ),

              const SizedBox(height: 20),

              // Title
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20)),
                  child: SingleChildScrollView(
                      child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      Text(
                        widget.selectedCategory.name,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),

                      // About
                      Text(
                        widget.selectedCategory.description,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                        textAlign: TextAlign.justify,
                      ),

                      const SizedBox(height: 10),

                      // List of questions
                      ListView.builder(
                        shrinkWrap: true,
                        itemCount: widget.questions.length,
                        itemBuilder: (context, index) {
                          final question = widget.questions[index];
                          return Container(
                            margin: const EdgeInsets.symmetric(vertical: 10),
                            child: Text(
                              '${index + 1}. ${question.question}',
                              style: const TextStyle(fontSize: 14),
                            ),
                          );
                        },
                      ),
                    ],
                  )),
                ),
              ),

              const SizedBox(height: 10),

              // Continue button
              MyButton(
                  text: "Begin",
                  onTap: () =>
                      categoryPressed(context, widget.selectedCategory)),
            ],
          ),
        ),
      ),
    );
  }

  categoryPressed(BuildContext context, Category selectedCategory) {
    showModalBottomSheet(
      context: context,
      builder: (sheetContext) => BottomSheet(
        builder: (_) => QuizOptionsDialog(
          questions: widget.questions,
          category: selectedCategory,
        ),
        onClosing: () {},
      ),
    );
  }
}
