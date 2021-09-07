//----------------------------------------------------------------I. BIẾN CHUNG ----------------------------------------------------------------
var jsonDataUser = "", jsonDataSouces = "";
const pathDataSources = "./file/Data_Sources.json";
const pathDataUser = "./file/Data_User.json"
var kiemTraTruocKhiTinh = false;
var kiemTraThongBaoBiTrung = "";
var anHienThongBaoSoatLoi = false;

//---------------------------------------------------------------II. HÀM CHUNG CHO WEB ----------------------------------------------------------------------
//Tự động tính toán + lưu dữ liệu
function TuDongTinhToan() {
    var a = document.getElementsByTagName("input");
    for (var i = 0; i < a.length; i++) {
        //Khi tính toán
        if (a[i].id !== "upload_TaiLenTepDuLieu" && a[i].id !== "input_TenFileTaiXuong") {
            a[i].addEventListener("input", function () {
                //Tính toán
                document.getElementById("btn_calculator").click();

                //Cập nhật dữ liệu
                TuDongCapNhatThayDoiVaoJsonCore();

                //Lưu dữ liệu
                LuuDuLieuVaoLocalStorage();
            });
        }
    }
    var b = document.getElementsByTagName("select");
    for (var i = 0; i < b.length; i++) {
        if (b[i].id !== "comboBox_DichSangNgonNguKhac") {
            b[i].addEventListener("change", function () {
                //Tính toán
                document.getElementById("btn_calculator").click();

                //Cập nhật dữ liệu
                TuDongCapNhatThayDoiVaoJsonCore();

                //Lưu dữ liệu
                LuuDuLieuVaoLocalStorage();
            });

        }
    }
}

//2.1 Ẩn đối tượng = none
function AnDoiTuong(mangTen) {
    for (var i = 0; i < mangTen.length; i++) {
        document.getElementById(mangTen[i]).style.display = "none";
    }
}

//Ẩn hiện đối tượng dạng block - true = ẩn, false = hiện
function AnHienDoiTuongDangBlock(idDoiTuong, AnT_HienF) {
    //Code
    if (AnT_HienF === true) {
        document.getElementById(idDoiTuong).style.display = "none";
    } else {
        document.getElementById(idDoiTuong).style.display = "block";
    }
}

//2.2 Hiện đối tượng - flex
function HienDoiTuong(mangTen) {
    for (var i = 0; i < mangTen.length; i++) {
        document.getElementById(mangTen[i]).style.display = "flex";
    }
}

//2.3 Nhập giá trị cho text box - không hữu dụng
function NhapGiaTriChoTextBox(ID, giaTri) {
    document.getElementById(ID).value = giaTri;
}

//2.4 Hiển thị thông báo - từ string
function HienThiThongBao(thongTinHienThi) {
    //Hiện thông báo
    document.getElementById("thongBao").setAttribute("class", "toast show");
    document.getElementById("thongTinThongBao").innerHTML = thongTinHienThi;

    //Ẩn sau 5 giây
    setTimeout(function () {
        document.getElementById("thongBao").setAttribute("class", "toast hide");
    }, 5000);

    //Ẩn bằng nút đóng thông báo
    document.getElementById("dongThongBao").addEventListener("click", function () {
        document.getElementById("thongBao").setAttribute("class", "toast hide");
    });
}

//2.5 Kiểm tra điều kiện trước khi tính toán (không thông báo)
function KiemTraDuLieuVao(jsonCanKiemTra) {
    //Khai báo biến
    var kiemTra = true;
    var kieuKiemTra = "";
    var bienLuuTam, bienThongBao = "", chuoiIDCuaJsonKiemTra = "";

    //Code
    for (var i = 0; i < jsonCanKiemTra.length; i++) {
        kieuKiemTra = jsonCanKiemTra[i].ID.slice(0, jsonCanKiemTra[i].ID.indexOf("_", 0));

        //Kiểm tra từng ID
        if (kieuKiemTra === "comboBox") {
            bienLuuTam = document.getElementById(jsonCanKiemTra[i].ID).selectedIndex;
            if (bienLuuTam === 0) {
                chuoiIDCuaJsonKiemTra = chuoiIDCuaJsonKiemTra + jsonCanKiemTra[i].ID + ", ";
                bienThongBao = bienThongBao + jsonCanKiemTra[i].Ten + "</br>";
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "red";
                kiemTra = false;
            } else {
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "#ced4da";
            }

        } else if (kieuKiemTra === "input") {
            bienLuuTam = document.getElementById(jsonCanKiemTra[i].ID).value;
            if (bienLuuTam === "") {
                chuoiIDCuaJsonKiemTra = chuoiIDCuaJsonKiemTra + jsonCanKiemTra[i].ID + ", ";
                bienThongBao = bienThongBao + jsonCanKiemTra[i].Ten + "</br>";
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "red";
                kiemTra = false;
            } else {
                document.getElementById(jsonCanKiemTra[i].ID).style.borderColor = "#ced4da";
            }
        }
    }

    if (bienThongBao !== "") {
        if (kiemTraThongBaoBiTrung.indexOf(chuoiIDCuaJsonKiemTra, 0) === -1) {
            //Chỉ thông báo khi không phải click nút tính toán
            if (anHienThongBaoSoatLoi === false) {
                HienThiThongBao(bienThongBao);
            }
            kiemTraThongBaoBiTrung = chuoiIDCuaJsonKiemTra + "@" + bienThongBao;
        } else {
            //Xử lý thông báo lỗi để hiển thị khi click nút soát lỗi
            kiemTraThongBaoBiTrung = kiemTraThongBaoBiTrung.slice(0, kiemTraThongBaoBiTrung.indexOf("@", 0));
            kiemTraThongBaoBiTrung = kiemTraThongBaoBiTrung + "@" + bienThongBao;
        }
        //Hiển thị lại thông báo bình thường
        anHienThongBaoSoatLoi = false;

        //Dừng tính toán
        kiemTraTruocKhiTinh = false;
    } else {
        //Trả kết quả vào các biến bên dưới
        kiemTraTruocKhiTinh = true;
    }
    return kiemTra;
}

//2.6 Nhập dữ liệu từ tệp tải lên + dữ liệu có sẵn
function NhapDuLieuTuTepTaiLen(loaiNuocThaiXuLy) {
    //Khai báo biến
    var kieuKiemTra = "";

    //Code
    //Nhập dữ liệu cho lĩnh vực tính toán
    document.getElementById(jsonDataUser.DuLieu.LinhVucTinhToan[0].ID).selectedIndex = jsonDataUser.DuLieu.LinhVucTinhToan[0].GiaTri;

    //Nhập tuần tự dữ liệu lên chương trình
    for (var i = 0; i < jsonDataUser.DuLieu[loaiNuocThaiXuLy].length; i++) {
        kieuKiemTra = jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].ID.slice(0, jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].ID.indexOf("_", 0));
        //Đối với comboBox
        if (kieuKiemTra === "comboBox") {
            document.getElementById(jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].ID).selectedIndex = jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].GiaTri;
            if (jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].ID === "comboBox_XuLyNuocThai_GopSinhHoat" && jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].GiaTri === 1) {
                document.getElementById("btn_xuLyNuocThai_GopSinhHoat").click();
            }
        }
        //Đối với input text, number
        else if (kieuKiemTra === "input") {
            document.getElementById(jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].ID).value = jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].GiaTri;
        }
        //Đối với sơ đồ công nghệ được hiển thị
        else if (jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].ID === "soDoCongNghe" && jsonDataUser.DuLieu[loaiNuocThaiXuLy][i - 1].GiaTri === 2 /* Trường hợp bằng 1 thì sao */) {
            duLieuSoDoCongNghe_NuocThai = jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].GiaTri;
            //Tạo mảng từ tệp dữ liệu
            congTrinhDaChon = [];
            for (var j = 0; j < jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].CongTrinhDonVi_Tep.length; j++) {
                congTrinhDaChon.push(jsonDataUser.DuLieu[loaiNuocThaiXuLy][i].CongTrinhDonVi_Tep[j]);
            }
            taoCongTrinh = duLieuSoDoCongNghe_NuocThai.slice(0, duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0) - 32);
            taoDuongVe = duLieuSoDoCongNghe_NuocThai.slice(duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0), duLieuSoDoCongNghe_NuocThai.length - 7);
        }
    }
    //Ẩn hiện thông tin phù hợp
    AnHienThongTinTheoLinhVucTinhToan();
    AnHienThongTin(loaiNuocThaiXuLy);
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
        "section_XuLyNuocThai_ThongSoTinhToan"
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

