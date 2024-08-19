// ignore_for_file: public_member_api_docs, sort_constructors_first

class AtlasPin {
  String id;
  double top;
  double left;
  int sceneIndex;
  String title;
  String thumbnailPath;
  String atlasId;

  AtlasPin({
    required this.id,
    required this.top,
    required this.left,
    required this.sceneIndex,
    required this.title,
    required this.thumbnailPath,
    required this.atlasId,
  });

  factory AtlasPin.fromMap(Map<String, dynamic> map) {
    return AtlasPin(
      id: map['id'] as String,
      top: map['top'] as double,
      left: map['left'] as double,
      sceneIndex: map['sceneIndex'] as int,
      title: map['title'] as String,
      thumbnailPath: map['thumbnailPath'] as String,
      atlasId: map['atlasId'] as String,
    );
  }
}
