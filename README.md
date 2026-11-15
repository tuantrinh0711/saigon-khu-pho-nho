# Sài Gòn: Khu Phố Nhỏ

Mini game Babylon.js góc nhìn thứ ba trong một khu phố Sài Gòn giả tưởng. Mục tiêu: nhận bưu kiện ở xe bánh mì rồi giao cho khách ở đầu hẻm.

## Chạy trên Windows

1. Cài Node.js và kết nối Internet (Babylon.js tải từ CDN).
2. Mở terminal trong thư mục này.
3. Chạy `node serve.cjs`.
4. Mở `http://127.0.0.1:4173/` trong trình duyệt.

Nếu cổng 4173 đang được dùng, đóng máy chủ demo cũ hoặc chạy `set PORT=4174` trước `node serve.cjs`, rồi mở cổng 4174.

## Điều khiển

- **W A S D**: di chuyển.
- **← / →**: xoay camera quanh nhân vật.
- **Shift**: chạy hoặc tăng tốc khi lái xe.
- **E**: vào/ra tiệm bánh mì, lên/xuống xe, nhận/giao bưu kiện theo vị trí.
- Đi qua mép đường để bước lên vỉa hè; khi ở trên xe, **W/S** tăng/giảm ga, **A/D** bẻ lái.
- **R**: bắt đầu lại nhiệm vụ.

## Mã nguồn và tài nguyên

- `index.html`: menu, HUD và màn hình kết quả.
- `style.css`: giao diện và bố cục responsive.
- `src/game.js`: cảnh Babylon.js, nhân vật 3D tạo từ mesh, animation idle/walk/run/ride, cửa tiệm có nội thất, điều khiển xe máy và nhiệm vụ.
- `assets/painterly-saigon-wall.png`: chất liệu tường sơn cũ vẽ tay dùng cho mặt tiền cửa tiệm.
- `assets/player-walk-atlas-white.png` và `assets/player-front-atlas-white.png`: hình tham khảo cho thiết kế nhân vật; game hiện không tải các sprite này.
- `assets/player-back.png`: hình tham khảo nhân vật.
- `assets/saigon-lowpoly-concept.png`: concept art tham khảo bối cảnh.
- `PLAN.md`: lộ trình phát triển và phạm vi các mốc.

Bản hiện tại là mini game 3D với một nhiệm vụ khép kín. Nhân vật procedural bằng mesh 3D có idle/walk/run, dáng nghiêng nhẹ, bước chân có trọng lượng và hiệu ứng vòng sáng xanh khi di chuyển; animation được tạo trong code, chưa dùng rig xương GLB. Chi tiết về những bước tiếp theo nằm trong [PLAN.md](PLAN.md).

