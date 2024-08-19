class Category {
  final int id;
  final String name;
  final String description;
  final String imagePath;
  final String questionPath;
  final String displayPicturePath;
  Category(this.id, this.name, this.description, this.imagePath,
      this.questionPath, this.displayPicturePath);
}

final List<Category> categories = [
/*   Category(
      0,
      'Theme 1: Exploration of the Cosmos',
      'Embark on a celestial adventure into the vast unknown. Unravel the mysteries of the universe, from the captivating formation of stars and galaxies to the mind-boggling black holes and the quest for extraterrestrial life. Explore the wonders of our solar system, delve into the secrets of space exploration, and contemplate the profound questions about the origin, evolution, and future of our cosmos. This theme will ignite your curiosity and inspire you to ponder the grand scale of existence.',
      'assets/images/number-one.png',
      'assets/data/theme1.json',
      'assets/images/theme1.png'),
  Category(
      1,
      'Theme 2: Unraveling the Mysteries of Life',
      'Immerse yourself in the captivating world of biology, where you\'ll discover the intricate mechanisms of life, from the microscopic workings of cells to the complex interactions of ecosystems. Explore the diversity of living organisms, from the simplest bacteria to the most complex animals, and unravel the fascinating processes of evolution and adaptation. Investigate the delicate balance of the natural world and learn about the challenges and opportunities we face in preserving our planet for future generations.',
      'assets/images/number-two.png',
      'assets/data/theme2.json',
      'assets/images/theme2.jpg'),
  Category(
      2,
      'Theme 3: Decoding the Language of Technology',
      'Embark on a journey through the ever-evolving realm of technology. Discover the remarkable ways technology is shaping our lives, from the devices we use daily to the groundbreaking innovations that are changing the world. Explore the fascinating history of technological advancements, delve into the intricate world of coding and programming, and understand the potential and challenges of artificial intelligence, robotics, and the digital revolution. This theme will equip you with the knowledge and skills to navigate the ever-changing landscape of technology and contribute to its future development.',
      'assets/images/number-three.png',
      'assets/data/theme3.json',
      'assets/images/theme3.jpg'),
  Category(
      3,
      'Theme 4: Navigating the Labyrinth of History',
      'Delve into the captivating chronicles of the past, where you\'ll explore the events and personalities that shaped the world we know today. Uncover the stories of ancient civilizations, momentous wars and revolutions, and the rise and fall of empires. Analyze the impact of historical figures and movements, learn from the successes and failures of the past, and gain valuable insights into the complexities of human society. This theme will broaden your understanding of the present and equip you to navigate the future with a deeper perspective.',
      'assets/images/number-four.png',
      'assets/data/theme4.json',
      'assets/images/theme4.jpg'),
  Category(
      4,
      'Theme 5: Unveiling the Wonders of Art and Culture',
      'Immerse yourself in the diverse expressions of human creativity through art and culture. Explore the captivating world of painting, sculpture, music, literature, and dance, and discover how these artistic forms reflect the human experience and inspire us to connect with ourselves and others. Delve into the rich tapestry of cultures around the world, appreciate the beauty and significance of traditional art forms, and understand the power of artistic expression to challenge, provoke, and inspire.',
      'assets/images/number-five.png',
      'assets/data/theme5.json',
      'assets/images/theme5.jpg'), */
  Category(
      1,
      "Chuyên đề 1. Lịch sử Lâm Đồng giai đoạn 1893 – 1945s",
      "Giới thiệu ngắn về Lâm Đồng trong giai đoạn thuộc địa Pháp là một hành trình phát triển đầy biến động, từ quá trình khám phá và quản lý vùng đất đến tình hình kinh tế - xã hội dưới thế chế thực dân Pháp. Trải qua những thăng trầm của lịch sử, Lâm Đồng chứng kiến sự hình thành của chi bộ Cộng sản đầu tiên, cùng với những biến cố trong phong trào cách mạng 1930 – 1931 và 1936 – 1939. \nĐặc biệt, diễn biến của Cách mạng tháng Tám năm 1945 đã ghi dấu những cột mốc quan trọng trên đất Lâm Đồng, với ý nghĩa lớn trong lịch sử cách mạng Việt Nam. Những sự kiện này không chỉ là bước ngoặt quan trọng trong chặng đường phấn đấu giành độc lập, mà còn là những nguồn động viên quý báu cho sự phát triển sau này của vùng đất này.",
      'assets/images/number-one.png',
      'assets/data/chuyende1.json',
      'assets/images/chuyende1.jpg'),
  Category(
      2,
      "Chuyên đề 2. Văn hoá một số dân tộc thiểu số ở Lâm Đồng",
      "Lâm Đồng, với đa dạng vùng đất và đa ngôn ngữ, là nơi sinh sống của nhiều dân tộc thiểu số độc đáo. Nét khái quát về họ không chỉ là về số lượng và địa bàn, mà còn là về đời sống kinh tế. Có những dân tộc như K'Ho, Chơ Ro, M'Nông, Chăm, có sự phân bố chính tại các huyện như Lạc Dương, Đơn Dương, Đức Trọng, với một cộng đồng đông đảo. \nVăn hoá của những dân tộc này tạo nên một bức tranh đa sắc màu với văn hoá vật chất phản ánh qua nghệ thuật trang trí độc đáo, tín ngưỡng và phong tục đậm chất bản địa, cùng những lễ hội tuyệt vời. Văn hóa M'Nông, ví dụ, thể hiện qua nét độc đáo của những nghi lễ đám ma truyền thống và văn hóa văn học của họ. \nTrách nhiệm trân trọng, bảo tồn và phát huy bản sắc văn hóa của các dân tộc thiểu số là một ưu tiên quan trọng. Việc quảng bá giá trị văn hóa này không chỉ là sự duy trì của quá khứ mà còn làm giàu thêm cho sự đa dạng văn hóa của toàn bộ cộng đồng, là cơ hội để những giá trị truyền thống được chắt lọc và truyền đạt qua thế hệ.",
      'assets/images/number-two.png',
      'assets/data/chuyende2.json',
      'assets/images/chuyende2.jpeg'),
  Category(
      3,
      "Chuyên đề 3. Văn học dân gian tỉnh Lâm Đồng",
      "Văn học dân gian của Lâm Đồng, như một tinh hoa của văn hóa địa phương, là nơi thể hiện đặc điểm riêng biệt và độc đáo. Để hiểu rõ hơn về nền văn hóa này, ta cần nhận biết các đặc điểm cơ bản, từ ngôn ngữ, lối kể chuyện đến đề tài thường xuất hiện trong các tác phẩm dân gian. \nPhân tích giá trị nội dung và nghệ thuật của văn học dân gian Lâm Đồng thông qua việc đọc hiểu các tác phẩm sẽ giúp ta nhìn nhận sâu sắc về tâm hồn và tư duy của những người sáng tác. Sự thống nhất và khác biệt với văn học dân gian Việt Nam cũng là một chủ đề quan trọng, là cơ hội để ta thấu hiểu sự đa dạng và phong phú của văn hóa dân gian Việt Nam. \nCuối cùng, trân trọng di sản nghệ thuật của người xưa qua các sáng tác văn học dân gian Lâm Đồng không chỉ là việc gìn giữ mà còn là việc tôn vinh những giá trị văn hóa độc đáo, làm giàu thêm tầm nhìn và kiến thức về văn hóa của cộng đồng.",
      'assets/images/number-three.png',
      'assets/data/chuyende3.json',
      'assets/images/chuyende3.webp'),
  Category(
      4,
      "Chuyên đề 4. Hoạt động sản xuất nông, lâm nghiệp, thuỷ sản; công nghiệp ở tỉnh Lâm Đồng",
      "Lâm Đồng, với địa hình đa dạng và khí hậu ôn đới, đóng vai trò quan trọng trong phát triển nông lâm ngư nghiệp. Ngành nông nghiệp tại đây đa dạng với sự phát triển mạnh mẽ của cây lúa, cà phê, hoa màu và các loại rau củ. Lâm nghiệp cũng đóng góp lớn với diện tích rừng phong phú, cung cấp nguồn gỗ và sản phẩm lâm sản đa dạng. \nTrong lĩnh vực thuỷ sản, nhờ các hệ thống hồ nuôi cá và đồng ruộng, Lâm Đồng có sự đa dạng về loại cá và đạt được sự phát triển ổn định. \nBên cạnh đó, ngành công nghiệp ở Lâm Đồng cũng có những bước tiến vững chắc, đặc biệt là trong lĩnh vực chế biến nông sản và thực phẩm. Sự đa dạng này phản ánh rõ trong cấu trúc kinh tế của tỉnh.",
      'assets/images/number-four.png',
      'assets/data/chuyende4.json',
      'assets/images/chuyende4.jpeg'),
  Category(
      5,
      "Chuyên đề 5. Đô thị hoá và ảnh hưởng của đô thị hoá đến phát triển kinh tế - xã hội - môi trường tỉnh Lâm Đồng",
      "Đô thị hoá đang là một xu hướng đặc trưng của nền kinh tế - xã hội hiện đại, và tỉnh Lâm Đồng không phải nằm ngoại lệ. Sự gia tăng nhanh chóng của đô thị hóa đã tạo ra nhiều ảnh hưởng đồng thời đối mặt với những thách thức về môi trường và phát triển bền vững. \nThực trạng này không chỉ tác động tích cực đến phát triển kinh tế, mà còn đặt ra những thách thức về hạ tầng, an sinh xã hội và môi trường sống. Sự tập trung dân cư tại các khu đô thị đã làm gia tăng áp lực lên nguồn nước, năng lượng và giao thông, đồng thời ảnh hưởng đến môi trường tự nhiên. \nĐể giải quyết những thách thức này, cần đề xuất và thực hiện các giải pháp phát triển đô thị có chủ đích và bền vững. Việc xây dựng hạ tầng, quản lý và phân bố dân cư một cách hợp lý, cùng với việc bảo vệ môi trường là những biện pháp quan trọng. Tăng cường các chính sách hỗ trợ doanh nghiệp và kích thích đầu tư vào các lĩnh vực có thể tạo năng lực cạnh tranh cho đô thị cũng là một hướng đi quan trọng. Những giải pháp này giúp Lâm Đồng không chỉ phát triển đô thị một cách bền vững mà còn duy trì được cân bằng giữa phát triển kinh tế và bảo vệ môi trường.",
      'assets/images/number-five.png',
      'assets/data/chuyende5.json',
      'assets/images/chuyende5.jpeg'),
];
