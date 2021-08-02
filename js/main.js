//----------------------------------------------------------------I. BIẾN CHUNG ----------------------------------------------------------------
var jsonCore, jsonGoiY;
const duongDanGoiY = "./file/GoiY.json";
var kiemTraTruocKhiTinh = false;

//---------------------------------------------------------------II. HÀM CHUNG ----------------------------------------------------------------------
//2.1 Ẩn đối tượng
function AnDoiTuong(mangTen) {
    for (var i = 0; i < mangTen.length; i++) {
        document.getElementById(mangTen[i]).style.display = "none";
    }
}

//2.2 Hiện đối tượng
function HienDoiTuong(mangTen) {
    for (var i = 0; i < mangTen.length; i++) {
        document.getElementById(mangTen[i]).style.display = "flex";
    }
}

//2.3 Nhập giá trị cho text box
function NhapGiaTriChoTextBox(ID, giaTri) {
    document.getElementById(ID).value = giaTri;
}

//2.4 Hiển thị thông báo
function HienThiThongBao(thongTinHienThi) {
    //Hiện thông báo
    document.getElementById("thongBao").setAttribute("class", "toast show");
    document.getElementById("thongTinThongBao").innerHTML = thongTinHienThi;

    //Ẩn sau 3 giây
    setTimeout(function () {
        document.getElementById("thongBao").setAttribute("class", "toast hide");
    }, 5000);

    //Ẩn bằng nút đóng thông báo
    document.getElementById("dongThongBao").addEventListener("click", function () {
        document.getElementById("thongBao").setAttribute("class", "toast hide");
    });
}

//2.5 Chưa đủ dữ liệu tính toán
function KiemTraDuLieuVao(jsonCanKiemTra) {
    //Khai báo biến
    var kiemTra = true;
    var kieuKiemTra = "";
    var bienLuuTam, bienThongBao = "";

    //Code
    for (var i = 0; i < jsonCanKiemTra.length; i++) {
        kieuKiemTra = jsonCanKiemTra[i].ID.slice(0, jsonCanKiemTra[i].ID.indexOf("_", 0));
        if (kieuKiemTra === "comboBox") {
            bienLuuTam = document.getElementById(jsonCanKiemTra[i].ID).selectedIndex;
            if (bienLuuTam === 0) {
                bienThongBao = bienThongBao + jsonCanKiemTra[i].Ten + "</br>";
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "red";
                kiemTra = false;
            } else {
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "#ced4da";
            }

        } else if (kieuKiemTra === "input") {
            bienLuuTam = document.getElementById(jsonCanKiemTra[i].ID).value;
            if (bienLuuTam === "") {
                bienThongBao = bienThongBao + jsonCanKiemTra[i].Ten + "</br>";
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "red";
                kiemTra = false;
            } else {
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "#ced4da";
            }
        }
    }
    if (bienThongBao !== "") {
        HienThiThongBao(bienThongBao);
        kiemTraTruocKhiTinh = false;
    } else {
        kiemTraTruocKhiTinh = true;
    }
    return kiemTra;
}

//2.6 Nhập dữ liệu từ tệp tải lên
function NhapDuLieuTuTepTaiLen(loaiNuocThaiXuLy) {
    //Khai báo biến
    var kieuKiemTra = "";

    //Code
    //Nhập dữ liệu cho lĩnh vực tính toán
    document.getElementById(jsonCore.Core.LinhVucTinhToan[0].ID).selectedIndex = jsonCore.Core.LinhVucTinhToan[0].GiaTri;

    //Nhập tuần tự dữ liệu lên chương trình
    for (var i = 0; i < jsonCore.Core[loaiNuocThaiXuLy].length; i++) {
        kieuKiemTra = jsonCore.Core[loaiNuocThaiXuLy][i].ID.slice(0, jsonCore.Core[loaiNuocThaiXuLy][i].ID.indexOf("_", 0));
        //Đối với comboBox
        if (kieuKiemTra === "comboBox") {
            document.getElementById(jsonCore.Core[loaiNuocThaiXuLy][i].ID).selectedIndex = jsonCore.Core[loaiNuocThaiXuLy][i].GiaTri;
        }
        //Đối với input text, number
        else if (kieuKiemTra === "input") {
            document.getElementById(jsonCore.Core[loaiNuocThaiXuLy][i].ID).value = jsonCore.Core[loaiNuocThaiXuLy][i].GiaTri;
        }
        //Đối với sơ đồ công nghệ được hiển thị
        else if (jsonCore.Core[loaiNuocThaiXuLy][i].ID === "soDoCongNghe" && jsonCore.Core[loaiNuocThaiXuLy][i - 1].GiaTri === 2) {
            duLieuSoDoCongNghe_NuocThai = jsonCore.Core[loaiNuocThaiXuLy][i].GiaTri;
            //Tạo mảng từ tệp dữ liệu
            congTrinhDaChon = [];
            for (var j = 0; j<jsonCore.Core[loaiNuocThaiXuLy][i].CongTrinhDonVi_Tep.length;j++){
                congTrinhDaChon.push(jsonCore.Core[loaiNuocThaiXuLy][i].CongTrinhDonVi_Tep[j]);
            }
            taoCongTrinh = duLieuSoDoCongNghe_NuocThai.slice(0, duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0) - 32);
            taoDuongVe = duLieuSoDoCongNghe_NuocThai.slice(duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0), duLieuSoDoCongNghe_NuocThai.length - 7);
        }
    }
    //Ẩn hiện thông tin phù hợp
    AnHienThongTinTheoLinhVucTinhToan();

    if (loaiNuocThaiXuLy === "NuocThai") {//Nước thải
        AnHienHeSoKKQKF_NuocThai();
        AnHienChoCongNgheXuLy_NuocThai();
        AnHienCongTrinhDonVi(congTrinhDaChon);
    } else if (loaiNuocThaiXuLy === "NuocCap") {//Nước cấp

    } else if (loaiNuocThaiXuLy === "KhiThai") {//Khí thải

    } else if (loaiNuocThaiXuLy === "ChatThaiRan") {//Chất thải rắn

    }
}