//Lấy dữ liệu từ file sources code (sau khi load web mới sử dụng được)
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
    for (var i = 0; i < jsonDataSouces.GoiY.NuocThai.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonDataSouces.GoiY.NuocThai[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonDataSouces.GoiY.NuocThai.length; j++) {
                if (jsonDataSouces.GoiY.NuocThai[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonDataSouces.GoiY.NuocThai[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
    //Xử lý cho nước cấp
    for (var i = 0; i < jsonDataSouces.GoiY.NuocCap.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonDataSouces.GoiY.NuocCap[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonDataSouces.GoiY.NuocCap.length; j++) {
                if (jsonDataSouces.GoiY.NuocCap[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonDataSouces.GoiY.NuocCap[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
    //Xử lý cho khí thải
    for (var i = 0; i < jsonDataSouces.GoiY.KhiThai.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonDataSouces.GoiY.KhiThai[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonDataSouces.GoiY.KhiThai.length; j++) {
                if (jsonDataSouces.GoiY.KhiThai[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonDataSouces.GoiY.KhiThai[j].GiaTri;
                    document.getElementById("btn_HienThiModal").click();
                }
            }
        });
    }
    //Xử lý cho chất thải rắn
    for (var i = 0; i < jsonDataSouces.GoiY.ChatThaiRan.length; i++) {
        //Tạo sự kiện
        document.getElementById(jsonDataSouces.GoiY.ChatThaiRan[i].ID).addEventListener("click", function () {
            for (var j = 0; j < jsonDataSouces.GoiY.ChatThaiRan.length; j++) {
                if (jsonDataSouces.GoiY.ChatThaiRan[j].ID === this.id) {
                    document.getElementById("modal_HienThiThongTinTroGiup").innerHTML = jsonDataSouces.GoiY.ChatThaiRan[j].GiaTri;
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

//Ẩn hiện thông tin cho toàn chương trình
function AnHienThongTin(linhVucXuLy) {
    //Khai báo biến
    var loaiNuocThai = document.getElementById("comboBox_XuLyNuocThai");

    //Chương trình con
    //Ẩn hiện hệ số K, Kq, Kf phù hợp
    function AnHienHeSoKKQKF_NuocThai() {
        //Khai báo biến
        var mang_HeSoQC4011 = ["heSoKQC401", "heSoKQC402"];
        var mang_HeSoQC14 = ["heSoKQC14"];
        var index_LoaiNuocThai = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;

        //Code
        if (index_LoaiNuocThai === 1 || index_LoaiNuocThai === 4) {
            AnDoiTuong(mang_HeSoQC4011);
            HienDoiTuong(mang_HeSoQC14);
        } else if (index_LoaiNuocThai === 2 || index_LoaiNuocThai === 3) {
            AnDoiTuong(mang_HeSoQC14);
            HienDoiTuong(mang_HeSoQC4011);
        }
    }

    //Ẩn hiện thông số nồng độ các chất ô nhiễm
    function AnHienChiTieuONhiem_NuocThai() {
        //Khai báo biến
        var loaiNuocThaiXuLy = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
        var xuLyGopSinhHoat = document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").selectedIndex;

        //Hàm xử lý
        function AnHienTheoLoaiNuocThai(loaiNuocThai, gopSinhHoat) {
            //Khai báo biến
            var bienTam;

            //Code
            if (gopSinhHoat === false) {
                //Ẩn hết chỉ tiêu - thông số đầu vào
                for (var i = 0; i < jsonDBNuocThai.TatCaChiTieu.length; i++) {
                    bienTam = jsonDBNuocThai.TatCaChiTieu[i].ID;
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "none";
                }

                //Ẩn hết chỉ tiêu - yêu cầu đầu ra
                for (var i = 0; i < jsonDBNuocThai.TatCaChiTieu.length; i++) {
                    bienTam = jsonDBNuocThai.TatCaChiTieu[i].ID;
                    bienTam = bienTam.replace("ThongThongSoDauVao", "YeuCauDauRa");
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "none";
                }

                //Hiện lại theo đúng quy chuẩn - thông số đầu vào
                for (var i = 0; i < jsonDBNuocThai[loaiNuocThai].length; i++) {
                    bienTam = jsonDBNuocThai[loaiNuocThai][i].ID;
                    document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_ChiTieuONhiem").appendChild(document.getElementById(bienTam).parentNode.parentNode);
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "block";
                }

                //Hiện lại theo đúng quy chuẩn - yêu cầu đầu ra
                for (var i = 0; i < jsonDBNuocThai[loaiNuocThai].length; i++) {
                    bienTam = jsonDBNuocThai[loaiNuocThai][i].ID;
                    bienTam = bienTam.replace("ThongThongSoDauVao", "YeuCauDauRa");
                    document.getElementById("box_xuLyNuocThai_YeuCauDauRa_ChiTieuONhiem").appendChild(document.getElementById(bienTam).parentNode.parentNode);
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "block";
                }
            }

            if (gopSinhHoat === true) {
                //Ẩn hết chỉ tiêu - thông số đầu vào
                for (var i = 0; i < jsonDBNuocThai.TatCaChiTieu.length; i++) {
                    bienTam = jsonDBNuocThai.TatCaChiTieu[i].ID;
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "none";
                }

                //Ẩn hết chỉ tiêu - nồng độ ô nhiễm hỗn hợp
                for (var i = 0; i < jsonDBNuocThai.TatCaChiTieu.length; i++) {
                    bienTam = jsonDBNuocThai.TatCaChiTieu[i].ID;
                    bienTam = bienTam + "_NongDoHH";
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "none";
                }

                //Ẩn hết chỉ tiêu - yêu cầu đầu ra
                for (var i = 0; i < jsonDBNuocThai.TatCaChiTieu.length; i++) {
                    bienTam = jsonDBNuocThai.TatCaChiTieu[i].ID;
                    bienTam = bienTam.replace("ThongThongSoDauVao", "YeuCauDauRa");
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "none";
                }

                //Hiện lại theo đúng quy chuẩn - thông số đầu vào
                for (var i = 0; i < jsonDBNuocThai[loaiNuocThai].length; i++) {
                    bienTam = jsonDBNuocThai[loaiNuocThai][i].ID;
                    document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_ChiTieuONhiem").appendChild(document.getElementById(bienTam).parentNode.parentNode);
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "block";
                }

                //Hiện lại theo đúng quy chuẩn - nồng độ ô nhiễm hỗn hợp
                for (var i = 0; i < jsonDBNuocThai[loaiNuocThai].length; i++) {
                    bienTam = jsonDBNuocThai[loaiNuocThai][i].ID;
                    bienTam = bienTam + "_NongDoHH";
                    document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_NongDoHH").appendChild(document.getElementById(bienTam).parentNode.parentNode);
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "block";
                }

                //Hiện lại theo đúng quy chuẩn - yêu cầu đầu ra
                for (var i = 0; i < jsonDBNuocThai[loaiNuocThai].length; i++) {
                    bienTam = jsonDBNuocThai[loaiNuocThai][i].ID;
                    bienTam = bienTam.replace("ThongThongSoDauVao", "YeuCauDauRa");
                    document.getElementById("box_xuLyNuocThai_YeuCauDauRa_ChiTieuONhiem").appendChild(document.getElementById(bienTam).parentNode.parentNode);
                    document.getElementById(bienTam).parentNode.parentNode.style.display = "block";
                }
            }
        }

        //Xử lý riêng
        if (xuLyGopSinhHoat === 0) {
            //Đối với nước thải sinh hoạt
            if (loaiNuocThaiXuLy === 1) {
                AnHienTheoLoaiNuocThai("NTSH", false);
            }

            //Đối với nước thải thuỷ sản
            else if (loaiNuocThaiXuLy === 2) {
                AnHienTheoLoaiNuocThai("NTTS", false);
            }
        }

        //Xử lý gộp sinh hoạt
        else if (xuLyGopSinhHoat === 1) {
            if (loaiNuocThaiXuLy === 2) {
                AnHienTheoLoaiNuocThai("NTTS", true);
            }
        }

    }

    //Ẩn hiện sơ đồ công nghệ chọn lại + đề xuất
    function AnHienChoCongNgheXuLy_NuocThai() {
        //Khai báo biến
        var index_PhuongAn = document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex;
        var loaiNuocThai = TuDongLayDuLieu("comboBox_XuLyNuocThai");
        var nguonTiepNhan = TuDongLayDuLieu("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan");
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

        //Chương trình con
        //Xử lý đưa ra sơ đồ công nghệ phù hợp
        function XuLySoDoCongNghe_NuocThai() {
            //Khai báo biến
            var quyChuan, loaiNuocThai, nuocSinhHoatGop;

            //Code
            loaiNuocThai = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
            nuocSinhHoatGop = document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").selectedIndex;
            quyChuan = document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex;
            congTrinhDaChon = [];

            //Khi xử lý riêng lẻ
            if (nuocSinhHoatGop === 0) {

                //Đối với nước thải sinh hoạt
                if (loaiNuocThai === 1) {
                    //Cột A
                    if (quyChuan === 1) {
                        //Hiện tại sử dụng đề xuất 01 sơ đồ công nghệ
                        duLieuSoDoCongNghe_NuocThai = jsonDBNuocThai.SoDoCongNghe.QCVN142008.CotA[0].GiaTri;
                        //Tạo mảng từ tệp dữ liệu
                        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.QCVN142008.CotA[0].CongTrinhDonVi_QuyChuan.length; j++) {
                            congTrinhDaChon.push(jsonDBNuocThai.SoDoCongNghe.QCVN142008.CotA[0].CongTrinhDonVi_QuyChuan[j]);
                        }
                    }

                    //Cột B
                    else if (quyChuan === 2) {
                        duLieuSoDoCongNghe_NuocThai = jsonDBNuocThai.SoDoCongNghe.QCVN142008.CotB[0].GiaTri;
                        //Tạo mảng từ tệp dữ liệu
                        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.QCVN142008.CotB[0].CongTrinhDonVi_QuyChuan.length; j++) {
                            congTrinhDaChon.push(jsonDBNuocThai.SoDoCongNghe.QCVN142008.CotB[0].CongTrinhDonVi_QuyChuan[j]);
                        }
                    }
                }

                //Đối với nước thải thuỷ sản
                else if (loaiNuocThai === 2) {
                    //Cột A
                    if (quyChuan === 3) {
                        //Hiện tại sử dụng đề xuất 01 sơ đồ công nghệ
                        duLieuSoDoCongNghe_NuocThai = jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015.CotA[0].GiaTri;
                        //Tạo mảng từ tệp dữ liệu
                        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015.CotA[0].CongTrinhDonVi_QuyChuan.length; j++) {
                            congTrinhDaChon.push(jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015.CotA[0].CongTrinhDonVi_QuyChuan[j]);
                        }
                    }

                    //Cột B
                    else if (quyChuan === 4) {
                        duLieuSoDoCongNghe_NuocThai = jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015.CotB[0].GiaTri;
                        //Tạo mảng từ tệp dữ liệu
                        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015.CotB[0].CongTrinhDonVi_QuyChuan.length; j++) {
                            congTrinhDaChon.push(jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015.CotB[0].CongTrinhDonVi_QuyChuan[j]);
                        }
                    }
                }


            }

            //Xử lý gộp sinh hoạt
            if (nuocSinhHoatGop === 1) {
                //Đối với nước thải thuỷ sản gộp sinh hoạt
                if (loaiNuocThai === 2) {
                    //Cột A
                    if (quyChuan === 3) {
                        //Hiện tại sử dụng đề xuất 01 sơ đồ công nghệ
                        duLieuSoDoCongNghe_NuocThai = jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015_GopSH.CotA[0].GiaTri;
                        //Tạo mảng từ tệp dữ liệu
                        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015_GopSH.CotA[0].CongTrinhDonVi_QuyChuan.length; j++) {
                            congTrinhDaChon.push(jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015_GopSH.CotA[0].CongTrinhDonVi_QuyChuan[j]);
                        }
                    }

                    //Cột B
                    else if (quyChuan === 4) {
                        duLieuSoDoCongNghe_NuocThai = jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015_GopSH.CotB[0].GiaTri;
                        //Tạo mảng từ tệp dữ liệu
                        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015_GopSH.CotB[0].CongTrinhDonVi_QuyChuan.length; j++) {
                            congTrinhDaChon.push(jsonDBNuocThai.SoDoCongNghe.QCVN11MT2015_GopSH.CotB[0].CongTrinhDonVi_QuyChuan[j]);
                        }
                    }
                }
            }


            //Đối với nước thải thuỷ sản cột A
            taoCongTrinh = duLieuSoDoCongNghe_NuocThai.slice(0, duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0) - 32);
            taoDuongVe = duLieuSoDoCongNghe_NuocThai.slice(duLieuSoDoCongNghe_NuocThai.indexOf("dauVao->", 0), duLieuSoDoCongNghe_NuocThai.length - 7);
        }

        //Code
        //Đối với trường hợp chọn lại sơ đồ công nghệ
        if (index_PhuongAn === 2) {
            document.getElementById("subSection_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").style.display = "block";
        } else {
            AnDoiTuong(["subSection_XuLyNuocThai_CongNghe_CongNgheLuaChonLai"]);
        }

        //Đối với trường hợp lấy sơ đồ công nghệ đề xuất
        if (index_PhuongAn === 1) {
            if (loaiNuocThai !== 0 && nguonTiepNhan !== 0) {
                XuLySoDoCongNghe_NuocThai();
                if (duLieuSoDoCongNghe_NuocThai !== "") {
                    VeSoDoCongNghe(duLieuSoDoCongNghe_NuocThai, "soDoCongNghe");
                }
                AnHienCongTrinhDonVi(congTrinhDaChon);
            } else {
                if (loaiNuocThai === 0 && nguonTiepNhan !== 0) {
                    HienThiThongBao("2.1 Chọn loại nước thải");
                } else if (loaiNuocThai !== 0 && nguonTiepNhan === 0) {
                    HienThiThongBao("4.1 Nguồn tiếp nhận nước thải");
                } else if (loaiNuocThai === 0 && nguonTiepNhan === 0) {
                    HienThiThongBao("2.1 Chọn loại nước thải </br> 4.1 Nguồn tiếp nhận nước thải");
                }
                document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;
            }
        }

        //Đối với trường hợp reset về selectIndex 0
        if (index_PhuongAn === 0) {
            //Xoá sơ đồ
            document.getElementById("soDoCongNghe").innerHTML = "";

            //Ẩn toàn bộ công trình đơn vị
            for (var i = 0; i < jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
                AnDoiTuong(jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].IDSectionHienThi);
            }
        }
    }

    //Ẩn hiện thông tin phương án cho hố thu
    function AnHienPhuongAnHoThu_NuocThai() {
        //Khai báo biến
        var phuongAn = document.getElementById("comboBox_XuLyNuocThai_HoThu_PhuongAn").selectedIndex;
        var mangPA1 = [
            "input_xuLyNuocThai_HoThu_DoCaoOngThoat",
            "input_xuLyNuocThai_HoThu_DoCaoBaoVe",
            "input_xuLyNuocThai_HoThu_DoCaoHuuIch",
            "input_xuLyNuocThai_HoThu_DoCaoThucTe",
            "comboBox_XuLyNuocThai_HoThu_DangHinhHoc",
            "input_xuLyNuocThai_HoThu_TheTichThucTe"
        ];
        var mangPA2 = [
            "input_xuLyNuocThai_HoThu_DoCaoOngThoat",
            "input_xuLyNuocThai_HoThu_DoCaoBaoVe",
            "input_xuLyNuocThai_HoThu_DoCaoHuuIch",
            "input_xuLyNuocThai_HoThu_DoCaoThucTe",
            "comboBox_XuLyNuocThai_HoThu_DangHinhHoc",
            "input_xuLyNuocThai_HoThu_TheTichThucTe",
            "input_xuLyNuocThai_HoThu_ThoiGianLuuNuoc",
            "input_xuLyNuocThai_HoThu_TheTichHuuIch"
        ];

        var mangPA3 = [
            "input_xuLyNuocThai_HoThu_ChieuDai",
            "input_xuLyNuocThai_HoThu_ChieuRong"
        ];
        var mangPA4 = [
            "input_xuLyNuocThai_HoThu_DuongKinh"
        ];
        //Code
        //Ẩn mặc định
        if (phuongAn === 0) {
            document.getElementById("box_XuLyNuocThai_HoThu_PhuongAn").style.display = "none";
        }

        //Hiện với phương án 1
        else if (phuongAn === 1) {
            for (var i = 0; i < mangPA2.length; i++) {
                document.getElementById(mangPA2[i]).parentNode.parentNode.parentNode.style.display = "none";
            }
            for (var i = 0; i < mangPA1.length; i++) {
                document.getElementById(mangPA1[i]).parentNode.parentNode.parentNode.style.display = "block";
            }

            //Xử lý dạng hình học
            document.getElementById("comboBox_XuLyNuocThai_HoThu_DangHinhHoc").selectedIndex = 2;
            document.getElementById("comboBox_XuLyNuocThai_HoThu_DangHinhHoc").disabled = true;
            for (var i = 0; i < mangPA4.length; i++) {
                document.getElementById(mangPA4[i]).parentNode.parentNode.parentNode.style.display = "none";
            }
            for (var i = 0; i < mangPA3.length; i++) {
                document.getElementById(mangPA3[i]).parentNode.parentNode.parentNode.style.display = "block";
            }

            //Xử lý người dùng tự nhập
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai_SuaLai").style.display = "none";
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai").disabled = false;
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuRong_SuaLai").style.display = "none";
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuRong").disabled = false;

            //Hiển thị lại nội dung
            document.getElementById("box_XuLyNuocThai_HoThu_PhuongAn").style.display = "block";
            document.getElementById("box_XuLyNuocThai_HoThu_DangHinhHoc").style.display = "block";
        }

        //Ẩn hiện với phương án 2
        else if (phuongAn === 2) {
            for (var i = 0; i < mangPA1.length; i++) {
                document.getElementById(mangPA1[i]).parentNode.parentNode.parentNode.style.display = "none";
            }
            for (var i = 0; i < mangPA2.length; i++) {
                document.getElementById(mangPA2[i]).parentNode.parentNode.parentNode.style.display = "block";
            }

            //Xử lý dạng hình học
            /* document.getElementById("comboBox_XuLyNuocThai_HoThu_DangHinhHoc").selectedIndex = 0; */
            document.getElementById("comboBox_XuLyNuocThai_HoThu_DangHinhHoc").disabled = false;
            for (var i = 0; i < mangPA4.length; i++) {
                document.getElementById(mangPA4[i]).parentNode.parentNode.parentNode.style.display = "block";
            }

            //Xử lý người dùng tự nhập
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai_SuaLai").style.display = "block";
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai").disabled = true;
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuRong_SuaLai").style.display = "block";
            document.getElementById("input_xuLyNuocThai_HoThu_ChieuRong").disabled = true;

            //Xử lý hiển thị chung
            document.getElementById("box_XuLyNuocThai_HoThu_DangHinhHoc").style.display = "none";
            document.getElementById("box_XuLyNuocThai_HoThu_PhuongAn").style.display = "block";
        }
    }

    //Ẩn hiện loại hình học cho hố thu
    function AnHienDangHinhHocHoThu_NuocThai() {
        //Khai báo biến
        var phuongAn = TuDongLayDuLieu("comboBox_XuLyNuocThai_HoThu_DangHinhHoc");
        var mangPA1 = [
            "input_xuLyNuocThai_HoThu_ChieuDai",
            "input_xuLyNuocThai_HoThu_ChieuRong"
        ];
        var mangPA2 = [
            "input_xuLyNuocThai_HoThu_DuongKinh"
        ];

        //Code
        //Ẩn hết mặc định
        if (phuongAn === 0) {
            document.getElementById("box_XuLyNuocThai_HoThu_DangHinhHoc").style.display = "none";
        }

        //Với phương án 1 và 2
        else {
            if (phuongAn === 1 || phuongAn === 2) {
                for (var i = 0; i < mangPA2.length; i++) {
                    document.getElementById(mangPA2[i]).parentNode.parentNode.parentNode.style.display = "none";
                }
                for (var i = 0; i < mangPA1.length; i++) {
                    document.getElementById(mangPA1[i]).parentNode.parentNode.parentNode.style.display = "block";
                }

                //Hình chữ nhật
                if (phuongAn === 2) {
                    document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai_SuaLai").style.display = "none";
                    document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai").disabled = false;
                }

                //Hình vuông
                else if (phuongAn === 1) {
                    document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai_SuaLai").style.display = "block";
                    document.getElementById("input_xuLyNuocThai_HoThu_ChieuDai").disabled = true;
                }
            }

            //Với phương án 3
            else if (phuongAn === 3) {
                for (var i = 0; i < mangPA1.length; i++) {
                    document.getElementById(mangPA1[i]).parentNode.parentNode.parentNode.style.display = "none";
                }
                for (var i = 0; i < mangPA2.length; i++) {
                    document.getElementById(mangPA2[i]).parentNode.parentNode.parentNode.style.display = "block";
                }
            }
            document.getElementById("box_XuLyNuocThai_HoThu_DangHinhHoc").style.display = "block";
        }
    }

    //Ẩn hiện bể điều hoà
    //Ẩn hiên dạng khuấy trộn
    function AnHienDangKhuayTronDieuHoa_NuocThai() {
        //Khai báo biến
        var dangKhuayTron = TuDongLayDuLieu("comboBox_XuLyNuocThai_DieuHoa_DangKhuayTron");

        //Code
        if (dangKhuayTron === 1) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_CoKhi", false);
        }

        else if (dangKhuayTron === 2) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen", false);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_CoKhi", true);
        }

        else {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_CoKhi", true);
        }
    }

    //Ẩn hiện loại khếch tán khí
    function AnHienLoaiKhechTanKhi_DieuHoa_NuocThai() {
        //khai báo biến
        var dangKhuechTan = TuDongLayDuLieu("comboBox_XuLyNuocThai_DieuHoa_KhiNen_LoaiKhechTan");

        //Code
        if (dangKhuechTan === 1) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen_DiaPhanPhiKhi", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen_OngPhanPhoiKhi", false);
        }

        else if (dangKhuechTan === 2) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen_DiaPhanPhiKhi", false);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen_OngPhanPhoiKhi", true);
        }

        else {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen_DiaPhanPhiKhi", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_KhiNen_OngPhanPhoiKhi", true);
        }

    }

    //Ẩn hiện dạng hình học
    function AnHienDangHinhHocDieuHoa_NuocThai() {
        //Khai báo biến
        var index = TuDongLayDuLieu("comboBox_XuLyNuocThai_DieuHoa_HinhDangBe");

        //Hình chữ nhật
        if (index === 1) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_ChuNhat", false);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Vuong", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Tron", true);
        }

        //Hình vuông
        else if (index === 2) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_ChuNhat", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Vuong", false);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Tron", true);
        }

        //Hình tròn
        else if (index === 3) {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_ChuNhat", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Vuong", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Tron", false);
        }

        //Không hiện gì
        else {
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_ChuNhat", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Vuong", true);
            AnHienDoiTuongDangBlock("box_XuLyNuocThai_DieuHoa_HinhDangBe_Tron", true);
        }
    }

    //Ẩn hiện bể sinh học hiếu khí
    function AnHienHieuKhi_NuocThai() {
        //Khai báo biến

        //Chương trình con
        //Phương án tính thể tích bể
        function PhuongAnTinhTheTich() {
            //Biến
            var phuongAn = TuDongLayDuLieu("comboBox_XuLyNuocThai_HieuKhi_PhuongAnTheTich");

            //Code
            //Thời gian lưu vi khuẩn
            if (phuongAn === 1) {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_XacDinhTheTich_ThoiGianLuuVK", false);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_XacDinhTheTich_ThoiGianLuu", true);
            }

            //ThờI gian lưu nước
            else if (phuongAn === 2) {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_XacDinhTheTich_ThoiGianLuuVK", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_XacDinhTheTich_ThoiGianLuu", false);
            }

            //Còn lại
            else {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_XacDinhTheTich_ThoiGianLuuVK", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_XacDinhTheTich_ThoiGianLuu", true);
            }
        }

        //Hình dạng bể
        function HinhDangBe() {
            //Biến
            var dangHinhHoc = TuDongLayDuLieu("comboBox_XuLyNuocThai_HieuKhi_HinhDangBe");

            //Code
            //Hình chữ nhật
            if (dangHinhHoc === 1) {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_ChuNhat", false);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Vuong", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Tron", true);
            }

            //Hình vuông
            else if (dangHinhHoc === 2) {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_ChuNhat", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Vuong", false);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Tron", true);
            }

            //Hình tròn
            else if (dangHinhHoc === 3) {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_ChuNhat", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Vuong", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Tron", false);
            }

            //Còn lại
            else {
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_ChuNhat", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Vuong", true);
                AnHienDoiTuongDangBlock("box_XuLyNuocThai_HieuKhi_HinhDangBe_Tron", true);
            }
        }

        //Code
        PhuongAnTinhTheTich();
        HinhDangBe();

    }

    //Nước thải
    if (linhVucXuLy === "NuocThai") {
        //Ẩn nút chọn nước thải sinh hoạt (xử lý chung)
        if (loaiNuocThai.selectedIndex === 1) {
            document.getElementById("btn_xuLyNuocThai_GopSinhHoat").disabled = true;
        } else {
            document.getElementById("btn_xuLyNuocThai_GopSinhHoat").disabled = false;
        }

        //Hệ số k
        AnHienHeSoKKQKF_NuocThai();

        //Công nghệ xử lý
        AnHienChoCongNgheXuLy_NuocThai();

        //Công trình đơn vị
        AnHienCongTrinhDonVi(congTrinhDaChon);

        //Chỉ tiêu ô nhiễm
        AnHienChiTieuONhiem_NuocThai();
        document.getElementById("title_xuLyNuocThai_ThongThongSoDauVao_LoaiNuoc1").innerText = loaiNuocThai.options[loaiNuocThai.selectedIndex].text;

        //Hố thu
        AnHienPhuongAnHoThu_NuocThai();
        AnHienDangHinhHocHoThu_NuocThai();

        //Bể điều hoà
        AnHienDangHinhHocDieuHoa_NuocThai();
        AnHienDangKhuayTronDieuHoa_NuocThai();
        AnHienLoaiKhechTanKhi_DieuHoa_NuocThai();

        //Bể sinh học hiếu khí
        AnHienHieuKhi_NuocThai();



    } else if (linhVucXuLy === "NuocCap") {//Nước cấp

    } else if (linhVucXuLy === "KhiThai") {//Khí thải

    } else if (linhVucXuLy === "ChatThaiRan") {//Chất thải rắn

    }
}

