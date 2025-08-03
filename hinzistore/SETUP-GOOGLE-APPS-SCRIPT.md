# 🚀 PANDUAN SETUP GOOGLE APPS SCRIPT - PENTING!

## ⚠️ WAJIB IKUTI LANGKAH INI AGAR TIDAK ADA CORS ERROR!

### 1. Copy Code ke Google Apps Script

1. Buka [script.google.com](https://script.google.com)
2. Klik **"New Project"**
3. Hapus semua code default
4. Copy & paste semua isi dari file `appscript.gs`
5. Rename project jadi **"HinziStore API"**

### 2. Buat Google Sheets

1. Buka [sheets.google.com](https://sheets.google.com)
2. Buat spreadsheet baru
3. Rename jadi **"HinziStore Database"**
4. Copy URL spreadsheet
5. Di Google Apps Script, klik **Extensions > Apps Script**
6. Ganti `SpreadsheetApp.getActiveSpreadsheet()` dengan `SpreadsheetApp.openById("ID_SPREADSHEET_KAMU")`

### 3. Deploy sebagai Web App (PALING PENTING!)

1. Di Google Apps Script, klik **Deploy > New Deployment**
2. Klik gear icon ⚙️ > pilih **"Web app"**
3. Setting seperti ini:
   ```
   Description: HinziStore API v1
   Execute as: Me (email kamu)
   Who has access: Anyone, even anonymous ⚠️ PENTING!
   ```
4. Klik **Deploy**
5. Copy **Web App URL** yang dikasih
6. Paste URL itu ke `index.html` di bagian `scriptURL`

### 4. Testing

1. Buka URL Web App di browser
2. Harus muncul response JSON seperti: `{"success":true,"transactions":[]}`
3. Kalau muncul "Authorization required", ulangi langkah 3

### 5. Update URL di index.html

```javascript
const scriptURL = "URL_WEB_APP_KAMU_DISINI";
```

### 6. Troubleshooting CORS

Kalau masih CORS error:

1. **Re-deploy Web App**:

   - Deploy > Manage Deployments
   - Klik Edit (pencil icon)
   - Ubah version ke "New"
   - Deploy lagi

2. **Cek Permission**:

   - Pastikan "Who has access" = **"Anyone, even anonymous"**
   - JANGAN "Anyone with Google account"

3. **Test Manual**:
   - Buka URL: `WEB_APP_URL?action=getTransactions`
   - Harus return JSON, bukan HTML login

### 📱 Contoh URL yang Benar:

```
https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXX/exec
```

### ❌ Yang SALAH:

```
https://script.google.com/macros/d/1XXXXXXX/edit  ← INI SALAH!
```

## 🎯 Tips Sukses:

- ✅ Deploy sebagai Web App, bukan Share
- ✅ Permission: "Anyone, even anonymous"
- ✅ Execute as: "Me"
- ✅ Re-deploy kalau ada perubahan code
- ✅ Test URL manual di browser dulu

## 🆘 Masih Error?

1. Coba buka file di web server (bukan file:// protocol)
2. Upload ke GitHub Pages atau Netlify
3. Atau jalankan local server: `python -m http.server 8000`

**Happy Coding! 🎉**