//Ẩn hiện thông tin chung
function AnHienThongTinTheoLinhVucTinhToan() {
    //Khai báo biến
    var index = document.getElementById("comboBox_LinhVucTinhToan").selectedIndex;
    var mangTen_XuLyNuocThai = [
        "section_XuLyNuocThai",
        "section_XuLyNuocThai_ThongSoDauVao",
        "section_XuLyNuocThai_YeuCauDauRa",
        "section_XuLyNuocThai_LuaChonCongNghe",
    ];
    var mangTen_XuLyNuocCap = ["section_XuLyNuocCap"];
    var mangTen_XuLyKhiThai = ["section_XuLyKhiThai"];
    var mangTen_XuLyChatThaiRan = ["section_XuLyChatThaiRan"];

    //Code
    if (index === 0) {
        //Ẩn toàn bộ
        AnDoiTuong(mangTen_XuLyNuocThai);
        AnDoiTuong(mangTen_XuLyNuocCap);
        AnDoiTuong(mangTen_XuLyKhiThai);
        AnDoiTuong(mangTen_XuLyChatThaiRan);
    } else if (index === 1) {
        //Hiện xử lý nước thải
        HienDoiTuong(mangTen_XuLyNuocThai);
        AnDoiTuong(mangTen_XuLyNuocCap);
        AnDoiTuong(mangTen_XuLyKhiThai);
        AnDoiTuong(mangTen_XuLyChatThaiRan);
    } else if (index === 2) {
        //Hiện xử lý nước cấp
        AnDoiTuong(mangTen_XuLyNuocThai);
        HienDoiTuong(mangTen_XuLyNuocCap);
        AnDoiTuong(mangTen_XuLyKhiThai);
        AnDoiTuong(mangTen_XuLyChatThaiRan);
    } else if (index === 3) {
        //Hiện xử lý khí thải
        AnDoiTuong(mangTen_XuLyNuocThai);
        AnDoiTuong(mangTen_XuLyNuocCap);
        HienDoiTuong(mangTen_XuLyKhiThai);
        AnDoiTuong(mangTen_XuLyChatThaiRan);
    } else if (index === 4) {
        //Hiện xử lý chất thải rắn
        AnDoiTuong(mangTen_XuLyNuocThai);
        AnDoiTuong(mangTen_XuLyNuocCap);
        AnDoiTuong(mangTen_XuLyKhiThai);
        HienDoiTuong(mangTen_XuLyChatThaiRan);
    }
}

//Lấy dữ liệu từ file sources code
function LayDuLieuJsonTuSourcesCode(duongDan, hamXuLy) {
    fetch(duongDan).then(function (response) {
        response.json().then(function (ketQua) {
            hamXuLy(ketQua);
        });
    });
}

