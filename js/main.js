//!----------------------------------------------------------------I. BIẾN TOÀN CỤC ----------------------------------------------------------------

const pathDataSources = "./file/Data_Sources.json";
const pathDataUser = "./file/Data_User.json";
var kiemTraTruocKhiTinh = false;
var kiemTraThongBaoBiTrung = "";
var anHienThongBaoSoatLoi = false;
var bangThongKe;
var jsonDataUser = "",
  jsonDataSources = "";

//!---------------------------------------------------------------II. CHƯƠNG TRÌNH CON ----------------------------------------------------------------------

//* THAO TÁC THỜI GIAN THỰC
/* 
? Tự động tín toán
? Thay đổi giao diện web phù hợp
? Lưu trữ dữ liệu tự đỘng vào indexdDB
*/
function XuLyThoiGianThucToanWebsite() {
  //* Đối với input
  let doiTuongInput = document.getElementsByTagName("input");
  for (let i = 0; i < doiTuongInput.length; i++) {
    //Khi tính toán
    if (
      doiTuongInput[i].id !== "upload_TaiLenTepDuLieu" &&
      doiTuongInput[i].id !== "input_TenFileTaiXuong" && doiTuongInput[i].id.indexOf("ThietKe", 0) === -1
    ) {
      //* Sự kiện khi thay đổi giá trị input
      doiTuongInput[i].addEventListener("input", function () {
        //Xử lý thao tác cho toàn bộ website
        TuDongThaoTacTrenDoiTuong(this.id);

        //Tính toán
        document.getElementById("btn_calculator").click();

        //Cập nhật dữ liệu
        TuDongCapNhatThayDoiTuUser();

        //Lưu dữ liệu
        NhapDuLieuLuuTruWebsite();
      });
    }
  }

  //* Đối với Select
  let doiTuongSelect = document.getElementsByTagName("select");
  for (let i = 0; i < doiTuongSelect.length; i++) {
    if (doiTuongSelect[i].id !== "comboBox_DichSangNgonNguKhac" && doiTuongSelect[i].id.indexOf("ThietKe", 0) === -1) {
      doiTuongSelect[i].addEventListener("change", function () {
        //Xử lý thao tác cho toàn bộ website
        TuDongThaoTacTrenDoiTuong(this.id);

        //Tính toán
        document.getElementById("btn_calculator").click();

        //Cập nhật dữ liệu
        TuDongCapNhatThayDoiTuUser();

        //Lưu dữ liệu
        NhapDuLieuLuuTruWebsite();
      });
    }
  }

  //* Đối với button
  let doiTuongButton = document.getElementsByTagName("button");
  for (let i = 0; i < doiTuongButton.length; i++) {
    if (doiTuongButton[i].id.indexOf("btnInCal", 0) !== -1) {
      doiTuongButton[i].addEventListener("click", function () {
        //Xử lý thao tác cho toàn bộ website
        TuDongThaoTacTrenDoiTuong(this.id);

        //Tính toán
        document.getElementById("btn_calculator").click();

        //Cập nhật dữ liệu
        TuDongCapNhatThayDoiTuUser();

        //Lưu dữ liệu
        NhapDuLieuLuuTruWebsite();
      });
    }
  }
}

//! THAO TÁC VỚI INDEXDDB
//* Nhập nhiều key vào indexdDB
async function NhapDuLieuVaoIndexdDB(mangTrongMangKhoavaGiaTri) {
  await idbKeyval.setMany(mangTrongMangKhoavaGiaTri).catch((err) => console.log("Lỗi khi nhập dữ liệu vào IndexdDB", err));
}
//* Cập nhật dữ liệu vào indexdDB
async function CapNhatDuLieuVaoIndexdDB(khoa, giaTri) {
  await idbKeyval.update(khoa, (e) => (giaTri));
}
//* Lấy nhiều key từ indexdDB
async function LayDuLieuTuIndexdDB(mangKhoaTimKiem) {
  return await idbKeyval.getMany(mangKhoaTimKiem);
}
//* Xoá toàn bộ dữ liệu trong IndexdDB
async function XoaToanBoDuLieuIndexdDB() {
  await idbKeyval.clear();
}
//* Xoá database keyval-store
function XoaDataBase() {
  indexedDB.deleteDatabase("keyval-store");
}

//* ẨN HIỆN ĐỐI TƯỢNG DẠNG BLOCK
/*  
? Ẩn = true
? Hiện = flase
*/
function AnHienDoiTuongDangBlock(idDoiTuong, AnT_HienF) {
  //Code
  if (AnT_HienF === true) {
    document.getElementById(idDoiTuong).style.display = "none";
  } else {
    document.getElementById(idDoiTuong).style.display = "block";
  }
}

//* ẨN HIỆN ĐỐI TƯỢNG DẠNG FLEX
function AnHienDoiTuongDangFlex(idDoiTuong, AnT_HienF) {
  //Code
  if (AnT_HienF === true) {
    document.getElementById(idDoiTuong).style.display = "none";
  } else {
    document.getElementById(idDoiTuong).style.display = "flex";
  }
}

//* KHOÁ VÀ MỞ KHOÁ THAO TÁC MỘT ĐỐI TƯỢNG
function KhoaMoThaoTacDoiTuong(idDoiTuong, KhoaT_MoF, viTriTuyChon) {
  //Thực thi
  //Khoá
  if (KhoaT_MoF) {
    //Khoá cho tuỳ chọn select
    if (viTriTuyChon !== "") {
      document.getElementById(idDoiTuong).options[viTriTuyChon].disabled = true;
    }

    //Khoá bình thường
    else {
      document.getElementById(idDoiTuong).disabled = true;
    }
  }

  //Mở khoá
  else {
    //Khoá cho tuỳ chọn select
    if (viTriTuyChon !== "") {
      document.getElementById(idDoiTuong).options[
        viTriTuyChon
      ].disabled = false;
    }

    //Khoá bình thường
    else {
      document.getElementById(idDoiTuong).disabled = false;
    }
  }
}

//* HIỂN THỊ THÔNG BÁO TỪ MỘT CHUỖI ĐẦU VÀO
function HienThiThongBao(thongTinHienThi) {
  //* Hiện thông báo
  document.getElementById("thongBao").setAttribute("class", "toast show");
  document.getElementById("thongTinThongBao").innerHTML = thongTinHienThi;

  //* Ẩn sau 5 giây
  setTimeout(function () {
    document.getElementById("thongBao").setAttribute("class", "toast hide");
  }, 5000);

  //* Ẩn bằng nút đóng thông báo
  document
    .getElementById("dongThongBao")
    .addEventListener("click", function () {
      document.getElementById("thongBao").setAttribute("class", "toast hide");
    });
}

//* ĐIỀU KIỆN TRƯỚC KHI THỰC HIỆN TÍNH TOÁN SỐ LIỆU
/* 
? Thực hiện kiểm tra chuỗi ID đầu vào xem đã có số liệu đủ để thực hiện tính toán chưa
? Trường hợp chưa đủ điều kiện sẽ trả về false + hightlight vị trí chưa đủ điều kiện
? Trường hợp đủ điều kiện trả về bình thường 
*/
function KiemTraDieuKienTinhToan(jsonCanKiemTra) {
  // Khai báo biến
  let kiemTra = true;
  let kieuKiemTra = "";
  let bienLuuTam,
    bienThongBao = "",
    chuoiIDCuaJsonKiemTra = "";

  // Thực hiện
  for (let i = 0; i < jsonCanKiemTra.length; i++) {
    kieuKiemTra = jsonCanKiemTra[i].ID.slice(
      0,
      jsonCanKiemTra[i].ID.indexOf("_", 0)
    );

    //* Kiểm tra từng ID
    //? Combo box
    if (kieuKiemTra === "comboBox") {
      bienLuuTam = document.getElementById(jsonCanKiemTra[i].ID).selectedIndex;

      //? Chưa chọn thì highlight
      if (bienLuuTam === 0) {
        chuoiIDCuaJsonKiemTra =
          chuoiIDCuaJsonKiemTra + jsonCanKiemTra[i].ID + ", ";
        bienThongBao = bienThongBao + jsonCanKiemTra[i].Ten + "</br>";
        document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "#39ff14";
        kiemTra = false;
      }

      //? Ok thì trả về mặc định
      else {
        document.getElementById(jsonCanKiemTra[i].ID).style.borderColor =
          "#ced4da";
      }
    }

    //? Input
    else if (kieuKiemTra === "input") {
      bienLuuTam = document.getElementById(jsonCanKiemTra[i].ID).value;

      //? Chưa có dữ liệu
      if (bienLuuTam === "") {
        chuoiIDCuaJsonKiemTra =
          chuoiIDCuaJsonKiemTra + jsonCanKiemTra[i].ID + ", ";
        bienThongBao = bienThongBao + jsonCanKiemTra[i].Ten + "</br>";
        document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "#39ff14";
        kiemTra = false;
      }

      //? Đã có dữ liệU
      else {
        document.getElementById(jsonCanKiemTra[i].ID).style.borderColor =
          "#ced4da";
      }
    }
  }

  //* Tiến hành thông báo
  if (bienThongBao !== "") {
    if (window.kiemTraThongBaoBiTrung.indexOf(chuoiIDCuaJsonKiemTra, 0) === -1) {
      //? Chỉ thông báo khi không phải click nút tính toán
      if (window.anHienThongBaoSoatLoi === false) {
        HienThiThongBao(bienThongBao);
      }
      window.kiemTraThongBaoBiTrung = chuoiIDCuaJsonKiemTra + "@" + bienThongBao;
    } else {
      //? Xử lý thông báo lỗi để hiển thị khi click nút soát lỗi
      window.kiemTraThongBaoBiTrung = window.kiemTraThongBaoBiTrung.slice(
        0,
        window.kiemTraThongBaoBiTrung.indexOf("@", 0)
      );
      window.kiemTraThongBaoBiTrung = window.kiemTraThongBaoBiTrung + "@" + bienThongBao;
    }
    //? Hiển thị lại thông báo bình thường
    window.anHienThongBaoSoatLoi = false;

    //? Dừng tính toán
    window.kiemTraTruocKhiTinh = false;
  } else {
    //? Trả kết quả vào các biến bên dưới
    window.kiemTraTruocKhiTinh = true;
  }

  //* Trả về giá trị true or false
  return kiemTra;
}

//* KIỂM TRA THÔNG BÁO LỖI KHI THỰC HIỆN LỆNH
/*
? Kiểm tra chuỗi json đầu vào có đủ điều kiện thực hiện lệNh chưa
? Nếu chưa trả về faslse và thông báo lỗi và highlight vị trí lỗi
? Ngược lại trả về true
*/
function KiemTraDieuKienThucHienLenh(jsonCanKiemTra) {
  //Biến
  let thongBaoLoi = "";
  let traVe = true;

  //Code
  //* Tạo thông báo + highlight ô lỗi
  for (let i = 0; i < jsonCanKiemTra.length; i++) {
    //Biến
    let tenDoiTuong = jsonCanKiemTra[i].Ten;
    let idDoiTuong = jsonCanKiemTra[i].ID;
    let loaiKiemTra = document.getElementById(idDoiTuong).tagName;

    //?Nhập liệu
    if (loaiKiemTra === "INPUT") {
      kiemTra = document.getElementById(idDoiTuong).value;
      if (kiemTra === "") {
        document.getElementById(idDoiTuong).style.borderColor = "red";
        thongBaoLoi = thongBaoLoi + tenDoiTuong + "</br>";
        traVe = false;
      } else {
        document.getElementById(idDoiTuong).style.borderColor = "#ced4da";
      }
    }

    //? Chọn
    else if (loaiKiemTra === "SELECT") {
      kiemTra = document.getElementById(idDoiTuong).selectedIndex;
      if (kiemTra === 0) {
        document.getElementById(idDoiTuong).style.borderColor = "red";
        thongBaoLoi = thongBaoLoi + tenDoiTuong + "</br>";
        traVe = false;
      } else {
        document.getElementById(idDoiTuong).style.borderColor = "#ced4da";
      }
    }
  }

  //* Kiểm tra biến để thông báo
  if (traVe === false) {
    HienThiThongBao(thongBaoLoi);
  }

  //* Trả về true or false
  return traVe;
}

//* TỰ ĐỘNG CẬP NHẬT NHỮNG DỮ LIỆU MÀ USER THAY ĐỔI
/* 
? Mỗi khi người dùng thay đổi bất kỳ điều gì trên website sẽ được cập nhật để sau này lưu trữ khi người dùng đóng trình duyệT
? Điều này đảm bảo không mất dữ liệU ở phiên làm việc sau 
*/
function TuDongCapNhatThayDoiTuUser() {
  //Biến
  let linhVucTinhToan = "";
  let mangThucHien, mangTaiNguyen;

  //Chương trình con
  //* Trả về giá trị thực hiện + nhập lĩnh vực tính toán
  function GiaTriThucHien() {
    //Biến
    let indexLoai = TuDongLayDuLieu("comboBox_LinhVucTinhToan");
    let mangSoSanh = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriPhuThuoc;
    let mangLoai = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;

    //Thực hiện
    //* Dò vị trí giá trị
    for (let i = 0; i < mangSoSanh.length; i++) {
      if (mangSoSanh[i] === indexLoai) {
        linhVucTinhToan = mangLoai[i];
      }
    }

    //* Nhập lĩnh vực
    window.jsonDataUser.DuLieu.LinhVucTinhToan[0].GiaTri = indexLoai;
  }

  //Code
  //* Giá trị thực hiện + nhập lĩnh vực tính toán
  GiaTriThucHien();

  //* Nhập dữ liệu từng ID
  if (linhVucTinhToan !== "") {
    //* Tạo mảng thực hiện
    mangThucHien = window.jsonDataUser.DuLieu[linhVucTinhToan];
    mangTaiNguyen = window.jsonDataSources.CauTruc[linhVucTinhToan];

    //* Nhập tuần tự
    for (let i = 0; i < mangThucHien.length; i++) {
      //? Nếu nhập cho sơ đồ công nghệ
      if (mangThucHien[i].ID.indexOf("flowChart", 0) !== -1) {
        //Biến
        let _duLieuTaoCongTrinh;
        let _duLieuTaoDuongVe;
        let _duLieuCongTrinh;
        let _duLieuSoDo;

        //Thực hiện
        //* Tìm vị trí id trong mảng tài nguyên
        for (let j = 0; j < mangTaiNguyen.length; j++) {
          if (mangTaiNguyen[j].ID === mangThucHien[i].ID) {
            _duLieuTaoCongTrinh = mangTaiNguyen[j].TaoSoDo._TaoCongTrinh;
            _duLieuTaoDuongVe = mangTaiNguyen[j].TaoSoDo._TaoDuongVe;
            _duLieuCongTrinh = mangTaiNguyen[j].TaoSoDo._DanhSachCongTrinh;
            _duLieuSoDo = mangTaiNguyen[j].TaoSoDo._DuLieuSoDo;
          }
        }

        //* Nhập dữ liệu
        mangThucHien[i].GiaTri = window[_duLieuSoDo];
        mangThucHien[i].CongTrinhDonVi_Tep = window[_duLieuCongTrinh];
        mangThucHien[i].ChuoiCongTrinh = window[_duLieuTaoCongTrinh];
        mangThucHien[i].ChuoiDuongVe = window[_duLieuTaoDuongVe];
      }

      //? TrườNg hợp còn lại
      else {
        mangThucHien[i].GiaTri = TuDongLayDuLieu(mangThucHien[i].ID);
      }
    }
  }
}

//* DỮ LIỆU NHẬP VÀO WEB TỪ INDEXDDB VÀ FILE USER
/* 
? Dữ liệu được nhập tuần tự từ chuỗi json được lưu trong indexdDB và file người dùng tải lên web
? Sau khi thực hiện nhập xong sẽ thay đổi đối tượng cho phù hợp và lưu trữ lại dữ liệu mới và indexdDB
*/
function NapDuLieuChoWebTuIndexdDBVaFile() {
  //Khai báo biến
  let linhVucXuLy = "";
  let mangThucHien, mangTaiNguyen;

  //Chương trình con
  function LoaiXuLy() {
    //Biến
    let indexLoai = window.jsonDataUser.DuLieu.LinhVucTinhToan[0].GiaTri;
    let mangSoSanh = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriPhuThuoc;
    let mangLoai = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;

    //Thực hiện
    //* Dò vị trí giá trị
    for (let i = 0; i < mangSoSanh.length; i++) {
      if (mangSoSanh[i] === indexLoai) {
        linhVucXuLy = mangLoai[i];
      }
    }
  }

  //Code
  //* Tìm loại nước thải xử lý
  LoaiXuLy();

  //* Chỉ thực hiện tiếp nếu có lĩnh vực xử lý
  if (linhVucXuLy !== "") {
    //* Nhập dữ liệu cho lĩnh vực tính toán
    TuDongNhapDuLieu(window.jsonDataUser.DuLieu.LinhVucTinhToan[0].ID, window.jsonDataUser.DuLieu.LinhVucTinhToan[0].GiaTri);

    //*Mảng thực hiện
    mangThucHien = window.jsonDataUser.DuLieu[linhVucXuLy];
    mangTaiNguyen = window.jsonDataSources.CauTruc[linhVucXuLy];

    //* Nhập tuần tự dữ liệu lên chương trình
    for (let i = 0; i < mangThucHien.length; i++) {
      //? Đối với sơ đồ công nghệ được hiển thị
      if (mangThucHien[i].ID.indexOf("flowChart", 0) !== -1) {
        //Biến
        let _duLieuTaoCongTrinh;
        let _duLieuTaoDuongVe;
        let _duLieuCongTrinh;
        let _duLieuSoDo;

        //Thực hiện
        //* Tìm vị trí id trong mảng tài nguyên
        for (let j = 0; j < mangTaiNguyen.length; j++) {
          if (mangTaiNguyen[j].ID === mangThucHien[i].ID) {
            _duLieuTaoCongTrinh = mangTaiNguyen[j].TaoSoDo._TaoCongTrinh;
            _duLieuTaoDuongVe = mangTaiNguyen[j].TaoSoDo._TaoDuongVe;
            _duLieuCongTrinh = mangTaiNguyen[j].TaoSoDo._DanhSachCongTrinh;
            _duLieuSoDo = mangTaiNguyen[j].TaoSoDo._DuLieuSoDo;
          }
        }

        //* Tạo thông tin vẽ sơ đồ từ tệp dữ liệu
        window[_duLieuSoDo] = mangThucHien[i].GiaTri;
        window[_duLieuCongTrinh] = mangThucHien[i].CongTrinhDonVi_Tep;
        window[_duLieuTaoCongTrinh] = mangThucHien[i].ChuoiCongTrinh;
        window[_duLieuTaoDuongVe] = mangThucHien[i].ChuoiDuongVe;

        //* Tự đỘng tạo lại sơ đỒ + ẩn hiện công trình đơn vị
        TuDongThaoTacTrenDoiTuong(mangThucHien[i].ID);
      }

      //? Trường hợp còn lại
      else {
        TuDongNhapDuLieu(mangThucHien[i].ID, mangThucHien[i].GiaTri);
      }
    }
    //* Ẩn hiện thông tin phù hợp
    TuDongThaoTacTrenDoiTuong();

    //* Tính toán đồng bộ lại
    document.getElementById("btn_calculator").click();

    //*Lưu dữ liệu mới vào indexdDB
    NhapDuLieuLuuTruWebsite();
  }
}

