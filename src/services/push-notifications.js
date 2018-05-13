import * as admin from 'firebase-admin';
import User from "../models/user.model";

const serviceAccount = require("../service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rawaaprovider.firebaseio.com"
});

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

export async function send(userId, title, body) {

    let user = await User.findById(userId);
    let tokens = user.pushTokens;

    const payload = {
        notification: {
            title, body,
            icon: "https://image.flaticon.com/icons/png/128/148/148921.png"
        },
        // data: {
        //     subject, subjectId
        // }
    }


    if (tokens.length) {
        admin.messaging().sendToDevice(tokens, payload)
            .then(response => {
                console.log("Successfully sent message:", response);
            })
            .catch(error => {
                console.log("Error sending message:", error);
            });
    }

}