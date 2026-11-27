# Tentang Linkku

Personal Media Fetcher untuk desainer dan kreator: bebas iklan perantara, tanpa verifikasi berlapis, dan mengambil stream resolusi asli tanpa watermark.

## Fitur Utama

- **TikTok:** Unduh MP4 Full HD (Tanpa Watermark), MP4 Standar, Cover HD, dan Audio MP3 asli.
- **Instagram:** Unduh video Reels dan Post asli.
- **Twitter / X:** Unduh video kualitas tertinggi dan gambar resolusi penuh.
- **Direct Video:** Stream dan unduh file video langsung (`.mp4`, `.webm`, `.mov`).
- **Pratinjau Video Instan:** Putar video langsung di halaman tanpa harus dialihkan ke aplikasi atau pop-up login.
- **Riwayat Lokal:** Menyimpan riwayat tautan yang pernah diinspeksi di browser perangkat tanpa database server.
- **Tampilan Kalm Ala GitHub:** Mona Sans + IBM Plex Mono, dukungan penuh mode gelap dan mode terang.

---

## 1. Menjalankan di Laptop (Penggunaan Lokal)

```bash
# Jalankan server pengembangan
npm run dev
```

Buka `http://localhost:3000` di browsermu.

Untuk menghentikan: tekan `Ctrl + C` di jendela terminal.

---

## 2. Cara Pasang Online Gratis 24 Jam di Render (Tanpa Kartu Kredit)

1. Masuk ke [GitHub](https://github.com) dan buat repository baru (misal: `linkku`).
2. Di folder project ini, jalankan perintah git:
   ```bash
   git add .
   git commit -m "feat: initial linkku media fetcher"
   git branch -M main
   git remote add origin https://github.com/<username-kamu>/linkku.git
   git push -u origin main
   ```
3. Buka [render.com](https://render.com) lalu pilih **Get Started for Free** (login pakai akun GitHub).
   - Render tidak meminta nomor kartu kredit sama sekali.
4. Klik tombol **New +** lalu pilih **Web Service**.
5. Pilih repository `linkku` dari akun GitHub kamu.
6. Pada kolom pengaturan:
   - **Name:** `linkku` (atau nama lain yang kamu suka)
   - **Runtime:** Pilih **Docker**
   - **Instance Type:** Pilih **Free**
7. Klik **Deploy Web Service**.
8. Tunggu Render selesai membuat container. Dalam beberapa menit kamu akan mendapatkan link HTTPS gratis resmi (misal: `https://linkku.onrender.com`).
