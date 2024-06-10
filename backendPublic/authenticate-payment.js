module.exports = async function authenticatePayment(email) {
  console.log(email);
  let problem = "";
  const LEMONSQUEEZY_API_KEY = "I'm not giving you my API key";

  async function getCustomerIdByEmail(email) {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/customers/`, {
      headers: {
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
    });

    if (!response.ok) {
      problem = "User not found";
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].attributes.email == email) {
          console.log(data.data[i].id);
          return data.data[i].id;
        }
      }
    } else {
      problem = "User not found";
    }
  }

  async function fetchSubscriptionsForCustomer(customerId) {
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/customers/${customerId}/subscriptions`,
      {
        headers: {
          Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      }
    );

    if (!response.ok) {
      problem = "No subscription";
    }

    const data = await response.json();
    return data.data[0].attributes.product_id; // Assuming the response is in the expected format
  }

  const customerId = await getCustomerIdByEmail(email);
  const subscription = await fetchSubscriptionsForCustomer(customerId);
  console.log(subscription == "239298");
  return subscription == "239298";
};