//* TẢI XUỐNG DỮ LIỆU JSON TỪ SOURCES CODE ON CLOUD
function LayDuLieuJsonTuSourcesCode(duongDan, hamXuLy) {
  fetch(duongDan).then(function (response) {
    response.json().then(function (ketQua) {
      hamXuLy(ketQua);
    });
  });
}

//* TẠO SỰ KIỆN CHO TOÀN BỘ NÚT GỢI Ý TRÊN TOÀN WEBSITE
/* 
? Tạo sự kiện khi click lên nút gợi ý trên toàn website
? Thông tin được đưa vào modal và hiển thị lên (full màng hình)
*/
function TaoSuKienHienThongTinGoiY() {
  //Khai báo biến
  let mangLinhVuc = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;
  let mangGiaTri;

  //Code
  //* Gợi ý cho lĩnh vực tính toán
  document.getElementById(window.jsonDataSources.CauTruc.LinhVuc[0].GoiY.IDGoiY).addEventListener("click", function () {
    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = window.jsonDataSources.CauTruc.LinhVuc[0].GoiY.GiaTriGoiY;
    document.getElementById("btn_HienThiModal").click();
  });

  //* Gợi ý cho các lĩnh vực còn lại
  for (let i = 0; i < mangLinhVuc.length; i++) {
    //* Tạo mảng thực hiện
    mangGiaTri = window.jsonDataSources.CauTruc[mangLinhVuc[i]];

    //* Thực hiện cho từng lĩnh vực
    for (let j = 0; j < mangGiaTri.length; j++) {
      //? Tồn tại gợi ý
      if (mangGiaTri[j].GoiY.IDGoiY !== "") {
        //* Tạo sự kiện
        document.getElementById(mangGiaTri[j].GoiY.IDGoiY).addEventListener("click", function () {
          //Biến
          let linhVucTinhToan = "";
          let mangThucHien;

          // Chương trình con
          //* Tìm giá trị thực hiện
          function GiaTriThucHien() {
            //Biến
            let indexLoai = TuDongLayDuLieu("comboBox_LinhVucTinhToan");
            let mangSoSanh = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriPhuThuoc;
            let mangLoai = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;

            //Thực hiện
            //* Dò vị trí giá trị
            for (let l = 0; l < mangSoSanh.length; l++) {
              if (mangSoSanh[l] === indexLoai) {
                linhVucTinhToan = mangLoai[l];
              }
            }
          }

          //Thực hiện
          //* Tìm giá trị thực hiện
          GiaTriThucHien();

          //* Gán mảng thực hiện
          mangThucHien = window.jsonDataSources.CauTruc[linhVucTinhToan];

          //* Duyệt và hiển thị thông báo gợi ý
          for (let k = 0; k < mangThucHien.length; k++) {
            if (mangThucHien[k].GoiY.IDGoiY === this.id) {
              document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = mangThucHien[k].GoiY.GiaTriGoiY;
              document.getElementById("btn_HienThiModal").click();
            }
          }
        });
      }
    }
  }
}

//* TẠO SƠ ĐỒ CÔNG NGHỆ
/* 
? Tạo sơ đồ công nghệ dựa trên biến dữ liệu (đã bao gồm đường dẫn và công trình) 
*/
function VeSoDoCongNghe(bienDuLieu, idHienThiSoDoCongNghe) {
  //Khai báo biến
  let dinhDangChoSoDo = {
    x: 0,
    y: 0,
    "line-width": 1.5, //độ dày nét
    "line-length": 25, //độ dài đường nối
    "text-margin": 10, //padding text
    "font-size": 18, //size chữ
    font: "normal",
    "font-family": "Arial",
    "font-weight": "normal",
    "font-color": "black",
    "line-color": "black",
    "element-color": "black",
    fill: "white", //màu nền rectange
    "yes-text": "yes",
    "no-text": "no",
    "arrow-end": "block",
    scale: 1,
    // Style cho khoá
    symbols: {
      start: {
        "font-color": "black",
        "element-color": "black",
        fill: "white",
        "font-weight": "bold",
        "line-width": 2.5,
      },
      end: {
        class: "end-element",
        "font-color": "black",
        "element-color": "black",
        fill: "white",
        "font-weight": "bold",
        "line-width": 2.5,
      },
      operation: {
        "font-color": "black",
        "element-color": "black",
        fill: "white",
      },
      inputoutput: {
        "font-color": "black",
        "element-color": "black",
        fill: "white",
        "font-weight": "bold",
      },
      subroutine: {
        "font-color": "black",
        "element-color": "black",
        fill: "white",
      },
      condition: {
        "font-color": "black",
        "element-color": "black",
        fill: "white",
      },
      parallel: {
        "font-color": "black",
        "element-color": "black",
        fill: "white",
      },
    },
    // even flowstate support ;-)
    flowstate: {
      past: {
        fill: "#CCCCCC",
        "font-size": 18,
      },
      current: {
        fill: "yellow",
        "font-color": "red",
        "font-weight": "bold",
      },
      future: {
        fill: "white",
      },
      request: {
        fill: "blue",
      },
      invalid: {
        fill: "#444444",
      },
      approved: {
        fill: "#58C4A3",
        "font-size": 18,
        "yes-text": "APPROVED",
        "no-text": "n/a",
      },
      rejected: {
        fill: "#C45879",
        "font-size": 18,
        "yes-text": "n/a",
        "no-text": "REJECTED",
      },
    },
  };

  //Code
  //* Xoá sơ đồ cũ (nếu có)
  document.getElementById(idHienThiSoDoCongNghe).innerHTML = "";

  //* Tiến hành vẽ sơ đồ mới
  chart = flowchart.parse(bienDuLieu);
  chart.drawSVG(idHienThiSoDoCongNghe, dinhDangChoSoDo);
}

//* MẢNG DỮ LIỆU TỪ MULTI SELECT DROPDOWN
function LayMangDuLieuTuMultiSelectDropdown(select) {
  let result = [];
  let options = select && select.options;
  let opt;

  for (let i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value);
    }
  }
  return result;
}

//* DI CHUYỂN NODE CON ĐẾN NODE CHA
function DiChuyenCacNode(idPhanTuCha, idPhanTuCon) {
  document.getElementById(idPhanTuCha).appendChild(document.getElementById(idPhanTuCon));
}

//* CHUYỂN CHỮ THÀNH SỐ
function So(duLieuText) {
  try {
    return parseFloat(duLieuText);
  } catch (error) {
    HienThiThongBao(duLieuText + "không phải định dạng số!");
  }
}

//* TỰ ĐỘNG LÀM TRÒN SỐ THỰC
/*
? Nguyên tắt: 
?- Nếu không có số nào là số nguyên = làm tròn đến khi có số thập phân
?- Nếu có một số nguyên = làm tròn đến 2 chữ số thập phân
?- Nếu có hai số nguyên = làm tròn đến 1 chữ số thập phân
?- Nếu có ba số nguyên trở lên = không lấy phần thập phân 
*/
function TuDongLamTronSo(soLamTron) {
  //Khai báo biến
  let soSoNguyen, kiemTraGiaTri;

  //Code
  //* Chuyển thành chuỗi
  soLamTron = soLamTron.toString();

  //? Có phần thập phân
  if (soLamTron.indexOf(".", 0) !== -1) {
    //* tìm số chữ số nguyên
    soSoNguyen = soLamTron.slice(0, soLamTron.indexOf(".", 0));

    //? Khi không có số nguyên nào
    if (soSoNguyen === "0" && soSoNguyen.length === 1) {
      let viTri;
      for (let i = 3; i < 10; i++) {
        kiemTraGiaTri = soLamTron.slice(
          soLamTron.indexOf(".", 0) + i,
          soLamTron.indexOf(".", 0) + i + 1
        );
        if (kiemTraGiaTri !== "0") {
          viTri = i;
          break;
        }
      }
      return parseFloat(soLamTron).toFixed(viTri);
    }

    //? Khi tồn tại số nguyên
    else {
      soSoNguyen = soSoNguyen.length;

      //? Khi có 01 số nguyên
      if (soSoNguyen === 1) {
        return parseFloat(soLamTron).toFixed(2);
      }

      //? Khi có 2 số nguyên
      else if (soSoNguyen === 2) {
        return parseFloat(soLamTron).toFixed(1);
      }

      //? Khi lớn hơn hoặc bằng 3
      else if (soSoNguyen >= 3) {
        return parseFloat(soLamTron).toFixed(0);
      }
    }
  }

  //? Khi không có phần thập phân
  else {
    soSoNguyen = soLamTron.length;

    //? Khi có 01 số nguyên
    if (soSoNguyen === 1) {
      return parseFloat(soLamTron).toFixed(2);
    }

    //? Khi có 2 số nguyên
    else if (soSoNguyen === 2) {
      return parseFloat(soLamTron).toFixed(1);
    }

    //? Khi lớn hơn hoặc bằng 3
    else if (soSoNguyen >= 3) {
      return parseFloat(soLamTron).toFixed(0);
    }
  }
}

//* TỰ ĐỘNG NHẬP DỮ LIỆU
function TuDongNhapDuLieu(idCanNhap, giaTri) {
  //Khai báo biến
  let kieuKiemTra = idCanNhap.slice(0, idCanNhap.indexOf("_", 0));

  //Code
  //? Nếu là comboBox
  if (kieuKiemTra === "comboBox") {
    document.getElementById(idCanNhap).selectedIndex = giaTri;
  }

  //? Nếu là input
  else if (kieuKiemTra === "input") {
    document.getElementById(idCanNhap).value = giaTri;
  }

  //? Nếu là switch
  else if (kieuKiemTra === "switch") {
    document.getElementById(idCanNhap).checked = giaTri;
  }

  //? Còn lại
  else {
    console.log("ID lỗi: " + idCanNhap);
    HienThiThongBao("Không tìm thấy kiểu cần nhập");
  }
}

//* TỰ ĐỘNG LẤY DỮ LIỆU
function TuDongLayDuLieu(idCanLay) {
  //Khai báo biến
  let kieuKiemTra = idCanLay.slice(0, idCanLay.indexOf("_", 0));

  //Code
  //? Nếu là comboBox
  if (kieuKiemTra === "comboBox") {
    return document.getElementById(idCanLay).selectedIndex;
  }

  //? Nếu là input
  else if (kieuKiemTra === "input") {
    try {
      let check = document.getElementById(idCanLay + "_SuaLai").value;
      if (check !== "") {
        return check;
      } else {
        return document.getElementById(idCanLay).value;
      }
    } catch (error) {
      return document.getElementById(idCanLay).value;
    }
  }

  //? Nếu là switch
  else if (kieuKiemTra === "switch") {
    return document.getElementById(idCanLay).checked;
  }

  //? Còn lại
  else {
    console.log("ID lỗi: " + idCanLay);
    HienThiThongBao("Không tìm thấy kiểu cần lấy");
  }
}

//* THU GỌN SECTION
function ClickToCollapse(id) {
  let doiTuong = document.getElementById(id);
  let bienTam = new bootstrap.Collapse(doiTuong, {
    toggle: true,
  });
}

//* LƯU DỮ LIỆU VÀO LOCAL STORAGE
function LuuDuLieuVaoLocalStorage() {}

//* NẠP DỮ LIỆU TRONG LOCAL STORAGE
function NapDuLieuTuLocalStorage() {}

//* LƯU TRỮ DỮ LIỆU VÀO INDEXDDB
function NhapDuLieuLuuTruWebsite() {
  //Biến
  let dataTN = window.jsonDataSources;
  let dataND = window.jsonDataUser;
  let dataL = window.kiemTraThongBaoBiTrung;
  const mangLuuTru = [
    ["duLieuTaiNguyen", dataTN],
    ["duLieuNguoiDung", dataND],
    ["duLieuSoatLoi", dataL]
  ];

  //Thực hiện
  //* Nhập dữ liệu vào indexdDB để lưu trữ
  NhapDuLieuVaoIndexdDB(mangLuuTru);
}

//* XOÁ BỎ TOÀN BỘ DỮ LIỆU ĐƯỢC LƯU TRONG INDEXDDB
function XoaToanBoDuLieuWebsite() {
  //Thực hiện
  //* Reset comboBox lựa chọn lĩnh vực
  document.getElementById(window.jsonDataSources.CauTruc.LinhVuc[0].ID).selectedIndex = 0;

  //* Xoá bỏ toàn bộ dữ liệu trong IndexdDB
  //XoaToanBoDuLieuIndexdDB();

  //* Xoá database keyval-store
  XoaDataBase();

  //* Thực hiện tải lại trang để áp dụng thay đổi
  setTimeout(function () {
    location.reload();
  }, 250);
}

//* RESET ĐỐI TƯỢNG VỀ GIÁ TRỊ MẶC ĐỊNH
function TuDongTraVeGiaTriMacDinh(IDThucHien, batKyF_thaoTacT) {
  //Biến
  let indexLinhVuc = TuDongLayDuLieu(window.jsonDataSources.CauTruc.LinhVuc[0].ID);
  let linhVuc = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien[indexLinhVuc - 1];
  let mangThucHien = window.jsonDataSources.CauTruc[linhVuc];

  //Chương trình con
  function TraVeMacDinh(id) {
    //Biến
    let kieuKiemTra = id.slice(0, id.indexOf("_", 0));

    //Thực hiện
    //? Input
    if (kieuKiemTra === "input") {
      document.getElementById(id).value = "";
    }

    //? Select
    else if (kieuKiemTra === "comboBox") {
      document.getElementById(id).selectedIndex = 0;
    }

    //? Switch
    else if (kieuKiemTra === "switch") {
      document.getElementById(id).checked = false;
    }

    //Lỗi
    else {
      console.log("ID lỗi: " + id);
      HienThiThongBao("Lỗi trả về giá trị mặc định");
    }
  }

  //Thực hiện
  //? Thao tác
  if (batKyF_thaoTacT) {
    //* Duyệt tìm đối tượng
    for (let i = 0; i < mangThucHien.length; i++) {
      if (mangThucHien[i].ID === IDThucHien) {
        //Biến
        let mangIDReset = mangThucHien[i].TraVeMacDinh;

        //Thực hiẹn
        //* Reset từng đối tượng trong mảng
        for (let j = 0; j < mangIDReset.length; j++) {
          TraVeMacDinh(mangIDReset[j]);
        }
      }
    }
  }

  //? Bất kỳ
  else {
    TraVeMacDinh(IDThucHien);
  }
}

//* CREATE POPOVER CAN RUN ALL OUR WEBSITE
function ChayPopoverTrenWebsite() {
  let popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}

//* XỬ LÝ DỮ LIỆU THỐNG KÊ
function TaoBangThongKeSoLieu() {
  //Biến
  let indexLinhVuc = TuDongLayDuLieu(window.jsonDataSources.CauTruc.LinhVuc[0].ID);
  let linhVucXuLy, mangTaiNguyen, dinhDangBang;

  //Chương trình con
  //* Xử lý kiểm tra ẩn hiện
  //* Kiểm tra ẩn hiện
  function KiemTraAnHien(viTri) {
    //Biến
    let kiemTra = true;

    //Thực hiện
    //* Kiểm tra ẩn hiện của section
    let idSection = mangTaiNguyen[viTri].IDSection;
    let idBoxSection = idSection.replace("section", "box");
    let trangThaiSection = document.getElementById(idBoxSection).style.display;

    //? Nếu đang ẩn
    if (trangThaiSection === "none") {
      kiemTra = false;
    }

    //* Kiểm tra chính đối tượng
    let idDoiTuong = mangTaiNguyen[viTri].ID;
    let kieuDoiTuong = mangTaiNguyen[viTri].Kieu;
    let idBoxDoiTuong = idDoiTuong.replace(kieuDoiTuong, "box");
    let trangThaiDoiTuong = document.getElementById(idBoxDoiTuong).style.display;

    //? Nếu đang ẩn
    if (trangThaiDoiTuong === "none") {
      kiemTra = false;
    }

    return kiemTra;
  }

  //* Kiểm tra các field không thống kê
  function KiemTraKieuThongKe(viTri) {
    //Biến
    let mangKieu = [
      "anchor",
      "section",
      "btnInCal",
      "flowChart"
    ];
    let kiemTra = true;
    let kieuDoiTuong = mangTaiNguyen[viTri].Kieu;

    //Thực hiện
    //* lặp duyệt có trùng kiểu bị loại
    for (let i = 0; i < mangKieu.length; i++) {
      //? Nếu trùng
      if (kieuDoiTuong === mangKieu[i]) {
        kiemTra = false;
        break;
      }
    }

    //* Trả kết quả
    return kiemTra;
  }

  //* Xử lý xuất dữ liệu thống kê
  function XuLyThongKe() {
    //Biến
    let duLieuBang = [];
    let dem = 1;

    for (let i = 0; i < mangTaiNguyen.length; i++) {
      let kiemTraThongKe = mangTaiNguyen[i].ThongKe.TatCa;
      let duLieuMau = {
        id: "",
        thongSo: "",
        donVi: "",
        soLieu: "",
        ghiChu: "",
      };

      //? khác section, flowchart, btnInCal, anchor, title
      if (KiemTraKieuThongKe(i)) {
        //? có thống kê và đang hiển thị
        if (kiemTraThongKe === true && KiemTraAnHien(i) === true) {
          //Gán id
          duLieuMau.id = dem;
          dem = dem + 1;

          //Gán thông số
          duLieuMau.thongSo = mangTaiNguyen[i].Ten + " | " + mangTaiNguyen[i].KyHieu;

          //Đơn vị
          duLieuMau.donVi = mangTaiNguyen[i].DonVi;

          //* Xử lý số liệu và ghi chú
          let kieuDoiTuong = mangTaiNguyen[i].Kieu;
          //? Kiểu input
          if (kieuDoiTuong === "input") {
            //Gán số liệu
            duLieuMau.soLieu = TuDongLayDuLieu(mangTaiNguyen[i].ID);

            //Ghi chú
            duLieuMau.ghiChu = mangTaiNguyen[i].ThongKe.GhiChu;
          }

          //? Kiểu switch
          else if (kieuDoiTuong === "switch") {
            //Gán số liệu
            let tam = TuDongLayDuLieu(mangTaiNguyen[i].ID);
            if (tam) {
              duLieuMau.soLieu = "Có";
            } else {
              duLieuMau.soLieu = "Không";
            }

            //Ghi chú
            duLieuMau.ghiChu = mangTaiNguyen[i].ThongKe.GhiChu;
          }

          //? Kiểu comboBox
          else if (kieuDoiTuong === "comboBox") {
            //Ghi chú
            let tam = document.getElementById(mangTaiNguyen[i].ID);
            duLieuMau.ghiChu = tam.options[tam.selectedIndex].text;
          }

          //? Kiểu title
          else if (kieuDoiTuong === "title") {
            duLieuMau.ghiChu = mangTaiNguyen[i].ThongKe.GhiChu;
          }

          //Đưa vào mảng dữ liệu
          duLieuBang.push(duLieuMau);
        }
      }

    }
    return duLieuBang;
  }

  //Thực hiện
  //? Lĩnh vực khác 0
  if (indexLinhVuc !== 0) {
    linhVucXuLy = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien[indexLinhVuc - 1];
    mangTaiNguyen = window.jsonDataSources.CauTruc[linhVucXuLy];

    //Gán dữ liệU và định dạng bảng + xem chung
    dinhDangBang = {
      data: XuLyThongKe(), //Định nghĩa biến dữ liệu cho bảng
      layout: "fitColumns", //Tự động chọn kích thước cột
      resizableColumns: "header", //Chỉ cho phép thay đổi độ rộng ở tiêu đề
      height: "90%", //Độ cao bảng so với parent
      headerSort: false, //Tắt tính năng sort ở header
      /*       printAsHtml: true, //in như html
            printStyled: true, //có xét đến định dạng trên html */
      columns: [{
          title: "TT",
          field: "tt",
          width: 55,
          hozAlign: "center",
          formatter: "rownum",
        },
        {
          title: "Tên thông số",
          field: "thongSo",
          minWidth: 250,
          hozAlign: "left",
          /* formatter: "html", */
          formatter: function (cell, formatterParams, onRendered) {
            return (
              '<div style="white-space: normal;">' + cell.getValue() + "</div>"
            ); //mặt định white-space thành normal
          },
        },
        {
          title: "Đơn vị",
          field: "donVi",
          width: 150,
          hozAlign: "center",
          formatter: "html",
        },
        {
          title: "Số liệu",
          field: "soLieu",
          width: 100,
          hozAlign: "right",
          formatter: "money",
          formatterParams: {
            decimal: "", //Ký tự ngăn cách phần thập phân (mặc định ".")
            thousand: "", //Ký tự ngăn cách phần nghìn (mặc định ",")
            symbol: "",
            symbolAfter: "",
            precision: false,
          },
        },
        {
          title: "Ghi chú",
          field: "ghiChu",
          width: 250,
          hozAlign: "left",
          /* formatter: "html", */
          formatter: function (cell, formatterParams, onRendered) {
            return (
              '<div style="white-space: normal;">' + cell.getValue() + "</div>"
            ); //mặt định white-space thành normal
          },
        },
      ], //Định nghĩa số cột
    };

    //Tạo bảng từ dữ liệu với ID table
    window.bangThongKe = new Tabulator("#table_BangThongKeDuLieu", dinhDangBang);
  }
}

