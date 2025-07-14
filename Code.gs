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

    // Debug: log apa yang diterima
    console.log("=== DOPOST DEBUG ===");
    console.log("e.postData:", e.postData);
    console.log("e.parameter:", e.parameter);

    // Coba debug dulu
    const debugResult = debugFormData(e);
    if (debugResult) {
      data = debugResult;
    } else {
      // Handle berbagai format input
      if (e.postData && e.postData.contents) {
        if (e.postData.type === "application/x-www-form-urlencoded") {
          // Handle form-encoded data
          const params = new URLSearchParams(e.postData.contents);
          const dataParam = params.get("data");
          if (dataParam) {
            data = JSON.parse(dataParam);
          } else {
            throw new Error("No data parameter found in form");
          }
        } else {
          // Jika data dikirim sebagai JSON body
          data = JSON.parse(e.postData.contents);
        }
      } else if (e.parameter && e.parameter.data) {
        // Jika data dikirim sebagai form parameter
        try {
          data = JSON.parse(e.parameter.data);
        } catch (parseError) {
          console.error("Error parsing parameter data:", parseError);
          throw new Error(
            "Failed to parse data parameter: " + parseError.toString()
          );
        }
      } else {
        throw new Error(
          "No valid data received. postData: " +
            JSON.stringify(e.postData) +
            ", parameter: " +
            JSON.stringify(e.parameter)
        );
      }
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
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Fungsi test untuk memastikan script berfungsi
function testFunction() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    console.log(
      "Spreadsheet Name:",
      SpreadsheetApp.getActiveSpreadsheet().getName()
    );
    console.log("Sheet Name:", sheet.getName());
    console.log("Last Row:", sheet.getLastRow());

    // Test tambah data
    const testRow = [
      "TEST",
      new Date(),
      "Test User",
      "081234567890",
      "Test School",
      "Test Position",
      "jempol",
      "positif",
      "Test",
      "2025-01-01",
    ];
    sheet.appendRow(testRow);
    console.log("Test data added successfully");

    return "Test berhasil!";
  } catch (error) {
    console.error("Error in test:", error);
    return "Test error: " + error.toString();
  }
}

// Fungsi untuk handle form submission dengan logging yang detail
function debugFormData(e) {
  try {
    console.log("=== DEBUG FORM DATA ===");
    console.log("e.postData:", JSON.stringify(e.postData, null, 2));
    console.log("e.parameter:", JSON.stringify(e.parameter, null, 2));

    if (e.postData && e.postData.contents) {
      console.log("Raw contents:", e.postData.contents);

      // Coba parse form data jika ini adalah form-encoded
      if (e.postData.type === "application/x-www-form-urlencoded") {
        const params = new URLSearchParams(e.postData.contents);
        console.log("Parsed form params:");
        for (const [key, value] of params.entries()) {
          console.log(`  ${key}: ${value}`);
        }

        const dataParam = params.get("data");
        if (dataParam) {
          console.log("Data parameter found:", dataParam);
          try {
            const parsedData = JSON.parse(dataParam);
            console.log("Successfully parsed data:", parsedData);
            return parsedData;
          } catch (parseError) {
            console.error("Failed to parse data parameter:", parseError);
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error in debugFormData:", error);
    return null;
  }
}
