// src/services/AuthService.js
import SignInService from './signin.service';

export default {
    async login(data) {
        try {
            // Gọi SignInService.getAll() để lấy danh sách tài khoản mà không dùng POST
            const accounts = await SignInService.getAll();

            // Tìm tài khoản khớp với username và password
            const account = accounts.find(
                acc => acc.username === data.username && acc.password === data.password
            );

            if (!account) {
                throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
            }

            // Nếu đăng nhập thành công, lưu thông tin tài khoản vào localStorage
            localStorage.setItem("account", JSON.stringify(account));
            return account; // Trả về tài khoản để sử dụng trong component đăng nhập
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            throw new Error(error.message || "Có lỗi xảy ra khi đăng nhập.");
        }
    },

    logout() {
        localStorage.removeItem("account");
    },

    isLoggedIn() {
        return !!localStorage.getItem("account");
    },

    isUser() {
        const account = JSON.parse(localStorage.getItem("account"));
        return account && account.role === "user";
    },

    getUser() {
        return JSON.parse(localStorage.getItem("account"));
    },
};
