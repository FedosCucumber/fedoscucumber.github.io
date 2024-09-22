window.addEventListener("load", function () {
    const menuItems = document.querySelectorAll(".menu__item")
    menuItems.forEach(item => {
        const link = item.querySelector(".button-link")
        if (link.href === document.location.href) {
            link.classList.add("current_page")
        }
    })
});
