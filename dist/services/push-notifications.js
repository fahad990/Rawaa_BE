"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.send = undefined;

//push manual notification
// admin.messaging().sendToDevice(['fi8EKJAJaaM:APA91bFdooPqy5hZ3cRIsL4S46Jk-Nf6TxrD9DF-Wk_8BXTt-CJSXM1Itgm77aneUvpTZ5mhjBpGG1HhlhLcPkXLn6CpxMB6QdzR4RCj5exe0QoBwkEuWXSM9KkjfDXH5g0WHtwjKCj8'],
//     {
//         notification: {
//             title: "dsdsd",
//             body: "hello form bakry",
//             icon:"https://image.flaticon.com/icons/png/128/148/148921.png"
//         },
//         data: {
//             subject: "bla b",

//         }
//     }).then(response => {
//         console.log("Successfully sent message:", response.results[0]);
//     })
//     .catch(error => {
//         console.log("Error sending message:", error);
//     });

var send = exports.send = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId, title, body) {
        var user, tokens, payload;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _user2.default.findById(userId);

                    case 2:
                        user = _context.sent;
                        tokens = user.pushTokens;
                        payload = {
                            notification: {
                                title: title, body: body,
                                icon: "https://image.flaticon.com/icons/png/128/148/148921.png"
                            }
                            // data: {
                            //     subject, subjectId
                            // }
                        };


                        if (tokens.length) {
                            admin.messaging().sendToDevice(tokens, payload).then(function (response) {
                                console.log("Successfully sent message:", response);
                            }).catch(function (error) {
                                console.log("Error sending message:", error);
                            });
                        }

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function send(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var _firebaseAdmin = require("firebase-admin");

var admin = _interopRequireWildcard(_firebaseAdmin);

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var serviceAccount = require("../service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rawaaprovider.firebaseio.com"
});
//# sourceMappingURL=push-notifications.js.map