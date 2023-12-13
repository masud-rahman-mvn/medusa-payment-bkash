// Sample data for Address type
const sampleAddress = {
    street: "123 Main St",
    city: "Cityville",
    state: "State",
    postal_code: "12345",
    country: "Country",
  };
  
  // Sample data for Customer type
  const sampleCustomer = {
    id: "customer_123",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  };
  
  // Sample data for PaymentProcessorContext
  const samplePaymentProcessorContext = {
    billing_address: sampleAddress,
    email: "john.doe@example.com",
    currency_code: "USD",
    amount: 100.50,
    resource_id: "order_123",
    customer: sampleCustomer,
    context: {
        // You can add any additional context data here
        client_version: "1.0.0",
        device_type: "mobile",
    },
    paymentSessionData: {
        // You can add any payment session data here
        session_id: "session_456",
        payment_method: "credit_card",
    },
  };
  
  // Sample data for PaymentProcessorSessionResponse
  const samplePaymentProcessorSessionResponse = {
    update_requests: {
        customer_metadata: {
            loyalty_points: 50,
            membership_level: "Gold",
        },
    },
    session_data: {
        // You can add any session data here
        status: "active",
        expires_at: "2023-12-31T23:59:59Z",
    },
  };
  
  // Usage example
  console.log("Sample Payment Processor Context:", samplePaymentProcessorContext);
  console.log("Sample Payment Processor Session Response:", samplePaymentProcessorSessionResponse);
  