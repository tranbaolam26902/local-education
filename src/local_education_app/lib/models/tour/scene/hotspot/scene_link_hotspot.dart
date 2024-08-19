// ignore_for_file: public_member_api_docs, sort_constructors_first

class SceneLinkHotspot {
  String id;
  String sceneId;
  String linkId;
  int sceneIndex;
  String title;
  int x;
  int y;
  int z;
  SceneLinkHotspot({
    required this.id,
    required this.sceneId,
    required this.linkId,
    required this.sceneIndex,
    required this.title,
    required this.x,
    required this.y,
    required this.z,
  });

  factory SceneLinkHotspot.fromMap(Map<String, dynamic> map) {
    return SceneLinkHotspot(
      id: map['id'] as String,
      sceneId: map['sceneId'] as String,
      linkId: map['linkId'] as String,
      sceneIndex: map['sceneIndex'] as int,
      title: map['title'] as String,
      x: map['x'] as int,
      y: map['y'] as int,
      z: map['z'] as int,
    );
  }
}