//Chuyển text thành số
function So(duLieuText) {
    try {
        return parseFloat(duLieuText);
    } catch (error) {
        HienThiThongBao(duLieuText + "không phải định dạng số!");
    }
}

//Tự động lấy số chữ số thập phân theo nguyên tắt:
//- Nếu không có số nào là số nguyên = làm tròn đến khi có số thập phân
//- Nếu có một số nguyên = làm tròn đến 2 chữ số thập phân
//- Nếu có hai số nguyên = làm tròn đến 1 chữ số thập phân
//- Nếu có ba số nguyên trở lên = không lấy phần thập phân
function TuDongLamTronSo(soLamTron) {
    //Khai báo biến
    var soSoNguyen, kiemTraGiaTri;

    //Code
    //chuyển thành chuỗi
    soLamTron = soLamTron.toString();

    if (soLamTron.indexOf(".", 0) !== -1) {
        //tìm số chữ số nguyên
        soSoNguyen = soLamTron.slice(0, soLamTron.indexOf(".", 0));

        //Khi không có số nguyên nào
        if (soSoNguyen === "0" && soSoNguyen.length === 1) {
            var viTri;
            for (var i = 3; i < 10; i++) {
                kiemTraGiaTri = soLamTron.slice(soLamTron.indexOf(".", 0) + i, soLamTron.indexOf(".", 0) + i + 1);
                if (kiemTraGiaTri !== "0") {
                    viTri = i;
                    break;
                }
            }
            return parseFloat(soLamTron).toFixed(viTri);
        }

        //Khi tồn tại số nguyên
        else {
            soSoNguyen = soSoNguyen.length;

            //Khi có 01 số nguyên
            if (soSoNguyen === 1) {
                return parseFloat(soLamTron).toFixed(2);
            }

            //Khi có 2 số nguyên
            else if (soSoNguyen === 2) {
                return parseFloat(soLamTron).toFixed(1);
            }

            //Khi lớn hơn hoặc bằng 3
            else if (soSoNguyen >= 3) {
                return parseFloat(soLamTron).toFixed(0);
            }
        }
    }

    //Khi không có phần thập phân
    else {
        soSoNguyen = soLamTron.length;

        //Khi có 01 số nguyên
        if (soSoNguyen === 1) {
            return parseFloat(soLamTron).toFixed(2);
        }

        //Khi có 2 số nguyên
        else if (soSoNguyen === 2) {
            return parseFloat(soLamTron).toFixed(1);
        }

        //Khi lớn hơn hoặc bằng 3
        else if (soSoNguyen >= 3) {
            return parseFloat(soLamTron).toFixed(0);
        }
    }


}

//Tự động nhập dữ liệu phù hợp với ID
function TuDongNhapDuLieu(idCanNhap, giaTri) {
    //Khai báo biến
    var kieuKiemTra = idCanNhap.slice(0, idCanNhap.indexOf("_", 0));

    //Code
    //Nếu là comboBox
    if (kieuKiemTra === "comboBox") {
        document.getElementById(idCanNhap).selectedIndex = giaTri;
    }

    //Nếu là input
    else if (kieuKiemTra === "input") {
        document.getElementById(idCanNhap).value = giaTri;
    }

    //Còn lại
    else {
        HienThiThongBao("Không tìm thấy kiểu cần nhập");
    }
}

//Tự động lấy dữ liệu
function TuDongLayDuLieu(idCanLay) {
    //Khai báo biến
    var kieuKiemTra = idCanLay.slice(0, idCanLay.indexOf("_", 0));

    //Code
    //Nếu là comboBox
    if (kieuKiemTra === "comboBox") {
        return document.getElementById(idCanLay).selectedIndex;
    }

    //Nếu là input
    else if (kieuKiemTra === "input") {
        try {
            var check = document.getElementById(idCanLay + "_SuaLai").value;
            if (check !== "") {
                return check;
            } else {
                return document.getElementById(idCanLay).value;
            }
        } catch (error) {
            return document.getElementById(idCanLay).value;
        }
    }

    //Còn lại
    else {
        HienThiThongBao("Không tìm thấy kiểu cần lấy");
    }
}

//Ẩn section khi click nút ẩn ở cuối
function ClickToCollapse(id) {
    var doiTuong = document.getElementById(id);
    var bienTam = new bootstrap.Collapse(doiTuong, {
        toggle: true
    })
}

//Đưa dữ liệu vào web (từ local và file)
function NapDuLieuChoWebTuLocalStorageVaFile() {
    var linhVucTinhToan;

    //Code
    linhVucTinhToan = jsonDataUser.DuLieu.LinhVucTinhToan[0].GiaTri;
    if (linhVucTinhToan === 1) {
        NhapDuLieuTuTepTaiLen("NuocThai");

        //Vẽ lại sơ đồ công nghệ
        if (duLieuSoDoCongNghe_NuocThai !== "") {
            VeSoDoCongNghe(duLieuSoDoCongNghe_NuocThai, "soDoCongNghe");
        }
    } else if (linhVucTinhToan === 2) {
        NhapDuLieuTuTepTaiLen("NuocCap");
    } else if (linhVucTinhToan === 3) {
        NhapDuLieuTuTepTaiLen("KhiThai");
    } else if (linhVucTinhToan === 4) {
        NhapDuLieuTuTepTaiLen("ChatThaiRan");
    }

    //Lưu dữ liệu mới vào local storage
    LuuDuLieuVaoLocalStorage();
}

//Lưu dữ liệu vào local storage
function LuuDuLieuVaoLocalStorage() {
    //Biến
    var duLieuNguoiDung = JSON.stringify(jsonDataUser);
    var duLieuNuocThai = JSON.stringify(jsonDBNuocThai);
    var duLieuSoatLoi = kiemTraThongBaoBiTrung;

    //Lưu vào local
    localStorage.setItem("duLieuNguoiDung", duLieuNguoiDung);
    localStorage.setItem("duLieuNuocThai", duLieuNuocThai);
    localStorage.setItem("duLieuSoatLoi", duLieuSoatLoi);
}