//!-------------------------------------------------------------III. RENDER THÀNH PHẦN WEBSITE------------------------------------------------------------------
//Todo: TỰ ĐỘNG RENDER WEBSITE (XỬ LÝ QUA JSON DATA SOURCES)
function TaoDoiTuongChoWebsite() {
  //Biến
  let mangLinhVuc = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;
  let mangThucHien, phanTuCha;

  //Chương trình con
  //* Tạo section
  function TaoSection(viTriDoiTuong) {
    //Biến
    let idThanSection = mangThucHien[viTriDoiTuong].ID.replace("section", "body");
    let kiemTraThuGon = mangThucHien[viTriDoiTuong].ThuGon;
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //Thực hiện
    //? Thu gọn
    if (kiemTraThuGon) {
      //* Tạo khung
      let khung = document.createElement("div");
      let idKhung = idDoiTuong.replace("section", "box");
      khung.id = idKhung;
      //? Ẩn mặc đỊnh
      let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
      if (kiemTraAnHienMD === false) {
        khung.style.display = "none";
      } else {
        khung.style.display = "block";
      }

      //* Tạo khung section
      let taoKhung = document.createElement("div");
      taoKhung.className = "row group-unit-alway-show";
      taoKhung.id = mangThucHien[viTriDoiTuong].ID;
      khung.appendChild(taoKhung);

      //* Tạo tiêu đề
      let taoTieuDe = document.createElement("h4");
      taoTieuDe.className = "title-1";
      taoTieuDe.setAttribute("data-bs-toggle", "collapse");
      taoTieuDe.setAttribute("data-bs-target", "#" + idThanSection);
      taoTieuDe.setAttribute("aria-expanded", false);
      taoTieuDe.setAttribute("aria-controls", idThanSection);
      taoTieuDe.innerHTML = mangThucHien[viTriDoiTuong].Ten;
      taoKhung.appendChild(taoTieuDe);

      //* Tạo thân thu gọn
      let taoThanThuGon = document.createElement("div");
      taoThanThuGon.className = "collapse";
      taoThanThuGon.id = idThanSection;
      taoKhung.appendChild(taoThanThuGon);

      //* Tạo nút thu gọn
      let taoNut = document.createElement("div");
      taoNut.className = "collapse-section";
      taoNut.id = idThanSection.replace("body", "btnThuGon");
      taoThanThuGon.appendChild(taoNut);

      let taoIcon = document.createElement("i");
      taoIcon.className = "fas fa-angle-double-up";
      taoIcon.addEventListener("click", function () {
        ClickToCollapse(idThanSection);
      });
      taoNut.appendChild(taoIcon);

      //* Nối đối tượng  
      //? Có ID của phần tử cha - anchor
      let kiemTraAnchor = mangThucHien[viTriDoiTuong].IDNeoGiu;
      if (kiemTraAnchor !== "") {
        let phanTuAnChor = document.getElementById(kiemTraAnchor);
        phanTuAnChor.appendChild(khung);
      }

      //? Không có anchor
      else {
        phanTuCha.appendChild(khung);
      }
    }

    //? Không thu gọn
    else {
      //* Tạo khung
      let khung = document.createElement("div");
      let idKhung = idDoiTuong.replace("section", "box");
      khung.id = idKhung;
      //? Ẩn mặc đỊnh
      let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
      if (kiemTraAnHienMD === false) {
        khung.style.display = "none";
      } else {
        khung.style.display = "block";
      }

      //* Tạo khung section
      let taoKhung = document.createElement("div");
      taoKhung.className = "row group-unit-alway-show group-no-collapse";
      taoKhung.id = mangThucHien[viTriDoiTuong].ID;
      khung.appendChild(taoKhung);

      //* Tạo tiêu đề
      let taoTieuDe = document.createElement("h4");
      taoTieuDe.className = "title-1";
      taoTieuDe.innerHTML = mangThucHien[viTriDoiTuong].Ten;
      taoKhung.appendChild(taoTieuDe);

      //* Tạo thân không thu gọn
      let taoThanKhongThuGon = document.createElement("div");
      taoThanKhongThuGon.id = idThanSection;
      taoKhung.appendChild(taoThanKhongThuGon);

      //* Nối đối tượng
      //? Có ID của phần tử cha - anchor
      let kiemTraAnchor = mangThucHien[viTriDoiTuong].IDNeoGiu;
      if (kiemTraAnchor !== "") {
        let phanTuAnChor = document.getElementById(kiemTraAnchor);
        phanTuAnChor.appendChild(khung);
      }

      //? Không có anchor
      else {
        phanTuCha.appendChild(khung);
      }
    }
  }

  //* Tạo comboBox
  function TaoComboBox(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;
    let mangTuyChon = mangThucHien[viTriDoiTuong].DanhSachGiaTri;

    //Thực hiện
    //* Tạo khung
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("comboBox", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo tiêu đề
    let taoTieuDe = document.createElement("h5");
    let loaiTieuDe = mangThucHien[viTriDoiTuong].LoaiTieuDe;
    //? Loại tiêu đề 1
    if (loaiTieuDe === "loai1") {
      taoTieuDe.className = "title-2";
    }
    //? Loại tiêu đề 2
    else if (loaiTieuDe === "loai2") {
      taoTieuDe.className = "title-2 title-3";
    }
    let tenTieuDe = mangThucHien[viTriDoiTuong].Ten;
    //? Không có tên thì không tạo tiêu đề
    if (tenTieuDe !== "") {
      taoTieuDe.innerHTML = tenTieuDe;
      taoKhung.appendChild(taoTieuDe);
    }

    //* Tạo khung cho select
    let taoKhungSelect = document.createElement("div");
    taoKhungSelect.className = "col-8 fix-full-screen";
    taoKhung.appendChild(taoKhungSelect);

    //* Tạo select
    let taoSelect = document.createElement("select");
    taoSelect.className = "form-select";
    taoSelect.id = idDoiTuong;
    taoSelect.setAttribute("aria-label", "default-select");
    //? Có khoá thao tác mặc đỊnh
    taoSelect.disabled = mangThucHien[viTriDoiTuong].KhoaThaoTac.MacDinh;
    taoKhungSelect.appendChild(taoSelect);

    //* Tạo options
    //* Tuỳ chọn mặc định
    let tuyChonMacDinh = document.createElement("option");
    tuyChonMacDinh.innerHTML = "Chọn một phương án...";
    taoSelect.appendChild(tuyChonMacDinh);
    taoSelect.options.selectedIndex = 0;

    //* Lặp thêm tuỳ chọn
    let dem = 1;
    for (let k = 0; k < mangTuyChon.length; k++) {
      //* Tạo từNg tuỳ chọn trong mảng
      let taoTuyChon = document.createElement("option");
      //? Phải là tuỳ chọn chia nhóm
      if (mangTuyChon[k].indexOf("*", 0) !== -1) {
        taoTuyChon.disabled = true;
        taoTuyChon.className = "div-list";
        taoTuyChon.innerHTML = mangTuyChon[k].replace("*", "");
      }
      //? Có nhập cho giá trị của tuỳ chọn
      else if (mangTuyChon.join(";").indexOf("=", 0) !== -1) {
        // Biến
        let strHienThi = mangTuyChon[k].slice(0, mangTuyChon[k].indexOf("=", 0));
        let strGiaTri = mangTuyChon[k].slice(mangTuyChon[k].indexOf("=", 0) + 1, mangTuyChon[k].length);

        //Thực hiện
        taoTuyChon.value = strGiaTri;
        taoTuyChon.innerHTML = strHienThi;
      }

      //? Trường hợp không có giá trị tuỳ chọn - tự tạo giá trị tăng dần
      else {
        taoTuyChon.value = dem;
        dem = dem + 1;
        taoTuyChon.innerHTML = mangTuyChon[k];
      }
      taoSelect.appendChild(taoTuyChon);
    }

    //? Có gợi ý
    let kiemTraGoiY = mangThucHien[viTriDoiTuong].GoiY.IDGoiY;
    if (kiemTraGoiY !== "") {
      //* Tạo khung nút gợi ý
      let khung = document.createElement("a");
      let idKhung = idDoiTuong.replace("comboBox", "info");
      khung.className = "btn-suggest";
      khung.id = idKhung;
      taoKhungSelect.appendChild(khung);

      //* Tạo icon nút gợi ý
      let iconGoiY = document.createElement("i");
      iconGoiY.className = "fas fa-info-circle";
      khung.appendChild(iconGoiY);
    }

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);
  }

  //* Tạo input (nhập dữ liệu)
  function TaoInput(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //Thực hiện
    //* Tạo khung
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("input", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo tiêu đề
    let taoTieuDe = document.createElement("h5");
    let loaiTieuDe = mangThucHien[viTriDoiTuong].LoaiTieuDe;
    //? Loại tiêu đề 1
    if (loaiTieuDe === "loai1") {
      taoTieuDe.className = "title-2";
    }
    //? Loại tiêu đề 2
    else if (loaiTieuDe === "loai2") {
      taoTieuDe.className = "title-2 title-3";
    }
    let tenTieuDe = mangThucHien[viTriDoiTuong].Ten;
    //? Có tiêu đề
    if (tenTieuDe !== "") {
      taoTieuDe.innerHTML = tenTieuDe;
      taoKhung.appendChild(taoTieuDe);
    }

    //* Tạo khung cho input
    let taoKhungInput = document.createElement("div");
    taoKhungInput.className = "col-8 fix-full-screen";
    taoKhung.appendChild(taoKhungInput);

    //* Tạo group cho input
    let nhomInput = document.createElement("div");
    nhomInput.className = "input-group";
    taoKhungInput.appendChild(nhomInput);

    //? Có ký hiệu
    let kiemTraKyHieu = mangThucHien[viTriDoiTuong].KyHieu;
    if (kiemTraKyHieu !== "") {
      //* Tạo ký hiệU cho input
      let kyHieu = document.createElement("span");
      kyHieu.className = "input-group-text";
      kyHieu.innerHTML = kiemTraKyHieu;
      nhomInput.appendChild(kyHieu);
    }

    //* Tạo nhập liệu
    let taoInput = document.createElement("input");
    taoInput.className = "form-control";
    taoInput.id = idDoiTuong;
    taoInput.type = mangThucHien[viTriDoiTuong].KieuNhap;
    taoInput.setAttribute("aria-label", mangThucHien[viTriDoiTuong].ID);
    //? Có hướng dẫn nhập liệu
    let kiemTraHuongDan = mangThucHien[viTriDoiTuong].HuongDanNhap;
    if (kiemTraHuongDan !== "") {
      taoInput.placeholder = kiemTraHuongDan;
    }
    //? Có khoá thao tác mặc đỊnh
    taoInput.disabled = mangThucHien[viTriDoiTuong].KhoaThaoTac.MacDinh;
    nhomInput.appendChild(taoInput);

    //? Có cho sửa lại giá trị
    let kiemTraSuaLai = mangThucHien[viTriDoiTuong].ChoPhepSuaLai;
    if (kiemTraSuaLai) {
      //* Tạo khung nhập sửa lại
      let taoInputSuaLai = document.createElement("input");
      taoInputSuaLai.className = "form-control";
      taoInputSuaLai.id = idDoiTuong + "_SuaLai";
      taoInputSuaLai.type = mangThucHien[viTriDoiTuong].KieuNhap;
      taoInputSuaLai.setAttribute("aria-label", mangThucHien[viTriDoiTuong].Ten);
      nhomInput.appendChild(taoInputSuaLai);
    }

    //? Có đơn vị
    let kiemTraDonVi = mangThucHien[viTriDoiTuong].DonVi;
    if (kiemTraDonVi !== "") {
      //* Tạo đƠn vị cho input
      let donVi = document.createElement("span");
      donVi.className = "input-group-text";
      donVi.innerHTML = kiemTraDonVi;
      nhomInput.appendChild(donVi);
    }

    //? có gợi ý
    let kiemTraGoiY = mangThucHien[viTriDoiTuong].GoiY.IDGoiY;
    if (kiemTraGoiY !== "") {
      //* Tạo khung nút gợi ý
      let khung = document.createElement("a");
      let idKhung = idDoiTuong.replace("input", "info");
      khung.className = "btn-suggest";
      khung.id = idKhung;
      nhomInput.appendChild(khung);

      //* Tạo icon nút gợi ý
      let iconGoiY = document.createElement("i");
      iconGoiY.className = "fas fa-info-circle";
      khung.appendChild(iconGoiY);
    }

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);
  }

  //* Tạo switch
  function TaoSwitch(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //Thực hiện
    //* Tạo khung
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("switch", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo khung cho switch
    let taoKhungSwitch = document.createElement("div");
    taoKhungSwitch.className = "col-8 fix-full-screen";
    taoKhung.appendChild(taoKhungSwitch);

    //* Tạo form 
    let formSwitch = document.createElement("div");
    formSwitch.className = "form-check form-switch";
    taoKhungSwitch.appendChild(formSwitch);

    //* Tạo Switch
    let nutSwitch = document.createElement("input");
    nutSwitch.className = "form-check-input";
    nutSwitch.type = "checkbox";
    nutSwitch.id = idDoiTuong;
    nutSwitch.disabled = mangThucHien[viTriDoiTuong].KhoaThaoTac.MacDinh;
    formSwitch.appendChild(nutSwitch);

    //* Tạo tiêu đề
    let tieuDeSwitch = document.createElement("label");
    tieuDeSwitch.className = "form-check-label";
    tieuDeSwitch.htmlFor = idDoiTuong;
    tieuDeSwitch.innerHTML = mangThucHien[viTriDoiTuong].Ten;
    formSwitch.appendChild(tieuDeSwitch);

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);
  }

  //* Tạo tiêu đề
  function TaoTieuDe(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //Thực hiệN
    //* Tạo khung tiêu đề
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("title", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo tiêu đề
    let taoTieuDe = document.createElement("h5");
    let loaiTieuDe = mangThucHien[viTriDoiTuong].LoaiTieuDe;
    //? Loại tiêu đề 1
    if (loaiTieuDe === "loai1") {
      taoTieuDe.className = "title-2";
    }

    //? Loại tiêu đề 2
    else if (loaiTieuDe === "loai2") {
      taoTieuDe.className = "title-2 title-3";
    }
    taoTieuDe.id = mangThucHien[viTriDoiTuong].ID;
    taoTieuDe.innerHTML = mangThucHien[viTriDoiTuong].Ten;
    taoKhung.appendChild(taoTieuDe);

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);
  }

  //* Tạo nút nhấn
  function TaoNutNhan(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //Thực hiệN
    //* Tạo khung nút
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("btnInCal", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo nút
    let taoNut = document.createElement("button");
    taoNut.className = "btn btn-success btn-sm btn-csdl";
    taoNut.id = idDoiTuong;
    taoNut.type = "button";
    taoNut.innerHTML = mangThucHien[viTriDoiTuong].Ten;
    taoKhung.appendChild(taoNut);

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);
  }

  //* Tạo sơ đồ công nghệ (flowchart)
  function TaoFlowChart(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //Thực hiệN
    //* Tạo khung sơ đồ
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("flowChart", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo tiêu đề
    let taoTieuDe = document.createElement("h5");
    let loaiTieuDe = mangThucHien[viTriDoiTuong].LoaiTieuDe;
    //? Loại tiêu đề 1
    if (loaiTieuDe === "loai1") {
      taoTieuDe.className = "title-2";
    }
    //? Loại tiêu đề 2
    else if (loaiTieuDe === "loai2") {
      taoTieuDe.className = "title-2 title-3";
    }
    let tenTieuDe = mangThucHien[viTriDoiTuong].Ten;
    //? Có tiêu đề
    if (tenTieuDe !== "") {
      taoTieuDe.innerHTML = tenTieuDe;
      taoKhung.appendChild(taoTieuDe);
    }

    //* Tạo flowchart
    let flowChart = document.createElement("div");
    flowChart.className = "col fix-full-screen fix-SoDoCongNghe";
    flowChart.id = idDoiTuong;
    taoKhung.appendChild(flowChart);

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);

    //! Sự kiện sửa lỗi load sơ đồ - event fixed for flowchart bug
    document.getElementById(mangThucHien[viTriDoiTuong].IDSection).firstChild.addEventListener("click", function () {
      //Biến
      let idSection = this.parentNode.id;
      let indexLinhVuc = TuDongLayDuLieu(window.jsonDataSources.CauTruc.LinhVuc[0].ID);
      let linhVuc = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien[indexLinhVuc - 1];
      let mangThucHien = window.jsonDataSources.CauTruc[linhVuc];

      //Thực hiện
      //* Lặp tìm đối tượng
      for (let i = 0; i < mangThucHien.length; i++) {
        //? Kiểu flowChart và đúng ID Section
        if (mangThucHien[i].Kieu === "flowChart" && mangThucHien[i].IDSection === idSection) {
          //Biến
          let duLieuVeSoDo = window[mangThucHien[i].TaoSoDo._DuLieuSoDo];

          //* Vẽ lại sơ đồ
          if (duLieuVeSoDo !== "") {
            VeSoDoCongNghe(duLieuVeSoDo, mangThucHien[i].ID);
          }
        }
      }
    });

    //* Tạo biến toàn cục flowchart - create any global variable for flowchart
    let tenBienCongTrinh = mangThucHien[viTriDoiTuong].TaoSoDo._TaoCongTrinh;
    let giaTriCongTrinh = mangThucHien[viTriDoiTuong].TaoSoDo.TaoCongTrinh_DauVao;
    //? Biến công trình - variable for construction
    window[tenBienCongTrinh] = giaTriCongTrinh;
    let tenBienDuongVe = mangThucHien[viTriDoiTuong].TaoSoDo._TaoDuongVe;
    let giaTriDuongVe = mangThucHien[viTriDoiTuong].TaoSoDo.TaoDuongVe_DauVao;
    //? Biến đƯờng vẽ - variable for line drawing
    window[tenBienDuongVe] = giaTriDuongVe;
    let tenBienDanhSachCongTrinh = mangThucHien[viTriDoiTuong].TaoSoDo._DanhSachCongTrinh;
    let tenBienDuLieuSoDo = mangThucHien[viTriDoiTuong].TaoSoDo._DuLieuSoDo;
    //? Biến danh sách công trình và dữ liệu sơ đỒ - variable for construction list and diagram data
    window[tenBienDanhSachCongTrinh] = [];
    window[tenBienDuLieuSoDo] = "";
  }

  //* Tạo đối tượng neo chứa section
  function TaoAnchor(viTriDoiTuong) {
    //* Tạo đỐi tượng anchor
    let taoAnchor = document.createElement("div");
    taoAnchor.id = mangThucHien[viTriDoiTuong].ID;

    //* Nối vào đỐi tượng chính
    phanTuCha.appendChild(taoAnchor);
  }

  function TaoPhanChiaTinhToan(viTriDoiTuong) {
    //Biến
    let idDoiTuong = mangThucHien[viTriDoiTuong].ID;

    //* Tạo khung
    let taoKhung = document.createElement("div");
    let idKhung = idDoiTuong.replace("divCal", "box");
    taoKhung.id = idKhung;
    //? Ẩn mặc đỊnh
    let kiemTraAnHienMD = mangThucHien[viTriDoiTuong].AnHien.MacDinh;
    if (kiemTraAnHienMD === false) {
      taoKhung.style.display = "none";
    } else {
      taoKhung.style.display = "block";
    }

    //* Tạo đối tượng phân chia
    let taoDiv = document.createElement("div");
    taoDiv.className = "div-calculate";
    taoDiv.id = idDoiTuong;
    taoDiv.innerHTML = "<i class=\"fas fa-bolt\"></i>";
    taoKhung.appendChild(taoDiv);

    //* Nối vào đỐi tượng chính
    let idCha = mangThucHien[viTriDoiTuong].IDSection.replace("section", "body");
    let idNutThuGon = idCha.replace("body", "btnThuGon");
    let phanTuCha = document.getElementById(idCha);
    let phanTuThuGon = document.getElementById(idNutThuGon);
    phanTuCha.insertBefore(taoKhung, phanTuThuGon);
  }

  //Thực hiện
  //! Render cho từng lĩnh vực
  for (let i = 0; i < 1; i++) {
    //Biến
    mangThucHien = window.jsonDataSources.CauTruc[mangLinhVuc[i]];
    let idPhanTuCha = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.IDBox[i];
    phanTuCha = document.getElementById(idPhanTuCha);

    //Thực hiện
    //* Lặp qua từNg đối tượng
    for (let j = 0; j < mangThucHien.length; j++) {
      //Biến
      let kieuDoiTuong = mangThucHien[j].Kieu;

      //Thực hiện
      //? Kiểu section
      if (kieuDoiTuong === "section") {
        TaoSection(j);
      }

      //? Kiểu comboBox
      else if (kieuDoiTuong === "comboBox") {
        TaoComboBox(j);
      }

      //? Kiểu input
      else if (kieuDoiTuong === "input") {
        TaoInput(j);
      }

      //? Kiểu switch
      else if (kieuDoiTuong === "switch") {
        TaoSwitch(j);
      }

      //? Kiểu tiêu đề
      else if (kieuDoiTuong === "title") {
        TaoTieuDe(j);
      }

      //? Kiểu nút lệnh
      else if (kieuDoiTuong === "btnInCal") {
        TaoNutNhan(j);
      }

      //? Kiểu sơ đồ công nghệ (flowchart)
      else if (kieuDoiTuong === "flowChart") {
        TaoFlowChart(j);
      }

      //? Kiểu đối tượng neo giữ
      else if (kieuDoiTuong === "anchor") {
        TaoAnchor(j);
      }

      //? Kiểu đối tượng phân chia các phần tính toán
      else if (kieuDoiTuong === "divCal") {
        TaoPhanChiaTinhToan(j);
      }
    }
  }

  //! Render modal design
  //Biến
  mangThucHien = window.jsonDataSources.CauTruc.ThietKe;
  phanTuCha = document.getElementById("databody_ThietKeGiaoDien");

  //Thực hiện
  //* Lặp qua từNg đối tượng
  for (let j = 0; j < mangThucHien.length; j++) {
    //Biến
    let kieuDoiTuong = mangThucHien[j].Kieu;

    //Thực hiện
    //? Kiểu section
    if (kieuDoiTuong === "section") {
      TaoSection(j);
    }

    //? Kiểu comboBox
    if (kieuDoiTuong === "comboBox") {
      TaoComboBox(j);
    }

    //? Kiểu input
    if (kieuDoiTuong === "input") {
      TaoInput(j);
    }

    //? Kiểu switch
    if (kieuDoiTuong === "switch") {
      TaoSwitch(j);
    }

    //? Kiểu tiêu đề
    if (kieuDoiTuong === "title") {
      TaoTieuDe(j);
    }

    //? Kiểu nút lệnh
    if (kieuDoiTuong === "btnInCal") {
      TaoNutNhan(j);
    }
  }
}

