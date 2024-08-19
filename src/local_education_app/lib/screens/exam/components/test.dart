/* import 'package:another_quiz/components/timer.dart';
import 'package:another_quiz/data/mock_data.dart';
import 'package:another_quiz/models/question_model.dart';
import 'package:another_quiz/pages/result_page.dart';
import 'package:another_quiz/theme/color.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_clippers/flutter_custom_clippers.dart';

class MultipleChoicesQuestionWidget extends StatefulWidget {
  final int timeLimit;

  const MultipleChoicesQuestionWidget({super.key, required this.timeLimit});

  @override
  State<MultipleChoicesQuestionWidget> createState() =>
      _MultipleChoicesQuestionState();
}

class _MultipleChoicesQuestionState
    extends State<MultipleChoicesQuestionWidget> {
  late PageController _controller;
  int _questionNumber = 1;
  int _score = 0;
  bool _isLocked = false;

  @override
  void initState() {
    super.initState();
    _controller = PageController(initialPage: 0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: secondaryColor,
      appBar: AppBar(
        backgroundColor: primaryColor,
        elevation: 0,
      ),
      body: Stack(
        children: <Widget>[
          ClipPath(
            clipper: WaveClipperTwo(),
            child: Container(
              decoration: BoxDecoration(color: primaryColor),
              height: 200,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(children: [
              const SizedBox(height: 25),

              TimerWidget(
                timeLimit: widget.timeLimit,
                onTimerExpired: () {
                  print('Time is up');
                },
              ),
              // Question number text
              Text(
                'Question $_questionNumber/${mcQuestions.length}',
                style: const TextStyle(fontSize: 25),
              ),

              const Divider(
                thickness: 1,
                color: Colors.grey,
              ),

              Expanded(
                child: PageView.builder(
                  controller: _controller,
                  itemCount: mcQuestions.length,
                  physics: const NeverScrollableScrollPhysics(),
                  itemBuilder: (context, index) {
                    final _question = mcQuestions[index];
                    return buildQuestion(_question);
                  },
                ),
              ),

              _isLocked ? buildElevatedButton() : const SizedBox.shrink(),

              const SizedBox(height: 25),
            ]),
          ),
        ],
      ),
    );
  }

  Column buildQuestion(MultipleChoicesQuestionModel question) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 25),
        // Question text
        Text(
          question.text,
          style: const TextStyle(fontSize: 25),
        ),

        const SizedBox(height: 25),

        Expanded(
          child: OptionsWidget(
            question: question,
            onClickedOption: (option) {
              if (question.isLocked) {
                return;
              } else {
                setState(() {
                  question.isLocked = true;
                  question.selectedOption = option;
                });
                _isLocked = question.isLocked;
                if (question.selectedOption!.isCorrect) {
                  _score++;
                }
              }
            },
          ),
        ),
      ],
    );
  }

  ElevatedButton buildElevatedButton() {
    return ElevatedButton(
        onPressed: () {
          if (_questionNumber < mcQuestions.length) {
            _controller.nextPage(
              duration: const Duration(microseconds: 250),
              curve: Curves.easeInExpo,
            );
            setState(() {
              _questionNumber++;
              _isLocked = false;
            });
          } else {
            Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                    builder: (context) => ResultPage(
                        score: _score, questionLength: mcQuestions.length)));
          }
        },
        child: Text(
          _questionNumber < mcQuestions.length ? 'Next' : 'See The Result',
        ));
  }
}

class OptionsWidget extends StatelessWidget {
  final MultipleChoicesQuestionModel question;
  final ValueChanged<Option> onClickedOption;

  const OptionsWidget({
    super.key,
    required this.question,
    required this.onClickedOption,
  });

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
        child: Column(
          children: [
            ...question.options
                .map((option) => buildOption(context, option))
                .toList(),
          ],
        ),
      );

  Widget buildOption(BuildContext context, Option option) {
    final color = getColorForOption(option, question);
    return GestureDetector(
      onTap: () => onClickedOption(option),
      child: Container(
        height: 100,
        padding: const EdgeInsets.all(20),
        margin: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              option.text,
              style: const TextStyle(fontSize: 20, color: Colors.black),
            ),
            getIconForOption(option, question),
          ],
        ),
      ),
    );
  }

  Color getColorForOption(
      Option option, MultipleChoicesQuestionModel question) {
    final isSelected = option == question.selectedOption;
    if (isSelected) {
      return option.isCorrect ? Colors.green : Colors.red;
    } else if (option.isCorrect) {
      return Colors.green;
    }
    return Colors.grey;
  }

  Widget getIconForOption(
      Option option, MultipleChoicesQuestionModel question) {
    final isSelected = option == question.selectedOption;
    if (question.isLocked) {
      if (isSelected) {
        return option.isCorrect
            ? const Icon(
                Icons.check_circle,
                color: Colors.green,
              )
            : const Icon(
                Icons.cancel,
                color: Colors.red,
              );
      } else if (option.isCorrect) {
        return const Icon(Icons.check_circle, color: Colors.green);
      }
    }
    return const SizedBox.shrink();
  }
}
 */