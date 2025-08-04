function doPost(e) {
  try {
    const action = e.parameter.action || "saveTransaction";

    if (action === "saveTransaction") {
      return saveTransaction(e);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Unknown action" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action || "getTransactions";

    if (action === "getTransactions") {
      const result = getTransactions();

      // Support JSONP callback untuk mengatasi CORS
      const callback = e.parameter.callback;
      if (callback) {
        const jsonpResult = `${callback}(${result.getContent()})`;
        return ContentService.createTextOutput(jsonpResult).setMimeType(
          ContentService.MimeType.JAVASCRIPT
        );
      }

      return result;
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Unknown action" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const errorResult = JSON.stringify({
      success: false,
      message: error.toString(),
    });

    // Support JSONP callback untuk error juga
    const callback = e.parameter.callback;
    if (callback) {
      const jsonpError = `${callback}(${errorResult})`;
      return ContentService.createTextOutput(jsonpError).setMimeType(
        ContentService.MimeType.JAVASCRIPT
      );
    }

    return ContentService.createTextOutput(errorResult).setMimeType(
      ContentService.MimeType.JSON
    );
  }
}

function saveTransaction(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create or get finance sheet
  let sheet = ss.getSheetByName("finance");
  if (!sheet) {
    sheet = ss.insertSheet("finance");
    sheet.appendRow(["Tanggal", "No HP", "Deskripsi", "Nominal"]);

    // Format kolom No HP sebagai teks agar 0 di depan tidak hilang
    const range = sheet.getRange("B:B"); // Kolom B (No HP)
    range.setNumberFormat("@"); // @ berarti format teks
  }

  const now = new Date();
  const tanggal =
    now.toLocaleDateString("id-ID") +
    " " +
    now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Get nomor HP sebagai string dan pastikan tetap sebagai teks
  const nohp = String(e.parameter.nohp || "");

  // Save transaction dengan format yang tepat
  const newRow = sheet.getLastRow() + 1;

  // Set nilai satu per satu dengan format yang tepat
  sheet.getRange(newRow, 1).setValue(tanggal); // Tanggal
  sheet.getRange(newRow, 2).setValue(nohp).setNumberFormat("@"); // No HP sebagai teks
  sheet.getRange(newRow, 3).setValue(e.parameter.deskripsi || ""); // Deskripsi
  sheet.getRange(newRow, 4).setValue(Number(e.parameter.harga) || 0); // Nominal sebagai angka

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Transaction saved successfully",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getTransactions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("finance");

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, transactions: [] })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, transactions: [] })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const rows = data.slice(1);

  // Sort by newest first (reverse order)
  rows.reverse();

  const transactions = rows.map((row) => {
    return {
      tanggal: row[0] || "",
      nohp: String(row[1] || ""), // Pastikan nomor HP tetap sebagai string
      deskripsi: row[2] || "",
      nominal: Number(row[3]) || 0,
    };
  });

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, transactions: transactions })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Utility function untuk memformat ulang kolom No HP yang sudah ada
function fixPhoneNumberFormat() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("finance");

  if (!sheet) {
    Logger.log("Sheet 'finance' tidak ditemukan");
    return;
  }

  // Format kolom B (No HP) sebagai teks
  const range = sheet.getRange("B:B");
  range.setNumberFormat("@");

  // Jika ada data yang sudah kehilangan 0 di depan, bisa diperbaiki manual
  // atau dengan menambahkan 0 di depan jika nomor HP kurang dari 11 digit
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    // Skip header
    let nohp = String(data[i][1] || "");

    // Jika nomor HP berupa angka dan dimulai dengan 8, tambahkan 0 di depan
    if (nohp.length > 0 && nohp.charAt(0) === "8" && nohp.length >= 10) {
      nohp = "0" + nohp;
      sheet
        .getRange(i + 1, 2)
        .setValue(nohp)
        .setNumberFormat("@");
    }
  }

  Logger.log("Format nomor HP berhasil diperbaiki");
}