//!-------------------------------------------------------------IV. XỬ LÝ TÍNH TOÁN------------------------------------------------------------------
//Todo: TỰ ĐỘNG TÍNH TOÁN TOÀN BỘ WEBSITE (XỬ LÝ QUA JSON DATA SOURCES)
function TuDongTinhToanTrenDoiTuong() {
  //Biến
  let linhVucXuLy = "";
  let mangTaiNguyen, mangDuLieu;

  //Chương trình con
  //* Tìm ra lĩnh vực đang xử lý
  function TimLinhVucXuLy() {
    //Biến
    let indexLinhVuc = TuDongLayDuLieu(window.jsonDataSources.CauTruc.LinhVuc[0].ID);
    let mangGiaTriThucHien = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;
    let mangSoSanh = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriPhuThuoc;

    //Thực hiện
    //* Lặp tìm giá trị
    for (let i = 0; i < mangSoSanh.length; i++) {
      //? Nếu đúng giá trị cần so sánh
      if (mangSoSanh[i] === indexLinhVuc) {
        linhVucXuLy = mangGiaTriThucHien[i];
      }
    }
  }

  //* Kiểm tra giá trị hiện tại
  function SoSanhGiaTriHienTaiVaMang(giaTriHienTai, mangSoSanh, TonTaiHoacKhongT_ViTriF) {
    //Biến
    let tonTai = false;
    let viTriGiaTri = -1;

    //Kiểm tra tồn tại giá trị hiện tại và mảng so sánh
    for (let i = 0; i < mangSoSanh.length; i++) {
      //Loại dấu , và chuyển đầu vào sang str
      let bienSoSanh = mangSoSanh[i].toString().replace(/,/g, "");
      let giaTriSoSanh = giaTriHienTai.toString();

      //So sánh, trả kết quả
      if (bienSoSanh === giaTriSoSanh) {
        tonTai = true;
        viTriGiaTri = i;
      }
    }

    //Trả về
    //Trả về có tồn tại trong mảng hay không
    if (TonTaiHoacKhongT_ViTriF) {
      return tonTai;
    }

    //Trả về vị trí tồn tại
    else {
      return viTriGiaTri;
    }
  }

  //* Tự động trả về mặc định
  function TraVeMacDinh(id) {
    //Biến
    let kieuKiemTra = id.slice(0, id.indexOf("_", 0));

    //Thực hiện
    //? Input
    if (kieuKiemTra === "input") {
      document.getElementById(id).value = "";
    }

    //? Select
    else if (kieuKiemTra === "comboBox") {
      document.getElementById(id).selectedIndex = 0;
    }

    //? Switch
    else if (kieuKiemTra === "switch") {
      document.getElementById(id).checked = false;
    }

    //Lỗi
    else {
      console.log("ID lỗi: " + id);
      HienThiThongBao("Lỗi trả về giá trị mặc định");
    }
  }

  //* Kiểm tra ẩn hiện
  function KiemTraAnHien(viTri) {
    //Biến
    let kiemTra = true;

    //Thực hiện
    //* Kiểm tra ẩn hiện của section
    let idSection = mangTaiNguyen[viTri].IDSection;
    let idBoxSection = idSection.replace("section", "box");
    let trangThaiSection = document.getElementById(idBoxSection).style.display;

    //? Nếu đang ẩn
    if (trangThaiSection === "none") {
      kiemTra = false;
    }

    //* Kiểm tra chính đối tượng
    let idDoiTuong = mangTaiNguyen[viTri].ID;
    let kieuDoiTuong = mangTaiNguyen[viTri].Kieu;
    let idBoxDoiTuong = idDoiTuong.replace(kieuDoiTuong, "box");
    let trangThaiDoiTuong = document.getElementById(idBoxDoiTuong).style.display;

    //? Nếu đang ẩn
    if (trangThaiDoiTuong === "none") {
      kiemTra = false;
    }

    return kiemTra;
  }

  //* Kiểm tra các field đầu vào đã đủ điều kiện chưa
  function KiemTraDieuKien(viTri) {
    //Biến
    let mangDieuKien = mangTaiNguyen[viTri].TinhToan.DieuKien;
    let kiemTra = true;

    //Thực hiện
    //* Lặp từng đỐi tượng để kiểm tra
    for (let i = 0; i < mangDieuKien.length; i++) {
      let idHienTai = mangDieuKien[i].slice(mangDieuKien[i].indexOf("=", 0) + 1, mangDieuKien[i].length);
      let giaTriHienTai = TuDongLayDuLieu(idHienTai);
      let kieuDoiTuong, trangThaiHienTai;

      //* Lặp tìm ra kiểu đối tượng
      for (let j = 0; j < mangTaiNguyen.length; j++) {
        //? ID trùng với id đang kiểm tra
        if (mangTaiNguyen[j].ID === idHienTai) {
          kieuDoiTuong = mangTaiNguyen[j].Kieu;
          break;
        }
      }

      //* Lấy trạng thái ẩn hiện
      trangThaiHienTai = document.getElementById(idHienTai.replace(kieuDoiTuong, "box")).style.display;

      //? Kiểu là comboBox + chưa seclect + đang hiện
      if (kieuDoiTuong === "comboBox" && giaTriHienTai === 0 && trangThaiHienTai === "block") {
        kiemTra = false;
        break;
      }

      //? Kiểu là input + giá trị rỗng + đang hiển thị
      if (kieuDoiTuong === "input" && giaTriHienTai === "" && trangThaiHienTai === "block") {
        kiemTra = false;
        break;
      }
    }

    //? Chưa đủ điều kiện tính toán
    if (kiemTra === false) {
      //* Reset đối tượng
      TraVeMacDinh(mangTaiNguyen[viTri].ID);
    }

    //* Trả giá trị về
    return kiemTra;
  }

  //* Kiểm tra có thuộc sơ đồ công nghệ
  function KiemTraSoDo(viTri) {
    //Biến
    let idSoDo = mangTaiNguyen[viTri].TinhToan.IDCongNghe;
    let congTrinh = mangTaiNguyen[viTri].CongTrinhDonVi;
    let kiemTra = false;

    //Thực hiện
    //* Lặp tìm vị trí id công nghệ
    for (let i = 0; i < mangTaiNguyen.length; i++) {
      //? Tìm thấy id sơ đồ
      if (mangTaiNguyen[i].ID === idSoDo) {
        let _danhSachCongTrinh = mangTaiNguyen[i].TaoSoDo._DanhSachCongTrinh;
        let danhSachCT = window[_danhSachCongTrinh];

        //* Lặp kiểm tra có nằm trong danh sách công trình
        for (let j = 0; j < danhSachCT.length; j++) {
          //? tìm thấy công trình trong danh sách
          if (danhSachCT[j] === congTrinh) {
            kiemTra = true;
            break;
          }
        }
        break;
      }
    }

    //* Trả về giá trị kt
    return kiemTra;
  }

  //* Chuyển chuỗi thành công thức và tính toán trả kết quả
  function TinhToanKetQua(viTri) {
    //Biến
    let bieuThuc = mangTaiNguyen[viTri].TinhToan.CongThuc;
    let mangDieuKien = mangTaiNguyen[viTri].TinhToan.DieuKien;

    //Thực hiện
    //* Lặp lấy số liệu hiện tại và gán biến
    for (let i = 0; i < mangDieuKien.length; i++) {
      let tenBien = mangDieuKien[i].slice(0, mangDieuKien[i].indexOf("="));
      let idLaySoLieu = mangDieuKien[i].slice(mangDieuKien[i].indexOf("=", 0) + 1, mangDieuKien[i].length);
      let soLieuHienTai = So(TuDongLayDuLieu(idLaySoLieu));

      //* Gán biến
      eval("var " + tenBien + " = " + soLieuHienTai + ";");
    }

    //* Tính toán kết quả
    let ketQuaTinh = eval(bieuThuc + ";");
    let kieuDoiTuong = mangTaiNguyen[viTri].KieuNhap;

    //? Kiểu là số
    if (kieuDoiTuong === "number") {
      let kiemTraLamTron = mangTaiNguyen[viTri].TinhToan.LamTron;

      //? Có làm tròn
      if (kiemTraLamTron !== "") {
        ketQuaTinh = ketQuaTinh.toFixed(kiemTraLamTron);
      }

      //? Làm tròn theo nguyên tắt
      else {
        ketQuaTinh = TuDongLamTronSo(ketQuaTinh);
      }
    }

    //* Nhập số liệu trở lại field đang chờ
    let idDoiTuong = mangTaiNguyen[viTri].ID;
    TuDongNhapDuLieu(idDoiTuong, ketQuaTinh);
  }

  //* Tính toán nồng độ hỗn hợp cho nước thải
  function TinhToanNongDoHonHop_NuocThai(viTri) {
    //Biến
    let bieuThuc = mangTaiNguyen[viTri].TinhToan.CongThuc;
    let mangDieuKien = mangTaiNguyen[viTri].TinhToan.DieuKien;

    //Thực hiện
    //* Lặp lấy số liệu hiện tại và gán biến
    for (let i = 0; i < mangDieuKien.length; i++) {
      let tenBien = mangDieuKien[i].slice(0, mangDieuKien[i].indexOf("="));
      let idLaySoLieu = mangDieuKien[i].slice(mangDieuKien[i].indexOf("=", 0) + 1, mangDieuKien[i].length);
      let idBoxLaySo = idLaySoLieu.replace("input", "box");
      let trangThai = document.getElementById(idBoxLaySo).style.display;
      let soLieuHienTai;

      //? Trạng thái không ẩn
      if (trangThai !== "none") {
        soLieuHienTai = So(TuDongLayDuLieu(idLaySoLieu));
      }

      //? Trạng thái ẩn
      else {
        soLieuHienTai = 0;
      }

      //* Gán biến
      eval("var " + tenBien + " = " + soLieuHienTai + ";");
    }

    //* Tính toán kết quả
    let ketQuaTinh = eval(bieuThuc + ";");
    let kieuDoiTuong = mangTaiNguyen[viTri].KieuNhap;

    //? Kiểu là số
    if (kieuDoiTuong === "number") {
      ketQuaTinh = TuDongLamTronSo(ketQuaTinh);
    }

    //* Nhập số liệu trở lại field đang chờ
    let idDoiTuong = mangTaiNguyen[viTri].ID;
    TuDongNhapDuLieu(idDoiTuong, ketQuaTinh);
  }

  //* Tính toán nồng độ chất ô nhiễm theo hệ số k, kq, kf
  function TinhToanNongDoTheoQuyChuan_NuocThai(viTri) {
    //Biến
    let mangIDPhuThuoc = mangTaiNguyen[viTri].TinhToan.DuLieu.IDPhuThuoc;
    let mangSoSanh = mangTaiNguyen[viTri].TinhToan.DuLieu.GiaTriPhuThuoc;
    let mangDuongDan = mangTaiNguyen[viTri].TinhToan.DuLieu.DuongDanCSDL;
    let chuoiGiaTriHienTai = "";

    //Thực hiện
    //* Lấy giá trị phụ thuộc ghép thành chuỗi
    for (let i = 0; i < mangIDPhuThuoc.length; i++) {
      let giaTri = TuDongLayDuLieu(mangIDPhuThuoc[i]);

      //* cộng chuỗi
      chuoiGiaTriHienTai = chuoiGiaTriHienTai + giaTri.toString();
    }

    //* Lấy số liệu chỉ tiêu từ đường dẫn
    let viTriKetQua = SoSanhGiaTriHienTaiVaMang(chuoiGiaTriHienTai, mangSoSanh, false);
    let duongDan = mangDuongDan[viTriKetQua];
    let catDuongDan = duongDan.split(".");
    let truyCap = mangDuLieu.QCVN;
    let idDoiTuong = mangTaiNguyen[viTri].ID;
    let chiTieu = idDoiTuong.slice(idDoiTuong.lastIndexOf("_") + 1, idDoiTuong.length);

    //* Lặp truy cập đường dẫn và trả kết quả
    for (let i = 0; i < catDuongDan.length; i++) {
      truyCap = truyCap[catDuongDan[i]];
    }
    let ketQua = truyCap[chiTieu];

    //* Xử lý kết quả tính
    //? Không phải pH và tổng coliforms
    if (chiTieu !== "pH" && chiTieu !== "TColiforms") {
      let mangDieuKien = mangTaiNguyen[viTri].TinhToan.DieuKien;

      //* Duyệt nhân hệ số quy đổi với số liệu quy chuẩn
      for (let i = 1; i < mangDieuKien.length; i++) {
        let idDieuKien = mangDieuKien[i].slice(mangDieuKien[i].indexOf("=", 0) + 1, mangDieuKien[i].length);
        let idBoxDieuKien = idDieuKien.replace("input", "box");
        let trangThaiAnHien = document.getElementById(idBoxDieuKien).style.display;

        //? Có hiện
        if (trangThaiAnHien !== "none") {
          ketQua = ketQua * So(TuDongLayDuLieu(idDieuKien));
        }
      }

      //* làm tròn kết qua
      ketQua = TuDongLamTronSo(ketQua);
    }

    //* Trả kết quả về field đang chờ
    TuDongNhapDuLieu(idDoiTuong, ketQua);
  }

  //* Tính toán thể tích theo dạng hình học
  function TinhToanTheTichDangHinhHoc_NuocThai(viTri) {
    //Biến
    let mangIDPhuThuoc = mangTaiNguyen[viTri].TinhToan.DuLieu.IDPhuThuoc;
    let mangSoSanh = mangTaiNguyen[viTri].TinhToan.DuLieu.GiaTriPhuThuoc;
    let mangCongThuc = mangTaiNguyen[viTri].TinhToan.DuLieu.DuongDanCSDL;
    let mangDieuKien = mangTaiNguyen[viTri].TinhToan.DieuKien;
    let chuoiGiaTriHienTai = "";

    //Thực hiện
    //* Lấy giá trị phụ thuộc ghép thành chuỗi
    for (let i = 0; i < mangIDPhuThuoc.length; i++) {
      let giaTri = TuDongLayDuLieu(mangIDPhuThuoc[i]);

      //* cộng chuỗi
      chuoiGiaTriHienTai = chuoiGiaTriHienTai + giaTri.toString();
    }

    //* Lấy số liệu chỉ tiêu từ đường dẫn
    let viTriKetQua = SoSanhGiaTriHienTaiVaMang(chuoiGiaTriHienTai, mangSoSanh, false);
    let congThuc = mangCongThuc[viTriKetQua];

    //* Tìm các biến có trong công thức và gán giá trị
    for (let i = 0; i < mangDieuKien.length; i++) {
      let tenBien = mangDieuKien[i].slice(0, mangDieuKien[i].indexOf("="));

      //? Tên biến có trong công thức
      if (congThuc.indexOf(tenBien, 0) !== -1) {
        let idLaySoLieu = mangDieuKien[i].slice(mangDieuKien[i].indexOf("=", 0) + 1, mangDieuKien[i].length);
        let soLieuHienTai = So(TuDongLayDuLieu(idLaySoLieu));

        //* Gán biến
        eval("var " + tenBien + " = " + soLieuHienTai + ";");
      }
    }

    //* Tính toán kết quả
    let ketQuaTinh = eval(congThuc + ";");
    let kieuDoiTuong = mangTaiNguyen[viTri].KieuNhap;

    //? Kiểu là số
    if (kieuDoiTuong === "number") {
      ketQuaTinh = TuDongLamTronSo(ketQuaTinh);
    }

    //* Nhập số liệu trở lại field đang chờ
    let idDoiTuong = mangTaiNguyen[viTri].ID;
    TuDongNhapDuLieu(idDoiTuong, ketQuaTinh);
  }

  //* Highlight chỉ dẫn nhập
  function HighlightDoiTuong(idDoiTuong, highlightT_boHighlightF) {
    //? Highlight đối tượng
    if (highlightT_boHighlightF) {
      document.getElementById(idDoiTuong).style.borderColor = "#0d6efd";
    }

    //? Bỏ Highlight đối tượng
    else {
      document.getElementById(idDoiTuong).style.borderColor = "#ced4da";
    }
  }

  //Thực hiện
  //* Tìm lĩnh vực xử lý
  TimLinhVucXuLy();

  //? Nếu tồn tại lĩnh vực xử lý
  if (linhVucXuLy !== "") {
    mangTaiNguyen = window.jsonDataSources.CauTruc[linhVucXuLy];
    mangDuLieu = window.jsonDataSources.CoSoDuLieu[linhVucXuLy];

    //* Lặp xử lý tính toán từng đối tượng
    for (let i = 0; i < mangTaiNguyen.length; i++) {
      let kiemTraCongTrinhDonVi = mangTaiNguyen[i].CongTrinhDonVi;
      let kiemTraDieuKien = mangTaiNguyen[i].TinhToan.DieuKien.length;
      let kiemTraKieuTinh = mangTaiNguyen[i].TinhToan.KieuTinh;

      //? Có công thức tính toán
      if (kiemTraDieuKien !== 0) {
        //? Có hiển thị
        if (KiemTraAnHien(i)) {
          //? Điều kiện đầu vào
          if (KiemTraDieuKien(i)) {
            //? Kiểu tính bình thường
            if (kiemTraKieuTinh === "") {
              TinhToanKetQua(i);
            }

            //? Kiểu tính ngoại lệ
            else {
              //? Tính nồng độ hỗn hợp
              if (kiemTraKieuTinh === "nongDoHonHop") {
                TinhToanNongDoHonHop_NuocThai(i);
              }

              //? Tính toán nồng độ chất ô nhiễm theo hệ số k, kq, kf
              if (kiemTraKieuTinh === "nongDoTheoQuyChuan") {
                TinhToanNongDoTheoQuyChuan_NuocThai(i);
              }

              //? Tính toán dạng hình học
              if (kiemTraKieuTinh === "dangHinhHoc") {
                TinhToanTheTichDangHinhHoc_NuocThai(i);
              }
            }
          }
        }
      }
    }

    //* Lặp hướng dẫn nhập cho từng đối tượng
    for (let i = 0; i < mangTaiNguyen.length; i++) {
      let kieuDoiTuong = mangTaiNguyen[i].Kieu;

      //? Kiểu là comboBox hoặc input
      if (kieuDoiTuong === "comboBox" || kieuDoiTuong === "input") {
        let idSection = mangTaiNguyen[i].IDSection;
        let idBoxSection = idSection.replace("section", "box");
        let kiemTraAnHienSection = document.getElementById(idBoxSection).style.display;

        //? Section đang hiện
        if (kiemTraAnHienSection !== "none") {
          let idDoiTuong = mangTaiNguyen[i].ID;
          let idBoxDoiTuong = idDoiTuong.replace(kieuDoiTuong, "box");
          let kiemTraTrangThaiDoiTuong = document.getElementById(idBoxDoiTuong).style.display;
          let kiemTraDisable = document.getElementById(idDoiTuong).disabled;

          //? Đối tượng đang hiện
          if (kiemTraTrangThaiDoiTuong !== "none" && kiemTraDisable === false) {
            let giaTriDoiTuong = TuDongLayDuLieu(idDoiTuong);

            //? là comboBox
            if (kieuDoiTuong === "comboBox") {
              //? Chưa chọn giá trị
              if (giaTriDoiTuong === 0) {
                HighlightDoiTuong(idDoiTuong, true);
              }

              //? Đã chọn giá trị
              else {
                HighlightDoiTuong(idDoiTuong, false);
              }
            }

            //? là input
            else if (kieuDoiTuong === "input") {
              //? Chưa nhập giá trị
              if (giaTriDoiTuong === "") {
                HighlightDoiTuong(idDoiTuong, true);
              }

              //? Đã nhập giá trị
              else {
                HighlightDoiTuong(idDoiTuong, false);
              }
            }
          }
        }
      }
    }
  }
}

