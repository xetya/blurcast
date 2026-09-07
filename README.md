# Blurcast

Generator video latar blur bergerak dari cover album — mirip tampilan lirik
di Apple Music. 100% jalan di browser, tanpa server/backend.

## Cara pakai

1. Upload gambar cover album.
2. Pilih rasio video: 1:1, 9:16, atau 16:9.
3. Pilih intensitas gerakan: Subtle / Medium / Energetic.
4. Atur durasi (5 detik – 5 menit).
5. (Opsional) centang "Sertakan versi MP4" kalau butuh file MP4, bukan hanya WebM.
6. Klik **Generate video**, tunggu sampai selesai, lalu unduh.

Warna pada animasi diambil otomatis dari gambar album yang diupload.

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload 3 file ini ke root repo: `index.html`, `coi-serviceworker.js`, `README.md`.
3. Buka **Settings → Pages**.
4. Di bagian **Build and deployment**, pilih **Deploy from a branch**, branch
   `main`, folder `/ (root)`.
5. Simpan, tunggu sebentar, lalu buka `https://<username>.github.io/<nama-repo>/`.

Halaman mungkin **reload otomatis satu kali** saat pertama dibuka — ini normal,
disebabkan oleh `coi-serviceworker.js` yang mengaktifkan mode "cross-origin
isolated" agar konversi MP4 bisa memakai encoder multi-thread yang lebih cepat.

## Catatan teknis

- **WebM** dihasilkan langsung lewat `MediaRecorder` API browser — cepat, dan
  bisa diputar di hampir semua aplikasi/editor modern.
- **MP4** dihasilkan dengan mengonversi WebM tadi memakai
  [ffmpeg.wasm](https://ffmpegwasm.netlify.app/) langsung di browser
  (tidak ada upload ke server manapun). Proses ini jauh lebih berat dari
  sekadar merekam WebM — untuk klip yang panjang (mendekati 5 menit) bisa
  memakan waktu beberapa kali lipat dari durasi videonya, tergantung
  spesifikasi perangkat. Kalau cuma butuh cepat, pakai WebM saja.
- Tidak ada data yang dikirim ke server mana pun — semua render dan encode
  terjadi di perangkat pengguna.
- Browser yang didukung: Chrome, Edge, Firefox versi terbaru. Safari punya
  dukungan `MediaRecorder`/`captureStream` yang lebih terbatas.
