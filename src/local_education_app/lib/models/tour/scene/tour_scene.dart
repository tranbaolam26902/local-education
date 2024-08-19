// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:local_education_app/models/tour/audio/scene_audio.dart';
import 'package:local_education_app/models/tour/scene/hotspot/scene_info_hotspot.dart';
import 'package:local_education_app/models/tour/scene/hotspot/scene_link_hotspot.dart';

class TourScene {
  String id;
  String tourId;
  String title;
  int index;
  int x;
  int y;
  int z;
  String urlPreview;
  String urlImage;
  SceneAudio? audio;
  List<SceneLinkHotspot> linkHotspots;
  List<SceneInfoHotspot> infoHotspots;
  TourScene({
    required this.id,
    required this.tourId,
    required this.title,
    required this.index,
    required this.x,
    required this.y,
    required this.z,
    required this.urlPreview,
    required this.urlImage,
    required this.audio,
    required this.linkHotspots,
    required this.infoHotspots,
  });

  factory TourScene.fromMap(Map<String, dynamic> map) {
    final List<dynamic> linkData = map['linkHotspots'] ?? [];
    final audio = map['audio'] as Map<String, dynamic>?;
    final List<dynamic> infoData = map['infoHotspots'] ?? [];
    final List<SceneLinkHotspot> linkHotspots = linkData.map((e) {
      return SceneLinkHotspot.fromMap(e);
    }).toList();
    final List<SceneInfoHotspot> infoHotspots = infoData.map((e) {
      return SceneInfoHotspot.fromMap(e);
    }).toList();

    return TourScene(
      id: map['id'] as String,
      tourId: map['tourId'] as String,
      title: map['title'] as String,
      index: map['index'] as int,
      x: (map['x'] as num).toInt(),
      y: (map['y'] as num).toInt(),
      z: (map['z'] as num).toInt(),
      urlPreview: map['urlPreview'] as String,
      urlImage: map['urlImage'] as String,
      audio: audio != null ? SceneAudio.fromMap(audio) : null,
      linkHotspots: linkHotspots,
      infoHotspots: infoHotspots,
    );
  }
}