//!-----------------------------------------------------------V. XỬ LÝ SỰ KIỆN-----------------------------------------------------------------------
//Todo: TỰ ĐỘNG ẨN HIỆN TOÀN BỘ WEBSITE (XỬ LÝ QUA JSON DATA SOURCES)
function TuDongThaoTacTrenDoiTuong(idThucHien) {
  //Biến
  let indexLinhVuc = TuDongLayDuLieu(window.jsonDataSources.CauTruc.LinhVuc[0].ID);
  let linhVucXuLy = "";
  let mangThucHien = [];

  //Chương trình con
  //Kiểm tra giá trị hiện tại
  function SoSanhGiaTriHienTaiVaMang(
    giaTriHienTai,
    mangSoSanh,
    TonTaiHoacKhongT_ViTriF
  ) {
    //Biến
    let tonTai = false;
    let viTriGiaTri = -1;

    //Kiểm tra tồn tại giá trị hiện tại và mảng so sánh
    for (let i = 0; i < mangSoSanh.length; i++) {
      //Loại dấu , và chuyển đầu vào sang str
      let bienSoSanh = mangSoSanh[i].toString().replace(/,/g, "");
      let giaTriSoSanh = giaTriHienTai.toString();

      //So sánh, trả kết quả
      if (bienSoSanh === giaTriSoSanh) {
        tonTai = true;
        viTriGiaTri = i;
      }
    }

    //Trả về
    //Trả về có tồn tại trong mảng hay không
    if (TonTaiHoacKhongT_ViTriF) {
      return tonTai;
    }

    //Trả về vị trí tồn tại
    else {
      return viTriGiaTri;
    }
  }

  //* Ẩn hiện lĩnh vực tính toán + gán giá trị thực hiện
  function AnHienLinhVucXuLy() {
    //Biến
    //Mảng IDBox ẩn hiện
    let mangIDBox = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.IDBox;
    //Mảng giá trị phụ thuộc
    let mangGiaTriPhuThuoc =
      window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriPhuThuoc;
    //Mảng giá trị thực hiệN
    let mangGiaTriThucHien =
      window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien;

    for (let i = 0; i < mangIDBox.length; i++) {
      //Nếu đúng giá trị lĩnh vực đang chọn
      if (indexLinhVuc === mangGiaTriPhuThuoc[i]) {
        AnHienDoiTuongDangBlock(mangIDBox[i], false);
        linhVucXuLy = mangGiaTriThucHien[i];
      }

      //Ẩn toàn bộ các giá trị còn lại
      else {
        AnHienDoiTuongDangBlock(mangIDBox[i], true);
      }
    }
  }

  //* Ẩn hiện toàn website
  function AnHien(bienLap) {
    //Biến
    let mangIDPhuThuoc = mangThucHien[bienLap].AnHien.IDPhuThuoc;

    //Nếu tồn tại phụ thuộc
    if (mangIDPhuThuoc.length !== 0) {
      //Biến
      let idDoiTuong = mangThucHien[bienLap].ID;
      let idBoxAnHien = idDoiTuong.replace(idDoiTuong.slice(0, idDoiTuong.indexOf("_", 0)), "box");
      let mangGiaTri = mangThucHien[bienLap].AnHien.GiaTriPhuThuoc;
      let kiemTra;
      let chuoiGiaTriHienTai = "";

      //Tạo chuỗi so sánh
      for (let k = 0; k < mangIDPhuThuoc.length; k++) {
        //Biến
        let giaTri = TuDongLayDuLieu(mangIDPhuThuoc[k]);
        let kieuDoiTuong = mangIDPhuThuoc[k].slice(
          0,
          mangIDPhuThuoc[k].indexOf("_", 0)
        );

        //Nếu là nhập chữ
        if (kieuDoiTuong === "input") {
          if (giaTri !== "") {
            chuoiGiaTriHienTai = chuoiGiaTriHienTai + "*";
          }
        }

        //Kiểu khác
        else {
          chuoiGiaTriHienTai = chuoiGiaTriHienTai + giaTri.toString();
        }
      }

      //True = hiện, false = ẩn
      kiemTra = SoSanhGiaTriHienTaiVaMang(chuoiGiaTriHienTai, mangGiaTri, true);

      //Nếu cần hiện
      if (kiemTra) {
        AnHienDoiTuongDangBlock(idBoxAnHien, false);
      }

      //Nếu không hiện
      else {
        AnHienDoiTuongDangBlock(idBoxAnHien, true);
      }
    }
  }

  //* Khoá thao tác toán website
  function KhoaThaoTac(bienLap) {
    //Biến
    let kiemTraKhoa = mangThucHien[bienLap].KhoaThaoTac.IDPhuThuoc;

    //Thực thi
    //Nếu cần khoá
    if (kiemTraKhoa !== "") {
      //Biến
      let giaTriHienTai = TuDongLayDuLieu(kiemTraKhoa);
      let mangGiaTri = mangThucHien[bienLap].KhoaThaoTac.GiaTriPhuThuoc;
      let mangGiaTriTuyChon = mangThucHien[bienLap].KhoaThaoTac.GiaTriTuyChon;
      let kiemTra = SoSanhGiaTriHienTaiVaMang(giaTriHienTai, mangGiaTri, true);
      let idDoiTuong = mangThucHien[bienLap].ID;

      //Không có tuỳ chọn hay select
      if (mangGiaTriTuyChon.length === 0) {
        //Đúng giá trị khoá
        if (kiemTra) {
          KhoaMoThaoTacDoiTuong(idDoiTuong, true, "");
        }

        //Không đúng thì mở khoá
        else {
          KhoaMoThaoTacDoiTuong(idDoiTuong, false, "");
        }
      }

      //Có tuỳ chọn cho select
      else {
        for (let i = 0; i < mangGiaTriTuyChon.length; i++) {
          //Khoá
          if (kiemTra) {
            KhoaMoThaoTacDoiTuong(idDoiTuong, true, mangGiaTriTuyChon[i]);
          }

          //Mở khoá
          else {
            KhoaMoThaoTacDoiTuong(idDoiTuong, false, mangGiaTriTuyChon[i]);
          }
        }
      }
    }
  }

  //* Tự động điền trước dữ liệu vào một field bất kỳ
  function TuDongDienTruocDuLieu(bienLap) {
    //Biến
    let mangIDPhuThuoc = mangThucHien[bienLap].TuDongDienTruoc.IDPhuThuoc;

    //Thực hiện
    //Nếu cần đIền trước
    if (mangIDPhuThuoc.length !== 0) {
      //Biến
      let mangGiaTriDien = mangThucHien[bienLap].TuDongDienTruoc.GiaTriDien;
      let mangGiaTriPhuThuoc =
        mangThucHien[bienLap].TuDongDienTruoc.GiaTriPhuThuoc;
      let viTri;
      let chuoiGiaTriHienTai = "";

      //Thực hiện
      //Tạo chuỗi so sánh
      for (let k = 0; k < mangIDPhuThuoc.length; k++) {
        //Biến
        let giaTri = TuDongLayDuLieu(mangIDPhuThuoc[k]);
        let kieuDoiTuong = mangIDPhuThuoc[k].slice(
          0,
          mangIDPhuThuoc[k].indexOf("_", 0)
        );

        //Nếu là nhập chữ
        if (kieuDoiTuong === "input") {
          if (giaTri !== "") {
            chuoiGiaTriHienTai = chuoiGiaTriHienTai + "*";
          }
        }

        //Kiểu khác
        else {
          chuoiGiaTriHienTai = chuoiGiaTriHienTai + giaTri.toString();
        }
      }

      //Trả về vị trí của giá trị cần điền trong mảng giá trị điền trước
      viTri = SoSanhGiaTriHienTaiVaMang(
        chuoiGiaTriHienTai,
        mangGiaTriPhuThuoc,
        false
      );

      //Thực hiện điền trước
      TuDongNhapDuLieu(mangThucHien[bienLap].ID, mangGiaTriDien[viTri]);
    }
  }

  //* Chọn công trình và vẽ sơ đồ công nghệ
  function ThaoTacSoDoCongNghe(bienLap) {
    //Khai báo biến
    let kiemTraSoDo = mangThucHien[bienLap].TaoSoDo.IDHienThi;
    let kiemTraChonCongTrinh = mangThucHien[bienLap].TaoSoDo.ChonCongTrinh;
    let kiemTraID = mangThucHien[bienLap].ID;

    //Chương trình con
    function TimViTriID(idCanTim) {
      //* Lặp tìm id
      for (let k = 0; k < mangThucHien.length; k++) {
        //? Tìm thấy id trả về vị trí trong mảng
        if (mangThucHien[k].ID === idCanTim) {
          return k;
        }
      }
    }

    //* Ẩn hiện công trình đơn vị
    function AnHienCongTrinhDonVi(mangCongTrinh, idHienThiSoDo) {
      //Biến

      //Thực hiện
      //* Ẩn toàn bộ section có công trình đơn vị (thuộc sơ đỒ công nghệ)
      for (let i = 0; i < mangThucHien.length; i++) {
        let idDoiTuong = mangThucHien[i].ID;

        //? Là id của hiển thị sơ đồ công nghệ
        if (idDoiTuong === idHienThiSoDo) {
          let mangToanBoCongTrinh = mangThucHien[i].TaoSoDo.DSCongTrinhDonVi;

          //* Lặp ẩn toàn bộ section có công trình đơn vị trong mảng
          for (let j = 0; j < mangToanBoCongTrinh.length; j++) {
            let congTrinh = mangToanBoCongTrinh[j];

            //* Lặp tìm section chứa công trình đơn vị
            for (var k = 0; k < mangThucHien.length; k++) {
              let kieuDoiTuong = mangThucHien[k].Kieu;
              let loaiCongTrinh = mangThucHien[k].CongTrinhDonVi;

              //? Kiểu là section + loại = công trình đơn vị đang tìm
              if (kieuDoiTuong === "section" && loaiCongTrinh === congTrinh) {
                let idBoxHienThi = mangThucHien[k].ID.replace("section", "box");

                //* Ẩn công trình qua box hiển thị
                AnHienDoiTuongDangBlock(idBoxHienThi, true);
              }
            }
          }
        }
      }

      //* Lặp từng công trình đơn vị trong mảng
      for (let i = 0; i < mangCongTrinh.length; i++) {
        let congTrinh = mangCongTrinh[i];
        let idBoxHienThi, idNeoGiu;

        //* Lặp tìm vị trí section công trình đơn vị đang kiểm tra
        for (let j = 0; j < mangThucHien.length; j++) {
          let kieuDoiTuong = mangThucHien[j].Kieu;
          let loaiCongTrinh = mangThucHien[j].CongTrinhDonVi;

          //? kiểu là section và loại công trình đúng vớI công trình đang duyệt
          if (kieuDoiTuong === "section" && loaiCongTrinh === congTrinh) {
            idBoxHienThi = mangThucHien[j].ID.replace("section", "box");
            idNeoGiu = mangThucHien[j].IDNeoGiu;
          }
        }

        //* Di chuyển công trình theo thứ tự công nghệ
        DiChuyenCacNode(idNeoGiu, idBoxHienThi);

        //* Hiện công trình đƠn vị
        AnHienDoiTuongDangBlock(idBoxHienThi, false);
      }
    }

    //Thực hiện
    //? Id không phải là id hiển thị sơ đỒ công nghệ
    if (kiemTraID.indexOf("flowChart", 0) === -1) {
      //? Có sơ đồ
      if (kiemTraSoDo !== "") {
        //? Combo box chọn công trình
        if (kiemTraChonCongTrinh) {
          //Biến
          let viTriFlowChart = TimViTriID(kiemTraSoDo);
          let idDoiTuong = mangThucHien[bienLap].ID;

          //? Có phải btn xoá không
          if (idDoiTuong.indexOf("btnInCal", 0) !== -1) {
            //Biến
            let congTrinhDangChon, tenTuyChon;

            //* Tìm vị trí comboBox chọn công trình + reset về mặc đỊnh
            for (let i = 0; i < mangThucHien.length; i++) {
              //Biến
              let idHienThiHienTai = mangThucHien[i].TaoSoDo.IDHienThi;
              let congTrinhChonHienTai = mangThucHien[i].TaoSoDo.ChonCongTrinh;
              let phaiKhacBTN = mangThucHien[i].ID.indexOf("btnInCal", 0);

              //? ID Hiện tại, công trình chọn true, không phải btn
              if (idHienThiHienTai === kiemTraSoDo && congTrinhChonHienTai === true && phaiKhacBTN === -1) {
                //* Gán công trình đang chọn
                congTrinhDangChon = document.getElementById(mangThucHien[i].ID).value;

                //* Gán label của tuỳ chọn
                let tuyChon = document.getElementById(mangThucHien[i].ID);
                tenTuyChon = tuyChon.options[tuyChon.selectedIndex].text;

                //* Reset về mặc đỊnh
                TuDongTraVeGiaTriMacDinh(mangThucHien[i].ID, false);
              }
            }

            //* Biến của sơ đồ
            let _duLieuTaoSoDo = mangThucHien[viTriFlowChart].TaoSoDo._DuLieuSoDo;
            let _duLieuCongTrinh = mangThucHien[viTriFlowChart].TaoSoDo._TaoCongTrinh;
            let _duLieuDuongVe = mangThucHien[viTriFlowChart].TaoSoDo._TaoDuongVe;
            let _danhSachCongTrinh = mangThucHien[viTriFlowChart].TaoSoDo._DanhSachCongTrinh;

            //* Xoá công trình và tạo lại dữ liệu công trình
            let duLieuCongTrinh = window[_duLieuCongTrinh];
            let chuoiCongTrinh = congTrinhDangChon + "=>operation: " + tenTuyChon + "\n";
            let strTam1 = duLieuCongTrinh.slice(0, duLieuCongTrinh.indexOf(chuoiCongTrinh, 0));
            let strTam2 = duLieuCongTrinh.slice(duLieuCongTrinh.indexOf(chuoiCongTrinh, 0) + chuoiCongTrinh.length, duLieuCongTrinh.length);
            duLieuCongTrinh = strTam1 + strTam2;

            //* Xoá đường vẽ và tạo lại dữ liệu đường vẽ
            let duLieuDuongVe = window[_duLieuDuongVe];
            let chuoiDuongVeXoa = "->" + congTrinhDangChon;
            strTam1 = duLieuDuongVe.slice(0, duLieuDuongVe.indexOf(chuoiDuongVeXoa, 0));
            strTam2 = duLieuDuongVe.slice(duLieuDuongVe.indexOf(chuoiDuongVeXoa, 0) + chuoiDuongVeXoa.length, duLieuDuongVe.length);
            duLieuDuongVe = strTam1 + strTam2;

            //* Xoá công trình đơn vị trong danh sách
            let danhSachCongTrinh = window[_danhSachCongTrinh];
            danhSachCongTrinh.splice(danhSachCongTrinh.indexOf(congTrinhDangChon), 1);

            //* Tạo lại dữ liệu vẽ sơ đồ
            let taoCongTrinh_Ra = mangThucHien[viTriFlowChart].TaoSoDo.TaoCongTrinh_DauRa;
            let taoDuongVe_Ra = mangThucHien[viTriFlowChart].TaoSoDo.TaoDuongVe_DauRa;
            let duLieuVeSoDo = duLieuCongTrinh + taoCongTrinh_Ra + duLieuDuongVe + taoDuongVe_Ra;

            //* Vẽ sơ đồ, hiển thị công trình đơn vị
            VeSoDoCongNghe(duLieuVeSoDo, kiemTraSoDo);
            AnHienCongTrinhDonVi(danhSachCongTrinh, kiemTraSoDo);

            //* Cập nhật lại các biến toàn cục
            window[_duLieuCongTrinh] = duLieuCongTrinh;
            window[_duLieuDuongVe] = duLieuDuongVe;
            window[_danhSachCongTrinh] = danhSachCongTrinh;
            window[_duLieuTaoSoDo] = duLieuVeSoDo;
          }

          //? Thêm công trình
          else {
            //Biến
            let congTrinh = document.getElementById(idDoiTuong).value;
            let _bienDanhSachCongTrinh = mangThucHien[viTriFlowChart].TaoSoDo._DanhSachCongTrinh;
            let danhSachCongTrinh = window[_bienDanhSachCongTrinh];
            let kiemTraDaChon = false;

            //Code
            //? Kiểm tra phải giá trị mặc đỊnh không
            if (TuDongLayDuLieu(idDoiTuong) === 0) {
              kiemTraDaChon = true;
            }

            //* Kiểm tra có công trình chưa?
            for (let j = 0; j < danhSachCongTrinh.length; j++) {
              //? Có công trình rồi
              if (danhSachCongTrinh[j] === congTrinh) {
                kiemTraDaChon = true;
              }
            }

            //? Nếu chưa thực hiện vẽ
            if (kiemTraDaChon === false) {
              //Biến
              let _bienTaoCongTrinh = mangThucHien[viTriFlowChart].TaoSoDo._TaoCongTrinh;
              let chuoiCongTrinh = window[_bienTaoCongTrinh];
              let _bienTaoDuongVe = mangThucHien[viTriFlowChart].TaoSoDo._TaoDuongVe;
              let chuoiDuongVe = window[_bienTaoDuongVe];
              let taoCongTrinh_Ra = mangThucHien[viTriFlowChart].TaoSoDo.TaoCongTrinh_DauRa;
              let taoDuongVe_Ra = mangThucHien[viTriFlowChart].TaoSoDo.TaoDuongVe_DauRa;
              let _bienDuLieuSoDo = mangThucHien[viTriFlowChart].TaoSoDo._DuLieuSoDo;
              let bienDuLieuVeSoDo = window[_bienDuLieuSoDo];

              //Thực hiện
              //* Thêm công trình vào danh sách công trình
              danhSachCongTrinh.push(congTrinh);

              //* Tạo công trình
              let congTrinhHienTai = document.getElementById(idDoiTuong);
              let tenTuyChon = congTrinhHienTai.options[congTrinhHienTai.selectedIndex].text;
              chuoiCongTrinh = chuoiCongTrinh + congTrinh + "=>operation: " + tenTuyChon + "\n";
              chuoiDuongVe = chuoiDuongVe + "->" + congTrinh;

              //* Tạo dữ liệu vẽ sơ đồ và thực hiệN vẽ
              bienDuLieuVeSoDo = chuoiCongTrinh + taoCongTrinh_Ra + chuoiDuongVe + taoDuongVe_Ra;
              VeSoDoCongNghe(bienDuLieuVeSoDo, kiemTraSoDo);

              //* Ẩn hiện công trình cho phù hợp công nghệ
              AnHienCongTrinhDonVi(danhSachCongTrinh, kiemTraSoDo);

              //* Gán dữ liệu trở lại cho biến toàn cục
              window[_bienDuLieuSoDo] = bienDuLieuVeSoDo;
              window[_bienDanhSachCongTrinh] = danhSachCongTrinh;
              window[_bienTaoCongTrinh] = chuoiCongTrinh;
              window[_bienTaoDuongVe] = chuoiDuongVe;

              //* Reset comboBox lựa chọn
              TuDongTraVeGiaTriMacDinh(idDoiTuong, false);
            }
          }
        }

        //? Combo box chọn cách tạo sơ đồ
        else {
          //Biến
          let giaTriDangChon = TuDongLayDuLieu(mangThucHien[bienLap].ID);

          //? Giá trị chọn là 0
          if (giaTriDangChon === 0) {
            //* Xoá sơ đồ tồn tại (nếu có)
            document.getElementById(kiemTraSoDo).innerHTML = "";

            //* Reset công trình đơn vị
            let _bienDanhSachCongTrinh = mangThucHien[TimViTriID(kiemTraSoDo)].TaoSoDo._DanhSachCongTrinh;
            window[_bienDanhSachCongTrinh] = [];

            //* Ẩn toàn bộ công trình đơn vị
            AnHienCongTrinhDonVi(window[_bienDanhSachCongTrinh], kiemTraSoDo);
          }

          //? Giá trị bằng 1 thì đề xuất công nghệ
          else if (giaTriDangChon === 1) {
            //Khai báo biến
            let viTriFlowChart = TimViTriID(kiemTraSoDo);
            let mangIDPhuThuoc = mangThucHien[viTriFlowChart].TaoSoDo.DeXuat.IDPhuThuoc;
            let chuoiGiaTriHienTai = "";
            let viTri;
            let mangGiaTri = mangThucHien[viTriFlowChart].TaoSoDo.DeXuat.GiaTriPhuThuoc;
            let mangDuongDan = mangThucHien[viTriFlowChart].TaoSoDo.DeXuat.DuongDanCSDL;
            let idDoiTuong = mangThucHien[bienLap].ID;

            //Thực hiện
            //* Tạo chuỗi so sánh
            for (let j = 0; j < mangIDPhuThuoc.length; j++) {
              //Biến
              let giaTri = TuDongLayDuLieu(mangIDPhuThuoc[j]);
              let kieuDoiTuong = mangIDPhuThuoc[j].slice(
                0,
                mangIDPhuThuoc[j].indexOf("_", 0)
              );

              //? Nếu là nhập chữ
              if (kieuDoiTuong === "input") {
                if (giaTri !== "") {
                  chuoiGiaTriHienTai = chuoiGiaTriHienTai + "*";
                }
              }

              //? Kiểu khác
              else {
                chuoiGiaTriHienTai = chuoiGiaTriHienTai + giaTri.toString();
              }
            }

            //* Kiểm tra lấy vị trí đường dẫn dữ liệu điền
            viTri = SoSanhGiaTriHienTaiVaMang(chuoiGiaTriHienTai, mangGiaTri, false);

            //? Tìm được vị trí
            if (viTri !== -1) {
              //* Tạo biến của sơ đồ
              let _duLieuTaoSoDo = mangThucHien[viTriFlowChart].TaoSoDo._DuLieuSoDo;
              let _duLieuCongTrinh = mangThucHien[viTriFlowChart].TaoSoDo._TaoCongTrinh;
              let _duLieuDuongVe = mangThucHien[viTriFlowChart].TaoSoDo._TaoDuongVe;
              let _danhSachCongTrinh = mangThucHien[viTriFlowChart].TaoSoDo._DanhSachCongTrinh;
              //* Lấy dữ liệu từ đường dẫn trong CSDL
              let duongDan = mangDuongDan[viTri].split(".");
              let mangTam = mangCSDL.SoDoCongNghe;
              //* Lặp từng node trong đường dẫn
              for (let l = 0; l < duongDan.length; l++) {
                mangTam = mangTam[duongDan[l]];
              }

              //* Gán dữ liệu sơ đỒ vào biến toàn cục
              window[_duLieuTaoSoDo] = mangTam.GiaTri;

              //* Dữ liệu công trình đơn vị
              let taoCongTrinh_Ra = mangThucHien[viTriFlowChart].TaoSoDo.TaoCongTrinh_DauRa;
              let taoDuongVe_Vao = mangThucHien[viTriFlowChart].TaoSoDo.TaoDuongVe_DauVao;
              let taoDuongVe_Ra = mangThucHien[viTriFlowChart].TaoSoDo.TaoDuongVe_DauRa;

              //* Gán danh sách công trình vào biến toàn cục
              let strDanhSach = mangTam.GiaTri.slice(mangTam.GiaTri.indexOf(taoDuongVe_Vao + "->", 0) + taoDuongVe_Vao.length + 2, mangTam.GiaTri.length - taoDuongVe_Ra.length);
              let mangDanhSachCongTrinh = strDanhSach.split("->");
              window[_danhSachCongTrinh] = mangDanhSachCongTrinh;

              //* Tạo chuỗi công trình + đường vẽ và gán vào biến toàn cục
              window[_duLieuCongTrinh] = mangTam.GiaTri.slice(0, mangTam.GiaTri.indexOf(taoCongTrinh_Ra, 0));
              window[_duLieuDuongVe] = taoDuongVe_Vao + "->" + strDanhSach;

              //* Tạo dữ liệu vẽ sơ đồ và thực hiệN vẽ
              VeSoDoCongNghe(mangTam.GiaTri, kiemTraSoDo);

              //* Ẩn hiện công trình cho phù hợp công nghệ
              AnHienCongTrinhDonVi(mangDanhSachCongTrinh, kiemTraSoDo);
            }

            //? Không tìm thấy vị trí
            else {
              TuDongTraVeGiaTriMacDinh(idDoiTuong);
            }
          }
        }
      }
    }

    //? Là id hiển thị sơ đỒ công nghệ (thẻ div, flowChart_)
    else {
      //Biến
      let _duLieuCongTrinh = mangThucHien[bienLap].TaoSoDo._DanhSachCongTrinh;
      let _duLieuSoDo = mangThucHien[bienLap].TaoSoDo._DuLieuSoDo;

      //Thực hiện
      //? Nếu có dữ liệu sơ đỒ cũ
      if (window[_duLieuSoDo] !== "") {
        //* Tạo sơ đồ công nghệ
        VeSoDoCongNghe(window[_duLieuSoDo], kiemTraID);

        //* Ẩn hiệN công trình đơn vị
        AnHienCongTrinhDonVi(window[_duLieuCongTrinh], kiemTraID);
      }
    }
  }

  //* Trả về mặc định
  function TuDongTraVeGiaTriMacDinh(bienLap_ID, thaoTacT_BatKyF) {
    //Biến

    //Chương trình con
    function TraVeMacDinh(id) {
      //Biến
      let kieuKiemTra = id.slice(0, id.indexOf("_", 0));

      //Thực hiện
      //? Input
      if (kieuKiemTra === "input") {
        document.getElementById(id).value = "";
      }

      //? Select
      else if (kieuKiemTra === "comboBox") {
        document.getElementById(id).selectedIndex = 0;
      }

      //? Switch
      else if (kieuKiemTra === "switch") {
        document.getElementById(id).checked = false;
      }

      //Lỗi
      else {
        console.log("ID lỗi: " + id);
        HienThiThongBao("Lỗi trả về giá trị mặc định");
      }
    }

    //Thực hiẹn
    //? Thao tác
    if (thaoTacT_BatKyF) {
      //Biến
      let mangIDReset = mangThucHien[bienLap_ID].TraVeMacDinh;

      //* Reset từng đối tượng trong mảng
      for (let j = 0; j < mangIDReset.length; j++) {
        TraVeMacDinh(mangIDReset[j]);
      }
    }

    //? Đối tượng bất kỳ
    else {
      TraVeMacDinh(bienLap_ID);
    }
  }

  //Chương trình
  //Ẩn hiện lĩnh vực tính toán + gán giá trị thực hiện
  AnHienLinhVucXuLy();

  //? Tồn tại lĩnh vực xử lý
  if (linhVucXuLy !== "") {
    //* Gán mảng thực hiện
    mangThucHien = window.jsonDataSources.CauTruc[linhVucXuLy];
    mangCSDL = window.jsonDataSources.CoSoDuLieu[linhVucXuLy];

    //? Xử lý đối tượng riêng lẻ
    if (idThucHien !== undefined) {
      //* Tìm đối tượng đang đƯợc chọn
      for (let doiTuong = 0; doiTuong < mangThucHien.length; doiTuong++) {
        //? Tìm thấy thực hiện chạy các function cho nó
        if (mangThucHien[doiTuong].ID === idThucHien) {
          //? Bỏ qua lĩnh vực tính toán
          if (idThucHien !== "comboBox_LinhVucTinhToan") {
            //* Trả về mặc đỊnh (nếu có)
            TuDongTraVeGiaTriMacDinh(doiTuong, true);
          }

          //* Thao tác, thêm, xoá công trình đơn vị cho sơ đồ công nghệ
          ThaoTacSoDoCongNghe(doiTuong);
        }
      }
    }

    //* Xử lý đối tượng dạng tuần tự
    for (let doiTuong = 0; doiTuong < mangThucHien.length; doiTuong++) {
      AnHien(doiTuong);
      KhoaThaoTac(doiTuong);
      TuDongDienTruocDuLieu(doiTuong);
    }
  }
}

