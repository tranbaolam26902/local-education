// ignore_for_file: public_member_api_docs, sort_constructors_first
class SceneInfoHotspot {
  String id;
  String sceneId;
  String title;
  String description;
  String address;
  String thumbnailPath;
  String lessonId;
  int x;
  int y;
  int z;
  SceneInfoHotspot({
    required this.id,
    required this.sceneId,
    required this.title,
    required this.description,
    required this.address,
    required this.lessonId,
    required this.thumbnailPath,
    required this.x,
    required this.y,
    required this.z,
  });

  factory SceneInfoHotspot.fromMap(Map<String, dynamic> map) {
    return SceneInfoHotspot(
      id: map['id'] as String,
      sceneId: map['sceneId'] as String,
      title: map['title'] as String,
      description: map['description'] as String,
      address: map['address'] as String,
      thumbnailPath: map['thumbnailPath'] as String,
      lessonId: map['lessonId'] as String,
      x: map['x'] as int,
      y: map['y'] as int,
      z: map['z'] as int,
    );
  }
}
