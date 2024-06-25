function addQuantity(id) {
  console.log('JS ADD QUANTITY')
  console.log(id)
  const orderLineRowQty = document.getElementsByName('orderLineQty-' + id)
  if (orderLineRowQty[0]) {
    orderLineRowQty[0].textContent = Number.parseInt(orderLineRowQty[0].textContent) + 1
  }
}

function removeQuantity(id) {
  console.log('JS REMOVE QUANTITY')
  console.log(id)
  const orderLineRowQty = document.getElementsByName('orderLineQty-' + id)
  if (orderLineRowQty[0]) {
    if (Number.parseInt(orderLineRowQty[0].textContent) === 1) {
      orderLineRowQty[0].parentNode.parentNode.remove
    } else {
      orderLineRowQty[0].textContent = Number.parseInt(orderLineRowQty[0].textContent) - 1
    }
  }
}

function removeOrderLine(id) {
  console.log('JS REMOVE ORDER LINE')
  console.log(id)
  const orderLineRowQty = document.getElementsByName('orderLine-' + id)
  if (orderLineRowQty[0]) {
    orderLineRowQty[0].parentNode.parentNode.remove()
  }
}