//Nạp dữ liệu đƯợc lưu trong Local Storage
function NapDuLieuTuLocalStorage() {
    //Biến
    var duLieuNguoiDung = localStorage.getItem("duLieuNguoiDung");
    var duLieuNuocThai = localStorage.getItem("duLieuNuocThai");
    var duLieuSoatLoi = localStorage.getItem("duLieuSoatLoi");

    //chuyển dữ liệu sang Json
    if (duLieuNguoiDung !== null && duLieuNuocThai !== null && duLieuSoatLoi !== null) {
        jsonDataUser = JSON.parse(duLieuNguoiDung);
        jsonDBNuocThai = JSON.parse(duLieuNuocThai);
        kiemTraThongBaoBiTrung = duLieuSoatLoi;

        NapDuLieuChoWebTuLocalStorageVaFile();

    }
    document.getElementById("btn_calculator").click();

}

//Cập nhật thay đổi + kết quả tính vào jsonDataUser
function TuDongCapNhatThayDoiVaoJsonCore() {
    //Biến
    var linhVucTinhToan = TuDongLayDuLieu("comboBox_LinhVucTinhToan");

    //Code
    //Lĩnh vực tính toán
    jsonDataUser.DuLieu.LinhVucTinhToan[0].GiaTri = linhVucTinhToan;

    //Nước thải
    if (linhVucTinhToan === 1) {
        for (var i = 0; i < jsonDataUser.DuLieu.NuocThai.length; i++) {
            if (jsonDataUser.DuLieu.NuocThai[i].ID === "soDoCongNghe") {
                jsonDataUser.DuLieu.NuocThai[i].GiaTri = duLieuSoDoCongNghe_NuocThai;
                jsonDataUser.DuLieu.NuocThai[i].CongTrinhDonVi_Tep = congTrinhDaChon;
            }
            else {
                jsonDataUser.DuLieu.NuocThai[i].GiaTri = TuDongLayDuLieu(jsonDataUser.DuLieu.NuocThai[i].ID);
            }
        }
    }
}

//Xoá dữ liệu trong Local Storage
function XoaDuLieuTuLocalStorage() {
    //Biến
    var xacNhan = confirm("Bạn chắc chắn xoá mọi dữ liệu được lưu trên trang web này?");

    //Code
    if (xacNhan) {
        jsonDataUser = "";
        jsonDBNuocThai = "";
        kiemTraThongBaoBiTrung = "";
        localStorage.removeItem("duLieuNguoiDung");
        localStorage.removeItem("duLieuNuocThai");
        localStorage.removeItem("duLieuSoatLoi");

        HienThiThongBao("Dữ liệu đã được xoá thành công!");
        setTimeout(function () { location.reload() }, 250);
    } else {
        HienThiThongBao("Dữ liệu vẫn được giữ an toàn!");
    }
}
//-------------------------------------------------------------III. XỬ LÝ TÍNH TOÁN------------------------------------------------------------------
///=================================================NƯỚC THẢI
//Biến chung
const duongDanDBNuocThai = "./file/DB_NuocThai.json";
var jsonDBNuocThai = "";
var duLieuSoDoCongNghe_NuocThai = "";
var congTrinhDaChon = [];
var taoCongTrinh = "dauVao=>start: Nước thải đầu vào\n", taoDuongVe = "dauVao";

//Biến nồng độ chất ô nhiễm cho nước thải
var nuocThai_BOD5_DauVao;

