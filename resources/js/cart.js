function addQuantity(id) {
  console.log('JS ADD QUANTITY')
  console.log(id)
  const orderLineRowQty = document.getElementsByName('orderLineQty-' + id)

  if (orderLineRowQty[0]) {
    orderLineRowQty[0].textContent = Number.parseInt(orderLineRowQty[0].textContent) + 1
    updateTotalRow(id, orderLineRowQty[0])
    updateTotalOrder()
  }
}

function removeQuantity(id) {
  console.log('JS REMOVE QUANTITY')
  console.log(id)
  const orderLineRowQty = document.getElementsByName('orderLineQty-' + id)
  if (orderLineRowQty[0]) {
    if (Number.parseInt(orderLineRowQty[0].textContent) === 1) {
      removeOrderLine(id)
      updateTotalOrder()
    } else {
      orderLineRowQty[0].textContent = Number.parseInt(orderLineRowQty[0].textContent) - 1
      updateTotalRow(id, orderLineRowQty[0])
      updateTotalOrder()
    }
  }
}

function removeOrderLine(id) {
  const orderLineRowQty = document.getElementsByName('orderLineQtyRow-' + id)
  const removeOrderLineForm = document.getElementsByName('removeOrderLine-' + id)[0]

  removeOrderLineForm.style.display = 'none'
  removeOrderLineForm.submit()
  if (orderLineRowQty[0]) {
    orderLineRowQty[0].remove()
    updateTotalOrder()
  }
}

function updateTotalRow(id, orderLineQtyRow) {
  const totalRow = document.getElementsByName('total-price-' + id)[0]
  const discountPrice = document.getElementsByName('discount-price-' + id)[0]
  totalRow.textContent =
    Number.parseInt(orderLineQtyRow.textContent) * Number.parseInt(discountPrice.textContent)
}

function updateTotalOrder() {
  console.log('updateTotalOrder')
  const totalRows = document.querySelectorAll('span[data-subtotal]')
  console.log(totalRows)
  const totalOrder = document.querySelector('span[data-total-order]')
  let sum = 0
  totalRows.forEach((element) => {
    sum += Number.parseInt(element.textContent)
  })

  totalOrder.textContent = sum
}
