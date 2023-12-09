// let paymentID;

// const username = "sandboxTestUser";
// const password = "hWD@8vtzw0";
// const app_key = "5tunt4masn6pv2hnvte1sb5n3j";
// const app_secret = "1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka";

// const grantTokenUrl = "http://localhost:3000/checkout/token/grant";
// const createCheckoutUrl = "http://localhost:3000/checkout/payment/create";
// const executeCheckoutUrl =
//   "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute";

// $(document).ready(function () {
//   createPayment();
// });

// async function createPayment() {
//   const body = {
//     app_key: app_key,
//     app_secret: app_secret,
//   };

//   try {
//     const response = await fetch(grantTokenUrl, {
//       method: "POST",
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }

//     const result = await response.json();

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: result.id_token, // Contains access token
//       "X-APP-Key": app_key,
//     };

//     const request = {
//       amount: "85.50",
//       intent: "sale",
//       currency: "BDT",
//       merchantInvoiceNumber: "123456",
//     };

//     initBkash(headers, request);
//   } catch (error) {
//     console.error("error:", error);
//   }
// }

// function initBkash(headers, request) {
//   bKash.init({
//     paymentMode: "checkout",
//     paymentRequest: request,

//     createRequest(request) {
//       fetch(createCheckoutUrl, {
//         method: "POST",
//         headers: headers,
//         type: "POST",
//         contentType: "application/json",
//         body: JSON.stringify(request),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("data createRequest:>> ", data);
//           if (data && data.paymentID !== null) {
//             paymentID = data.paymentID;
//             bKash.create().onSuccess(data);
//           } else {
//             bKash.create().onError(); // Run clean up code
//             alert("data.errorMessage");
//           }
//         })
//         .catch((error) => {
//           bKash.create().onError(); // Run clean up code
//           console.error("Error:", error.message);
//         });
//     },

//     executeRequestOnAuthorization() {
//       fetch(`${executeCheckoutUrl}/${paymentID}`, {
//         method: "POST",
//         headers: headers,
//         contentType: "application/json",
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("data executeRequestOnAuthorization:>> ", data);

//           if (data.transactionStatus !== "Completed") {
//             alert(`[ERROR] Fail Payment`);
//             throw new Error(`Error: ${data}`);
//             // window.location.href = "https://www.example.com/";
//             bKash.execute().onError(); // Run clean up code
//           }

//           if (data && data.paymentID !== null) {
//             // console.log("data :>> ", data);
//             // On success, perform your desired action
//             // alert(`[SUCCESS] Payment`);
//             // window.location.href = "https://www.example.com/";
//           }
//         })
//         .catch((error) => {
//           alert("An alert has occurred during execute");
//           bKash.execute().onError(); // Run clean up code
//           console.error("Error:", error.message);
//         });
//     },
//     onClose: function () {
//       alert("User has clicked the close button");
//     },
//   });

//   $("#bKash_button").removeAttr("disabled");
// }
