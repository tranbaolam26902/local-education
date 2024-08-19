import 'dart:async';

import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:local_education_app/screens/exam/theme/color.dart';

class AudioPlayerWidget extends StatefulWidget {
  final String audioPath;
  const AudioPlayerWidget({super.key, required this.audioPath});

  @override
  _AudioPlayerWidgetState createState() => _AudioPlayerWidgetState();
}

class _AudioPlayerWidgetState extends State<AudioPlayerWidget> {
  final player = AudioPlayer();
  Duration duration = Duration.zero;
  Duration position = Duration.zero;
  bool isPlaying = false;
  Timer? _positionTimer;

  @override
  void initState() {
    super.initState();
    player.setAsset(widget.audioPath);

    player.playingStream.listen((playing) {
      setState(() {
        isPlaying = playing;
      });
      if (playing) {
        _positionTimer?.cancel();
        _positionTimer =
            Timer.periodic(const Duration(milliseconds: 100), (timer) {
          setState(() {
            position = player.position;
          });
        });
      } else {
        _positionTimer?.cancel();
      }
    });

    player.durationStream.listen((duration) {
      setState(() {
        this.duration = duration!;
      });
    });

    player.positionStream.listen((position) {
      setState(() {
        this.position = position;
      });
    });
  }

  @override
  void dispose() {
    _positionTimer?.cancel();
    //player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(formatTime(position)),
                  Slider(
                      min: 0,
                      max: duration.inSeconds.toDouble(),
                      value: position.inSeconds.toDouble(),
                      onChanged: (value) async {
                        await player.seek(Duration(seconds: value.toInt()));
                      }),
                  Text(formatTime(duration - position)),
                ],
              ),
            ),
            CircleAvatar(
                backgroundColor: primaryColor,
                child: IconButton(
                  icon: Icon(isPlaying ? Icons.pause : Icons.play_arrow),
                  onPressed: () async {
                    if (isPlaying) {
                      await player.pause();
                    } else {
                      await player.play();
                    }
                  },
                )),
          ],
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  String formatTime(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final hours = twoDigits(duration.inHours);
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));

    return [if (duration.inHours > 0) hours, minutes, seconds].join(':');
  }
}
