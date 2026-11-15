# Lộ trình game — Sài Gòn: Khu Phố Nhỏ

## Tầm nhìn

Một game phiêu lưu hành động góc nhìn thứ ba cho PC, gợi cảm giác tự do khám phá thành phố của GTA Vice City nhưng có bối cảnh, nhân vật, bản đồ, nhiệm vụ, hình ảnh và âm thanh nguyên bản tại Sài Gòn. Không sử dụng thương hiệu hoặc tài nguyên trích xuất từ GTA.

## Bản chơi được hiện tại — Hoàn thành

Một mini game khép kín trong một khu phố nhỏ:

- Màn hình mở đầu và màn hình hoàn thành.
- Đường phố Sài Gòn cách điệu: ngã tư, vỉa hè, cửa tiệm có biển tiếng Việt, xe máy, cây và xe bánh mì.
- Phong cách tranh vẽ: tường cửa tiệm phủ chất liệu sơn cũ, nhân vật bo tròn và phối màu đất dịu.
- Nhân vật 3D ghép từ mesh Babylon.js: đầu có mặt, tóc, áo, quần, túi đeo, tay và chân.
- Animation idle/walk/run được tạo bằng chuyển động các khớp mesh; nhân vật xoay theo hướng di chuyển.
- WASD di chuyển; phím mũi tên trái/phải xoay camera; Shift chạy; R chơi lại.
- Nhiệm vụ có hai bước: nhận bưu kiện ở xe bánh mì, giao cho khách ở đầu hẻm bằng phím E.
- HUD theo dõi mục tiêu, thời gian, lời nhắc tương tác và kết quả nhiệm vụ.

## Công nghệ hiện tại

- Babylon.js và JavaScript thuần cho scene, camera, điều khiển và trạng thái game.
- HTML/CSS cho menu, HUD và màn hình kết quả.
- Nhân vật hiện là mô hình procedural từ các mesh và pivot riêng; idle/walk/run cập nhật mỗi khung hình bằng JavaScript.
- Máy chủ Node.js cục bộ trong `serve.cjs`; Babylon.js lấy từ CDN nên khi chạy cần Internet.

## Các giai đoạn phát triển tiếp

### 1. Hoàn thiện điều khiển nhân vật

- Tùy chọn thay mô hình procedural bằng model GLB có rig xương và clip idle/walk/run để tăng độ chi tiết.
- Thêm nhảy, dừng/chuyển động tự nhiên, giới hạn va chạm với mép đường.

### 2. Tăng độ sống cho khu phố

- Thay các khối hình bằng mô hình low-poly có vật liệu và chi tiết riêng.
- Thêm người bán hàng/khách với hội thoại, hoạt ảnh và phản ứng.
- Thêm xe chạy nền, âm thanh phố, bước chân và âm thanh tương tác.

### 3. Thêm gameplay

- Nhiều đơn hàng, thời hạn, tiền thưởng và điểm đánh giá.
- Hệ thống nhiệm vụ lưu trạng thái và bảng chọn nhiệm vụ.
- Cho phép lên/xuống xe máy, lái xe arcade, va chạm và camera lái riêng.

### 4. Mở rộng bản đồ

- Tách thành các block phố nhỏ có thể tái sử dụng.
- Thêm hẻm, cửa hàng, ngã tư và các khu phố khác nhau.
- Tạo bản đồ nhỏ, điểm nhiệm vụ và các lối đi rõ ràng.

### 5. Hoàn thiện bản PC

- Chuyển sang Vite/npm và khóa phiên bản Babylon.js thay vì phụ thuộc CDN.
- Thêm cài đặt đồ họa/âm thanh, lưu game, hỗ trợ tay cầm.
- Đóng gói Windows bằng Electron sau khi vòng chơi và hiệu năng ổn định.
- Kiểm tra nhiều độ phân giải, tối ưu texture và số đối tượng theo máy đích.

## Mốc kiểm tra

- **Mini game hiện tại:** vào phố → di chuyển → nhận bưu kiện → giao bưu kiện → màn hình hoàn thành → chơi lại.
- **Mốc 3D nhân vật:** mesh 3D có idle/walk/run đồng bộ với phím và tốc độ (đã hoàn thành); GLB có rig xương là nâng cấp tùy chọn.
- **Mốc khu phố:** va chạm, ít nhất một NPC tương tác và giao thông nền.
- **Mốc PC:** chạy ổn định ngoài trình duyệt thử nghiệm và có gói Windows cài/chạy được.

## Giới hạn hiện tại

Đây là một mini game hoàn chỉnh trong phạm vi một nhiệm vụ, chưa phải game thế giới mở dài như Vice City. Công trình là mô hình khối low-poly; nhân vật là mesh 3D tự ghép với chuyển động khớp đơn giản, chưa phải model GLB có rig xương chi tiết.

Máy đã kiểm tra trước đó là ASUS GL553VD, Intel i5-7300HQ và RAM 16 GB. GPU chưa xác nhận trực tiếp. Nên bắt đầu mở rộng theo từng block phố, đo hiệu năng rồi mới thêm NPC/xe.