//Chương trình con
//Ẩn hiện công trình đơn vị cho nước thải
function AnHienCongTrinhDonVi(mangCongTrinh) {
    for (var i = 0; i < jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
        AnDoiTuong(jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].IDSectionHienThi);
    }
    for (var i = 0; i < mangCongTrinh.length; i++) {
        for (var j = 0; j < jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi.length; j++) {
            if (mangCongTrinh[i] === jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[j].ID) {
                DiChuyenCacNode("box_XuLyNuocThai_CongTrinhDonVi", jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[j].IDSectionHienThi);
                HienDoiTuong(jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[j].IDSectionHienThi);
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
        for (var i = 0; i < jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
            bienLuuTam = jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].ID;
            if (bienLuuTam === congTrinh) {
                //Khi tìm được: tạo mảng, tạo ds công trình, tạo đường vẽ, trả về giá trị mặt định cho nút
                congTrinhDaChon.push(bienLuuTam);
                taoCongTrinh = taoCongTrinh + jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri;
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
        for (var i = 0; i < jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi.length; i++) {
            bienLuuTam = jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].ID;
            if (bienLuuTam === congTrinh) {
                //Xoá string công trình
                str1 = taoCongTrinh.slice(0, taoCongTrinh.indexOf(jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri));
                str2 = taoCongTrinh.slice(taoCongTrinh.indexOf(jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri) + jsonDBNuocThai.SoDoCongNghe.CongTrinhDonVi[i].GiaTri.length, taoCongTrinh.length);
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

//Tính toán chính
function TinhToanChoXuLyNuocThai() {
    //Khai báo biến
    var loaiNuocThaiXuLy = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
    var xuLyGopSinhHoat = document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").selectedIndex;

    var jsonSinhHoatKhiGop = [
        {
            "Ten": "pH",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_pH_SH"
        },
        {
            "Ten": "BOD<sub>5</sub>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_BOD5_SH"
        },
        {
            "Ten": "TSS",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TSS_SH"
        },
        {
            "Ten": "TDS",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TDS_SH"
        },
        {
            "Ten": "H<sub>2</sub>S",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_H2S_SH"
        },
        {
            "Ten": "NH<sub>3</sub>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_NH3_SH"
        },
        {
            "Ten": "NO<sub>3</sub><sup>-</sup>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_NO3-_SH"
        },
        {
            "Ten": "Dầu mỡ động, thực vật",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_DMDTV_SH"
        },
        {
            "Ten": "Tổng các chất hoạt động bề mặt",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TCCHDBM_SH"
        },
        {
            "Ten": "PO<sub>4</sub><sup>3-</sup>",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_PO43-_SH"
        },
        {
            "Ten": "Tổng Coliforms",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_TColiforms_SH"
        }
    ];
    var jsonLuuLuongSHGop = [
        {
            "Ten": "Lưu lượng nước thải sinh hoạt - xử lý chung",
            "ID": "input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai_SH"
        }
    ]
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
            "Ten": "5.1 Công nghệ lựa chọn",
            "ID": "comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon"
        }
    ];

    //Gán giá trị nồng độ các chất ô nhiễm
    function NongDoCONDauVao() {
        //Biến
        var kiemTra = document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").style.display;

        //Code
        if (kiemTraTruocKhiTinh === true) {
            if (kiemTra === "none") {
                nuocThai_BOD5_DauVao = TuDongLayDuLieu("input_xuLyNuocThai_ThongThongSoDauVao_BOD5");
            }
            else {
                nuocThai_BOD5_DauVao = TuDongLayDuLieu("input_xuLyNuocThai_ThongThongSoDauVao_BOD5" + "_NongDoHH");
            }
        }
    }

    //Chương trình con
    // Xử lý nồng độ chất ô nhiễm theo hệ số K
    function XuLyHeSoQuyChuan_NuocThai(QCApDung) {
        //Khai báo biến
        var k, kq, kf, bienChiTieu, ketQuaTinh, idNhap;
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
                                ketQuaTinh = jsonDBNuocThai.QCVN.QCVN142008.CotA[bienChiTieu];
                                NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                            } else {
                                ketQuaTinh = Math.round(jsonDBNuocThai.QCVN.QCVN142008.CotA[bienChiTieu] * k);
                                NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                            }
                        } else if (document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex === 2) {
                            //Đối với cột B
                            if (bienChiTieu === "pH" || bienChiTieu === "TColiforms") {
                                ketQuaTinh = jsonDBNuocThai.QCVN.QCVN142008.CotB[bienChiTieu];
                                NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                            } else {
                                ketQuaTinh = Math.round(jsonDBNuocThai.QCVN.QCVN142008.CotB[bienChiTieu] * k);
                                NhapGiaTriChoTextBox(mangIDQuyChuan14[i], ketQuaTinh);
                            }
                        }
                    }
                }
            }

            //Áp dụng cho quy chuẩn 11-MT:2015/BTNMT
            else if (QCApDung === 2) {
                if (KiemTraDuLieuVao(jsonKiemTraQC4011)) {
                    kq = document.getElementById("input_xuLyNuocThai_YeuCauDauRa_HeSoKq").value;
                    kf = document.getElementById("input_xuLyNuocThai_YeuCauDauRa_HeSoKf").value;

                    //Áp dụng cho QCVN 11-MT:2015/BTNMT
                    for (var i = 0; i < jsonDBNuocThai.NTTS.length; i++) {
                        bienChiTieu = jsonDBNuocThai.NTTS[i].ID.slice(jsonDBNuocThai.NTTS[i].ID.lastIndexOf("_") + 1, jsonDBNuocThai.NTTS[i].ID.length);
                        idNhap = jsonDBNuocThai.NTTS[i].ID.replace("ThongThongSoDauVao", "YeuCauDauRa");
                        if (document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex === 3) {
                            //Đối với cột A
                            if (bienChiTieu === "pH" || bienChiTieu === "TColiforms") {
                                ketQuaTinh = jsonDBNuocThai.QCVN.QCVN11MT2015.CotA[bienChiTieu];
                                NhapGiaTriChoTextBox(idNhap, ketQuaTinh);
                            } else {
                                ketQuaTinh = Math.round(jsonDBNuocThai.QCVN.QCVN11MT2015.CotA[bienChiTieu] * kq * kf);
                                NhapGiaTriChoTextBox(idNhap, ketQuaTinh);
                            }
                        } else if (document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex === 4) {
                            //Đối với cột B
                            if (bienChiTieu === "pH" || bienChiTieu === "TColiforms") {
                                ketQuaTinh = jsonDBNuocThai.QCVN.QCVN11MT2015.CotB[bienChiTieu];
                                NhapGiaTriChoTextBox(idNhap, ketQuaTinh);
                            } else {
                                ketQuaTinh = Math.round(jsonDBNuocThai.QCVN.QCVN11MT2015.CotB[bienChiTieu] * kq * kf);
                                NhapGiaTriChoTextBox(idNhap, ketQuaTinh);
                            }
                        }
                    }
                }
            }
        }
    }

    //Xử lý nồng độ ô nhiễm hỗn hợp nước thải
    function XuLyNongDoONhiemGop(loaiNuocThai) {
        //Khai báo biến
        var giaTriNuocThaiChinh, giaTriNuocThaiSH;
        var luuLuongNuocThaiChinh = document.getElementById("input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai").value;
        var luuLuongNuocThaiSH = document.getElementById("input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai_SH").value;
        var tongLuuLuong, ketQua, bienTam;

        //Code
        if (loaiNuocThai === 2) {
            for (var i = 0; i < jsonDBNuocThai.NTTS.length; i++) {
                giaTriNuocThaiChinh = document.getElementById(jsonDBNuocThai.NTTS[i].ID).value;
                try {
                    giaTriNuocThaiSH = document.getElementById(jsonDBNuocThai.NTTS[i].ID + "_SH").value;
                } catch (error) {
                    giaTriNuocThaiSH = 0;
                }
                bienTam = jsonDBNuocThai.NTTS[i].ID.slice(jsonDBNuocThai.NTTS[i].ID.lastIndexOf("_") + 1, jsonDBNuocThai.NTTS[i].ID.length);
                if (bienTam === "pH") {
                    if (So(giaTriNuocThaiSH) < So(giaTriNuocThaiChinh)) {
                        ketQua = giaTriNuocThaiSH + " - " + giaTriNuocThaiChinh;
                    } else {
                        ketQua = giaTriNuocThaiChinh + " - " + giaTriNuocThaiSH;
                    }
                    NhapGiaTriChoTextBox(jsonDBNuocThai.NTTS[i].ID + "_NongDoHH", ketQua);
                } else {
                    tongLuuLuong = So(luuLuongNuocThaiChinh) + So(luuLuongNuocThaiSH);
                    ketQua = ((giaTriNuocThaiSH * luuLuongNuocThaiSH) + (giaTriNuocThaiChinh * luuLuongNuocThaiChinh)) / tongLuuLuong;
                    NhapGiaTriChoTextBox(jsonDBNuocThai.NTTS[i].ID + "_NongDoHH", TuDongLamTronSo(ketQua));
                }
            }
        }
    }

    //Xử lý thông số tính toán
    function XuLyThongSoTinhToan_NuocThai(indexXuLyGop) {
        //Khai báo biến
        var qTongNgayDem, tHoatDong, kMax, kMin, tHeThong;

        //Code
        //6.1 Lưu lượng tính toán ngày đêm
        if (indexXuLyGop === 0) {
            qTongNgayDem = document.getElementById("input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai").value;
            TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTong", qTongNgayDem);
        } else {
            var nuocThaiChinh = document.getElementById("input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai").value;
            var nuocSinhHoat = document.getElementById("input_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai_SH").value;
            qTongNgayDem = So(nuocThaiChinh) + So(nuocSinhHoat);
            TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTong", qTongNgayDem);
        }

        //6.3 Lưu lượng trung bình giờ
        tHoatDong = document.getElementById("input_xuLyNuocThai_ThongSoTinhToan_ThoiGianHoatDong").value;
        TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTrungBinhGio", TuDongLamTronSo(qTongNgayDem / tHoatDong));

        //6.4 Lưu lượng trung bình giây
        TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTrungBinhGiay", TuDongLamTronSo(qTongNgayDem / (tHoatDong * 3600)));

        //6.6 Lưu lượng lớn nhất giây
        kMax = document.getElementById("input_xuLyNuocThai_ThongSoTinhToan_Kmax").value;
        TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongMaxGiay", TuDongLamTronSo((qTongNgayDem * kMax) / (tHoatDong * 3600)));

        //6.6 Lưu lượng nhỏ nhất giây
        kMin = document.getElementById("input_xuLyNuocThai_ThongSoTinhToan_Kmin").value;
        TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongMinGiay", TuDongLamTronSo((qTongNgayDem * kMin) / (tHoatDong * 3600)));

        //6.10 Lưu lượng xử lý giờ của hệ thống
        tHeThong = document.getElementById("input_xuLyNuocThai_ThongSoTinhToan_ThoiGianHoatDongHeThong").value;
        TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongXuLyGio", TuDongLamTronSo(qTongNgayDem / tHeThong));

        //6.11 Lưu lượng xử lý giây của hệ thống
        TuDongNhapDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongXuLyGiay", TuDongLamTronSo(qTongNgayDem / (tHeThong * 3600)));
    }

    //Tính toán cho hố thu
    function XuLyTinhToanHoThu_NuocThai() {
        //Khai báo biến
        var phuongAn = document.getElementById("comboBox_XuLyNuocThai_HoThu_PhuongAn").selectedIndex;
        var jsonKiemTra0 = [
            {
                "Ten": "Hố thu gom | Phương án tính toán",
                "ID": "comboBox_XuLyNuocThai_HoThu_PhuongAn"
            }
        ];
        var jsonKiemTra1 = [
            {
                "Ten": "Hố thu gom | Thời gian lưu nước",
                "ID": "input_xuLyNuocThai_HoThu_ThoiGianLuuNuoc"
            }
        ];

        var jsonKiemTra2 = [
            {
                "Ten": "Hố thu gom | Độ cao ống thoát - mực nước",
                "ID": "input_xuLyNuocThai_HoThu_DoCaoOngThoat"
            },
            {
                "Ten": "Hố thu gom | Độ cao bảo vệ",
                "ID": "input_xuLyNuocThai_HoThu_DoCaoBaoVe"
            },
            {
                "Ten": "Hố thu gom | Độ cao hữu ích",
                "ID": "input_xuLyNuocThai_HoThu_DoCaoHuuIch"
            }
        ];

        var jsonKiemTra3 = [
            {
                "Ten": "Hố thu gom | Dạng hình học",
                "ID": "comboBox_XuLyNuocThai_HoThu_DangHinhHoc"
            }
        ];

        var jsonKiemTra4 = [
            {
                "Ten": "Hố thu gom | Chiều dài",
                "ID": "input_xuLyNuocThai_HoThu_ChieuDai"
            }
        ];

        var jsonKiemTra5 = [
            {
                "Ten": "Hố thu gom | Chiều dài",
                "ID": "input_xuLyNuocThai_HoThu_ChieuDai"
            },
            {
                "Ten": "Hố thu gom | Chiều rộng",
                "ID": "input_xuLyNuocThai_HoThu_ChieuRong"
            }
        ];

        //Chương trình con
        //Tổng độ cao thực tế
        function TongDoCaoThucTe() {
            var hOngThoat = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoOngThoat");
            var hBaoVe = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoBaoVe");
            var hHuuIch = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoHuuIch");

            var hThucTeHoThu = TuDongLamTronSo(So(hOngThoat) + So(hBaoVe) + So(hHuuIch));

            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_DoCaoThucTe", hThucTeHoThu);
        }

        //Thể tích thực tế
        function TheTichThucTe() {
            var lHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_ChieuDai");
            var wHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_ChieuRong");
            var hThucTeHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoThucTe");

            var vThucTeHoThu = TuDongLamTronSo(So(lHoThu) * So(wHoThu) * So(hThucTeHoThu));

            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_TheTichThucTe", vThucTeHoThu);
        }

        //Thể tích hữu ích
        function TheTichHuuIch() {
            var qLonNhatGiay = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongMaxGiay");
            var tLuuNuocHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_ThoiGianLuuNuoc");

            var vHuuIchHoThu = TuDongLamTronSo(So(qLonNhatGiay) * 60 * So(tLuuNuocHoThu));

            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_TheTichHuuIch", vHuuIchHoThu);
        }

        //Suy ra chiều rộng
        function SuyRaChieuRong() {
            var lHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_ChieuDai");
            var vHuuIchHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_TheTichHuuIch");
            var hHuuIch = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoHuuIch");

            var wHoThu = TuDongLamTronSo((So(vHuuIchHoThu) / So(hHuuIch)) / So(lHoThu));

            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_ChieuRong", wHoThu);
        }

        //Suy ra chiều dài và rộng - hình vuông
        function SuyRaChieuDaiVaRong() {
            var vHuuIchHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_TheTichHuuIch");
            var hHuuIch = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoHuuIch");

            var lHoThu = TuDongLamTronSo(Math.sqrt(So(vHuuIchHoThu / So(hHuuIch))));

            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_ChieuDai", lHoThu);
            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_ChieuRong", lHoThu);
        }

        //Suy ra đường kính - hình tròn
        function SuyRaDuongKinh() {
            var vHuuIchHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_TheTichHuuIch");
            var hHuuIch = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoHuuIch");
            var hThucTeHoThu = TuDongLayDuLieu("input_xuLyNuocThai_HoThu_DoCaoThucTe");

            var dHoThu = TuDongLamTronSo(Math.sqrt((4 / Math.PI) * (So(vHuuIchHoThu) / So(hHuuIch))));
            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_DuongKinh", dHoThu);

            var vThucTeHoThu = TuDongLamTronSo(Math.PI * Math.pow((dHoThu / 2), 2) * So(hThucTeHoThu));
            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_TheTichThucTe", vThucTeHoThu);
        }

        //Tính lưu lượng bơm của hố thu
        function LuuLuongBomChim() {
            var luuLuongm3GiayLonNhat = So(TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongMaxGiay"));

            //Lưu lượng lít/phút
            var luuLuongBomLitPhut = TuDongLamTronSo(luuLuongm3GiayLonNhat * 60 * 1000);
            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_LuuLuongBom_LitPhut", luuLuongBomLitPhut);

            //Lưu lượng m3/giờ
            var luuLuongBomm3Gio = TuDongLamTronSo(luuLuongm3GiayLonNhat * 3600);
            TuDongNhapDuLieu("input_xuLyNuocThai_HoThu_LuuLuongBom_m3gio", luuLuongBomm3Gio);
        }

        //Code
        if (kiemTraTruocKhiTinh === true) {
            if (KiemTraDuLieuVao(jsonKiemTra0)) {
                //Tự nhập
                if (phuongAn === 1) {
                    if (KiemTraDuLieuVao(jsonKiemTra2)) {
                        TongDoCaoThucTe();
                        if (KiemTraDuLieuVao(jsonKiemTra5)) {
                            TheTichThucTe();
                        }
                    }
                }

                //Tính từ thời gian lưu
                else if (phuongAn === 2) {
                    if (KiemTraDuLieuVao(jsonKiemTra1)) {
                        TheTichHuuIch();

                        if (KiemTraDuLieuVao(jsonKiemTra2)) {
                            TongDoCaoThucTe();

                            if (KiemTraDuLieuVao(jsonKiemTra3)) {
                                //Hình chữ nhật
                                if (TuDongLayDuLieu("comboBox_XuLyNuocThai_HoThu_DangHinhHoc") === 2) {
                                    if (KiemTraDuLieuVao(jsonKiemTra4)) {
                                        SuyRaChieuRong();
                                        TheTichThucTe();
                                    }
                                }

                                //Hình vuông
                                else if (TuDongLayDuLieu("comboBox_XuLyNuocThai_HoThu_DangHinhHoc") === 1) {
                                    SuyRaChieuDaiVaRong();
                                    TheTichThucTe();
                                }

                                //Hình trụ tròn
                                else {
                                    SuyRaDuongKinh();
                                }
                            }
                        }
                    }
                }
                LuuLuongBomChim();
            }
        }
    }

    //Tính toán bể điều hoà
    function TinhToanBeDieuHoa_NuocThai() {
        //Khai báo biến
        var hinhDangBe, dangKhuayTron, loaiKhechTan;
        var jsonKiemTra0 = [
            {
                "Ten": "Bể điều hoà | Độ cao hữu ích",
                "ID": "input_xuLyNuocThai_DieuHoa_DoCaoHuuIch"
            },
            {
                "Ten": "Bể điều hoà | Độ cao bảo vệ",
                "ID": "input_xuLyNuocThai_DieuHoa_DoCaoBaove"
            }
        ];
        var jsonKiemTra1 = [
            {
                "Ten": "Bể điều hoà | Hình dạng bể",
                "ID": "comboBox_XuLyNuocThai_DieuHoa_HinhDangBe"
            }
        ];
        var jsonKiemTra2 = [
            {
                "Ten": "Bể điều hoà | Chiều dài",
                "ID": "input_xuLyNuocThai_DieuHoa_ChieuDai_HinhChuNhat"
            }
        ];
        var jsonKiemTra3 = [
            {
                "Ten": "Bể điều hoà | Hệ số vượt tải",
                "ID": "input_xuLyNuocThai_DieuHoa_HeSoVuotTai"
            }
        ];

        var jsonKiemTra4 = [
            {
                "Ten": "Bể điều hoà | Dạng khuấy trộn",
                "ID": "comboBox_XuLyNuocThai_DieuHoa_DangKhuayTron"
            }
        ];

        var jsonKiemTra5 = [
            {
                "Ten": "Bể điều hoà | Công suất cung cấp mỗi cho mỗi m<sup>3</sup> nước thải",
                "ID": "input_xuLyNuocThai_DieuHoa_CoKhi_CongSuatMoiM3Nuoc"
            }
        ];

        var jsonKiemTra6 = [
            {
                "Ten": "Bể điều hoà | Tốc độ khí nén cung cấp",
                "ID": "input_xuLyNuocThai_DieuHoa_KhiNen_TocDoKhiNenCungCap"
            }
        ];

        var jsonKiemTra7 = [
            {
                "Ten": "Bể điều hoà | Loại khuếch tán khí",
                "ID": "comboBox_XuLyNuocThai_DieuHoa_KhiNen_LoaiKhechTan"
            }
        ];

        var jsonKiemTra8 = [
            {
                "Ten": "Bể điều hoà | Lưu lượng khí trên mỗi ống (cái)",
                "ID": "input_xuLyNuocThai_DieuHoa_KhiNen_OngPhanPhoi_LuongKhiTrenMoiOng"
            }
        ];

        var jsonKiemTra9 = [
            {
                "Ten": "Bể điều hoà | Lưu lượng khí trên mỗi đĩa",
                "ID": "input_xuLyNuocThai_DieuHoa_KhiNen_DiaPhanPhoi_LuongKhiTrenMoiDia"
            }
        ];

        //Code
        //tính toán thời gian lưu
        function ThoiGianLuu() {
            var tHoatDong = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_ThoiGianHoatDong");
            var tHeThong = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_ThoiGianHoatDongHeThong");

            var tLuuDieuHoa = So(tHeThong) - So(tHoatDong);
            if (tLuuDieuHoa === 0) {
                TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_ThoiGianLuu", 8);
            } else {
                TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_ThoiGianLuu", tLuuDieuHoa);
            }
        }

        //Thể tích hữu ích lý thuyết
        function TheTichHuuIchLyThuyet() {
            var qXuLyGio = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongXuLyGio");
            var tLuuDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_ThoiGianLuu");

            var vHuuIchDieuHoaLyThuyet = TuDongLamTronSo(So(qXuLyGio) * So(tLuuDieuHoa));
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIchLyThuyet", vHuuIchDieuHoaLyThuyet);
        }

        //Thể tích hữu ích
        function TheTichHuuIch() {
            var vHuuIchDieuHoaLyThuyet = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIchLyThuyet");
            var kHeSoVuotTai = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_HeSoVuotTai");

            var vHuuIchDieuHoa = TuDongLamTronSo(So(vHuuIchDieuHoaLyThuyet) * So(kHeSoVuotTai));
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIch", vHuuIchDieuHoa);
        }

        //Tổng độ cao thực tế
        function TongDoCaoThucTe() {
            var hHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoHuuIch");
            var hBaoVeDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoBaove");

            var hThucTeDieuHoa = So(hHuuIchDieuHoa) + So(hBaoVeDieuHoa);
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoThucTe", hThucTeDieuHoa);
        }

        //Hình chữ nhật
        function HinhChuNhat() {
            var lDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_ChieuDai_HinhChuNhat");
            var vHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIch");
            var hHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoHuuIch");

            var wDieuHoa = TuDongLamTronSo((So(vHuuIchDieuHoa) / So(hHuuIchDieuHoa)) / lDieuHoa);
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_ChieuRong_HinhChuNhat", wDieuHoa);
        }

        //Hình vuông
        function HinhVuong() {
            var vHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIch");
            var hHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoHuuIch");

            var lDieuHoa = TuDongLamTronSo(Math.sqrt(So(vHuuIchDieuHoa) / So(hHuuIchDieuHoa)));
            var wDieuHoa = lDieuHoa;
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_ChieuDai_HinhVuong", lDieuHoa);
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_ChieuRong_HinhVuong", wDieuHoa);
        }

        //Hình tròn
        function HinhTron() {
            var vHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIch");
            var hHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoHuuIch");

            var dDieuHoa = TuDongLamTronSo(Math.sqrt((4 / Math.PI) * (So(vHuuIchDieuHoa) / So(hHuuIchDieuHoa))));
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_DuongKinh_HinhTron", dDieuHoa);
        }

        //Thể tích thực tế
        function TheTichThucTe(loaiHinhHoc) {
            //Hình tròn bằng true
            if (loaiHinhHoc === "Tron") {
                var dDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DuongKinh_HinhTron");
                var hThucTeDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoThucTe");

                var vThucTeDieuHoa = TuDongLamTronSo(Math.PI * Math.pow(So(dDieuHoa / 2), 2) * So(hThucTeDieuHoa));
                TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_TheTichThucTe", vThucTeDieuHoa);
            }

            //Hình chữ nhật
            else if (loaiHinhHoc === "ChuNhat") {
                var hThucTeDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoThucTe");
                var wDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_ChieuDai_HinhChuNhat");
                var lDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_ChieuRong_HinhChuNhat");

                var vThucTeDieuHoa = TuDongLamTronSo(So(hThucTeDieuHoa) * So(wDieuHoa) * So(lDieuHoa));
                TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_TheTichThucTe", vThucTeDieuHoa);
            }

            //Hình vuông
            else if (loaiHinhHoc === "Vuong") {
                var hThucTeDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_DoCaoThucTe");
                var wDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_ChieuDai_HinhVuong");
                var lDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_ChieuRong_HinhVuong");

                var vThucTeDieuHoa = TuDongLamTronSo(So(hThucTeDieuHoa) * So(wDieuHoa) * So(lDieuHoa));
                TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_TheTichThucTe", vThucTeDieuHoa);
            }
        }

        //Công suất thiết bị khuấy trộn
        function CongSuatMayKhuayTron() {
            var pCungCap = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_CoKhi_CongSuatMoiM3Nuoc");
            var vHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIch");

            var pKhuayTronkW = TuDongLamTronSo((So(pCungCap) * So(vHuuIchDieuHoa)) / 1000);
            var pKhuayTronHP = TuDongLamTronSo((pKhuayTronkW * 1.34102));
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_CoKhi_CongSuatThietBiKhuay_KW", pKhuayTronkW);
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_CoKhi_CongSuatThietBiKhuay_HP", pKhuayTronHP);
        }

        //Lượng khí nén cần thiết
        function LuongKhiNenCanThiet() {
            var vHuuIchDieuHoa = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_TheTichHuuIch");
            var vKhiNen = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_TocDoKhiNenCungCap");

            var qKhiNen = TuDongLamTronSo(So(vHuuIchDieuHoa) * So(vKhiNen));
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_LuongKhiNenKhuayTron", qKhiNen);
        }

        //Số ống phân phối cần thiết
        function SoOngPhanPhoi() {
            var qKhiNen = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_LuongKhiNenKhuayTron");
            var qKhiOng = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_OngPhanPhoi_LuongKhiTrenMoiOng");

            var nOng = So(qKhiNen) / So(qKhiOng);
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_OngPhanPhoi_SoLuongOng", nOng.toFixed(0));
        }

        //Số đĩa phân phối cần thiết
        function SoDiaPhanPhoi() {
            var qKhiNen = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_LuongKhiNenKhuayTron");
            var qKhiDia = TuDongLayDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_DiaPhanPhoi_LuongKhiTrenMoiDia");

            var nDia = So(qKhiNen) / So(qKhiDia);
            TuDongNhapDuLieu("input_xuLyNuocThai_DieuHoa_KhiNen_DiaPhanPhoi_SoLuongDia", nDia.toFixed(0));
        }




        //Thông số, kích thước
        if (kiemTraTruocKhiTinh === true) {
            ThoiGianLuu();
            TheTichHuuIchLyThuyet();
            if (KiemTraDuLieuVao(jsonKiemTra3)) {
                TheTichHuuIch();
                if (KiemTraDuLieuVao(jsonKiemTra0)) {
                    TongDoCaoThucTe();
                    if (KiemTraDuLieuVao(jsonKiemTra1)) {
                        hinhDangBe = TuDongLayDuLieu("comboBox_XuLyNuocThai_DieuHoa_HinhDangBe");

                        //hình chữ nhật
                        if (hinhDangBe === 1) {
                            if (KiemTraDuLieuVao(jsonKiemTra2)) {
                                HinhChuNhat();
                                TheTichThucTe("ChuNhat");
                            }
                        }

                        //Hình vuông
                        else if (hinhDangBe === 2) {
                            HinhVuong();
                            TheTichThucTe("Vuong");
                        }

                        //Hình tròn
                        else if (hinhDangBe === 3) {
                            HinhTron();
                            TheTichThucTe("Tron");
                        }
                    }
                }
            }
        }

        //Máy móc, thiết bị
        if (kiemTraTruocKhiTinh === true) {
            if (KiemTraDuLieuVao(jsonKiemTra4)) {
                dangKhuayTron = TuDongLayDuLieu("comboBox_XuLyNuocThai_DieuHoa_DangKhuayTron");

                //Khuấy trộn cơ khí
                if (dangKhuayTron === 1) {
                    if (KiemTraDuLieuVao(jsonKiemTra5)) {
                        CongSuatMayKhuayTron();
                    }
                }

                //Khuấy trộn khí nén
                if (dangKhuayTron === 2) {
                    if (KiemTraDuLieuVao(jsonKiemTra6)) {
                        LuongKhiNenCanThiet();
                        if (KiemTraDuLieuVao(jsonKiemTra7)) {
                            loaiKhechTan = TuDongLayDuLieu("comboBox_XuLyNuocThai_DieuHoa_KhiNen_LoaiKhechTan");

                            //Ống phân phối khí
                            if (loaiKhechTan === 1) {
                                if (KiemTraDuLieuVao(jsonKiemTra8)) {
                                    SoOngPhanPhoi();
                                }
                            }

                            //Đĩa phân phối khí
                            else if (loaiKhechTan === 2) {
                                if (KiemTraDuLieuVao(jsonKiemTra9)) {
                                    SoDiaPhanPhoi();
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //Tính toán bể bùn hoạt tính
    function NuocThai_BeBunHoatTinh() {
        //Biến
        var phuongAnTheTich, hinhDangBe;
        var jsonKiemTra0 = [
            {
                "Ten": "Bể hiếu khí | Phương án xác định thể tích",
                "ID": "comboBox_XuLyNuocThai_HieuKhi_PhuongAnTheTich"
            }
        ];
        var jsonKiemTra1 = [
            {
                "Ten": "Bể hiếu khí | Tỉ lệ các chất phân huỷ sinh học trong SS sau xử lý",
                "ID": "input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_TiLePhanHuySinhHocSS"
            }
        ];
        var jsonKiemTra2 = [
            {
                "Ten": "Bể hiếu khí | Nhiệt độ trung bình khu vực tính toán",
                "ID": "input_xuLyNuocThai_HieuKhi_NhietDoKhuVuc"
            },
            {
                "Ten": "Bể hiếu khí | Thời gian lưu vi khuẩn (bùn)",
                "ID": "input_xuLyNuocThai_HieuKhi_ThoiGianLuuViKhuan"
            },
            {
                "Ten": "Bể hiếu khí | Nồng độ các chất lơ lửng dễ bay hơi trong hỗn hợp bùn hoạt tính",
                "ID": "input_xuLyNuocThai_HieuKhi_MLVSS"
            },
            {
                "Ten": "Bể hiếu khí | Hệ số sản lượng bùn",
                "ID": "input_xuLyNuocThai_HieuKhi_HeSoSanLuongBun"
            },
            {
                "Ten": "Bể hiếu khí | Hệ số phân huỷ nội bào (ở 20 độ C)",
                "ID": "input_xuLyNuocThai_HieuKhi_HeSoPhanHuyNoiBao20Do"
            },
            {
                "Ten": "Bể hiếu khí | Hệ số điều chỉnh kd theo nhiệt độ",
                "ID": "input_xuLyNuocThai_HieuKhi_HeSoDieuChinhKd"
            }
        ];
        var jsonKiemTra3 = [
            {
                "Ten": "Bể hiếu khí | Thời gian lưu nước trong bể",
                "ID": "input_xuLyNuocThai_HieuKhi_ThoiGianLuuNuoc_ThoiGianLuu"
            }
        ];
        var jsonKiemTra4 = [
            {
                "Ten": "Bể hiếu khí | Độ tro của bùn",
                "ID": "input_xuLyNuocThai_HieuKhi_DoTroCuaBun"
            }
        ];
        //Chương trình con
        //SS và BOD5 quy chuẩn
        function SSBOD5CanDat_QCVN() {
            var nuocThai_SS_QuyChuan = TuDongLayDuLieu("input_xuLyNuocThai_YeuCauDauRa_TSS");
            var nuocThai_BOD5_QuyChuan = TuDongLayDuLieu("input_xuLyNuocThai_YeuCauDauRa_BOD5");

            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_SSQuyChuan", nuocThai_SS_QuyChuan);
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BOD5QuyChuan", nuocThai_BOD5_QuyChuan);
        }

        //Nồng độ SS và BOD5 sau xử lý ước tính
        function SSBOD5_SauXuLy() {
            var nuocThai_SS_QuyChuan = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_SSQuyChuan");
            var nuocThai_BOD5_QuyChuan = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BOD5QuyChuan");

            var ss_SauXuLy = TuDongLamTronSo(0.68 * So(nuocThai_SS_QuyChuan));
            var bod5_SauXuLy = TuDongLamTronSo(0.92 * So(nuocThai_BOD5_QuyChuan));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_SSSauXuLy", ss_SauXuLy);
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BOD5SauXuLy", bod5_SauXuLy);
        }

        //BOD hoà tan tối đa
        function LuongBODHoaTanToiDa() {
            var ssSauXuLy = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_SSSauXuLy");
            var bod5SauXuLy = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BOD5SauXuLy");
            var rPhanHuySinhHocSS = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_TiLePhanHuySinhHocSS");

            var bodHoaTanSauXL = TuDongLamTronSo(So(bod5SauXuLy) - (So(ssSauXuLy) * (So(rPhanHuySinhHocSS) / 100) * 1.42 * 0.68));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BODHoaTanSauXuLy", bodHoaTanSauXL);

        }

        //hệ số phân huỷ nội bào theo nhiệt độ khu vực
        function HeSoPhanHuyNoiBaoONhietDoKhuVuc() {
            var tKhuVuc = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_NhietDoKhuVuc");
            var kd20 = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_HeSoPhanHuyNoiBao20Do");
            var cDieuChinhKd = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_HeSoDieuChinhKd");

            var kd = TuDongLamTronSo(So(kd20) * Math.pow(So(cDieuChinhKd), So(tKhuVuc) - 20));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_HeSoPhanHuyNoiBaoKhuVuc", kd);
        }

        //Thể tích bể hiếu khí
        function TheTichBeHieuKhi(phuongAn) {
            //Code
            //ThờI gian lưu vi khuẩn
            if (phuongAn === "viKhuan") {
                //Thể tích
                var qTongNgayDem = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTong");
                var thetaC = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuViKhuan");
                var y = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_HeSoSanLuongBun");
                var bod5DauVao = nuocThai_BOD5_DauVao;
                var bodHoaTanSauXL = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BODHoaTanSauXuLy");
                var x = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_MLVSS");
                var kd = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_HeSoPhanHuyNoiBaoKhuVuc");

                var vHuuIchHieuKhi = TuDongLamTronSo((So(qTongNgayDem) * So(thetaC) * So(y) * (So(bod5DauVao) - So(bodHoaTanSauXL))) / (So(x) * (1 + (So(kd) * So(thetaC)))));
                TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch", vHuuIchHieuKhi);
            }

            //Thời gian lưu nước
            else if (phuongAn === "nuoc") {
                var qXuLyGio = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongXuLyGio");
                var tLuuHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuNuoc_ThoiGianLuu");

                var vHuuIchHieuKhi = TuDongLamTronSo(So(qXuLyGio) * So(tLuuHieuKhi));
                TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch", vHuuIchHieuKhi);
            }
        }

        //Thời gian lưu tồn nước tính toán - phương án thời gian lưu vi khuẩn
        function ThoiGianLuuNuoc_TinhLai() {
            var vHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch");
            var qXuLyGio = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongXuLyGio");

            var tLuuHieuKhi = TuDongLamTronSo(So(vHuuIchHieuKhi) / So(qXuLyGio));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuu", tLuuHieuKhi);
        }

        //Tỉ lệ F/M
        function TiLeFM() {
            var qTongNgayDem = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTong");
            var bod5DauVao = nuocThai_BOD5_DauVao;
            var vHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch");
            var x = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_MLVSS");

            var fmHieuKhi = TuDongLamTronSo((So(qTongNgayDem) * So(bod5DauVao)) / (So(vHuuIchHieuKhi) * So(x)));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TiLeFM", fmHieuKhi);
        }

        //Tải nạp chất hữu cơ theo thể tích bể
        function TaiNapChatHuuCo() {
            var qTongNgayDem = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTong");
            var bod5DauVao = nuocThai_BOD5_DauVao;
            var vHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch");

            var lBOD = TuDongLamTronSo((So(qTongNgayDem) * So(bod5DauVao)) / (So(vHuuIchHieuKhi) * 1000));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TaiNapChatHuuCo", lBOD);
        }

        //Lượng bùn dư thải bỏ mỗi ngày
        function LuongBunDuMoiNgay() {
            var bodHoaTanSauXL = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_BODHoaTanSauXuLy");
            var thetaC = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuViKhuan");
            var y = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_HeSoSanLuongBun");
            var kd = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_HeSoPhanHuyNoiBaoKhuVuc");
            var qTongNgayDem = TuDongLayDuLieu("input_xuLyNuocThai_ThongSoTinhToan_LuuLuongTong");
            var bod5DauVao = nuocThai_BOD5_DauVao;
            var rTroBun = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoTroCuaBun");
            var ssSauXuLy = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ThoiGianLuuVK_SSSauXuLy");

            var yOBS = (So(y)) / (1 + (So(kd) * So(thetaC)));
            var pX = So(qTongNgayDem) * yOBS * (So(bod5DauVao) - So(bodHoaTanSauXL)) * 0.001;
            var pBun = pX / ((100 - So(rTroBun)) / 100);
            var wBunThaiMoiNgay = TuDongLamTronSo(pBun - (So(qTongNgayDem) * So(ssSauXuLy) * 0.001));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_LuongBunThaiMoiNgay", wBunThaiMoiNgay);
        }





        //Hình chữ nhật
        function HinhChuNhat() {
            var lHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ChieuDai_HinhChuNhat");
            var vHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch");
            var hHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoCaoHuuIch");

            var wHieuKhi = TuDongLamTronSo((So(vHuuIchHieuKhi) / So(hHuuIchHieuKhi)) / lHieuKhi);
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ChieuRong_HinhChuNhat", wHieuKhi);
        }

        //Hình vuông
        function HinhVuong() {
            var vHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch");
            var hHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoCaoHuuIch");

            var lHieuKhi = TuDongLamTronSo(Math.sqrt(So(vHuuIchHieuKhi) / So(hHuuIchHieuKhi)));
            var wHieuKhi = lHieuKhi;
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ChieuDai_HinhVuong", lHieuKhi);
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_ChieuRong_HinhVuong", wHieuKhi);
        }

        //Hình tròn
        function HinhTron() {
            var vHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_TheTichHuuIch");
            var hHuuIchHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoCaoHuuIch");

            var dHieuKhi = TuDongLamTronSo(Math.sqrt((4 / Math.PI) * (So(vHuuIchHieuKhi) / So(hHuuIchHieuKhi))));
            TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_DuongKinh_HinhTron", dHieuKhi);
        }

        //Thể tích thực tế
        function TheTichThucTe(loaiHinhHoc) {
            //Hình tròn bằng true
            if (loaiHinhHoc === "Tron") {
                var dHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DuongKinh_HinhTron");
                var hThucTeHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoCaoThucTe");

                var vThucTeHieuKhi = TuDongLamTronSo(Math.PI * Math.pow(So(dHieuKhi / 2), 2) * So(hThucTeHieuKhi));
                TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TheTichThucTe", vThucTeHieuKhi);
            }

            //Hình chữ nhật
            else if (loaiHinhHoc === "ChuNhat") {
                var hThucTeHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoCaoThucTe");
                var wHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ChieuRong_HinhChuNhat");
                var lHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ChieuDai_HinhChuNhat");

                var vThucTeHieuKhi = TuDongLamTronSo(So(hThucTeHieuKhi) * So(wHieuKhi) * So(lHieuKhi));
                TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TheTichThucTe", vThucTeHieuKhi);
            }

            //Hình vuông
            else if (loaiHinhHoc === "Vuong") {
                var hThucTeHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_DoCaoThucTe");
                var wHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ChieuRong_HinhVuong");
                var lHieuKhi = TuDongLayDuLieu("input_xuLyNuocThai_HieuKhi_ChieuDai_HinhVuong");

                var vThucTeHieuKhi = TuDongLamTronSo(So(hThucTeHieuKhi) * So(wHieuKhi) * So(lHieuKhi));
                TuDongNhapDuLieu("input_xuLyNuocThai_HieuKhi_TheTichThucTe", vThucTeHieuKhi);
            }
        }

        //Code
        //Thông số, kích thước
        if (kiemTraTruocKhiTinh === true) {
            if (KiemTraDuLieuVao(jsonKiemTra0)) {
                //SS và BOD5 quy chuẩn
                SSBOD5CanDat_QCVN();

                //Nồng độ SS và BOD5 sau xử lý ước tính
                SSBOD5_SauXuLy();

                if (KiemTraDuLieuVao(jsonKiemTra1)) {
                    //BOD hoà tan tối đa
                    LuongBODHoaTanToiDa();

                    if (KiemTraDuLieuVao(jsonKiemTra2)) {
                        phuongAnTheTich = TuDongLayDuLieu("comboBox_XuLyNuocThai_HieuKhi_PhuongAnTheTich");
                        HeSoPhanHuyNoiBaoONhietDoKhuVuc();

                        //Theo thời gian lưu vi khuẩn
                        if (phuongAnTheTich === 1) {
                            TheTichBeHieuKhi("viKhuan");

                            ThoiGianLuuNuoc_TinhLai();
                        }

                        //Theo thời gian lưu nước
                        else if (phuongAnTheTich === 2) {
                            if (KiemTraDuLieuVao(jsonKiemTra3)) {
                                TheTichBeHieuKhi("nuoc");
                            }
                        }
                    }

                }

            }
        }

        //Tiếp tục tính toán
        if (kiemTraTruocKhiTinh === true) {
            //Tỉ lệ F/M
            TiLeFM();

            //Tải nạp chất hữu cơ theo thể tích bể
            TaiNapChatHuuCo();

            if (KiemTraDuLieuVao(jsonKiemTra4)) {
                //Lượng bùn dư mỗi ngày
                LuongBunDuMoiNgay();

                if (KiemTraDuLieuVao(jsonKiemTra5)) {
                    //Lượng bùn thải bỏ hằNg ngày
                    LuongBunThaiBoHangNgay();

                    //Thời gian vận hành không thải bỏ bùn
                    ThoiGianVanHanhKhongThaiBun();

                    //Lưu luọng bùn hoàn lưu
                    LuuLuongBunHoanLuu();

                    if (KiemTraDuLieuVao(jsonKiemTra6)) {
                        TongDoCaoThucTe();

                        if (KiemTraDuLieuVao(jsonKiemTra7)) {
                            hinhDangBe = TuDongLayDuLieu("comboBox_XuLyNuocThai_HieuKhi_HinhDangBe");

                            //hình chữ nhật
                            if (hinhDangBe === 1) {
                                if (KiemTraDuLieuVao(jsonKiemTra8)) {
                                    HinhChuNhat();
                                    TheTichThucTe("ChuNhat");
                                }
                            }

                            //Hình vuông
                            else if (hinhDangBe === 2) {
                                HinhVuong();
                                TheTichThucTe("Vuong");
                            }

                            //Hình tròn
                            else if (hinhDangBe === 3) {
                                HinhTron();
                                TheTichThucTe("Tron");
                            }
                        }
                    }
                }
            }

        }


        //Máy móc, thiết bị
        if (kiemTraTruocKhiTinh === true) {

        }
    }

    //Code
    //Xử lý tính toán II -> IV
    if (KiemTraDuLieuVao(jsonKiemTra)) {
        //Xử lý riêng lẻ
        if (xuLyGopSinhHoat === 0) {
            //Đối với nước thải sinh hoạt
            if (loaiNuocThaiXuLy === 1) {
                if (KiemTraDuLieuVao(jsonDBNuocThai.NTSH)) {
                    XuLyHeSoQuyChuan_NuocThai(1);
                }
            }

            //Đối với nước thải thuỷ sản
            if (loaiNuocThaiXuLy === 2) {
                if (KiemTraDuLieuVao(jsonDBNuocThai.NTTS)) {
                    XuLyHeSoQuyChuan_NuocThai(2);
                }
            }
        }

        //Xử lý gộp với sinh hoạt
        else if (xuLyGopSinhHoat === 1 && KiemTraDuLieuVao(jsonLuuLuongSHGop) && KiemTraDuLieuVao(jsonSinhHoatKhiGop)) {
            if (loaiNuocThaiXuLy === 2) {
                if (KiemTraDuLieuVao(jsonDBNuocThai.NTTS)) {
                    XuLyNongDoONhiemGop(2);
                    XuLyHeSoQuyChuan_NuocThai(2);
                }
            }
        }
    }

    //Xử lý V
    if (kiemTraTruocKhiTinh === true) {
        if (KiemTraDuLieuVao(jsonKiemTraCongNgheLuaChon)) {
        }
    }

    //Xử lý tính toán VI
    if (kiemTraTruocKhiTinh === true) {
        if (KiemTraDuLieuVao(jsonDBNuocThai.ThongSoTinhToan)) {
            XuLyThongSoTinhToan_NuocThai(xuLyGopSinhHoat);
        }
    }

    //Gán nồng độ chất ô nhiễm đầu vào cho biến
    NongDoCONDauVao();


    //Hố thu
    /* XuLyTinhToanHoThu_NuocThai(); */

    //Bể điều hoà
    /* TinhToanBeDieuHoa_NuocThai(); */

    //Bể bùn hoạt tính
    /* NuocThai_BeBunHoatTinh(); */
}

//=================================================NƯỚC CẤP
//3.2 Tính toán cho xử lý nước cấp
function TinhToanChoXuLyNuocCap() {

}

//=================================================KHÍ THẢI
//3.3 Tính toán cho xử lý khí thải
function TinhToanChoXuLyKhiThai() {

}

//=================================================CHẤT THẢI RẮN
//3.4 Tính toán cho xử lý chất thải rắn
function TinhToanChoXuLyChatThaiRan() {

}

//-----------------------------------------------------------IV. XỬ LÝ BẮT SỰ KIỆN-----------------------------------------------------------------------
//4.1 Xử lý chung
//Xử lý chính
function XuLySuKienChinh() {
    //0 Nhấn nút tính toán
    document.getElementById("btn_calculator").addEventListener("click", function () {
        //Khai báo biến
        var index = document.getElementById("comboBox_LinhVucTinhToan").selectedIndex;
        var jsonKiemTraDauVao = [{
            "Ten": "1.1 Lĩnh vực cần tính toán cho môi trường",
            "ID": "comboBox_LinhVucTinhToan",
        }]

        //Code
        //Không hiển thị thông báo lỗi
        anHienThongBaoSoatLoi = true;
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

        //Hiển thị dữ liệu trên console
        console.log(jsonDataUser);
    });
    //1 Xử lý file tải lên
    document.getElementById("upload_TaiLenTepDuLieu").addEventListener("change", function () {
        //Khai báo biến
        var reader = new FileReader();

        //Code
        reader.addEventListener("load", function () {
            var result = JSON.parse(reader.result);
            jsonDataUser = result;
            HienThiThongBao("Tải lên tệp tin thành công!");
        });
        reader.readAsText(document.getElementById("upload_TaiLenTepDuLieu").files[0]);

        //Hiển thị tên file tải lên
        var tenTep = document.getElementById("upload_TaiLenTepDuLieu").value;
        tenTep = tenTep.split("\\").pop();
        document.getElementById("tenTepTaiLen").innerText = tenTep;
    });
    //2 Xử lý trùng tên file - xoá file cũ trước khi tải lên file mới
    document.getElementById("upload_TaiLenTepDuLieu").addEventListener("click", function () {
        document.getElementById("upload_TaiLenTepDuLieu").value = "";
        document.getElementById("tenTepTaiLen").innerText = "...";
    });

    //3 Lĩnh vực tính toán
    document.getElementById("comboBox_LinhVucTinhToan").addEventListener("change", function () {
        AnHienThongTinTheoLinhVucTinhToan();
    });

    //4 Xử lý nút cập nhật dữ liệu vào chương trình
    document.getElementById("btn_CapNhatDuLieuTuFile").addEventListener("click", function () {
        //Khai báo biến

        //Chương trình con
        function KiemTraUpload() {
            var kiemTra = document.getElementById("upload_TaiLenTepDuLieu").value;
            if (kiemTra === "") {
                document.getElementById("nhapTepDuLieu").style.borderColor = "red";
                return false;
            } else {
                document.getElementById("nhapTepDuLieu").style.borderColor = "#ced4da";
                return true;
            }
        }

        //Code
        if (KiemTraUpload()) {
            NapDuLieuChoWebTuLocalStorageVaFile();
            document.getElementById("btn_calculator").click();
            /*  LuuDuLieuVaoLocalStorage(); */
            HienThiThongBao("Đã cập nhật dữ liệu từ tệp thành công!");
        } else {
            HienThiThongBao("Chưa có tệp được tải lên, vui lòng kiểm tra lại!");
        }
    });

    //5 Xử lý nút tải xuống file dữ liệu
    document.getElementById("btn_TaiXuongTepDuLieu").addEventListener("click", function () {
        //Biến
        var tenFile = document.getElementById("input_TenFileTaiXuong").value;
        var jsonKiemTra0 = [
            {
                "Ten": "Xuất tệp dữ liệu | Tên tệp",
                "ID": "input_TenFileTaiXuong"
            }
        ];
        //Chương trình con
        function download(filename, text) {
            //Tạo link
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            //Ẩn hiển thị
            element.style.display = 'none';
            document.body.appendChild(element);

            //Click
            element.click();

            //Loại bỏ
            document.body.removeChild(element);
        }

        //Code
        //Cập nhật lần cuối trước khi tải
        TuDongCapNhatThayDoiVaoJsonCore();
        LuuDuLieuVaoLocalStorage();

        //Tiến hành tải xuống
        if (KiemTraDuLieuVao(jsonKiemTra0)) {
            download(tenFile + ".json", JSON.stringify(jsonDataUser));
            HienThiThongBao("Tải xuống thành công");
        } else {
            HienThiThongBao("Vui lòng nhập tên tệp!");
        }
    });

    //6 Xoá dữ liệu lưu trữ
    document.getElementById("btn_XoaLocalStorage").addEventListener("click", function () {
        XoaDuLieuTuLocalStorage();
    });

    //7 Soát lỗi nhập dữ liệu
    document.getElementById("btn_KiemTraLoi").addEventListener("click", function () {
        var thongBaoLoi = kiemTraThongBaoBiTrung.slice(kiemTraThongBaoBiTrung.indexOf("@") + 1, kiemTraThongBaoBiTrung.length);
        if (thongBaoLoi !== "" && kiemTraTruocKhiTinh === false) {
            HienThiThongBao(thongBaoLoi);
        } else {
            HienThiThongBao("Không phát hiện lỗi!");
        }
    });
}

//Xử lý cho nước thải
function XuLySuKien_NuocThai() {
    //1 - Ẩn hiện thông tin loại nước thải
    document.getElementById("comboBox_XuLyNuocThai").addEventListener("change", function () {
        //Khai báo biến
        var loaiNuocThai = document.getElementById("comboBox_XuLyNuocThai");

        //Ẩn hiện thông tin
        document.getElementById("title_xuLyNuocThai_ThongThongSoDauVao_LoaiNuoc1").innerText = loaiNuocThai.options[loaiNuocThai.selectedIndex].text;
        document.getElementById("title_xuLyNuocThai_ThongThongSoDauVao_LuuLuongChinh").innerText = loaiNuocThai.options[loaiNuocThai.selectedIndex].text;
        AnHienThongTin("NuocThai");

        //Reset nguồn tiếp nhận nước thải + công nghệ lựa chọn
        document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").selectedIndex = 0;
        document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;

        //Ẩn nút chọn nước thải sinh hoạt (xử lý chung)
        if (loaiNuocThai.selectedIndex === 1) {
            document.getElementById("btn_xuLyNuocThai_GopSinhHoat").disabled = true;
        } else {
            document.getElementById("btn_xuLyNuocThai_GopSinhHoat").disabled = false;
        }
    });

    //2- Tự động áp dụng quy chuẩn phù hợp
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
        if (index_LoaiNuocThai !== 0) {
            if (index_NguonTiepNhan === 1 && index_LoaiNuocThai === 1) {
                //Nước thải sinh hoạt, cột a
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "1";
            } else if (index_NguonTiepNhan === 2 && index_LoaiNuocThai === 1) {
                //Nước thải sinh hoạt,cột b
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "2";
            } else if (index_NguonTiepNhan === 1 && index_LoaiNuocThai === 2) {
                //Nước thải thuỷ sản, cột a
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "3";
            } else if (index_NguonTiepNhan === 2 && index_LoaiNuocThai === 2) {
                //Nước thải thuỷ sản, cột b
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "4";
            } else if (index_NguonTiepNhan === 1 && index_LoaiNuocThai === 3) {
                //Nước thải công nghiệp, cột a
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "5";
            } else if (index_NguonTiepNhan === 2 && index_LoaiNuocThai === 3) {
                //Nước thải công nghiệp, cột b
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "6";
            } else if (index_NguonTiepNhan === 1 && index_LoaiNuocThai === 4) {
                //Nước thải y tế, cột a
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "7";
            } else if (index_NguonTiepNhan === 2 && index_LoaiNuocThai === 4) {
                //Nước thải y tế, cột b
                document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_QCVN").selectedIndex = "8";
            }
        } else {
            HienThiThongBao("2.1 Chọn loại nước thải cần xử lý");
            document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").selectedIndex = 0;
        }

        //Reset công nghệ lựa chọn
        document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;
    });

    //3 Thông số đầu vào nhập từ cơ sở dữ liệu
    document.getElementById("btn_xuLyNuocThai_ThongSoDauVao_CSDL").addEventListener("click", function () {
        //Khai báo biến
        var loaiNuocThaiXuLy = document.getElementById("comboBox_XuLyNuocThai").selectedIndex;
        var xuLyGopSinhHoat = document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").selectedIndex;
        var jsonKiemTra = [
            {
                "Ten": "2.1 Chọn loại nước thải",
                "ID": "comboBox_XuLyNuocThai"
            }
        ];
        function NhapDuLieuPhuHopQuyChuan() {
            //Đối với nước thải sinh hoạt
            if (loaiNuocThaiXuLy === 1) {
                for (var i = 0; i < jsonDBNuocThai.NTSH.length; i++) {
                    NhapGiaTriChoTextBox(jsonDBNuocThai.NTSH[i].ID, jsonDBNuocThai.NTSH[i].GiaTri);
                }
            }

            //Đối với nước thải thuỷ sản
            else if (loaiNuocThaiXuLy === 2) {
                for (var i = 0; i < jsonDBNuocThai.NTTS.length; i++) {
                    NhapGiaTriChoTextBox(jsonDBNuocThai.NTTS[i].ID, jsonDBNuocThai.NTTS[i].GiaTri);
                }
            }
        }

        //Code
        if (loaiNuocThaiXuLy !== 0) {
            //Đối với không gộp nước thải sinh hoạt
            if (xuLyGopSinhHoat === 0) {
                NhapDuLieuPhuHopQuyChuan();
            }

            //Đối với nước thải gộp sinh hoạt
            else if (xuLyGopSinhHoat === 1) {
                for (var i = 0; i < jsonDBNuocThai.NTSH.length; i++) {
                    NhapGiaTriChoTextBox(jsonDBNuocThai.NTSH[i].ID + "_SH", jsonDBNuocThai.NTSH[i].GiaTri);
                }
                NhapDuLieuPhuHopQuyChuan();
            }

            //Tính toán tiếp tục
            document.getElementById("btn_calculator").click();
        } else {
            HienThiThongBao("2.1 Chọn loại nước thải");
        }
    });

    //4 Ẩn hiện mục chọn lại sơ đồ công nghệ + section phù hợp
    document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").addEventListener("change", function () {
        //Code
        /* AnHienChoCongNgheXuLy_NuocThai(); */
        AnHienThongTin("NuocThai");
    });

    //5 Thêm công trình đơn vị vào sơ đồ công nghệ
    document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChonLai").addEventListener("change", function () {
        //Khai báo biến

        //Code
        ChonCongTrinhDonViVaVeSoDo_NuocThai();
    });

    //6 Xoá công trình đơn vị khỏi sơ đồ công nghệ
    document.getElementById("btn_xuLyNuocThai_CongNghe_XoaCongTrinhDV").addEventListener("click", function () {
        //Khai báo biến

        //Code
        XoaCongTrinhDonViVeLaiSoDo_NuocThai();
    });

    //7 Khi click nút thêm nước thải sinh hoạt
    document.getElementById("btn_xuLyNuocThai_GopSinhHoat").addEventListener("click", function () {
        //Khai báo biến
        var kiemTraTrangThai = document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").style.display;

        //Code
        //Reset nguồn tiếp nhận nước thải + công nghệ lựa chọn
        document.getElementById("comboBox_XuLyNuocThai_YeuCauDauRa_NguonTiepNhan").selectedIndex = 0;
        document.getElementById("comboBox_XuLyNuocThai_CongNghe_CongNgheLuaChon").selectedIndex = 0;

        //Trường hợp không hiển thị
        if (kiemTraTrangThai === "none") {
            // Ẩn hiện dấu - +
            document.getElementById("plus_XuLyNuocThai_GopSinhHoat").style.display = "none";
            document.getElementById("minus_XuLyNuocThai_GopSinhHoat").style.display = "inline-block";

            //Hiện nước thải sinh hoạt gộp
            HienDoiTuong(["comboBox_XuLyNuocThai_GopSinhHoat"]);

            //Reset loại nước thải đầu tiền về chọn lại nếu đang chọn nước thải sinh hoạt
            if (document.getElementById("comboBox_XuLyNuocThai").selectedIndex === 1) {
                document.getElementById("comboBox_XuLyNuocThai").selectedIndex = 0;
            }

            //Disable nước thải sinh hoạt
            document.getElementById("comboBox_XuLyNuocThai").options[1].disabled = true;

            //Chọn mặc định nước thải sinh hoạt
            document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").selectedIndex = 1;

            //Hiện lưu lượng nước thải sinh hoạt - trường hợp gộp
            document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai_SH").style.display = "block";

            //Chạy thủ tục hiện chỉ tiêu ô nhiễm
            /* AnHienChiTieuONhiem_NuocThai(); */
            AnHienThongTin("NuocThai");

            //Hiện nước thải sinh hoạt trường hợp gộp
            document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_ChiTieuONhiem_SH").style.display = "block";

            //Hiện nồng độ ô nhiễm hỗn hợp
            document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_NongDoHH").style.display = "block";
        }

        //Trường hợp hiển thị
        else {
            // Ẩn hiện dấu - +
            document.getElementById("plus_XuLyNuocThai_GopSinhHoat").style.display = "inline-block";
            document.getElementById("minus_XuLyNuocThai_GopSinhHoat").style.display = "none";

            //Ẩn nước thải sinh hoạt gộp
            AnDoiTuong(["comboBox_XuLyNuocThai_GopSinhHoat"]);

            //Disable nước thải sinh hoạt
            document.getElementById("comboBox_XuLyNuocThai").options[1].disabled = false;

            //Reset loại nước thải thứ 2
            document.getElementById("comboBox_XuLyNuocThai_GopSinhHoat").selectedIndex = 0;

            //Ẩn lưu lượng nước thải sinh hoạt trường hợp gộp
            document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_LuuLuongNuocThai_SH").style.display = "none";

            //Chạy thủ tục hiện chỉ tiêu ô nhiễm
            /* AnHienChiTieuONhiem_NuocThai(); */
            AnHienThongTin("NuocThai");

            //Ẩn nước thải sinh hoạt trường hợp gộp
            document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_ChiTieuONhiem_SH").style.display = "none";

            //Ẩn nồng độ ô nhiễm hỗn hợp
            document.getElementById("box_xuLyNuocThai_ThongThongSoDauVao_NongDoHH").style.display = "none";
        }
    });

    //8 Ẩn hiện phương án tính toán hố thu
    document.getElementById("comboBox_XuLyNuocThai_HoThu_PhuongAn").addEventListener("change", function () {
        /* AnHienPhuongAnHoThu_NuocThai(); */
        AnHienThongTin("NuocThai");
    });

    //9 Ẩn hiện dạng hình học cho hố thu
    document.getElementById("comboBox_XuLyNuocThai_HoThu_DangHinhHoc").addEventListener("change", function () {
        /*  AnHienDangHinhHocHoThu_NuocThai(); */
        AnHienThongTin("NuocThai");
    });

    //10 Ẩn hiện hình học bể điều hoà
    document.getElementById("comboBox_XuLyNuocThai_DieuHoa_HinhDangBe").addEventListener("change", function () {
        AnHienThongTin("NuocThai");
    });

    //11 Ẩn hiện dạng khuấy trộn - bể điều hoà
    document.getElementById("comboBox_XuLyNuocThai_DieuHoa_DangKhuayTron").addEventListener("change", function () {
        AnHienThongTin("NuocThai");
    });

    //12 Ẩn hiện loại khếch tán - bể điều hoà
    document.getElementById("comboBox_XuLyNuocThai_DieuHoa_KhiNen_LoaiKhechTan").addEventListener("change", function () {
        AnHienThongTin("NuocThai");
    });

    //13 Reload vẽ sơ đồ công nghệ khi click lên section
    document.getElementById("title_XuLyNuocThai_LuaChonCongNghe").addEventListener("click", function () {
        if (duLieuSoDoCongNghe_NuocThai !== "") {
            VeSoDoCongNghe(duLieuSoDoCongNghe_NuocThai, "soDoCongNghe");
        }
    });

    //14 Phương án xác định thể tích - hiếu khí
    document.getElementById("comboBox_XuLyNuocThai_HieuKhi_PhuongAnTheTich").addEventListener("change", function () {
        AnHienThongTin("NuocThai");
    });

    //Hình dạng bể - hiếu khí
    document.getElementById("comboBox_XuLyNuocThai_HieuKhi_HinhDangBe").addEventListener("change", function () {
        AnHienThongTin("NuocThai");
    });
}

//----------------------------------------------------------------V. PHẦN CHÍNH - CHẠY MẶC ĐỊNH KHI LOAD WEB-------------------------------------------------------------------------------------
window.addEventListener("load", function () {
    //Thông tin trợ giúp trong modal
    LayDuLieuJsonTuSourcesCode(pathDataSources, function (duLieuTraVe) {
        jsonDataSouces = duLieuTraVe;
        XuLyHienThongTinGoiYTrongModal();
    });

    //Lấy jsonDataUser mẫu từ sources code khi load trang
    LayDuLieuJsonTuSourcesCode(pathDataUser, function (duLieuTraVe) {
        jsonDataUser = duLieuTraVe;
    });

    //Lấy CSDL nước thải từ sources code khi load trang
    LayDuLieuJsonTuSourcesCode(duongDanDBNuocThai, function (duLieuTraVe) {
        jsonDBNuocThai = duLieuTraVe;
    });

    //Mặc định chạy hiển thị gợi ý trên toàn bộ web
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });

    //Sự kiện
    //Sự kiện chung
    XuLySuKienChinh();
    XuLySuKien_NuocThai();

    //Tự động tính toán số liệu
    TuDongTinhToan();

    //Lưu trữ dữ liệu trước khi đóng browser
    window.addEventListener("beforeunload", function () {
        if (jsonDataUser !== "" && jsonDBNuocThai !== "") {
            TuDongCapNhatThayDoiVaoJsonCore();
            LuuDuLieuVaoLocalStorage();
        }

        //Xoá ngôn ngữ dịch
        document.cookie = "googtrans = ";
    });

    //Nạp dữ liệu từ local storage (nếu có)
    NapDuLieuTuLocalStorage();

    //Mở thao tác
    setTimeout(function () {
        document.getElementById("lock_page").remove();
    }, 500);
})
//-----------------------------------------------------------------VI. TEST CODE--------------------------------------------------------------------------------------------------------------
/*
//Lấy ID cho file Data
var ip = document.getElementsByTagName("input");
var str = "";
for (var i = 0; i < ip.length; i++) {
if (ip[i].id.indexOf("_HieuKhi_", 0) !== -1) {
var a = {
    "Ten": "Bể hiếu khí | ",
    "ID": ip[i].id,
    "GiaTri": ""
};
if (str !== "") {
    str = str + ",\n" + JSON.stringify(a);
} else {
    str = str + JSON.stringify(a);
}
}
}
console.log(str);
var ip = document.getElementsByTagName("select");
for (var i = 0; i < ip.length; i++) {
if (ip[i].id.indexOf("HieuKhi", 0) !== -1) {
console.log(ip[i].id);
}
}
*/