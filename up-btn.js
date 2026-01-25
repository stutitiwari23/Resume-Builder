// js for up-btn 
document.addEventListener("DOMContentLoaded", () => {
    const upBtn = document.getElementById("up-btn");

    if (!upBtn) {
        console.log("up-btn not foudd");
        return;
    }

    // show button after scrolling down
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            upBtn.classList.add("show");
        } else {
            upBtn.classList.remove("show");
        }
    });

    // scroll to top on click
    upBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
