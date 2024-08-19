// ignore_for_file: public_member_api_docs, sort_constructors_first

class ApiResponse {
  bool isSuccess;
  int statusCode;
  List<String> errors;
  ApiResponse({
    required this.isSuccess,
    required this.statusCode,
    required this.errors,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'isSuccess': isSuccess,
      'statusCode': statusCode,
      'errors': errors,
    };
  }

  factory ApiResponse.fromMap(Map<String, dynamic> map) {
    final List<dynamic> errorData = map['errors'] ?? [];
    final List<String> errors = errorData.map((e) {
      return e.toString();
    }).toList();
    return ApiResponse(
      isSuccess: map['isSuccess'] as bool,
      statusCode: map['statusCode'] as int,
      // errors: List<String>.from(
      //   (map['errors'] as List<String>),
      // ),
      errors: errors,
    );
  }
}