function XuLySuKienChinh() {
  //===================================== NÚT LỆNH ========================================
  //* NÚT TÍNH TOÁN
  document.getElementById("btn_calculator").addEventListener("click", function () {
    //! Tự động tính toán trên toàn website
    TuDongTinhToanTrenDoiTuong();

    //* Hiển thị dữ liệu trên console
    console.log("%c Sources-Data: ", "color: green; font-weight: bold; font-size: 16px;");
    console.log(window.jsonDataSources);
    console.log("%c User-Data: ", "color: green; font-weight: bold; font-size: 16px;");
    console.log(window.jsonDataUser);
  });

  //* CẬP NHẬT DỮ LIỆU
  document.getElementById("btn_CapNhatDuLieuTuFile").addEventListener("click", function () {
    //Khai báo biến

    //Chương trình con
    function KiemTraUpload() {
      let kiemTra = document.getElementById("upload_TaiLenTepDuLieu").value;
      if (kiemTra === "") {
        document.getElementById("nhapTepDuLieu").style.borderColor = "red";
        return false;
      } else {
        document.getElementById("nhapTepDuLieu").style.borderColor = "#ced4da";
        return true;
      }
    }

    //Code
    //? Có file upload
    if (KiemTraUpload()) {
      //* Nạp dữ liệu vào website
      NapDuLieuChoWebTuIndexdDBVaFile();

      //* Thông báo thành công
      HienThiThongBao("Đã cập nhật dữ liệu từ tệp thành công!");

      //* Reset ô nhập file
      document.getElementById("tenTepTaiLen").innerText = "..."; //Cân nhắc
    }

    //? Không có file
    else {
      HienThiThongBao("Chưa có tệp được tải lên, vui lòng kiểm tra lại!");
    }
  });

  //* TẢI XUỐNG DỮ LIỆU
  document.getElementById("btn_TaiXuongTepDuLieu").addEventListener("click", function () {
    //Biến
    let tenFile = document.getElementById("input_TenFileTaiXuong").value;
    let jsonKiemTra0 = [{
      Ten: "Xuất tệp dữ liệu | Tên tệp",
      ID: "input_TenFileTaiXuong",
    }, ];
    //Chương trình con
    function download(filename, text) {
      //Tạo link
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      //Ẩn hiển thị
      element.style.display = "none";
      document.body.appendChild(element);

      //Click
      element.click();

      //Loại bỏ
      document.body.removeChild(element);
    }

    //Code
    //* Cập nhật lần cuối trước khi tải
    TuDongCapNhatThayDoiTuUser();

    //? Tiến hành tải xuống
    if (KiemTraDieuKienThucHienLenh(jsonKiemTra0)) {
      download(tenFile + ".json", JSON.stringify(window.jsonDataUser));
      HienThiThongBao("Tải xuống thành công!");
    }
  });

  //* XOÁ DỮ LIỆU
  document.getElementById("btn_XacNhanXoaMoiDuLieuDuocLuu").addEventListener("click", function () {
    XoaToanBoDuLieuWebsite();
  });

  //! KIỂM TRA LỖI - CẦN PHÁT TRIỂN TIẾP
  document.getElementById("btn_KiemTraLoi").addEventListener("click", function () {
    //Biến
    let thongBaoLoi = window.kiemTraThongBaoBiTrung.slice(window.kiemTraThongBaoBiTrung.indexOf("@") + 1, window.kiemTraThongBaoBiTrung.length);

    //? Có lỗi và chưa kết thúc tính toán
    if (thongBaoLoi !== "" && window.kiemTraTruocKhiTinh === false) {
      HienThiThongBao(thongBaoLoi);
    }

    //? Không còn lỗi
    else {
      HienThiThongBao("Không phát hiện lỗi!");
    }
  });

  //* THỐNG KÊ SỐ LIỆU
  document.getElementById("btn_ThongKeDuLieuTinhToan").addEventListener("click", function () {
    TaoBangThongKeSoLieu();
  });

  //* IN DỮ LIỆU THỐNG KÊ
  document.getElementById("btn_InDuLieuThongKe").addEventListener("click", function () {
    window.bangThongKe.print();
  });

  //* XUẤT FILE EXCEL DỮ LIỆU EXCEL
  document.getElementById("btn_InDuLieuExcel").addEventListener("click", () => {
    window.bangThongKe.download("xlsx", "dulieuthongke.xlsx");
  });

  //===================================== PHẦN TỬ ========================================
  //* TẢI LÊN TỆP DỮ LIỆU - TỪ NGƯỜI DÙNG
  document.getElementById("upload_TaiLenTepDuLieu").addEventListener("change", function () {
    //Khai báo biến
    let reader = new FileReader();

    //Code
    reader.addEventListener("load", function () {
      let result = JSON.parse(reader.result);
      window.jsonDataUser = result;
      HienThiThongBao("Tải lên tệp tin thành công!");
    });
    reader.readAsText(
      document.getElementById("upload_TaiLenTepDuLieu").files[0]
    );

    //* Hiển thị tên file tải lên
    let tenTep = document.getElementById("upload_TaiLenTepDuLieu").value;
    tenTep = tenTep.split("\\").pop();
    document.getElementById("tenTepTaiLen").innerText = tenTep;
  });
  //* XỬ LÝ TẢI FILE CÙNG TÊN
  document.getElementById("upload_TaiLenTepDuLieu").addEventListener("click", function () {
    //* Xoá file cũ
    document.getElementById("upload_TaiLenTepDuLieu").value = "";

    //* Xoá tên file trong upload btn
    document.getElementById("tenTepTaiLen").innerText = "...";
  });
}

