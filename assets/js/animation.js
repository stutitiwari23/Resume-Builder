
document.addEventListener("DOMContentLoaded", (event) => {

    function loco() {
        gsap.registerPlugin(ScrollTrigger);

        const locoScroll = new LocomotiveScroll({
            el: document.querySelector("main"),
            smooth: true
        });
        // Sync GSAP ScrollTrigger with Locomotive Scroll
        locoScroll.on("scroll", ScrollTrigger.update);
        ScrollTrigger.scrollerProxy("main", {
            scrollTop(value) {
                return arguments.length
                    ? locoScroll.scrollTo(value, 0, 0)
                    : locoScroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            pinType: document.querySelector("main").style.transform ? "transform" : "fixed"
        });
        // Keep in sync
        ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
        ScrollTrigger.refresh();
    }

    loco();
    // custom cursor code here
    function customCursor() {
        const cursor = document.querySelector(".cursor");
        const main = document.querySelector("main")
        main.addEventListener("mousemove", e => {
            gsap.to(cursor,
                {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: "power2.out"
                });
        });
    }
    customCursor()
    // navbar animation
    function navbarAnimation() {
        let main = document.querySelector("main");
        let navbar = document.querySelector(".header")
        let lastScroll = 0;
        main.addEventListener("wheel", (e) => {
            if (e.deltaY > 0) {
                gsap.to(navbar, {
                    y: -100,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(navbar, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

    }
    navbarAnimation()

});