# HinziStore - Sistem Pencatatan Transaksi Modern

Aplikasi web untuk mencatat transaksi dengan fitur Quick Actions dan UI modern menggunakan Tailwind CSS.

## ✨ Fitur

- **Quick Actions**: Produk populer yang dapat dipilih dengan cepat
- **ID Pembeli**: Field otomatis untuk produk yang memerlukan ID (Game, E-Wallet)
- **Nota Digital**: Generate nota dengan logo HinziStore dan fitur cetak/WhatsApp
- **Price Protection**: Harga nota dilindungi dari manipulasi dengan validasi server
- **Dark/Light Mode**: Pergantian tema otomatis dengan penyimpanan preferensi
- **Responsive Design**: Tampilan optimal di semua perangkat
- **Dual Database**: Sheet finance (transaksi) dan item (referensi harga)

## 📋 Persiapan Setup

### 1. Google Sheets Setup

1. Buat Google Spreadsheet baru
2. Sheet akan dibuat otomatis oleh script:
   - `finance`: Menyimpan data transaksi utama
   - `item`: Referensi harga untuk validasi nota
   - `quick_actions`: Data produk Quick Actions dengan flag ID Pembeli

### 2. Google Apps Script Setup

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru
3. Ganti code default dengan code dari `appscript.gs`
4. Bind script ke spreadsheet:
   - Extensions → Apps Script
   - Atau dari script.google.com: Resources → Libraries → pilih spreadsheet

### 3. Deploy Web App

1. Di Apps Script, klik **Deploy** → **New deployment**
2. Pilih type: **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**
5. Copy **Web app URL**

### 4. Update HTML Configuration

Edit `index.html` baris 219:

```javascript
const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

Ganti `YOUR_SCRIPT_ID` dengan URL Web App yang sudah di-deploy.

## 🚀 Struktur Data

### Sheet: `transaksi`

| Kolom     | Tipe   | Deskripsi                |
| --------- | ------ | ------------------------ |
| Timestamp | Date   | Waktu otomatis           |
| No HP     | Text   | Nomor HP customer        |
| Deskripsi | Text   | Deskripsi produk/layanan |
| Kategori  | Text   | Kategori produk          |
| Harga     | Number | Harga transaksi          |
| Tanggal   | Text   | Format: DD/MM/YYYY       |
| Jam       | Text   | Format: HH:MM:SS         |

### Sheet: `quick_actions`

| Kolom     | Tipe   | Deskripsi                                          |
| --------- | ------ | -------------------------------------------------- |
| Kategori  | Text   | Kategori produk (Pulsa, Data, PLN, Game, E-Wallet) |
| Deskripsi | Text   | Nama produk/layanan                                |
| Harga     | Number | Harga jual                                         |

## 📱 Cara Penggunaan

### Quick Actions

1. Produk populer akan dimuat otomatis dari Google Sheets
2. Klik card produk untuk mengisi form secara otomatis
3. Tinggal masukkan No HP dan submit

### Manual Entry

1. Isi form manual untuk produk custom
2. Semua field wajib diisi
3. Harga akan diformat otomatis

### Theme Toggle

- Klik icon sun/moon di pojok kanan atas
- Preferensi tema disimpan di localStorage

## 🔧 Kustomisasi

### Menambah Quick Actions

1. Buka Google Sheets
2. Edit sheet `quick_actions`
3. Tambah baris baru dengan format: Kategori | Deskripsi | Harga
4. Refresh halaman web untuk melihat perubahan

### Sample Data Quick Actions

Script akan otomatis membuat sample data:

- **Pulsa**: 5K - 100K (interval 5K)
- **Data**: Paket kuota 1GB - 10GB
- **PLN**: Token 20K - 100K
- **Game**: Mobile Legends, Free Fire, PUBG
- **E-Wallet**: DANA, OVO, GoPay

## 🎨 Customisasi Tampilan

### Warna Theme

Edit CSS variables di `index.html`:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
}
```

### Logo

Ganti logo di navigation:

```html
<img src="logo.ico" alt="HinziStore" class="w-8 h-8" />
```

## 🔗 Integration dengan TesDIA

Aplikasi ini adalah bagian dari ecosystem TesDIA:

- **TesDIA**: `/tesdia/` - Customer management & digital nota
- **HinziStore**: `/hinzistore/` - Transaction recording

## 📞 Support

Untuk pertanyaan atau bantuan setup, silakan hubungi developer atau buat issue di repository ini.

---

**HinziStore** - Powered by Google Apps Script & Tailwind CSS
