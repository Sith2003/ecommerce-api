const stripe = Stripe("pk_test_51NxOViDshRxO6VzXvwL8huUMIOlhXwPAkIJl6JfvXbmOTm9bhwn71sRtNYifMjqPM6yYYRhrtXu1jMNfeRPAUjWd00U52uG5Sj")

const placeorder = async (data) => {
  try {

    const requestData = {
      product: {
        name: 'test',
        price: 20000,
        quantity: 1
      },
      information: {
        name: data.name,
        address: data.address
      }
    }

    const response = await axios.post(
      'http://localhost:8080/api/v1/checkout',
      requestData
    )
    const session = response.data
    console.log('Response from server:', response.data);

    stripe.redirectToCheckout({
      sessionId: session.id,
    })
  } catch (error) {
    console.log('error', error)
  }

  return null
}