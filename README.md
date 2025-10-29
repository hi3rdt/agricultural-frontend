# Frontend Hệ Thống Giám Sát Nông Nghiệp Thông Minh 📊

Chào mừng bạn đến với frontend (giao diện người dùng) của hệ thống giám sát nông nghiệp thông minh! Dự án này được xây dựng bằng **Next.js** và **Tailwind CSS** (với **Shadcn UI**) để tạo ra một dashboard trực quan, cho phép bạn:

* Theo dõi dữ liệu cảm biến (nhiệt độ, độ ẩm không khí, độ ẩm đất) theo thời gian thực.
* Xem lịch sử dữ liệu qua các biểu đồ tương tác.
* Điều khiển máy bơm (chế độ tự động/thủ công) và cài đặt ngưỡng độ ẩm.
* Xem thư viện ảnh được chụp từ ESP32-CAM và yêu cầu chụp ảnh mới.
* Nhận các phân tích và lời khuyên tưới tiêu từ AI (Gemini).

Giao diện này kết nối đến [Backend API](https://github.com/hi3rdt/agricultural-backend) (FastAPI) để lấy dữ liệu và gửi lệnh điều khiển.

---

## ✨ Tính Năng Giao Diện

* **Dashboard Tổng Quan:** Hiển thị các chỉ số cảm biến mới nhất, trạng thái hệ thống.
* **Biểu Đồ Lịch Sử:** Trực quan hóa dữ liệu nhiệt độ, độ ẩm không khí và độ ẩm đất theo thời gian.
* **Điều Khiển Máy Bơm:** Giao diện để chuyển đổi chế độ, bật/tắt bơm thủ công và đặt ngưỡng độ ẩm.
* **Thư Viện Ảnh ESP32-CAM:** Hiển thị các ảnh đã chụp, cho phép xem, tải về, xóa và yêu cầu chụp ảnh mới.
* **Phân Tích AI:** Hiển thị lời khuyên tưới tiêu/bón phân từ Gemini.
* **Thiết Kế Responsive:** Hoạt động tốt trên cả máy tính và thiết bị di động.

---

## 🛠️ Công Nghệ Sử Dụng

* **Framework:** Next.js (App Router)
* **Ngôn ngữ:** TypeScript
* **UI:** React, Tailwind CSS, Shadcn UI
* **Biểu đồ:** Recharts
* **Quản lý gói:** pnpm (dựa trên lỗi `pnpm-lock.yaml` trước đó)

---

## 🚀 Hướng Dẫn Cài Đặt và Chạy (Local)

### 1. Chuẩn Bị

* **Node.js:** Bạn cần cài đặt Node.js (phiên bản 18.x trở lên được khuyến nghị). Node.js bao gồm `npm` (trình quản lý gói).
    * **Tải Node.js:** Truy cập [nodejs.org](https://nodejs.org/) và tải về bộ cài đặt phù hợp với hệ điều hành của bạn (Windows, macOS, Linux). 
    * **Kiểm tra:** Sau khi cài đặt, mở terminal (Command Prompt, PowerShell, Git Bash, etc.) và gõ `node -v` và `npm -v` để xác nhận cài đặt thành công.
* **pnpm (Khuyến nghị):** Dự án này có vẻ sử dụng `pnpm` (dựa trên lỗi `pnpm-lock.yaml`). Cài đặt `pnpm` bằng `npm` sau khi đã cài Node.js:
    ```bash
    npm install -g pnpm
    ```
* **Git:** Cần có Git để tải code về.

### 2. Cài Đặt

1.  **Tải code về:** Mở terminal và chạy lệnh:
    ```bash
    git clone [https://github.com/hi3rdt/agricultural-frontend.git](https://github.com/hi3rdt/agricultural-frontend.git)
    cd agricultural-frontend
    ```

2.  **Cài đặt thư viện:** Sử dụng `pnpm` để cài đặt các gói cần thiết:
    ```bash
    pnpm install
    ```
    *Lệnh này sẽ đọc file `package.json` và `pnpm-lock.yaml` để cài đúng các phiên bản thư viện.*

3.  **Thiết Lập Kết Nối API Backend:**
    * Tạo một file mới tên là **`.env.local`** trong thư mục gốc (`agricultural-frontend`).
    * Mở file `.env.local` và thêm vào URL của backend FastAPI. **Thay thế URL bằng địa chỉ thật** (local hoặc Render).
        ```dotenv
        # File .env.local - Biến môi trường cho frontend
        
        # URL của backend FastAPI
        # Ví dụ khi chạy local:
        NEXT_PUBLIC_API_BASE_URL="[http://127.0.0.1:8080](http://127.0.0.1:8080)" 
        
        # Ví dụ khi backend deploy trên Render:
        # NEXT_PUBLIC_API_BASE_URL="[https://agricultural-backend.onrender.com](https://agricultural-backend.onrender.com)" 
        ```
    * **Quan trọng:** Biến môi trường cho frontend trong Next.js phải bắt đầu bằng `NEXT_PUBLIC_` để có thể truy cập được từ phía client (trình duyệt). Code trong các component (ví dụ: `SensorCharts.tsx`) cần được sửa lại để đọc URL từ `process.env.NEXT_PUBLIC_API_BASE_URL` thay vì hardcode.

### 3. Chạy Development Server

Sau khi cài đặt xong, khởi động server phát triển:

```bash
pnpm dev
