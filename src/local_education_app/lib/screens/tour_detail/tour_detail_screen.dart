import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_education_app/config/routes/router.dart';
import 'package:local_education_app/config/routes/routes.dart';
import 'package:local_education_app/constants/api_constant.dart';
import 'package:local_education_app/provider/tour_provider.dart';
import 'package:local_education_app/services/coordinate/coordinate_converter.dart';
import 'package:panorama_viewer/panorama_viewer.dart';
import 'package:provider/provider.dart';

class TourScreen extends StatefulWidget {
  const TourScreen({Key? key, this.startIndex = 0, required this.tourSlug})
      : super(key: key);
  final String tourSlug;
  final int startIndex;

  @override
  State<TourScreen> createState() => _TourScreenState();
}

class _TourScreenState extends State<TourScreen> {
  int currentIndex = 0;
  bool isPlaying = false;
  final audioPlayer = AudioPlayer();

  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
    currentIndex = widget.startIndex;
    audioPlayer.onPlayerStateChanged.listen((state) {
      setState(() {
        isPlaying = state == PlayerState.playing;
      });
    });
  }

  @override
  void dispose() {
    audioPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<TourProvider>(
        builder: (context, tour, child) {
          if (tour.tourDetail?.scenes == null ||
              tour.tourDetail!.scenes.isEmpty) {
            tour.tourGetTourBySlug(widget.tourSlug);
            return const Center(
              child: Text("No Scene found"),
            );
          } else {
            final currentTour = tour.tourDetail;
            debugPrint(currentIndex.toString());
            final currentScene = currentTour?.scenes
                .firstWhere((scene) => scene.index == currentIndex);
            debugPrint(currentScene?.title);
            final imageUrl = currentScene?.urlImage;

            const domain = ApiEndpoint.domain;
            final linkHotSpots = currentScene?.linkHotspots;
            final infoHotSpot = currentScene?.infoHotspots;

            final audio = currentScene?.audio;
            final linkHotSpotWidget = linkHotSpots?.map((item) {
              return Hotspot(
                longitude:
                    CoordinateConverter.toLongitude(item.x, item.y, item.z),
                latitude:
                    CoordinateConverter.toLatitude(item.x, item.y, item.z),
                widget: IconButton(
                  icon: const Icon(
                    Icons.arrow_circle_up,
                    color: Colors.white,
                    size: 40,
                  ),
                  onPressed: () {
                    final index = item.sceneIndex;
                    debugPrint(index.toString());
                    setState(() {
                      currentIndex = index;
                    });
                  },
                ),
              );
            }).toList();
            final infoHotSpotWidget = infoHotSpot?.map((item) {
              return Hotspot(
                longitude:
                    CoordinateConverter.toLongitude(item.x, item.y, item.z),
                latitude:
                    CoordinateConverter.toLatitude(item.x, item.y, item.z),
                widget: IconButton(
                  icon: const Icon(
                    Icons.info_outline_rounded,
                    color: Colors.white,
                    size: 40,
                  ),
                  onPressed: () async {
                    await audioPlayer.stop();
                    if (context.mounted) {
                      // Navigator.pushNamed(context, RouteName.slideScreen,
                      //     arguments: SlideArgument(courseSlug: item.lessonId));
                    }
                  },
                ),
              );
            }).toList();

            return Stack(
              children: [
                PanoramaViewer(
                  hotspots: [...?infoHotSpotWidget, ...?linkHotSpotWidget],
                  child: Image.network('$domain/$imageUrl'),
                ),
                Positioned(
                  top: 20,
                  left: 20,
                  child: Text(
                    currentScene?.title ?? '',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    height: 70,
                    color: Colors.black.withOpacity(0.5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: InkWell(
                            onTap: () async {
                              await audioPlayer.stop();
                              if (context.mounted) {
                                tour.setTourDetail(null);
                                SystemChrome.setPreferredOrientations([
                                  DeviceOrientation.portraitDown,
                                  DeviceOrientation.portraitUp
                                ]);
                                Navigator.pop(context);
                              }
                            },
                            child: const Icon(
                              Icons.arrow_back_ios_new_rounded,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: IconButton(
                            disabledColor: Colors.grey,
                            onPressed: audio == null
                                ? null
                                : () async {
                                    debugPrint("pressed");
                                    if (isPlaying) {
                                      await audioPlayer.pause();
                                    } else {
                                      await audioPlayer.play(
                                          UrlSource("$domain/${audio.path}"));
                                    }
                                  },
                            icon: Icon(
                              isPlaying ? Icons.volume_up : Icons.volume_off,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: InkWell(
                            onTap: () async {
                              await audioPlayer.stop();
                              if (context.mounted) {
                                Navigator.pushNamed(
                                    context, RouteName.atlasScreen);
                              }
                            },
                            child: const Icon(
                              Icons.map,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }
        },
      ),
    );
  }
}
