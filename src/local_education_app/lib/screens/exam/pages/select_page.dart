import 'package:local_education_app/screens/exam/models/category.dart';
import 'package:local_education_app/screens/exam/models/question.dart';
import 'package:local_education_app/screens/exam/pages/quiz_details.dart';
import 'package:local_education_app/screens/exam/services/load_data.dart';
import 'package:local_education_app/screens/exam/theme/color.dart';
import 'package:flutter/material.dart';

class SelectPage extends StatefulWidget {
  const SelectPage({super.key});

  @override
  State<SelectPage> createState() => _SelectPageState();
}

class _SelectPageState extends State<SelectPage> {
  @override
  Widget build(BuildContext context) {
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
        title: const Text(
          'Select',
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
            gradient: LinearGradient(
                colors: [primaryColor, primaryColor.withOpacity(0.5)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter)),
        width: double.infinity,
        height: double.infinity,
        child: ListView.builder(
            shrinkWrap: true,
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return GestureDetector(
                onTap: () {
                  loadQuestionThenNavigate(category);
                  //navigateToQuizDetails(category, questions);
                },
                child: Container(
                  padding: const EdgeInsets.all(20),
                  margin: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.white,
                  ),
                  child: Row(
                    children: [
                      Image.asset(
                        category.imagePath,
                        height: 70,
                        width: 70,
                      ),
                      const SizedBox(width: 10),
                      Flexible(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              category.name,
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              category.description,
                              overflow: TextOverflow.ellipsis,
                              maxLines: 2,
                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right),
                    ],
                  ),
                ),
              );
            }),
      ),
    );
  }

  void loadQuestionThenNavigate(Category category) async {
    final questions = await getQuestionsFromFile(category.questionPath);
    await navigateToQuizDetails(category, questions);
  }

  navigateToQuizDetails(Category category, List<Question> questions) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => QuizDetailsPage(
          selectedCategory: category,
          questions: questions,
        ),
      ),
    );
  }
}
