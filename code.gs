function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Data POST tidak ditemukan");
    }

    // Ambil parameter sheet, default ke 'Sheet1'
    let sheetName = "Sheet1";
    if (e.parameter && e.parameter.sheet) {
      sheetName = e.parameter.sheet;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    const contentType = e.postData.type;
    let data;

    if (contentType === "application/x-www-form-urlencoded") {
      const params = e.postData.contents.split("&").reduce((acc, pair) => {
        const [key, val] = pair.split("=");
        acc[decodeURIComponent(key)] = decodeURIComponent(val || "");
        return acc;
      }, {});
      data = JSON.parse(params.data);
    } else {
      data = JSON.parse(e.postData.contents);
    }

    let newRow;
    if (sheetName === "finance") {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "ID",
          "Nomer",
          "Tanggal",
          "Kategori",
          "Jumlah",
          "Metode",
          "Keterangan",
          "Sumber",
          "Timestamp",
        ]);
      }
      newRow = [
        data.id || "",
        data.nomer || "",
        data.tanggal || "",
        data.kategori || "",
        data.jumlah || "",
        data.metode || "",
        data.keterangan || "",
        data.sumber || "",
        new Date().toLocaleString("id-ID"),
      ];
    } else if (sheetName === "akun") {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Nomor Akun",
          "Nama Lengkap",
          "Tanggal Tes",
          "Tanggal Bayar",
          "Nominal Bayar",
          "Alamat",
          "Status Pembayaran",
        ]);
      }
      // Status otomatis
      let status = "Belum Lunas";
      if (parseInt(data.nominalbayar) === 350000) status = "Lunas";
      newRow = [
        data.nomorakun || "",
        data.namalengkap || "",
        data.tanggaltes || "",
        data.tanggalbayar || "",
        data.nominalbayar || "",
        data.alamat || "",
        status,
      ];
    } else if (sheetName === "customer") {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "No",
          "Nama",
          "Jenis Tes",
          "No HP",
          "Waktu Proses",
          "Status Tes",
          "Nominal Pembayaran",
          "Status Pembayaran",
          "Akun Tes",
          "Konsultan",
        ]);
      }
      newRow = [
        data.no || "",
        data.nama || "",
        data.jenis_tes || "",
        data.no_hp || "",
        data.waktu_proses || "",
        data.status_tes || "",
        data.nominal_pembayaran || "",
        data.status_pembayaran || "",
        data.akun_tes || "",
        data.konsultan || "",
      ];
    } else if (sheetName === "temporary") {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "No",
          "Nama Pembayar",
          "Nama Yang di Tes",
          "Nominal",
          "Metode Pembayaran",
        ]);
      }
      newRow = [
        data.no || "",
        data.nama_pembayar || "",
        data.nama_yang_dites || "",
        data.nominal || "",
        data.metode_pembayaran || "",
      ];
    } else {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
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
        ]);
      }
      newRow = [
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
    }

    sheet.appendRow(newRow);
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGetWithPagination(e) {
  try {
    let sheetName = "Sheet1";
    if (e.parameter && e.parameter.sheet) {
      sheetName = e.parameter.sheet;
    }

    const page = parseInt(e.parameter.page) || 1;
    const limit = parseInt(e.parameter.limit) || 10;
    const search = e.parameter.search || "";

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const dataRange = sheet.getDataRange();

    if (dataRange.getNumRows() <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          data: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            limit: limit,
          },
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const values = dataRange.getValues();
    const headers = values[0];
    let dataRows = values.slice(1);

    // Filter jika ada search
    if (search) {
      const searchLower = search.toLowerCase();
      dataRows = dataRows.filter((row) => {
        return row.some((cell) =>
          cell.toString().toLowerCase().includes(searchLower)
        );
      });
    }

    // Hitung pagination
    const totalItems = dataRows.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = dataRows.slice(startIndex, endIndex);

    // Format data
    const data = paginatedData.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase().replace(/\s+/g, "")] = row[index] || "";
      });

      if (sheetName === "customer") {
        return {
          no: obj.no || "",
          nama: obj.nama || "",
          jenistes: obj.jenistes || "",
          nohp: obj.nohp || "",
          waktuproses: obj.waktuproses || "",
          statustes: obj.statustes || "",
          nominalpembayaran: obj.nominalpembayaran || "",
          statuspembayaran: obj.statuspembayaran || "",
          akuntes: obj.akuntes || "",
          konsultan: obj.konsultan || "",
        };
      } else if (sheetName === "temporary") {
        return {
          no: obj.no || "",
          namapembayar: obj.namapembayar || "",
          namayangdites: obj.namayangdites || "",
          nominal: obj.nominal || "",
          metodepembayaran: obj.metodepembayaran || "",
        };
      } else if (sheetName === "finance") {
        return {
          id: obj.id || "",
          nomer: obj.nomer || "",
          tanggal: obj.tanggal || "",
          kategori: obj.kategori || "",
          jumlah: obj.jumlah || "",
          metode: obj.metode || "",
          keterangan: obj.keterangan || "",
          sumber: obj.sumber || "",
          timestamp: obj.timestamp || "",
        };
      } else if (sheetName === "akun") {
        return {
          nomorakun: obj.nomorakun || "",
          namalengkap: obj.namalengkap || "",
          tanggaltes: obj.tanggaltes || "",
          tanggalbayar: obj.tanggalbayar || "",
          nominalbayar: obj.nominalbayar || "",
          alamat: obj.alamat || "",
          statuspembayaran: obj.statuspembayaran || "",
        };
      } else {
        return {
          id: obj.id || "",
          timestamp: obj.timestamp || "",
          nama: obj.nama || "",
          nohp: obj.nohp || "",
          sekolah: obj.sekolah || "",
          jabatan: obj.jabatan || "",
          tipejari: obj.tipejari || "",
          indikasi: obj.indikasi || "",
          keterangan: obj.keterangan || "",
          followup: obj.followup || "",
        };
      }
    });

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        data: data,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          limit: limit,
        },
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Update doGet untuk support paginasi
function doGet(e) {
  if (e.parameter.pagination === "true") {
    return doGetWithPagination(e);
  }

  // Kode doGet existing tetap sama
  try {
    let sheetName = "Sheet1";
    if (e.parameter && e.parameter.sheet) {
      sheetName = e.parameter.sheet;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const dataRange = sheet.getDataRange();

    if (dataRange.getNumRows() <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, data: [] })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const values = dataRange.getValues();
    const headers = values[0];
    const dataRows = values.slice(1);

    const data = dataRows.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase().replace(/\s+/g, "")] = row[index] || "";
      });

      if (sheetName === "finance") {
        return {
          id: obj.id || "",
          nomer: obj.nomer || "",
          tanggal: obj.tanggal || "",
          kategori: obj.kategori || "",
          jumlah: obj.jumlah || "",
          metode: obj.metode || "",
          keterangan: obj.keterangan || "",
          sumber: obj.sumber || "",
          timestamp: obj.timestamp || "",
        };
      } else if (sheetName === "akun") {
        return {
          nomorakun: obj.nomorakun || "",
          namalengkap: obj.namalengkap || "",
          tanggaltes: obj.tanggaltes || "",
          tanggalbayar: obj.tanggalbayar || "",
          nominalbayar: obj.nominalbayar || "",
          alamat: obj.alamat || "",
          statuspembayaran: obj.statuspembayaran || "",
        };
      } else if (sheetName === "customer") {
        return {
          no: obj.no || "",
          nama: obj.nama || "",
          jenis_tes: obj.jenistes || "",
          no_hp: obj.nohp || "",
          waktu_proses: obj.waktuproses || "",
          status_tes: obj.statustes || "",
          nominal_pembayaran: obj.nominalpembayaran || "",
          status_pembayaran: obj.statuspembayaran || "",
          akun_tes: obj.akuntes || "",
          konsultan: obj.konsultan || "",
        };
      } else if (sheetName === "temporary") {
        return {
          no: obj.no || "",
          nama_pembayar: obj.namapembayar || "",
          nama_yang_dites: obj.namayangdites || "",
          nominal: obj.nominal || "",
          metode_pembayaran: obj.metodepembayaran || "",
        };
      } else {
        return {
          id: obj.id || "",
          timestamp: obj.timestamp || "",
          nama: obj.nama || "",
          nohp: obj.nohp || "",
          sekolah: obj.sekolah || "",
          jabatan: obj.jabatan || "",
          tipejari: obj.tipejari || "",
          indikasi: obj.indikasi || "",
          keterangan: obj.keterangan || "",
          followup: obj.followup || "",
        };
      }
    });

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, data: data })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(
    ContentService.MimeType.TEXT
  );
}
