export function getOrderPayment(order: { extra: boolean; shipping: number }) {
  const productSubtotal = order.extra ? 450 : 150
  const discount = 20
  const shippingDiscount = 10
  const pointDeduction = 10
  const serviceFee = 2

  return {
    productSubtotal,
    discount,
    shippingDiscount,
    pointDeduction,
    serviceFee,
    total: productSubtotal + order.shipping - discount - shippingDiscount - pointDeduction + serviceFee,
  }
}

