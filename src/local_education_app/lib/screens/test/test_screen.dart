import 'package:flutter/material.dart';
import 'package:local_education_app/models/answer/answer.dart';
import 'package:local_education_app/provider/question_provider.dart';
import 'package:local_education_app/screens/slide/widgets/test_argument.dart';
import 'package:provider/provider.dart';

class TestScreen extends StatefulWidget {
  final String slideId;
  const TestScreen({Key? key, required this.slideId}) : super(key: key);

  @override
  State<TestScreen> createState() => _TestScreenState();
}

class _TestScreenState extends State<TestScreen> {
  bool _showLoadingIndicator = true;
  Map<int, int> selectedIndexes = {};
  final PageController _pageController = PageController(initialPage: 0);
  List<Answer> answers = [];
  int currentIndex = 0;
  @override
  void initState() {
    _loadData();
    super.initState();
  }

  _loadData() {
    final questionProv = Provider.of<QuestionProvider>(context, listen: false);
    questionProv.getQuestionsBySlide(widget.slideId).then((value) {
      if (questionProv.questionList.isEmpty) {
        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _showLoadingIndicator = false;
            });
          }
        });
      } else {
        if (mounted) {
          setState(() {
            _showLoadingIndicator = false;
          });
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final questionProv = Provider.of<QuestionProvider>(context);
    return Scaffold(
      backgroundColor: const Color(0xFF0B260D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B260D),
        title: const Text('Bài kiểm tra',
            style: TextStyle(color: Color(0xFFFFEBCD))),
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Color(0xFFFFEBCD)),
            onPressed: () {
              Navigator.pop(
                context,
                TestArgument(answers: []),
              );
            },
          ),
        ],
      ),
      body: _showLoadingIndicator
          ? const Center(child: CircularProgressIndicator())
          : (questionProv.questionList.isEmpty)
              ? const Center(
                  child: Text("Hiện tại chưa có bài kiểm tra",
                      style: TextStyle(color: Color(0xFFFFEBCD))),
                )
              : Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        itemCount: questionProv.questionList.length,
                        controller: _pageController,
                        onPageChanged: (int index) {
                          setState(() {
                            currentIndex = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          final currentQuestion =
                              questionProv.questionList[index];
                          final options = currentQuestion.options;
                          return Center(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: SingleChildScrollView(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8.0),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                            color: Colors.orange,
                                            width:
                                                3.0), // Điều chỉnh độ dày của đường viền ở đây
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                      ),
                                      child: Text(
                                        currentQuestion.content,
                                        style: const TextStyle(
                                            fontSize: 16,
                                            color: Color(0xFFFFEBCD)),
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    ...options.map(
                                      (currentOption) {
                                        bool isSelected =
                                            selectedIndexes[index] ==
                                                currentOption.index;
                                        Color backgroundColor = isSelected
                                            ? const Color(0xFFFFEBCD)
                                            : Colors.transparent;
                                        Color textColor = isSelected
                                            ? Colors.orange
                                            : const Color(0xFFFFEBCD);
                                        return GestureDetector(
                                          onTap: () {
                                            setState(() {
                                              selectedIndexes[index] =
                                                  currentOption.index;
                                              _updateAnswer(
                                                  currentQuestion.index,
                                                  currentOption.index);
                                            });
                                          },
                                          child: Container(
                                            margin: const EdgeInsets.symmetric(
                                                vertical: 4.0),
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                color: isSelected
                                                    ? Colors.orange
                                                    : const Color(0xFFFFEBCD),
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              color: backgroundColor,
                                            ),
                                            child: ListTile(
                                              title: Text(
                                                currentOption.content,
                                                style:
                                                    TextStyle(color: textColor),
                                              ),
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            if (currentIndex > 0) {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            } else {
                              Navigator.pop(
                                context,
                                TestArgument(answers: []),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            foregroundColor: const Color(0xFFFFEBCD),
                            backgroundColor: const Color(0xFF0B260D),
                          ),
                          child: const Text("Quay lại"),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            if (currentIndex <
                                questionProv.questionList.length - 1) {
                              _pageController.nextPage(
                                  duration: const Duration(microseconds: 300),
                                  curve: Curves.easeInOut);
                            } else {
                              Navigator.pop(
                                  context, TestArgument(answers: answers));
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            foregroundColor: const Color(0xFFFFEBCD),
                            backgroundColor: const Color(0xFF0B260D),
                          ),
                          child: const Text("Tiếp tục"),
                        ),
                      ],
                    ),
                  ],
                ),
    );
  }

  void _updateAnswer(int questionIndex, int optionIndex) {
    final existingAnswerIndex =
        answers.indexWhere((answer) => answer.questionIndex == questionIndex);
    if (existingAnswerIndex != -1) {
      answers[existingAnswerIndex] =
          Answer(questionIndex: questionIndex, optionIndex: optionIndex);
    } else {
      answers
          .add(Answer(questionIndex: questionIndex, optionIndex: optionIndex));
    }
  }
}
