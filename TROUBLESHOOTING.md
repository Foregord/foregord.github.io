# Troubleshooting Guide - Tesdia Data Manager

## 🔍 Debugging Apps Script

### 1. Error "Cannot read properties of undefined (reading 'postData')"

**Penyebab:**

- Parameter `e` yang diterima fungsi `doPost` adalah `undefined` atau `null`
- Kemungkinan deployment Apps Script belum benar atau ada masalah permission

**Solusi:**

1. Buka Google Apps Script Editor
2. Jalankan fungsi `testFunction()` untuk memastikan script dapat akses spreadsheet
3. Jalankan fungsi `testDoPost()` untuk test manual parsing data
4. Jalankan fungsi `checkSpreadsheetStatus()` untuk cek status spreadsheet
5. Jalankan fungsi `checkWebAppDeployment()` untuk cek deployment

### 2. Langkah Debugging di Google Apps Script

```javascript
// 1. Test koneksi spreadsheet
function testFunction() // Jalankan di Script Editor

// 2. Test manual doPost
function testDoPost() // Jalankan di Script Editor

// 3. Cek status spreadsheet
function checkSpreadsheetStatus() // Jalankan di Script Editor

// 4. Cek deployment web app
function checkWebAppDeployment() // Jalankan di Script Editor
```

### 3. Deploy Web App yang Benar

1. **Klik Deploy > New Deployment**
2. **Pilih type: Web app**
3. **Description**: Tesdia Data Manager
4. **Execute as**: Me (your email)
5. **Who has access**: Anyone
6. **Klik Deploy**
7. **Copy URL yang diberikan**
8. **Paste ke `index.html` di variabel `APPS_SCRIPT_URL`**

### 4. Permission Yang Diperlukan

Apps Script memerlukan permission untuk:

- ✅ Google Sheets API
- ✅ Google Drive API (untuk akses file)
- ✅ External web access (untuk menerima request dari website)

### 5. Cek Log Eksekusi

1. Buka Apps Script Editor
2. Klik **Executions** di sidebar kiri
3. Lihat log error yang muncul
4. Cek **View logs** untuk detail error

### 6. Test Connection dari Website

1. Buka website `foregord.github.io`
2. Klik tombol **"Test Connection"**
3. Cek console browser (F12) untuk melihat log
4. Jika berhasil, akan muncul alert sukses
5. Cek Google Sheets untuk melihat data test

### 7. Common Issues & Solutions

| Issue                 | Penyebab                      | Solusi                                                    |
| --------------------- | ----------------------------- | --------------------------------------------------------- |
| CORS Error            | Cross-origin request blocked  | Gunakan form submission via iframe (sudah diimplementasi) |
| 403 Permission Denied | Apps Script tidak punya akses | Re-deploy dengan "Execute as: Me"                         |
| 404 Not Found         | URL Apps Script salah         | Pastikan URL deployment benar                             |
| Parse Error           | Data format tidak sesuai      | Cek encoding dan format JSON                              |
| Spreadsheet Not Found | ID spreadsheet salah          | Pastikan Apps Script terhubung ke spreadsheet yang benar  |

### 8. URL Apps Script Format

URL yang benar memiliki format:

```
https://script.google.com/macros/s/[SCRIPT_ID]/exec
```

Contoh:

```
https://script.google.com/macros/s/AKfycbxrJu3nqCQdR16Ebi2WLdaQKg4eCqK68ZWUoPO9iZcNP4uMTdCERCqfLb2lc8pR9eepDQ/exec
```

### 9. Debugging Step-by-Step

1. **Cek Apps Script:**

   - Jalankan `testFunction()` - pastikan tidak error
   - Jalankan `checkSpreadsheetStatus()` - pastikan koneksi spreadsheet OK
   - Jalankan `testDoPost()` - pastikan parsing data OK

2. **Cek Deployment:**

   - Pastikan web app sudah di-deploy
   - Pastikan permission "Anyone" dan "Execute as: Me"
   - Copy URL yang benar

3. **Cek Website:**

   - Pastikan URL Apps Script benar di `index.html`
   - Jalankan "Test Connection" dan lihat hasilnya
   - Cek console browser untuk error

4. **Cek Google Sheets:**
   - Pastikan spreadsheet dapat diakses
   - Pastikan header sudah benar
   - Cek data yang masuk dari test

### 10. Logs yang Perlu Diperhatikan

**Di Apps Script Execution logs:**

- `=== DOPOST DEBUG ===`
- `=== DEBUG FORM DATA ===`
- `Data yang diterima:`
- `Row yang akan ditambahkan:`
- `Data berhasil ditambahkan ke sheet`

**Di Browser Console:**

- `Mengirim data ke Google Sheets:`
- `Form data yang dikirim:`
- `Submitting form ke:`
- `Form berhasil disubmit ke Google Sheets`

### 11. Contact & Support

Jika masih mengalami masalah, screenshot:

1. Error di Apps Script Execution logs
2. Error di browser console (F12)
3. Setting deployment Apps Script
4. Header dan isi Google Sheets

---

_Last updated: $(date)_