//! NHẬP TỪ JSON XOÁ BỎ EVENT NÀY
function XuLySuKien_NuocThai() {
  //* SỐ LIỆU TỪ CSDL
  document.getElementById("btnInCal_xuLyNuocThai_ThongSoDauVao_CSDL").addEventListener("click", function () {
    //Khai báo biến
    let loaiNuocThaiXuLy = TuDongLayDuLieu("comboBox_XuLyNuocThai");
    let xuLyGopSinhHoat = TuDongLayDuLieu("switch_xuLyNuocThai_GopSinhHoat");

    //Chương trình con
    //* Nhập dữ liệu phù hợp quy chuẩn được chọn
    function NhapDuLieuPhuHopQuyChuan() {
      //? Đối với nước thải sinh hoạt
      if (loaiNuocThaiXuLy === 1) {
        for (
          let i = 0; i < window.jsonDataSources.CoSoDuLieu.NuocThai.NTSH.length; i++
        ) {
          TuDongNhapDuLieu(
            window.jsonDataSources.CoSoDuLieu.NuocThai.NTSH[i].ID,
            window.jsonDataSources.CoSoDuLieu.NuocThai.NTSH[i].GiaTri
          );
        }
      }

      //Đối với nước thải thuỷ sản
      else if (loaiNuocThaiXuLy === 2) {
        for (
          let i = 0; i < window.jsonDataSources.CoSoDuLieu.NuocThai.NTTS.length; i++
        ) {
          TuDongNhapDuLieu(
            window.jsonDataSources.CoSoDuLieu.NuocThai.NTTS[i].ID,
            window.jsonDataSources.CoSoDuLieu.NuocThai.NTTS[i].GiaTri
          );
        }
      }
    }

    //Code
    if (loaiNuocThaiXuLy !== 0) {
      //Đối với không gộp nước thải sinh hoạt
      if (xuLyGopSinhHoat === false) {
        NhapDuLieuPhuHopQuyChuan();
      }

      //Đối với nước thải gộp sinh hoạt
      else if (xuLyGopSinhHoat === true) {
        for (
          let i = 0; i < window.jsonDataSources.CoSoDuLieu.NuocThai.NTSH.length; i++
        ) {
          TuDongNhapDuLieu(
            window.jsonDataSources.CoSoDuLieu.NuocThai.NTSH[i].ID + "_SH",
            window.jsonDataSources.CoSoDuLieu.NuocThai.NTSH[i].GiaTri
          );
        }
        NhapDuLieuPhuHopQuyChuan();
      }

      //Tính toán tiếp tục
      TuDongThaoTacTrenDoiTuong();
      document.getElementById("btn_calculator").click();

    } else {
      HienThiThongBao("2.1 Chọn loại nước thải");
    }
  });
}

//!-------------------------------------------------------VI. NẠP TÀI NGUYÊN WEBSITE KHI LOADING-------------------------------------------------------------------------------------
//Todo: KHỞI TẠO DỮ LIỆU VÀ SỰ KIỆN
window.addEventListener("load", function () {
  //* LẤY DỮ LIỆU TÀI NGUYÊN - SEVER
  LayDuLieuJsonTuSourcesCode(pathDataSources, function (duLieuTraVe) {
    window.jsonDataSources = duLieuTraVe;

    //* LẤY DỮ LIỆU NGƯỜI DÙNG - SEVER
    LayDuLieuJsonTuSourcesCode(pathDataUser, function (duLieuTraVe) {
      const mangKeyLuuTrongIndexdDB = ["duLieuTaiNguyen", "duLieuNguoiDung", "duLieuSoatLoi"];
      window.jsonDataUser = duLieuTraVe;

      //* LẤY DỮ LIỆU TÀI NGUYÊN + NGƯỜI DÙNG - CLIENT
      LayDuLieuTuIndexdDB(mangKeyLuuTrongIndexdDB).then(function ([dataTN, dataND, dataL]) {
        //Biến
        let tonTaiDuLieuCu = false;

        //Thực hiện
        //? Tồn tại dữ liệu cũ
        if (dataTN !== undefined && dataND !== undefined && dataL !== undefined) {
          //! Gắn giá trị cho biến toàn cục từ dữ liệu cũ
          window.jsonDataSources = dataTN;
          window.jsonDataUser = dataND;
          window.kiemTraThongBaoBiTrung = dataL;
          tonTaiDuLieuCu = true;
        }

        //! Render đối tượng cho toàn website
        TaoDoiTuongChoWebsite();

        //! Xử lý sự kiện
        TaoSuKienHienThongTinGoiY();
        XuLySuKienChinh();
        XuLySuKien_NuocThai();
        XuLySuKien_ThietKe(); //! Xoá sau khi xong thiết kế
        XuLyThoiGianThucToanWebsite();
        ChayPopoverTrenWebsite();

        //? Tồn tại dữ liệu cũ
        if (tonTaiDuLieuCu) {
          //! Nạp dữ liệu vào website
          NapDuLieuChoWebTuIndexdDBVaFile();
        }

        //! Lưu dữ liệu người dùng trước khi đóng website
        window.addEventListener("beforeunload", function () {
          //? Chỉ lưu lại dữ liệu khi có lĩnh vực được chọn => tức có dữ liệu
          if (TuDongLayDuLieu(window.jsonDataSources.CauTruc.LinhVuc[0].ID) !== 0) {
            TuDongCapNhatThayDoiTuUser();
            NhapDuLieuLuuTruWebsite();
          }

          //! Reset lại ngôn ngữ mặc định - vietnamese
          document.cookie = "googtrans = ";
        });

        //! Mở khoá và bắt đầu sử dụng
        setTimeout(function () {
          document.getElementById("lock_page").style.opacity = 0;
        }, 500);
        setTimeout(function () {
          document.getElementById("lock_page").remove();
        }, 1000);
      });
    });
  });
});

//!-----------------------------------------------------------------VII. THIẾT KẾ WEBSITE--------------------------------------------------------------------------------------------------------------
//* Nhập thông tin từ tài nguyên vào form
function NhapVaoForm() {
  //Biến
  let giaTriIndex = parseInt(TuDongLayDuLieu("input_ThietKe_ThuTu"));
  let linhVuc = TuDongLayDuLieu("comboBox_LinhVucTinhToan");
  let mangThucHien;

  //Thực hiện
  //? Néu có lĩnh vực
  if (linhVuc !== 0) {
    linhVuc = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien[linhVuc - 1];
    mangThucHien = window.jsonDataSources.CauTruc[linhVuc];

    //? Nếu có index
    if (isNaN(giaTriIndex) === false) {
      //? Nằm trong mảng thực hiện
      if (giaTriIndex < mangThucHien.length && giaTriIndex >= 0) {
        //* Nhập ghi chú
        TuDongNhapDuLieu("input_ThietKe_GhiChu", mangThucHien[giaTriIndex].GhiChu);

        //* Nhập liệu cho kiểu
        let kieuDoiTuong = mangThucHien[giaTriIndex].Kieu
        if (kieuDoiTuong === "section") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 1);
        } else if (kieuDoiTuong === "title") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 2);
        } else if (kieuDoiTuong === "comboBox") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 3);
        } else if (kieuDoiTuong === "input") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 4);
        } else if (kieuDoiTuong === "switch") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 5);
        } else if (kieuDoiTuong === "btnInCal") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 6);
        } else if (kieuDoiTuong === "anchor") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 7);
        } else if (kieuDoiTuong === "flowChart") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 8);
        } else if (kieuDoiTuong === "divCal") {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 9);
        }
        //? Không chọn gì
        else {
          TuDongNhapDuLieu("comboBox_ThietKe_Kieu", 0);
        }

        //* Nhập liệu cho loại tiêu đề
        let loaiTieuDe = mangThucHien[giaTriIndex].LoaiTieuDe;
        if (loaiTieuDe === "loai1") {
          TuDongNhapDuLieu("comboBox_ThietKe_LoaiTieuDe", 1);
        } else if (loaiTieuDe === "loai2") {
          TuDongNhapDuLieu("comboBox_ThietKe_LoaiTieuDe", 2);
        } else {
          TuDongNhapDuLieu("comboBox_ThietKe_LoaiTieuDe", 0);
        }

        //* Nhập liệU cho nhóm dưới đây
        TuDongNhapDuLieu("input_ThietKe_Ten", mangThucHien[giaTriIndex].Ten);
        TuDongNhapDuLieu("input_ThietKe_KyHieu", mangThucHien[giaTriIndex].KyHieu);
        TuDongNhapDuLieu("input_ThietKe_DonVi", mangThucHien[giaTriIndex].DonVi);
        TuDongNhapDuLieu("input_ThietKe_ID", mangThucHien[giaTriIndex].ID);
        TuDongNhapDuLieu("input_ThietKe_IDSection", mangThucHien[giaTriIndex].IDSection);
        TuDongNhapDuLieu("input_ThietKe_IDNeoGiun", mangThucHien[giaTriIndex].IDNeoGiu);
        TuDongNhapDuLieu("input_ThietKe_CongTrinhDonVi", mangThucHien[giaTriIndex].CongTrinhDonVi);

        //* Nhập cho danh sách giá trị - combo Box
        TuDongNhapDuLieu("input_ThietKe_DanhSachGiaTri", mangThucHien[giaTriIndex].DanhSachGiaTri.join(";"));

        //* NhậP cho hướng dẫn nhập liệu - place holder
        TuDongNhapDuLieu("input_ThietKe_HuongDanNhap", mangThucHien[giaTriIndex].HuongDanNhap);

        //* Nhập liệu cho kiểu nhập input
        let kieuNhapVao = mangThucHien[giaTriIndex].KieuNhap;
        if (kieuNhapVao === "number") {
          TuDongNhapDuLieu("comboBox_ThietKe_KieuNhap", 1);
        } else if (kieuNhapVao === "text") {
          TuDongNhapDuLieu("comboBox_ThietKe_KieuNhap", 2);
        } else {
          TuDongNhapDuLieu("comboBox_ThietKe_KieuNhap", 0);
        }

        //* Nhập liệu cho nhóm dưới đây
        TuDongNhapDuLieu("switch_ThietKe_ChoPhepSuaLai", mangThucHien[giaTriIndex].ChoPhepSuaLai);
        TuDongNhapDuLieu("switch_ThietKe_ThuGon", mangThucHien[giaTriIndex].ThuGon);
        TuDongNhapDuLieu("input_ThietKe_AnHien_IDPhuThuoc", mangThucHien[giaTriIndex].AnHien.IDPhuThuoc.join(";"));

        //* Nhập mảng ẩn hiện
        let giaTriAnHienPhuThuoc = mangThucHien[giaTriIndex].AnHien.GiaTriPhuThuoc;
        let tam = "";
        //* Lặp từng đối tượng
        for (let i = 0; i < giaTriAnHienPhuThuoc.length; i++) {
          //? Nằm ở cuối mảng
          if (i === giaTriAnHienPhuThuoc.length - 1) {
            tam = tam + giaTriAnHienPhuThuoc[i].toString();
          }

          //? Cộng vào bình thưỜNg
          else {
            tam = tam + giaTriAnHienPhuThuoc[i].toString() + ";";
          }
        }
        TuDongNhapDuLieu("input_ThietKe_AnHien_GiaTriPhuThuoc", tam);

        //* Nhập các trường dưới đây
        TuDongNhapDuLieu("input_ThietKe_AnHien_GiaTriThucHien", mangThucHien[giaTriIndex].AnHien.GiaTriThucHien.join(";"));
        TuDongNhapDuLieu("switch_ThietKe_AnHien_MacDinh", mangThucHien[giaTriIndex].AnHien.MacDinh);
        TuDongNhapDuLieu("input_ThietKe_GoiY_IDGoiY", mangThucHien[giaTriIndex].GoiY.IDGoiY);
        TuDongNhapDuLieu("input_ThietKe_GoiY_GiaTriGoiY", mangThucHien[giaTriIndex].GoiY.GiaTriGoiY);
        TuDongNhapDuLieu("switch_ThietKe_ThongKe_TatCa", mangThucHien[giaTriIndex].ThongKe.TatCa);
        TuDongNhapDuLieu("switch_ThietKe_ThongKe_RutGon", mangThucHien[giaTriIndex].ThongKe.RutGon);
        TuDongNhapDuLieu("switch_ThietKe_ThongKe_TuyChon", mangThucHien[giaTriIndex].ThongKe.TuyChon);
        TuDongNhapDuLieu("input_ThietKe_ThongKe_GhiChu", mangThucHien[giaTriIndex].ThongKe.GhiChu);
        TuDongNhapDuLieu("input_ThietKe_KhoaThaoTac_IDPhuThuoc", mangThucHien[giaTriIndex].KhoaThaoTac.IDPhuThuoc);
        TuDongNhapDuLieu("input_ThietKe_KhoaThaoTac_GiaTriPhuThuoc", mangThucHien[giaTriIndex].KhoaThaoTac.GiaTriPhuThuoc.join(";"));
        TuDongNhapDuLieu("input_ThietKe_KhoaThaoTac_GiaTriTuyChon", mangThucHien[giaTriIndex].KhoaThaoTac.GiaTriTuyChon.join(";"));
        TuDongNhapDuLieu("switch_ThietKe_KhoaThaoTac_MacDinh", mangThucHien[giaTriIndex].KhoaThaoTac.MacDinh);
        TuDongNhapDuLieu("input_ThietKe_TraVeMacDinh", mangThucHien[giaTriIndex].TraVeMacDinh.join(";"));
        TuDongNhapDuLieu("input_ThietKe_TuDongDienTruoc_IDPhuThuoc", mangThucHien[giaTriIndex].TuDongDienTruoc.IDPhuThuoc.join(";"));

        //* Nhập cho mảng giá trị phụ thuộc
        let giaTriTuDongDienPhuThuoc = mangThucHien[giaTriIndex].TuDongDienTruoc.GiaTriPhuThuoc;
        let tam1 = "";
        //* Duyệt từNg đối tượng
        for (let i = 0; i < giaTriTuDongDienPhuThuoc.length; i++) {
          //? Nằm ở cuối mảng
          if (i === giaTriTuDongDienPhuThuoc.length - 1) {
            tam1 = tam1 + giaTriTuDongDienPhuThuoc[i].toString();
          }

          //? Cộng vào bình thưỜNg
          else {
            tam1 = tam1 + giaTriTuDongDienPhuThuoc[i].toString() + ";";
          }
        }
        TuDongNhapDuLieu("input_ThietKe_TuDongDienTruoc_GiaTriPhuThuoc", tam1);
        TuDongNhapDuLieu("input_ThietKe_TuDongDienTruoc_GiaTriDien", mangThucHien[giaTriIndex].TuDongDienTruoc.GiaTriDien.join(";"));

        //* Nhập cho nhóm công thức tính toán
        TuDongNhapDuLieu("input_ThietKe_TinhToan_DieuKien", mangThucHien[giaTriIndex].TinhToan.DieuKien.join(";"));
        TuDongNhapDuLieu("input_ThietKe_TinhToan_IDCongNghe", mangThucHien[giaTriIndex].TinhToan.IDCongNghe);
        TuDongNhapDuLieu("input_ThietKe_TinhToan_CongThuc", mangThucHien[giaTriIndex].TinhToan.CongThuc);
        TuDongNhapDuLieu("input_ThietKe_TinhToan_LamTron", mangThucHien[giaTriIndex].TinhToan.LamTron);
        TuDongNhapDuLieu("input_ThietKe_TinhToan_KieuTinh", mangThucHien[giaTriIndex].TinhToan.KieuTinh);
        TuDongNhapDuLieu("input_ThietKe_TinhToan_DuLieu_IDPhuThuoc", mangThucHien[giaTriIndex].TinhToan.DuLieu.IDPhuThuoc.join(";"));
        //* Nhập cho mảng giá trị phụ thuộc
        let giaTriTinhToanPhuThuoc = mangThucHien[giaTriIndex].TinhToan.DuLieu.GiaTriPhuThuoc;
        let tam2 = "";
        //* Duyệt từNg đối tượng
        for (let i = 0; i < giaTriTinhToanPhuThuoc.length; i++) {
          //? Nằm ở cuối mảng
          if (i === giaTriTinhToanPhuThuoc.length - 1) {
            tam2 = tam2 + giaTriTinhToanPhuThuoc[i].toString();
          }

          //? Cộng vào bình thưỜNg
          else {
            tam2 = tam2 + giaTriTinhToanPhuThuoc[i].toString() + ";";
          }
        }
        TuDongNhapDuLieu("input_ThietKe_TinhToan_DuLieu_GiaTriPhuThuoc", tam2);
        TuDongNhapDuLieu("input_ThietKe_TinhToan_DuLieu_DuongDanCSDL", mangThucHien[giaTriIndex].TinhToan.DuLieu.DuongDanCSDL.join(";"));
      }

      //? Nằm ngoài mảng
      else if (giaTriIndex >= mangThucHien.length) {
        HienThiThongBao("Index nằm ngoài mảng!");
      }
    }
  }

  //? Nếu chưa có
  else {
    HienThiThongBao("Hãy chọn lĩnh vực tính toán!");
  }
}

