document.addEventListener("DOMContentLoaded", () => {
    const percentEl = document.getElementById("percent");
    const preloaderText = document.querySelector(".preloader-list")
    let load = { value: 0 };

    const tl = gsap.timeline({
        onComplete: () => {
            gsap.to(".preloader-wrap", {
                y: "-100%",
                duration: 1.2,
                ease: "expo.inOut",
                onComplete: () => {
                    document.querySelector(".loader").remove();
                    document.body.classList.remove("is-loading");
                }
            });
        }
    });

    // split elements with the class "split" into words and characters
    const split = new SplitText(".gallery-text", { type: "chars, words" });

    tl.from(split.chars, {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        ease: "back.out(1.7)",
        duration: 1
    });

    tl.from(".preloader-intro li", {
        y: "100%",
        duration: 1,
        ease: "power4.out"
    });
    tl.to(load, {
        value: 100,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
            percentEl.textContent = Math.round(load.value);
        }
    }, "-=0.5");

    tl.to(".preloader-intro", {
        opacity: 0,
        duration: 0.5
    }, "+=0.2");

});



