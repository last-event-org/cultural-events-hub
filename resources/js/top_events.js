document.addEventListener('DOMContentLoaded', function () {
  // Assuming there's only one '.autoscroll' container per page
  const scrollContainers = document.querySelectorAll('.autoscroll')

  scrollContainers.forEach((container) => {
    let scrollAmount = 0
    const scrollSpeed = 0.0001

    const autoScroll = () => {
      const scrollContent = container.querySelector('.scroll-content')

      scrollAmount += scrollSpeed * scrollContent.scrollHeight

      if (scrollAmount >= scrollContent.scrollHeight - container.clientHeight) {
        scrollAmount = 0
      }

      container.scrollTop = scrollAmount

      requestAnimationFrame(autoScroll)
    }

    autoScroll()
  })
})