//Hiện thông tin trợ giúp cho trang web trong modal
function XuLyHienThongTinGoiYTrongModal() {
    //Khai báo biến

    //Code
    //Xử lý cho nước thải
    for (var i = 0; i < jsonGoiY.GoiY.NuocThai.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonGoiY.GoiY.NuocThai[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonGoiY.GoiY.NuocThai.length; j++) {
                if (jsonGoiY.GoiY.NuocThai[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonGoiY.GoiY.NuocThai[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
    //Xử lý cho nước cấp
    for (var i = 0; i < jsonGoiY.GoiY.NuocCap.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonGoiY.GoiY.NuocCap[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonGoiY.GoiY.NuocCap.length; j++) {
                if (jsonGoiY.GoiY.NuocCap[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonGoiY.GoiY.NuocCap[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
    //Xử lý cho khí thải
    for (var i = 0; i < jsonGoiY.GoiY.KhiThai.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonGoiY.GoiY.KhiThai[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonGoiY.GoiY.KhiThai.length; j++) {
                if (jsonGoiY.GoiY.KhiThai[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonGoiY.GoiY.KhiThai[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
    //Xử lý cho chất thải rắn
    for (var i = 0; i < jsonGoiY.GoiY.ChatThaiRan.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonGoiY.GoiY.ChatThaiRan[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonGoiY.GoiY.ChatThaiRan.length; j++) {
                if (jsonGoiY.GoiY.ChatThaiRan[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonGoiY.GoiY.ChatThaiRan[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
}

//Vẽ sơ đồ công nghệ dựa trên Dữ liệu + id hiển thị
function VeSoDoCongNghe(bienDuLieu, idHienThiSoDoCongNghe) {
    //Khai báo biến
    var dinhDangChoSoDo = {
        'x': 0,
        'y': 0,
        'line-width': 1.5, //độ dày nét
        'line-length': 25, //độ dài đường nối
        'text-margin': 10, //padding text
        'font-size': 18, //size chữ
        'font': 'normal',
        'font-family': 'Arial',
        'font-weight': 'normal',
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        'fill': 'white', //màu nền rectange
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        'scale': 1,
        // Style cho khoá
        'symbols': {
            'start': {
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white',
                'font-weight': 'bold',
                "line-width": 2.5
            },
            'end': {
                'class': 'end-element',
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white',
                'font-weight': 'bold',
                "line-width": 2.5
            },
            'operation': {
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white'
            },
            'inputoutput': {
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white',
                'font-weight': 'bold'
            },
            'subroutine': {
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white'
            },
            'condition': {
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white'
            },
            'parallel': {
                'font-color': 'black',
                'element-color': 'black',
                'fill': 'white'
            },
        },
        // even flowstate support ;-)
        'flowstate': {
            'past': { 'fill': '#CCCCCC', 'font-size': 18 },
            'current': { 'fill': 'yellow', 'font-color': 'red', 'font-weight': 'bold' },
            'future': { 'fill': 'white' },
            'request': { 'fill': 'blue' },
            'invalid': { 'fill': '#444444' },
            'approved': { 'fill': '#58C4A3', 'font-size': 18, 'yes-text': 'APPROVED', 'no-text': 'n/a' },
            'rejected': { 'fill': '#C45879', 'font-size': 18, 'yes-text': 'n/a', 'no-text': 'REJECTED' }
        }
    }

    //Code
    document.getElementById(idHienThiSoDoCongNghe).innerHTML = "";
    chart = flowchart.parse(bienDuLieu);
    chart.drawSVG(idHienThiSoDoCongNghe, dinhDangChoSoDo);
}

//Lấy dữ liệu từ một multi select dropdown với id = select
function LayMangDuLieuTuMultiSelectDropdown(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value);
        }
    }
    return result;
}

//Di chuyển một node con đến một node cha biết trước
function DiChuyenCacNode(idPhanTuCha, idPhanTuCon) {
    document.getElementById(idPhanTuCha).appendChild(document.getElementById(idPhanTuCon));
}

//-------------------------------------------------------------III. XỬ LÝ TÍNH TOÁN------------------------------------------------------------------
//3.1 Tính toán cho xử lý nước thải
//3.1.1 Biến cho xử lý nước thải
const duongDanCSDL_NuocThai = "./file/CSDL_NuocThai.json";
var jsonCSDL_NuocThai;
var duLieuSoDoCongNghe_NuocThai = "";
var congTrinhDaChon = [];
var taoCongTrinh = "dauVao=>start: Nước thải đầu vào\n", taoDuongVe = "dauVao";

//3.1.2 Hàm cho xử lý nước thải
// Xử lý nồng độ chất ô nhiễm theo hệ số K
function XuLyHeSoQuyChuan_NuocThai(QCApDung) {
    //Khai báo biến
    var k, kq, kf, bienChiTieu, ketQuaTinh;
    var mangIDQuyChuan14 = [
        "input_xuLyNuocThai_YeuCauDauRa_pH",
        "input_xuLyNuocThai_YeuCauDauRa_BOD5",
        "input_xuLyNuocThai_YeuCauDauRa_TSS",
        "input_xuLyNuocThai_YeuCauDauRa_TDS",
        "input_xuLyNuocThai_YeuCauDauRa_H2S",
        "input_xuLyNuocThai_YeuCauDauRa_NH3",
        "input_xuLyNuocThai_YeuCauDauRa_NO3-",
        "input_xuLyNuocThai_YeuCauDauRa_DMDTV",
        "input_xuLyNuocThai_YeuCauDauRa_TCCHDBM",
        "input_xuLyNuocThai_YeuCauDauRa_PO43-",
        "input_xuLyNuocThai_YeuCauDauRa_TColiforms",
    ];
    var jsonKiemTraChung = [
        {
            "Ten": "4.1 Nguồn tiếp nhận nước thải",
            "ID": "comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan",
        },
        {
            "Ten": "4.2 Quy chuẩn áp dụng",
            "ID": "comboBox_XuLyNuocThai_YeuCauDauRa_QCVN",
        }
    ];
    var jsonKiemTraQC14 = [
        {
            "Ten": "4.3 Hệ số chuyển đổi",
            "ID": "input_xuLyNuocThai_YeuCauDauRa_HeSoK",
        }
    ];
    var jsonKiemTraQC4011 = [
        {
            "Ten": "4.3 Hệ số chuyển đổi (Kq)",
            "ID": "input_xuLyNuocThai_YeuCauDauRa_HeSoKq",
        },
        {
            "Ten": "4.3 Hệ số chuyển đổi (Kf)",
            "ID": "input_xuLyNuocThai_YeuCauDauRa_HeSoKf",
        }
    ];

    //Code
    //Kiểm tra đầu vào
    if (KiemTraDuLieuVao(jsonKiemTraChung)) {
        if (QCApDung === 1) {
            if (KiemTraDuLieuVao(jsonKiemTraQC14)) {
                k = document.getElementById("input_xuLyNuocThai_YeuCauDauRa_HeSoK").value;
                //Áp dụng cho QCVN 14:2008/BTNMT
                for (var i = 0; i < mangIDQuyChuan14.length; i++) {
                    bienChiTieu = mangIDQuyChuan14[i].slice(mangIDQuyChuan14[i].lastIndexOf("_") + 1, mangIDQuyChuan14[i].length);
                    if (document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex === 1) {
                        //Đối với cột A
                        if (bienChiTieu === "pH" || bienChiTieu === "TColiforms") {
                            ketQuaTinh = jsonCSDL_NuocThai.QCVN.QCVN142008.CotA[bienChiTieu];
                            NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                        } else {
                            ketQuaTinh = Math.round(jsonCSDL_NuocThai.QCVN.QCVN142008.CotA[bienChiTieu] * k);
                            NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                        }
                    } else if (document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex === 2) {
                        //Đối với cột B
                        if (bienChiTieu === "pH" || bienChiTieu === "TColiforms") {
                            ketQuaTinh = jsonCSDL_NuocThai.QCVN.QCVN142008.CotB[bienChiTieu];
                            NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                        } else {
                            ketQuaTinh = Math.round(jsonCSDL_NuocThai.QCVN.QCVN142008.CotB[bienChiTieu] * k);
                            NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                        }
                    }
                }
            }
        } else if (QCApDung === 2) {
            if (KiemTraDuLieuVao(jsonKiemTraQC4011)) {
                //Áp dụng cho quy chuẩn 11-MT:2015/BTNMT
            }
        } else if (QCApDung === 3) {
            if (KiemTraDuLieuVao(jsonKiemTraQC4011)) {
                //Áp dụng cho quy chuẩn 40:2011/BTNMT
            }
        }
    }
}

//Ẩn hiện hệ số K, Kq, Kf phù hợp
function AnHienHeSoKKQKF_NuocThai() {
    //Khai báo biến
    var mang_HeSoQC4011 = ["heSoKQC401", "heSoKQC402"];
    var mang_HeSoQC14 = ["heSoKQC14"];
    var index_LoaiNuocThai = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;

    //Code
    if (index_LoaiNuocThai === 1) {
        AnDoiTuong(mang_HeSoQC4011);
        HienDoiTuong(mang_HeSoQC14);
    } else if (index_LoaiNuocThai === 2 || index_LoaiNuocThai === 3) {
        AnDoiTuong(mang_HeSoQC14);
        HienDoiTuong(mang_HeSoQC4011);
    }
}

//Xử lý đưa ra sơ đồ công nghệ phù hợp
function XuLySoDoCongNghe_NuocThai() {
    //Khai báo biến
    var quyChuan, loaiNuocThai;

    //Code
    loaiNuocThai = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
    quyChuan = document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex;
    congTrinhDaChon = [];
    //Đối với nước sinh hoạt + cột A
    if (loaiNuocThai === 1 && quyChuan === 1) {
        //Hiện tại sử dụng đề xuất 01 sơ đồ công nghệ
        duLieuSoDoCongNghe_NuocThai = jsonCSDL_NuocThai.SoDoCongNghe.QCVN142008.CotA[0].GiaTri;
        //Tạo mảng từ tệp dữ liệu
        for (var j = 0; j<jsonCSDL_NuocThai.SoDoCongNghe.QCVN142008.CotA[0].CongTrinhDonVi_QuyChuan.length;j++){
            congTrinhDaChon.push(jsonCSDL_NuocThai.SoDoCongNghe.QCVN142008.CotA[0].CongTrinhDonVi_QuyChuan[j]);
        }
    } else if (loaiNuocThai === 1 && quyChuan === 2) { //Đối với nước thải sinh hoạt cột B
        duLieuSoDoCongNghe_NuocThai = jsonCSDL_NuocThai.SoDoCongNghe.QCVN142008.CotB[0].GiaTri;
        //Tạo mảng từ tệp dữ liệu
        for (var j = 0; j<jsonCSDL_NuocThai.SoDoCongNghe.QCVN142008.CotB[0].CongTrinhDonVi_QuyChuan.length;j++){
            congTrinhDaChon.push(jsonCSDL_NuocThai.SoDoCongNghe.QCVN142008.CotB[0].CongTrinhDonVi_QuyChuan[j]);
        }
    }
    taoCongTrinh = duLieuSoDoCongNghe_NuocThai.slice(0, duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0) - 32);
    taoDuongVe = duLieuSoDoCongNghe_NuocThai.slice(duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0), duLieuSoDoCongNghe_NuocThai.length - 7);
}

//Ẩn hiện sơ đồ công nghệ chọn lại
function AnHienChoCongNgheXuLy_NuocThai() {
    //Khai báo biến
    var index_PhuongAn = document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex;
    var jsonKiemTra = [
        {
            "Ten": "2.1 Chọn loại nước thải",
            "ID": "comboBox_XuLyNuocThai"
        },
        {
            "Ten": "4.1 Nguồn tiếp nhận nước thải",
            "ID": "comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan"
        },
    ];

    //Code
    //Đối với trường hợp chọn lại sơ đồ công nghệ
    if (index_PhuongAn === 2) {
        document.getElementById("subSection_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").style.display = "block";
    } else {
        AnDoiTuong(["subSection_XuLyNuocThai_CongNghe_CongNgheLuaChonLai"]);
    }

    //Đối với trường hợp lấy sơ đồ công nghệ đề xuất
    if (index_PhuongAn === 1) {
        if (KiemTraDuLieuVao(jsonKiemTra)) {
            XuLySoDoCongNghe_NuocThai();
            if (duLieuSoDoCongNghe_NuocThai !== "") {
                VeSoDoCongNghe(duLieuSoDoCongNghe_NuocThai, "soDoCongNghe");
            }
            AnHienCongTrinhDonVi(congTrinhDaChon);
        } else {
            document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;
        }
    }

    //Đối với trường hợp reset về selectIndex 0
    if (index_PhuongAn === 0){
        //Xoá sơ đồ
        document.getElementById("soDoCongNghe").innerHTML = "";

        //Ẩn toàn bộ công trình đơn vị
        for (var i = 0; i < jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
            AnDoiTuong(jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].IDSectionHienThi);
        }
    }
}

//Ẩn hiện công trình đơn vị cho nước thải
function AnHienCongTrinhDonVi(mangCongTrinh) {
    for (var i = 0; i < jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
        AnDoiTuong(jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].IDSectionHienThi);
    }
    for (var i = 0; i < mangCongTrinh.length; i++) {
        for (var j = 0; j < jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi.length; j++) {
            if (mangCongTrinh[i] === jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[j].ID) {
                DiChuyenCacNode("box_XuLyNuocThai_CongTrinhDonVi", jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[j].IDSectionHienThi);
                HienDoiTuong(jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[j].IDSectionHienThi);
            }
        }

    }
}

//Chọn công trình và vẽ sơ đồ công nghệ
function ChonCongTrinhDonViVaVeSoDo_NuocThai() {
    //Khai báo biến
    var congTrinh = document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").value;
    var bienLuuTam, kiemTraDaChon = false;
    var bienDuLieuVeSoDo;

    //Code
    //Kiểm tra có công trình chưa?
    for (var j = 0; j < congTrinhDaChon.length; j++) {
        if (congTrinhDaChon[j] === congTrinh) {
            kiemTraDaChon = true;
        }
    }
    //Nếu chưa thực hiện vẽ
    if (kiemTraDaChon === false) {
        for (var i = 0; i < jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
            bienLuuTam = jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].ID;
            if (bienLuuTam === congTrinh) {
                //Khi tìm được: tạo mảng, tạo ds công trình, tạo đường vẽ, trả về giá trị mặt định cho nút
                congTrinhDaChon.push(bienLuuTam);
                console.log(jsonCore.Core.NuocThai);
                taoCongTrinh = taoCongTrinh + jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri;
                taoDuongVe = taoDuongVe + "->" + congTrinh;
                //Reset comboBox lựa chọn
                document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").selectedIndex = 0;
            }
        }
        //Tạo dữ liệu vẽ sơ đồ và thực hiệN vẽ
        bienDuLieuVeSoDo = taoCongTrinh + "dauRa=>end: Nước thải sau xử lý\n" + taoDuongVe + "->dauRa";
        duLieuSoDoCongNghe_NuocThai = bienDuLieuVeSoDo;
        VeSoDoCongNghe(bienDuLieuVeSoDo, "soDoCongNghe");

        //Ẩn hiện công trình cho phù hợp công nghệ
        AnHienCongTrinhDonVi(congTrinhDaChon);
    }
}

//Chọn công trình để xoá và vẽ lại sơ đồ công nghệ
function XoaCongTrinhDonViVeLaiSoDo_NuocThai() {
    //Khai báo biến
    var congTrinh = document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").value;
    var bienLuuTam, str1, str2;
    var bienDuLieuVeSoDo, kiemTraCoCongTrinhKhong = false;

    //Code
    //Kiểm tra có công trình để xoá không
    for (var j = 0; j < congTrinhDaChon.length; j++) {
        if (congTrinhDaChon[j] === congTrinh) {
            kiemTraCoCongTrinhKhong = true;
        }
    }
    //Thực hiện xoá và làm lại code vẽ sơ đồ công nghệ
    if (kiemTraCoCongTrinhKhong) {
        for (var i = 0; i < jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
            bienLuuTam = jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].ID;
            if (bienLuuTam === congTrinh) {
                //Xoá string công trình
                str1 = taoCongTrinh.slice(0, taoCongTrinh.indexOf(jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri));
                str2 = taoCongTrinh.slice(taoCongTrinh.indexOf(jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri) + jsonCSDL_NuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri.length, taoCongTrinh.length);
                taoCongTrinh = str1 + str2;
                //Xoá string tạo đường vẽ
                str1 = taoDuongVe.slice(0, taoDuongVe.indexOf("->" + congTrinh));
                str2 = taoDuongVe.slice(taoDuongVe.indexOf("->" + congTrinh) + congTrinh.length + 2, taoDuongVe.length);
                taoDuongVe = str1 + str2;
                //Xoá công trình khỏi danh sách đã chọn
                congTrinhDaChon.splice(congTrinhDaChon.indexOf(bienLuuTam), 1);
                //Reset comboBox lựa chọn
                document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").selectedIndex = 0;
            }
        }
        //Tạo dữ liệu vẽ sơ đồ và thực hiệN vẽ
        bienDuLieuVeSoDo = taoCongTrinh + "dauRa=>end: Nước thải sau xử lý\n" + taoDuongVe + "->dauRa";
        duLieuSoDoCongNghe_NuocThai = bienDuLieuVeSoDo;
        VeSoDoCongNghe(bienDuLieuVeSoDo, "soDoCongNghe");

        //Ẩn hiện công trình cho phù hợp công nghệ
        AnHienCongTrinhDonVi(congTrinhDaChon);
    }
}

//3.1.3 Chương trình chính xử lý nước thải
function TinhToanChoXuLyNuocThai() {
    //Khai báo biến
    var loaiNuocThaiXuLy = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
    var jsonKiemTra = [
        {
            "Ten": "2.1 Chọn loại nước thải",
            "ID": "comboBox_XuLyNuocThai"
        },
        {
            "Ten": "3.1 Lưu lượng",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai"
        },
    ];
    var jsonKiemTraCongNgheLuaChon = [
        {
            "Ten": "2.1 Chọn loại nước thải",
            "ID": "comboBox_XuLyNuocThai"
        }
    ]
    var jsonNuocThaiSinhHoat = [
        {
            "Ten": "pH",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_pH"
        },
        {
            "Ten": "BOD<sub>5</sub>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_BOD5"
        },
        {
            "Ten": "TSS",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TSS"
        },
        {
            "Ten": "TDS",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TDS"
        },
        {
            "Ten": "H<sub>2</sub>S",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_H2S"
        },
        {
            "Ten": "NH<sub>3</sub>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_NH3"
        },
        {
            "Ten": "NO<sub>3</sub><sup>-</sup>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_NO3-"
        },
        {
            "Ten": "Dầu mỡ động, thực vật",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_DMDTV"
        },
        {
            "Ten": "Tổng các chất hoạt động bề mặt",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TCCHDBM"
        },
        {
            "Ten": "PO<sub>4</sub><sup>3-</sup>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_PO43-"
        },
        {
            "Ten": "Tổng Coliforms",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TColiforms"
        },
    ];
    //Code
    if (KiemTraDuLieuVao(jsonKiemTra)) {
        if (loaiNuocThaiXuLy === 1) {
            //Đối với nước thải sinh hoạt
            if (KiemTraDuLieuVao(jsonCSDL_NuocThai.NTSH)) {
                XuLyHeSoQuyChuan_NuocThai(1);
                if (kiemTraTruocKhiTinh === true) {
                    if (KiemTraDuLieuVao(jsonKiemTraCongNgheLuaChon)){

                    }
                }
            }
        } else if (loaiNuocThaiXuLy === 2) {
        } else if (loaiNuocThaiXuLy === 3) {
        }
    }
}

//3.2 Tính toán cho xử lý nước cấp
function TinhToanChoXuLyNuocCap() {

}

//3.3 Tính toán cho xử lý khí thải
function TinhToanChoXuLyKhiThai() {

}

//3.4 Tính toán cho xử lý chất thải rắn
function TinhToanChoXuLyChatThaiRan() {

}



//-----------------------------------------------------------IV. XỬ LÝ BẮT SỰ KIỆN-----------------------------------------------------------------------
//4.1 Xử lý chung

//4.1.1 Xử lý file tải lên
document.getElementById("btn_UploadFile").addEventListener("change", function () {
    //Khai báo biến
    var reader = new FileReader();

    //Code
    reader.addEventListener("load", function () {
        var result = JSON.parse(reader.result);
        jsonCore = result;
        HienThiThongBao("Tải lên tệp tin thành công!");
    });
    reader.readAsText(document.getElementById("btn_UploadFile").files[0]);
});
//Xử lý trùng tên file - xoá file cũ trước khi tải lên file mới
document.getElementById("btn_UploadFile").addEventListener("click", function () {
    document.getElementById("btn_UploadFile").value = "";
});

//4.1.2 Lĩnh vực tính toán
document.getElementById("comboBox_LinhVucTinhToan").addEventListener("change", function () {
    AnHienThongTinTheoLinhVucTinhToan();
});

//4.1.3 Xử lý nút cập nhật dữ liệu vào chương trình
document.getElementById("btn_CapNhatDuLieuTuFile").addEventListener("click", function () {
    //Khai báo biến
    var kiemTraCoFile = document.getElementById("btn_UploadFile").value;
    var linhVucTinhToan;

    if (kiemTraCoFile !== "") {
        linhVucTinhToan = jsonCore.Core.LinhVucTinhToan[0].GiaTri;
        if (linhVucTinhToan === 1) {
            NhapDuLieuTuTepTaiLen("NuocThai");
        } else if (linhVucTinhToan === 2) {
            NhapDuLieuTuTepTaiLen("NuocCap");
        } else if (linhVucTinhToan === 3) {
            NhapDuLieuTuTepTaiLen("KhiThai");
        } else if (linhVucTinhToan === 4) {
            NhapDuLieuTuTepTaiLen("ChatThaiRan");
        }
        HienThiThongBao("Đã cập nhật dữ liệu từ tệp thành công!");
    } else {
        HienThiThongBao("Chưa có tệp được tải lên, vui lòng kiểm tra lại!");
    }
    if (duLieuSoDoCongNghe_NuocThai !== "") {
        VeSoDoCongNghe(duLieuSoDoCongNghe_NuocThai, "soDoCongNghe");
    }
});

//4.2 Xử lý cho nước thải
//4.2.1 - Ẩn hiện thông tin hệ số K, Kq, Kf
document.getElementById("comboBox_XuLyNuocThai").addEventListener("change", function () {
    //Ẩn hiện hệ số
    AnHienHeSoKKQKF_NuocThai();

    //Reset nguồn tiếp nhận nước thải + công nghệ lựa chọn
    document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").selectedIndex = 0;
    document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;
});

//4.2.2 - Tự động áp dụng quy chuẩn phù hợp
document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").addEventListener("change", function () {
    //Khai báo biến
    var index_NguonTiepNhan = document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").selectedIndex;
    var index_LoaiNuocThai = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
    var jsonLoaiNuoc = [
        {
            "Ten": "2.1 Chọn loại nước thải cần xử lý",
            "ID": "comboBox_XuLyNuocThai",
        },
    ]

    //Code
    if (KiemTraDuLieuVao(jsonLoaiNuoc)) {
        if (index_NguonTiepNhan === 1 && index_LoaiNuocThai === 1) {
            //Nước thải sinh hoạt
            document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "1";
        } else if (index_NguonTiepNhan === 2 && index_LoaiNuocThai === 1) {
            //Nước thải sinh hoạt
            document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "2";
        }
    } else {
        document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").selectedIndex = 0;
    }
    //Reset công nghệ lựa chọn
    document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;
});

//4.2.3 Thông số đầu vào nhập từ cơ sở dữ liệu
document.getElementById("btn_xuLyNuocThai_ThongSoDauVao_CSDL").addEventListener("click", function () {
    //Code
    for (var i = 0; i < jsonCSDL_NuocThai.NTSH.length; i++) {
        NhapGiaTriChoTextBox(jsonCSDL_NuocThai.NTSH[i].ID, jsonCSDL_NuocThai.NTSH[i].GiaTri);
    }
});

//4.2.4 Ẩn hiện mục chọn lại sơ đồ công nghệ + section phù hợp
document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").addEventListener("change", function () {
    //Code
    AnHienChoCongNgheXuLy_NuocThai();
});

//4.2.5 Thêm công trình đơn vị vào sơ đồ công nghệ
document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").addEventListener("change", function () {
    //Khai báo biến

    //Code
    ChonCongTrinhDonViVaVeSoDo_NuocThai();
});

//Xoá công trình đơn vị khỏi sơ đồ công nghệ
document.getElementById("btn_xuLyNuocThai_CongNghe_XoaCongTrinhDV").addEventListener("click", function () {
    //Khai báo biến

    //Code
    XoaCongTrinhDonViVeLaiSoDo_NuocThai();
});

//----------------------------------------------------------------V. PHẦN CHÍNH - CHẠY MẶC ĐỊNH KHI LOAD WEB-------------------------------------------------------------------------------------
//5.1 Chương trình chính
//5.1.1 Xử lý chung
//Nhấn nút tính toán
document.getElementById("btn_calculator").addEventListener("click", function () {
    //Khai báo biến
    var index = document.getElementById("comboBox_LinhVucTinhToan").selectedIndex;
    var jsonKiemTraDauVao = [{
        "Ten": "1.1 Lĩnh vực cần tính toán cho môi trường",
        "ID": "comboBox_LinhVucTinhToan",
    }]

    //Code
    //Kiểm tra đầu vào
    if (KiemTraDuLieuVao(jsonKiemTraDauVao)) {
        if (index === 1) {
            TinhToanChoXuLyNuocThai();
        } else if (index === 2) {
            TinhToanChoXuLyNuocCap();
        } else if (index === 3) {
            TinhToanChoXuLyKhiThai();
        } else if (index === 4) {
            TinhToanChoXuLyChatThaiRan();
        }
    }
});

//Thông tin trợ giúp trong modal
LayDuLieuJsonTuSourcesCode(duongDanGoiY, function (duLieuTraVe) {
    jsonGoiY = duLieuTraVe;
    XuLyHienThongTinGoiYTrongModal();
});

//Mặc định chạy hiển thị gợi ý trên toàn bộ web
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
});

//5.1.2 Xử lý cho nước thải
//Lấy CSDL nước thải từ sources code khi load trang
LayDuLieuJsonTuSourcesCode(duongDanCSDL_NuocThai, function (duLieuTraVe) {
    jsonCSDL_NuocThai = duLieuTraVe;
});

//Mặt định ẩn chọn lại sơ đồ công nghệ
AnDoiTuong(["subSection_XuLyNuocThai_CongNghe_CongNgheLuaChonLai"]);

//Reload vẽ sơ đồ công nghệ khi click lên section
document.getElementById("title_XuLyNuocThai_LuaChonCongNghe").addEventListener("click", function () {
    if (duLieuSoDoCongNghe_NuocThai !== "") {
        VeSoDoCongNghe(duLieuSoDoCongNghe_NuocThai, "soDoCongNghe");
    }
});

//-----------------------------------------------------------------VI. TEST CODE--------------------------------------------------------------------------------------------------------------

