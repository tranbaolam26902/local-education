import 'package:local_education_app/screens/exam/theme/color.dart';
import 'package:flutter/material.dart';
import 'dart:async';

class TimerWidget extends StatefulWidget {
  final int timeLimit; // The time limit in seconds
  final Function
      onTimerExpired; // The callback function to be called when the timer expires

  const TimerWidget(
      {super.key, required this.timeLimit, required this.onTimerExpired});

  @override
  _TimerWidgetState createState() => _TimerWidgetState();
}

class _TimerWidgetState extends State<TimerWidget> {
  int _remainingTime = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _remainingTime = widget.timeLimit;
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingTime > 0) {
          _remainingTime--;
        } else {
          widget.onTimerExpired();
          _timer?.cancel();
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Center(
        child: Column(
          children: [buildTimer()],
        ),
      ),
    );
  }

  Widget buildTimer() => SizedBox(
        width: 100,
        height: 100,
        child: Stack(
          fit: StackFit.expand,
          children: [
            CircularProgressIndicator(
              value: _remainingTime / widget.timeLimit,
              valueColor: const AlwaysStoppedAnimation(Colors.white),
              backgroundColor: primaryColor,
              strokeWidth: 10.0,
            ),
            Center(child: buildTime()),
          ],
        ),
      );

  Widget buildTime() {
    final minutes = _remainingTime ~/ 60;
    final seconds = _remainingTime % 60;
    return Text(
      '$minutes:${seconds.toString().padLeft(2, '0')}',
      style: const TextStyle(fontSize: 24.0),
    );
  }
}
