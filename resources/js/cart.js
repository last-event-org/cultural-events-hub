function showSuccessNotification(message, type) {
  const notification = document.getElementById('notification')
  notification.innerHTML = `
      <div id="toast-success" class="notification fixed bottom-0 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span class="sr-only">Check icon</span>
        </div>
        <div class="ms-3 text-sm font-normal">${message}</div>
    </div>`
}

function showErrorNotification(message) {
  const notification = document.getElementById('notification')
  notification.innerHTML = `
 <div id="toast-danger" class="notification fixed bottom-0 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">${message}</div>
</div>`
}

function addQuantity(id) {
  const orderLineRowQty = document.getElementsByName('orderLineQty-' + id)

  if (orderLineRowQty[0]) {
    orderLineRowQty[0].textContent = Number.parseInt(orderLineRowQty[0].textContent) + 1
    updateTotalRow(id, orderLineRowQty[0])
    updateTotalOrder()
  }

  showSuccessNotification('Ticket ajouté')
}

function removeQuantity(id) {
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

  showErrorNotification('Ticket retiré')
}

async function removeOrderLine(id) {
  const orderLineRowQty = document.getElementsByName('orderLineQtyRow-' + id)
  // TODO error in log when deleting an order line, code looks for a submit form [look previous code]
  const removeOrderLineForm = document.getElementsByName('removeOrderLine-' + id)[0]
  removeOrderLineForm.submit()
  // removeOrderLineForm.style.display = 'none'
  if (orderLineRowQty[0]) {
    orderLineRowQty[0].remove()
    updateTotalOrder()
  }

  showErrorNotification('Ticket(s) supprimé(s)')
}

function updateTotalRow(id, orderLineQtyRow) {
  const totalRow = document.getElementsByName('total-price-' + id)[0]
  const discountPrice = document.getElementsByName('discount-price-' + id)[0]
  console.log(discountPrice)
  totalRow.textContent =
    Number.parseInt(orderLineQtyRow.textContent) * Number.parseFloat(discountPrice.textContent)
}

function updateTotalOrder() {
  const totalRows = document.querySelectorAll('span[data-subtotal]')
  const totalOrder = document.querySelector('span[data-total-order]')
  let sum = 0
  totalRows.forEach((element) => {
    sum += Number.parseFloat(element.textContent)
  })

  totalOrder.textContent = sum
}
