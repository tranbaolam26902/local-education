// ignore_for_file: public_member_api_docs, sort_constructors_first
class SceneAudio {
  String id;
  String path;
  String thumbnailPath;
  bool? autoPlay;
  bool? loopAuto;
  SceneAudio({
    required this.id,
    required this.path,
    required this.thumbnailPath,
    required this.autoPlay,
    required this.loopAuto,
  });

  factory SceneAudio.fromMap(Map<String, dynamic> map) {
    return SceneAudio(
      id: map['id'] as String,
      path: map['path'] as String,
      thumbnailPath: map['thumbnailPath'] as String,
      autoPlay: map['autoPlay'],
      loopAuto: map['loopAuto'],
    );
  }
}
