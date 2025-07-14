function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    // Skip header row jika ada data
    if (data.length <= 1) {
      return createResponse({ success: true, data: [] });
    }

    const records = data.slice(1).map((row) => ({
      id: row[0],
      timestamp: row[1],
      nama: row[2],
      nohp: row[3],
      sekolah: row[4],
      jabatan: row[5],
      tipejari: row[6],
      indikasi: row[7],
      keterangan: row[8],
      followup: row[9],
    }));

    return createResponse({ success: true, data: records });
  } catch (error) {
    console.error("Error di doGet:", error);
    return createResponse({
      success: false,
      message: "Error: " + error.toString(),
    });
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    let data;

    // Handle berbagai format input
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error("No data received");
    }

    // Log data yang diterima
    console.log("Data yang diterima:", data);

    // Tambahkan header jika sheet kosong
    if (sheet.getLastRow() === 0) {
      const headers = [
        "ID",
        "Timestamp",
        "Nama",
        "No HP",
        "Sekolah",
        "Jabatan",
        "Tipe Jari",
        "Indikasi",
        "Keterangan",
        "Follow Up",
      ];
      sheet.appendRow(headers);
      console.log("Header ditambahkan");
    }

    const newRow = [
      data.id || "",
      data.timestamp || new Date().toLocaleString("id-ID"),
      data.nama || "",
      data.nohp || "",
      data.sekolah || "",
      data.jabatan || "",
      data.tipejari || "",
      data.indikasi || "",
      data.keterangan || "",
      data.followup || "",
    ];

    console.log("Row yang akan ditambahkan:", newRow);

    sheet.appendRow(newRow);

    console.log("Data berhasil ditambahkan ke sheet");

    return createResponse({ success: true, message: "Data berhasil disimpan" });
  } catch (error) {
    console.error("Error di doPost:", error);
    return createResponse({
      success: false,
      message: "Error: " + error.toString(),
    });
  }
}

// Fungsi helper untuk membuat response dengan CORS headers
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi test untuk memastikan script berfungsi
function testFunction() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    console.log("Spreadsheet Name:", SpreadsheetApp.getActiveSpreadsheet().getName());
    console.log("Sheet Name:", sheet.getName());
    console.log("Last Row:", sheet.getLastRow());
    
    // Test tambah data
    const testRow = ['TEST', new Date(), 'Test User', '081234567890', 'Test School', 'Test Position', 'jempol', 'positif', 'Test', '2025-01-01'];
    sheet.appendRow(testRow);
    console.log("Test data added successfully");
    
    return "Test berhasil!";
  } catch (error) {
    console.error("Error in test:", error);
    return "Test error: " + error.toString();
  }
}
