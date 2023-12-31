let paymentID;

const productInfoUrl = "http://localhost:9000/checkout/product-info";
const createCheckoutUrl = "http://localhost:9000/checkout/payment/create";
const captureCheckoutUrl = "http://localhost:9000/checkout/payment/capture";

const executeCheckoutUrl =
  "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute";

$(document).ready(function () {
  getProductInfo();
});

async function getProductInfo() {
  try {
    const response = await fetch(`${productInfoUrl}/12345`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("result getProductInfo :>> ", result);
    const headers = {
      "Content-Type": "application/json",
      Authorization: result.id_token, // Contains access token
      "X-APP-Key": result.app_key,
    };

    initBkash(headers, result.request);
  } catch (error) {
    console.error("error:", error);
  }
}

async function capturePayment(body) {
  try {
    const response = await fetch(`${captureCheckoutUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();

    console.log("result capture :>> ", result);
  } catch (error) {
    console.error("error:", error);
  }
}

function initBkash(headers, request) {
  bKash.init({
    paymentMode: "checkout",
    paymentRequest: request,

    createRequest(request) {
      fetch(createCheckoutUrl, {
        method: "POST",
        headers: headers,
        type: "POST",
        contentType: "application/json",
        body: JSON.stringify(request),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("data createRequest:>> ", data);

          if (data && data.paymentID !== null) {
            paymentID = data.paymentID;
            bKash.create().onSuccess(data);
          } else {
            bKash.create().onError(); // Run clean up code
            alert("data.errorMessage");
          }
        })
        .catch((error) => {
          bKash.create().onError(); // Run clean up code
          console.error("Error:", error.message);
        });
    },

    executeRequestOnAuthorization() {
      fetch(`${executeCheckoutUrl}/${paymentID}`, {
        method: "POST",
        headers: headers,
        contentType: "application/json",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("data executeRequestOnAuthorization:>> ", data);

          if (data.transactionStatus !== "Completed") {
            alert(`[ERROR] Fail Payment`);
            bKash.execute().onError(); // Run clean up code
            throw new Error(`Error: ${data}`);
            // window.location.href = "https://www.example.com/";
          }

          if (data && data.paymentID !== null) {
            // capturePayment(data);
            // console.log("data :>> ", data);
            // On success, perform your desired action
            alert(`[SUCCESS] Payment`);
            window.location.href = "https://www.example.com/";
          }
        })
        .catch((error) => {
          alert("An alert has occurred during execute");
          bKash.execute().onError(); // Run clean up code
          console.error("Error:", error.message);
        });
    },
    onClose: function () {
      alert("User has clicked the close button");
    },
  });

  $("#bKash_button").removeAttr("disabled");
}
