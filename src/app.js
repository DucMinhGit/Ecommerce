const express = require('express');
/**
 * Giảm kích thước dữ liệu: Compression giúp giảm kích thước của dữ liệu gửi từ máy chủ đến trình duyệt hoặc 
 * ứng dụng khách, giúp tối ưu hóa băng thông mạng và tăng tốc độ tải trang. 
 * Tối ưu hóa hiệu suất: Khi dữ liệu được nén, việc truyền tải qua mạng trở nên nhanh chóng hơn,
 * giảm thời gian phản hồi từ máy chủ và cải thiện trải nghiệm người dùng.
 * - Ưu điểm của việc sử dụng compression trong Node.js:
 *    + Tăng tốc độ tải trang: Dữ liệu nén giúp giảm thời gian tải trang, cải thiện trải nghiệm người dùng.
 *    + Tiết kiệm băng thông: Dữ liệu nén giảm lưu lượng mạng cần thiết cho việc truyền tải dữ liệu,
 *      giúp tiết kiệm băng thông mạng.
 *    + Cải thiện hiệu suất: Tối ưu hóa việc truyền tải dữ liệu giúp cải thiện hiệu suất ứng dụng. 
 * - Nhược điểm của việc sử dụng compression trong Node.js:
 *    + Tài nguyên máy tính: Quá trình nén và giải nén dữ liệu tốn tài nguyên máy tính, đặc biệt là CPU.
 *      Trong một số trường hợp, việc nén và giải nén có thể gây tăng cường hoạt động của CPU,
 *      ảnh hưởng đến hiệu suất của máy chủ.
 *    + Khả năng tương thích: Mặc dù hầu hết các trình duyệt web đều hỗ trợ các phương thức nén như gzip hoặc deflate,
 *      nhưng có thể có một số trường hợp khi không phải tất cả các trình duyệt hoặc
 *      ứng dụng khách đều hỗ trợ các phương thức nén này.
 */
const compression = require('compression');

/**
 * helmet là một middleware bảo mật cho Express.js. 
 * Nó giúp bảo vệ ứng dụng web bằng cách thiết lập các header HTTP liên quan đến an ninh. 
 * Express Helmet bao gồm nhiều tính năng như:
 * - XSS Protection (Bảo vệ chống tấn công Cross-Site Scripting): 
 *    Thiết lập header X-XSS-Protection để ngăn chặn các cuộc tấn công XSS.
 * - Frameguard (Bảo vệ chống clickjacking): 
 *    Thiết lập header X-Frame-Options để ngăn chặn việc nhúng trang web vào trong một <frame> hoặc <iframe>.
 * - Bảo vệ chống các tấn công liên quan đến MIME: 
 *    Đặt header X-Content-Type-Options để ngăn chặn các tấn công liên quan đến kiểu MIME không mong muốn.
 * - Chống tấn công CRSF (Cross-Site Request Forgery): Cung cấp middleware để giúp bảo vệ chống tấn công CRSF.
 */
const { default: helmet } = require('helmet');
/**
 * morgan: la mot thu vien de ma in ra cac log cua chung ta 
 * khi ma mot nguoi dung chay mot request
*/
const morgan = require('morgan');

require('dotenv').config();

const app = express();





/**
 * 
 * init middlewares
 *  
 **/ 

/** 
 * Middleware có thể được sử dụng để xử lý các yêu cầu HTTP
 * trước khi chúng được xử lý bởi các route handlers chính.
*/

app.use(morgan("dev"));

/** 
 * morgan('dev') được sử dụng để tạo ra một logger HTTP đơn giản 
 * trong quá trình phát triển. Nó ghi lại thông tin về mỗi yêu cầu HTTP 
 * như method (phương thức), đường dẫn URL, mã trạng thái và thời gian phản hồi. 
*/
/** 
 * Thuong duoc su dung o moi truong dev 
 *
 **/

// app.use(morgan("combined"))

/****
 * 
 * Định dạng "combined" trong morgan là một trong những định dạng log phổ biến, 
 * bao gồm thông tin chi tiết về mỗi yêu cầu HTTP như method (phương thức), đường dẫn URL,
 * mã trạng thái, kích thước phản hồi, 
 * địa chỉ IP của người gửi yêu cầu và thông tin thời gian, theo chuan apache
 */

/**
 * Thuong duoc su dung o moi truong production
 */

// app.use(morgan("common"))
/**
 * No cung giong voi combined nhung chi khac la common khong co cai resource, 
 * khong biet chung ta chay curl hay postman hay chrome
 */

// app.use(morgan("short"))
/**
 * Định dạng "short" trong morgan cung cấp thông tin cơ bản hơn so với "tiny",
 * bao gồm method (phương thức), đường dẫn URL,
 * mã trạng thái và thời gian phản hồi.
 * Nó cung cấp một số thông tin khái quát về các yêu cầu HTTP mà không quá chi tiết.
 */

// app.use(morgan("tiny"))
/**
 * Định dạng "tiny" trong morgan là một định dạng log nhỏ gọn,
 * chỉ cung cấp thông tin cần thiết nhất về mỗi yêu cầu HTTP.
 * Nó bao gồm các thông tin như method (phương thức), đường dẫn URL và mã trạng thái.
 */

app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');

// init routes
app.use('/', require('./routes'));

// handling error

module.exports = app;