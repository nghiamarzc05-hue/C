# Học đa ngôn ngữ (Flashcard) — Static web app

## Chạy trên máy (không cần cài gì)
- Mở `index.html` trực tiếp **hoặc** (khuyến nghị) dùng server tĩnh:
  - VS Code: cài extension “Live Server” → Right click `index.html` → Open with Live Server.

## Deploy GitHub Pages / Cloudflare Pages
- Upload toàn bộ thư mục dự án.
- Entry: `index.html` (không có backend).

## Dữ liệu mặc định
- `data/default-pack.en-US.json` (gói tiếng Anh khởi động)
- 8 chủ đề, 223 mục.

## Nhập dữ liệu
- Tab **Nhập/Xuất** → chọn tệp → **Nhập (Gộp)** hoặc **Nhập (Thay thế)**.
- JSON: theo mẫu `data/mau-tai-len.json`.
- CSV: yêu cầu tối thiểu các cột: `term, meaning_vi, example, example_vi` (cột `topic`/`topicId` khuyến nghị).

## Lưu trữ
- Dữ liệu và tiến độ lưu trong `localStorage` trên trình duyệt.


## Âm thanh (Nghe)
- Nút **Nghe** đọc từ hiện tại (và ví dụ khi đang lật mặt sau).
- Phím tắt: **L** nghe, **S** dừng.
- Cài đặt: chọn giọng, tốc độ, cao độ, âm lượng.
- Nếu mục có `audioUrl` (tùy chọn) sẽ ưu tiên phát file đó trước.

## Giao diện
- Nút 🌗 trên header để đổi nhanh Sáng/Tối.
- Nếu chọn **Tự động** sẽ theo giao diện hệ thống (prefers-color-scheme).


## Refactor & Tối ưu
- Giảm biến global bằng IIFE.
- Cache querySelector để tăng tốc DOM.
- Debounce ô tìm kiếm.
- Bật strict mode toàn cục.


## Ghi nhớ (Memory)
- Trên mỗi thẻ có nút **Đã nhớ / Chưa nhớ / Bỏ đánh dấu**.
- Bộ lọc trạng thái áp dụng cho danh sách học: **Tất cả / Đã nhớ / Chưa nhớ / Chưa đánh dấu**.
- Sidebar hiển thị **Thống kê bộ lọc** (đếm số mục theo từng trạng thái trong phạm vi lọc hiện tại).

## Âm thanh & Chế độ
- **Tự động (Auto-play)**: khi sang thẻ mới sẽ tự phát âm.
- **Thủ công**: không tự phát, chỉ phát khi bấm **Nghe**.
