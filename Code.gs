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
    console.log("e:", e);
    console.log("e.postData:", e ? e.postData : "e is null/undefined");
    console.log("e.parameter:", e ? e.parameter : "e is null/undefined");

    // Cek jika e adalah null/undefined
    if (!e) {
      throw new Error("Parameter e is null or undefined");
    }

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

// Fungsi untuk handle OPTIONS request (CORS preflight)
function doOptions(e) {
  console.log("=== OPTIONS REQUEST ===");
  console.log("e:", e);

  return ContentService.createTextOutput("").setMimeType(
    ContentService.MimeType.TEXT
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
      "TEST-" + Date.now(),
      new Date().toLocaleString("id-ID"),
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

// Fungsi untuk handle manual test dari Script Editor
function testDoPost() {
  try {
    console.log("=== MANUAL TEST DOPOST ===");

    // Simulasi parameter yang diterima dari form
    const mockEvent = {
      postData: {
        type: "application/x-www-form-urlencoded",
        contents:
          "data=" +
          encodeURIComponent(
            JSON.stringify({
              id: "TEST-" + Date.now(),
              timestamp: new Date().toLocaleString("id-ID"),
              nama: "Manual Test User",
              nohp: "081234567890",
              sekolah: "Manual Test School",
              jabatan: "Manual Test Position",
              tipejari: "jempol",
              indikasi: "positif",
              keterangan: "Manual test dari Script Editor",
              followup: "2025-01-01",
            })
          ),
      },
    };

    const result = doPost(mockEvent);
    console.log("Manual test result:", result.getContent());

    return "Manual test doPost berhasil!";
  } catch (error) {
    console.error("Error in manual test:", error);
    return "Manual test error: " + error.toString();
  }
}

// Fungsi untuk handle form submission dengan logging yang detail
function debugFormData(e) {
  try {
    console.log("=== DEBUG FORM DATA ===");

    // Cek jika e adalah null/undefined
    if (!e) {
      console.log("Parameter e is null or undefined");
      return null;
    }

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

// Fungsi untuk cek status dan permission spreadsheet
function checkSpreadsheetStatus() {
  try {
    console.log("=== CHECKING SPREADSHEET STATUS ===");

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();

    console.log("Spreadsheet ID:", spreadsheet.getId());
    console.log("Spreadsheet Name:", spreadsheet.getName());
    console.log("Spreadsheet URL:", spreadsheet.getUrl());
    console.log("Sheet Name:", sheet.getName());
    console.log("Sheet ID:", sheet.getSheetId());
    console.log("Last Row:", sheet.getLastRow());
    console.log("Last Column:", sheet.getLastColumn());

    // Cek header jika ada
    if (sheet.getLastRow() > 0) {
      const headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];
      console.log("Headers:", headers);
    }

    // Cek permission
    const editors = spreadsheet.getEditors();
    console.log("Editors count:", editors.length);
    console.log("Current user:", Session.getActiveUser().getEmail());

    return {
      success: true,
      spreadsheetId: spreadsheet.getId(),
      spreadsheetName: spreadsheet.getName(),
      sheetName: sheet.getName(),
      lastRow: sheet.getLastRow(),
      currentUser: Session.getActiveUser().getEmail(),
    };
  } catch (error) {
    console.error("Error checking spreadsheet:", error);
    return {
      success: false,
      error: error.toString(),
    };
  }
}

// Fungsi untuk cek deployment web app
function checkWebAppDeployment() {
  try {
    console.log("=== CHECKING WEB APP DEPLOYMENT ===");

    // Info yang bisa dicek dari script
    const scriptId = ScriptApp.getScriptId();
    console.log("Script ID:", scriptId);

    // Cek trigger yang ada
    const triggers = ScriptApp.getProjectTriggers();
    console.log("Triggers count:", triggers.length);

    // Cek service yang enabled
    const services = ScriptApp.getServices();
    console.log("Available services:", services);

    return {
      success: true,
      scriptId: scriptId,
      triggersCount: triggers.length,
      services: services,
    };
  } catch (error) {
    console.error("Error checking web app:", error);
    return {
      success: false,
      error: error.toString(),
    };
  }
}