//* Thực hiện tạo mới, di chuyển và thay đổi đối tượng
function TaoDiChuyenLuuDoiTuong() {
  //Biến
  let kiemTraIndex = TuDongLayDuLieu("input_ThietKe_ThuTu");
  //* Mẫu json đỐi tượng
  let mauJson = {
    "ThuTu": "",
    "Ten": "",
    "KyHieu": "",
    "DonVi": "",
    "ID": "",
    "IDSection": "",
    "CongTrinhDonVi": "",
    "AnHien": {
      "IDPhuThuoc": [],
      "IDBox": "",
      "GiaTriPhuThuoc": [],
      "GiaTriThucHien": [],
      "MacDinh": true
    },
    "GoiY": {
      "IDGoiY": "",
      "GiaTriGoiY": ""
    },
    "ThongKe": {
      "TatCa": true,
      "RutGon": true,
      "TuyChon": false,
      "GhiChu": ""
    },
    "GhiChu": "",
    "ChoPhepSuaLai": false,
    "KhoaThaoTac": {
      "IDPhuThuoc": "",
      "GiaTriPhuThuoc": [],
      "GiaTriTuyChon": [],
      "MacDinh": false
    },
    "TraVeMacDinh": [],
    "Kieu": "",
    "TuDongDienTruoc": {
      "IDPhuThuoc": [],
      "GiaTriPhuThuoc": [],
      "GiaTriDien": []
    },
    "ThuGon": true,
    "DanhSachGiaTri": [],
    "LoaiTieuDe": "",
    "HuongDanNhap": "",
    "KieuNhap": "",
    "TaoSoDo": {
      "TaoCongTrinh_DauVao": "",
      "_TaoCongTrinh": "",
      "TaoDuongVe_DauVao": "",
      "_TaoDuongVe": "",
      "TaoCongTrinh_DauRa": "",
      "TaoDuongVe_DauRa": "",
      "IDHienThi": "",
      "_DanhSachCongTrinh": "",
      "_DuLieuSoDo": "",
      "ChonCongTrinh": false,
      "DeXuat": {
        "IDPhuThuoc": [],
        "GiaTriPhuThuoc": [],
        "DuongDanCSDL": []
      },
      "DSCongTrinhDonVi": []
    },
    "IDNeoGiu": "",
    "TinhToan": {
      "DieuKien": [],
      "IDCongNghe": "",
      "CongThuc": "",
      "KieuTinh": "",
      "DuLieu": {
        "IDPhuThuoc": [],
        "GiaTriPhuThuoc": [],
        "DuongDanCSDL": []
      },
      "LamTron": ""
    }
  };
  let linhVuc = TuDongLayDuLieu("comboBox_LinhVucTinhToan");
  let kiemTraThongBao = true;

  //Chương trình con
  function NhapLieuChoJsonMau() {
    //* Nhập dữ liệu vào json mẫu
    //* Nhập ghi chú đối tượng
    mauJson.GhiChu = TuDongLayDuLieu("input_ThietKe_GhiChu");

    //* Nhập kiểu
    let kieuDoiTuong = document.getElementById("comboBox_ThietKe_Kieu");
    //? Đang chọn mặc định
    if (kieuDoiTuong.selectedIndex === 0) {
      mauJson.Kieu = "";
    }
    //? Trường hợp còn lại
    else {
      mauJson.Kieu = kieuDoiTuong.options[kieuDoiTuong.selectedIndex].text;
    }

    //* Nhập loại tiêu đề
    let loaiTieuDe = document.getElementById("comboBox_ThietKe_LoaiTieuDe");
    //? Đang chọn mặc định
    if (loaiTieuDe.selectedIndex === 0) {
      mauJson.LoaiTieuDe = "";
    }
    //? Trường hợp còn lại
    else {
      mauJson.LoaiTieuDe = loaiTieuDe.options[loaiTieuDe.selectedIndex].text;
    }

    //* Nhập các đối tượng dưới đây
    mauJson.Ten = TuDongLayDuLieu("input_ThietKe_Ten");
    mauJson.KyHieu = TuDongLayDuLieu("input_ThietKe_KyHieu");
    mauJson.DonVi = TuDongLayDuLieu("input_ThietKe_DonVi");
    mauJson.ID = TuDongLayDuLieu("input_ThietKe_ID");
    mauJson.IDSection = TuDongLayDuLieu("input_ThietKe_IDSection");
    mauJson.IDNeoGiu = TuDongLayDuLieu("input_ThietKe_IDNeoGiun");
    mauJson.CongTrinhDonVi = TuDongLayDuLieu("input_ThietKe_CongTrinhDonVi");

    //* Nhập danh sách giá trị
    let danhSachGiaTri = TuDongLayDuLieu("input_ThietKe_DanhSachGiaTri");
    //? Khác rỗng
    if (danhSachGiaTri !== "") {
      mauJson.DanhSachGiaTri = danhSachGiaTri.split(";");
    }

    //* Nhập place holder
    mauJson.HuongDanNhap = TuDongLayDuLieu("input_ThietKe_HuongDanNhap");

    //* Nhập kiểu nhậP vào input
    let kieuNhapVao = document.getElementById("comboBox_ThietKe_KieuNhap");
    //? Đang chọn mặc định
    if (kieuNhapVao.selectedIndex === 0) {
      mauJson.KieuNhap = "";
    }
    //? Trường hợp còn lại
    else {
      mauJson.KieuNhap = kieuNhapVao.options[kieuNhapVao.selectedIndex].text;
    }

    //* Nhập các đối tượng dưới đây
    mauJson.ChoPhepSuaLai = TuDongLayDuLieu("switch_ThietKe_ChoPhepSuaLai");
    mauJson.ThuGon = TuDongLayDuLieu("switch_ThietKe_ThuGon");

    //* NhậP cho ẩn hiện đối tượng
    let idAnHienPhuThuoc = TuDongLayDuLieu("input_ThietKe_AnHien_IDPhuThuoc");
    //? Khác rỗng
    if (idAnHienPhuThuoc !== "") {
      mauJson.AnHien.IDPhuThuoc = idAnHienPhuThuoc.split(";");
    }
    let giaTriAnHienPhuThuoc = TuDongLayDuLieu("input_ThietKe_AnHien_GiaTriPhuThuoc");
    //? Khác rỗng
    if (giaTriAnHienPhuThuoc !== "") {
      let mangTam = giaTriAnHienPhuThuoc.split(";");
      let tam = [];

      //* Lặp từng nhóm để tiếp tục tạo mảng
      for (let i = 0; i < mangTam.length; i++) {
        tam.push(mangTam[i].split(","));
      }
      mauJson.AnHien.GiaTriPhuThuoc = tam;
    }
    let giaTriAnHienThucHien = TuDongLayDuLieu("input_ThietKe_AnHien_GiaTriThucHien");
    //? Khác rỗng
    if (giaTriAnHienThucHien !== "") {
      mauJson.AnHien.GiaTriThucHien = giaTriAnHienThucHien.split(";");
    }

    //* Nhập cho các đốI tượng dưỚI đây
    mauJson.AnHien.MacDinh = TuDongLayDuLieu("switch_ThietKe_AnHien_MacDinh");
    mauJson.GoiY.IDGoiY = TuDongLayDuLieu("input_ThietKe_GoiY_IDGoiY");
    mauJson.GoiY.GiaTriGoiY = TuDongLayDuLieu("input_ThietKe_GoiY_GiaTriGoiY");
    mauJson.ThongKe.TatCa = TuDongLayDuLieu("switch_ThietKe_ThongKe_TatCa");
    mauJson.ThongKe.RutGon = TuDongLayDuLieu("switch_ThietKe_ThongKe_RutGon");
    mauJson.ThongKe.TuyChon = TuDongLayDuLieu("switch_ThietKe_ThongKe_TuyChon");
    mauJson.ThongKe.GhiChu = TuDongLayDuLieu("input_ThietKe_ThongKe_GhiChu");

    //* Nhập cho khoá thao tác
    mauJson.KhoaThaoTac.IDPhuThuoc = TuDongLayDuLieu("input_ThietKe_KhoaThaoTac_IDPhuThuoc");
    let giaTriKhoaPhuThuoc = TuDongLayDuLieu("input_ThietKe_KhoaThaoTac_GiaTriPhuThuoc");
    //? Khác rỗng
    if (giaTriKhoaPhuThuoc !== "") {
      mauJson.KhoaThaoTac.GiaTriPhuThuoc = giaTriKhoaPhuThuoc.split(";");
    }
    let giaTriKhoaTuyChon = TuDongLayDuLieu("input_ThietKe_KhoaThaoTac_GiaTriTuyChon");
    //? Khác rỗng
    if (giaTriKhoaTuyChon !== "") {
      mauJson.KhoaThaoTac.GiaTriTuyChon = giaTriKhoaTuyChon.split(";");
    }
    mauJson.KhoaThaoTac.MacDinh = TuDongLayDuLieu("switch_ThietKe_KhoaThaoTac_MacDinh");

    //* Nhập cho trả về mặc định
    let traVeMacDinh = TuDongLayDuLieu("input_ThietKe_TraVeMacDinh");
    //? Khác rỗng
    if (traVeMacDinh !== "") {
      mauJson.TraVeMacDinh = traVeMacDinh.split(";");
    }

    //* Nhập cho tự động điền trước
    let idDienTruocPhuThuoc = TuDongLayDuLieu("input_ThietKe_TuDongDienTruoc_IDPhuThuoc");
    //? Khác rỗng
    if (idDienTruocPhuThuoc !== "") {
      mauJson.TuDongDienTruoc.IDPhuThuoc = idDienTruocPhuThuoc.split(";");
    }
    let giaTriDienTruocPhuThuoc = TuDongLayDuLieu("input_ThietKe_TuDongDienTruoc_GiaTriPhuThuoc");
    //? Khác rỗng
    if (giaTriDienTruocPhuThuoc !== "") {
      let mangTam = giaTriDienTruocPhuThuoc.split(";");
      let tam = [];

      //* Lặp từng nhóm để tiếp tục tạo mảng
      for (let i = 0; i < mangTam.length; i++) {
        tam.push(mangTam[i].split(","));
      }
      mauJson.TuDongDienTruoc.GiaTriPhuThuoc = tam;
    }
    let giaTriDienVao = TuDongLayDuLieu("input_ThietKe_TuDongDienTruoc_GiaTriDien");
    //? Khác rỗng
    if (giaTriDienVao !== "") {
      mauJson.TuDongDienTruoc.GiaTriDien = giaTriDienVao.split(";");
    }

    //* Nhập cho công thức tính toán
    let dieuKienTinhToan = TuDongLayDuLieu("input_ThietKe_TinhToan_DieuKien");
    //? Khác rỗng
    if (dieuKienTinhToan !== "") {
      mauJson.TinhToan.DieuKien = dieuKienTinhToan.split(";");
    }
    mauJson.TinhToan.IDCongNghe = TuDongLayDuLieu("input_ThietKe_TinhToan_IDCongNghe");
    mauJson.TinhToan.CongThuc = TuDongLayDuLieu("input_ThietKe_TinhToan_CongThuc");
    mauJson.TinhToan.LamTron = TuDongLayDuLieu("input_ThietKe_TinhToan_LamTron");
    mauJson.TinhToan.KieuTinh = TuDongLayDuLieu("input_ThietKe_TinhToan_KieuTinh");
    let duLieuIDPhuThuoc = TuDongLayDuLieu("input_ThietKe_TinhToan_DuLieu_IDPhuThuoc");
    //? Khác rỗng
    if (duLieuIDPhuThuoc !== "") {
      mauJson.TinhToan.DuLieu.IDPhuThuoc = duLieuIDPhuThuoc.split(";");
    }
    let tinhToanDuLieuPhuThuoc = TuDongLayDuLieu("input_ThietKe_TinhToan_DuLieu_GiaTriPhuThuoc");
    //? Khác rỗng
    if (tinhToanDuLieuPhuThuoc !== "") {
      let mangTam = tinhToanDuLieuPhuThuoc.split(";");
      let tam = [];

      //* Lặp từng nhóm để tiếp tục tạo mảng
      for (let i = 0; i < mangTam.length; i++) {
        tam.push(mangTam[i].split(","));
      }
      mauJson.TinhToan.DuLieu.GiaTriPhuThuoc = tam;
    }
    let duLieuDuongDanCSDL = TuDongLayDuLieu("input_ThietKe_TinhToan_DuLieu_DuongDanCSDL");
    //? Khác rỗng
    if (duLieuDuongDanCSDL !== "") {
      mauJson.TinhToan.DuLieu.DuongDanCSDL = duLieuDuongDanCSDL.split(";");
    }
  }

  //Thực hiện
  //? Néu có lĩnh vực
  if (linhVuc !== 0) {
    linhVuc = window.jsonDataSources.CauTruc.LinhVuc[0].AnHien.GiaTriThucHien[linhVuc - 1];

    //? Tạo mới đối tượng vào cuối mảng
    if (kiemTraIndex.indexOf("+", 0) !== -1) {
      NhapLieuChoJsonMau();
      window.jsonDataSources.CauTruc[linhVuc].push(mauJson);
    }

    //? Xoá đối tượng
    else if (kiemTraIndex.indexOf("-", 0) !== -1) {
      // Biến
      let viTri = parseInt(kiemTraIndex.replace("-", ""));

      //Thực hiện
      //* Xoá tại vị tí đối tượng
      window.jsonDataSources.CauTruc[linhVuc].splice(viTri, 1);
    }

    //? Di chuyển đối tượng
    else if (kiemTraIndex.indexOf("m", 0) !== -1) {
      // Biến
      let viTriHienTai = parseInt(kiemTraIndex.slice(0, kiemTraIndex.indexOf("m", 0)));
      let viTriMoi = parseInt(kiemTraIndex.slice(kiemTraIndex.indexOf("m", 0) + 1, kiemTraIndex.length));
      let copyDoiTuong = window.jsonDataSources.CauTruc[linhVuc][viTriHienTai];

      //Thực hiện
      //* Xoá đối tượng hiện tại
      window.jsonDataSources.CauTruc[linhVuc].splice(viTriHienTai, 1);

      //*Di chuyển đối tượng đã copy đến vị trí mới
      window.jsonDataSources.CauTruc[linhVuc].splice(viTriMoi, 0, copyDoiTuong);
    }

    //? Không nhập gì
    else if (kiemTraIndex === "") {
      HienThiThongBao("Hãy nhập vị trí đối tượng?");
      kiemTraThongBao = false;
    }

    //? Chỉnh sửa, cập nhật thuộc tính
    else {
      //Biến
      let viTriHienTai = parseInt(kiemTraIndex);

      //Thực hiệN
      //* Tạo json mẫu
      NhapLieuChoJsonMau();

      //* Đổi đối tượng mới vào vị trí đối tượng cũ
      window.jsonDataSources.CauTruc[linhVuc].splice(viTriHienTai, 1, mauJson);
    }

    //? Không có lỗi
    if (kiemTraThongBao) {
      //* Lưu lại thay đổi của json datasources
      NhapDuLieuLuuTruWebsite();

      //* Nhấn nút tính toán
      document.getElementById("btn_calculator").click();

      //* Hiển thị thông báo
      HienThiThongBao("Cập nhật thành công!");

      //* Tự đỘng đóng modal
      setTimeout(function () {
        document.getElementById("btnFunc_DongModalThietKe").click();
      }, 50);

      //* Reload cập nhật dữ liệu
      setTimeout(() => {
        location.reload();
      }, 50);
    }
  }

  //? Nếu chưa có
  else {
    HienThiThongBao("Hãy chọn lĩnh vực tính toán!");
  }
}

//* Tạo sự kiện cho thiết kế
function XuLySuKien_ThietKe() {
  //* Sự kiện điền dữ liệu có sẵn vào form
  document.getElementById("input_ThietKe_ThuTu").addEventListener("input", function () {
    NhapVaoForm();
  });

  //* Sự kiện thao tác trên modal chỉnh sửa
  document.getElementById("btnFunc_ChapNhanCapNhatThietKe").addEventListener("click", function () {
    TaoDiChuyenLuuDoiTuong();
  });

  //* Sự kiện click double để xoá
  let inputDouble = document.getElementsByTagName("input");
  //* Lặp tìm input thiết kế
  for (let i = 0; i < inputDouble.length; i++) {
    //? input thiết kế
    if (inputDouble[i].id.indexOf("input_ThietKe") !== -1) {
      inputDouble[i].addEventListener("contextmenu", function (e) {
        e.preventDefault();
        TuDongNhapDuLieu(this.id, "");
      });
    }
  }

  //* Hiển thị danh sách đỐi tượng
  let danhSach = window.jsonDataSources.CauTruc.NuocThai;
  for (let i = 0; i < danhSach.length; i++) {
    console.log(i + " - " + danhSach[i].ID);
    //console.log(i + " - " + danhSach[i].TinhToan.DieuKien);
  }
}

//* Nhập dữ liệu cho json sources bằng code
document.getElementById("btn_NhapLieu").addEventListener("click", function () {
  //Chương trình con
  //Tạo data json lưu dữ liệu người dùng
  function TaoJsonLuuDuLieuNguoiDung() {
    //Biến
    let mangLamLai = window.jsonDataUser.DuLieu.NuocThai;
    let mangThucHien = window.jsonDataSources.CauTruc.NuocThai;

    //Thực hiện
    for (let i = 0; i < mangThucHien.length; i++) {
      let mau = {
        "ID": "",
        "GiaTri": ""
      };

      let mauFlowchart = {
        "ID": "",
        "GiaTri": "",
        "CongTrinhDonVi_Tep": "",
        "ChuoiCongTrinh": "",
        "ChuoiDuongVe": ""
      };

      if (mangThucHien[i].Kieu === "comboBox" || mangThucHien[i].Kieu === "switch" || mangThucHien[i].Kieu === "input" || mangThucHien[i].Kieu === "flowChart") {
        //? Nếu là flowChart
        if (mangThucHien[i].Kieu === "flowChart") {
          mauFlowchart.ID = mangThucHien[i].ID;
          mangLamLai.push(mauFlowchart);
        }

        //? Các kiểu còn lại
        else {
          mau.ID = mangThucHien[i].ID;
          mangLamLai.push(mau);
        }
      }
    }
  }

  //* Thêm filed cho json
  function ThemTruongMoiChoJsonData() {
    let mangTaiNguyen = window.jsonDataSources.CauTruc.ThietKe;

    for (let i = 0; i < mangTaiNguyen.length; i++) {
      mangTaiNguyen[i].ThongKe.GhiChu = "";
    }
  }

  //TaoJsonLuuDuLieuNguoiDung();
  //ThemTruongMoiChoJsonData();
  //Thực hiện
  //console.log(window.jsonDataSources);
  //console.log(window.jsonDataUser);
});

//!-----------------------------------------------------------------VI. TEST CODE--------------------------------------------------------------------------------------------------------------


