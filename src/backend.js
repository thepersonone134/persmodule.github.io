const delay = ms => new Promise(res => setTimeout(res, ms));

var elements = document.querySelectorAll(".sidebuttons");
var BackToTop = document.querySelectorAll("#BackToTop")

var pastsectiondata = "introduction";
var pastsectiontext = "Introduction";

async function TweenColour(div, destination, time) {
    let styles = window.getComputedStyle(div);
    let backgroundcolour = styles.backgroundColor;

    let c = backgroundcolour.split(",")
    let r = String(c[0]); let g = String(c[1]); let b = String(c[2]);

    r = Number(r.split("rgb(")[1]); g = Number(g); b = Number(b.split(")")[0])

    let rr = (destination[0]-r); let rg = (destination[1]-g); let rb = (destination[2]-b)

    let absStart = performance.now();
    function LoopLogicColour() {
        let start = performance.now();

        if (time*1000 < start-absStart) {
            return
        }

        let timeleft = 1-(((time*1000)-(start-absStart))/(time*1000))

        div.style.backgroundColor = "rgb("+(r+(rr*timeleft))+","+(g+(rg*timeleft))+","+(b+(rb*timeleft))+")";

        requestAnimationFrame(LoopLogicColour);
    }
    LoopLogicColour()
}

async function TweenOpacity(div, destination, time) {
    let styles = window.getComputedStyle(div);
    let opacity = Number(styles.opacity);

    let diffopacity = destination-opacity

    let absStart = performance.now();
    function LogicLoop() {
        let start = performance.now();

        if (time*1000 < start-absStart) {
            return
        }

        let timeleft = 1-(((time*1000)-(start-absStart))/(time*1000))

        div.style.opacity = opacity + (diffopacity*timeleft);

        requestAnimationFrame(LogicLoop);
    }
    LogicLoop()
}

async function TweenPagePos(time) {
    let scrollpos = document.getElementById("Holder").scrollTop
    let absStart = performance.now();

    function LogicLoop() {
        let start = performance.now();

        if (time*1000 < start-absStart) {
            document.getElementById("Holder").scrollTop = 0
            return
        }

        let timeleft = 1-(((time*1000)-(start-absStart))/(time*1000))

        document.getElementById("Holder").scrollTop = scrollpos + (-scrollpos*timeleft);

        requestAnimationFrame(LogicLoop);
    }
    LogicLoop()
}


BackToTop[0].addEventListener("click", 
    function() {
        TweenPagePos(.3)
    }
)

elements.forEach(element => {
    element.addEventListener("click",
        function() {
            let pastline = document.querySelectorAll(".aLine."+pastsectiondata);
            let pastsubsection = document.querySelectorAll(".subSection."+pastsectiondata);

            TweenColour(pastline[0], [126, 135, 145], .3);
            TweenOpacity(pastsubsection[0], -1, .3);

            document.querySelectorAll(".sidebuttons."+pastsectiondata)[0].innerHTML = pastsectiontext;

            let sectiondata = element.className.split(" ")[2];
            let line = document.querySelectorAll(".aLine."+sectiondata);
            let subsection = document.querySelectorAll(".subSection."+sectiondata);

            delay(300);

            pastsubsection[0].style.display = "none";

            pastsectiondata = sectiondata
            pastsectiontext = element.innerHTML

            element.innerHTML = "<b style=\"color: rgb(255,255,255);\">"+pastsectiontext+"</b>"

            TweenColour(line[0], [255,255,255], .3)
            TweenOpacity(subsection[0], 2, .3)

            subsection[0].style.display = "inline-block";
            if (subsection[0].scrollHeight > subsection[0].clientHeight) {
                BackToTop[0].style.display = "inline";
                TweenOpacity(BackToTop[0], 2, .3);
            } else {
                TweenOpacity(BackToTop[0], -1, .3);
                delay(300)
                BackToTop[0].style.display = "none";
            }
            subsection[0].style.display = "inline";
        }
    )
});