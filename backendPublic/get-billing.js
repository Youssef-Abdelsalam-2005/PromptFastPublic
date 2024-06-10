module.exports = async function getBilling(req, res) {
  const { email } = req.body;
  const LEMONSQUEEZY_API_KEY = "I'm not giving you my API key";
  let errorMessage = "";
  async function getCustomerIdByEmail(email) {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/customers/`, {
      headers: {
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
    });

    if (!response.ok) {
      errorMessage = "No account info found";
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
      errorMessage = "No account info found";
    }
  }

  async function fetchBilling(customerId) {
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      }
    );

    if (!response.ok) {
      errorMessage = "No account info found";
    } else {
      const data = await response.json();
      return data.data.attributes.urls.customer_portal; // Assuming the response is in the expected format
    }
  }

  const customerId = await getCustomerIdByEmail(email);
  const billingLink = await fetchBilling(customerId);
  console.log(errorMessage);
  if (errorMessage == "No account info found") {
    res.status(404).send({ prompt: errorMessage });
  } else {
    res.status(200).send({ prompt: billingLink });
  }
};
