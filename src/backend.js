const delay = ms => new Promise(res => setTimeout(res, ms));

const TweenGenericSetters = {
    "colour": function(object, changes) {
        object.style.backgroundColor = `rgb(${changes[0]},${changes[1]},${changes[2]})`;
    },
    "opacity": function(object, changes) {
        object.style.opacity = changes[0];
    },
    "pagepos": function(object, changes, org) {
        object.scrollTop = changes[0];
    },
}

const ProtectedDocuments = ["core","clients","mousefollow","riggermodule","downloader"]

var PastData = {
    "SectionData": "introduction",
    "SectionText": "Introduction",
}

var Elements = document.querySelectorAll(".sidebuttons");
var BackToTop = document.querySelectorAll("#BackToTop");

class TweenInfo {
    constructor(time, easingstyledirection) {
        this.EasingCombos = {
            "SineIn": function(percentile) {
                return 1 - Math.cos(percentile * (Math.PI/2));
            },
            "SineOut": function(percentile) {
                return Math.sin(percentile * (Math.PI/2));
            },
            "SineInOut": function(percentile) {
                return (-1/2) * (Math.cos(Math.PI * percentile) - 1);
            },
            "Linear": function(percentile) {
                return percentile;
            }
        };

        return {
            "time": time,
            "easing": [this.EasingCombos, easingstyledirection]
        };
    };
}

class Tween {
    constructor(object, tweeninfo, goal, org, setter) {
        this.object = object;
        this.tweendata = tweeninfo;
        this.goal = goal;
        this.org = org;
        this.setter = setter;
        this.init = null;

        this.step = this.step.bind(this);
    }
    step(elapsed) {
        if (this.init == null) {
            this.init = elapsed;
        };
        let percentiletravel = (elapsed-this.init)/(this.tweendata.time*1000);
        if (percentiletravel >= 1) {
            this.setter(this.object, this.goal);
            return;
        }

        let changes = [];
        for (let i = 0; i < this.org.length; i++) {
            let asgoal = this.goal[i];
            let asorg = this.org[i];

            changes[i] = asorg + ((asgoal-asorg) * this.tweendata.easing[0][this.tweendata.easing[1]](percentiletravel));
        }
        
        this.setter(this.object, changes, this.org);

        requestAnimationFrame(this.step)
    }
    play() {
        requestAnimationFrame(this.step)
    };
}

function threevariables(object) {
    let styles = window.getComputedStyle(object);
    let bgclr = styles.backgroundColor;
    let c = bgclr.split(",")
    let r = String(c[0]); let g = String(c[1]); let b = String(c[2]);

    return [Number(r.split("rgb(")[1]), Number(g), Number(b.split(")")[0])];
}

BackToTop[0].addEventListener("click",
    function() {
        let tweeninfo = new TweenInfo(1, "SineInOut")
        let tween = new Tween(document.getElementById("Holder"), tweeninfo, [0], [document.getElementById("Holder").scrollTop], TweenGenericSetters.pagepos)

        tween.play()
    }
)

let confirm = document.getElementById("overlayconfirm");
let options = document.getElementById("overlayoptions");

let acceptrisk = document.getElementById("AcceptRiskButtonPrompt");
let rejectrisk = document.getElementById("RejectRiskButtonPrompt");

acceptrisk.addEventListener("click",
    function() {
        let noticetweeninfo = new TweenInfo(.3, "SineOut")
        new Tween(confirm, noticetweeninfo, [1], [confirm.style.opacity], TweenGenericSetters.opacity);

        delay(300);

        confirm.style.display = "none";
        options.style.display = "none";
    }
)

rejectrisk.addEventListener("click",
    function() {
        window.location.replace('https://github.com/');
    }
)

Debounce = false;
Elements.forEach(element => {
    element.addEventListener("click", 
        function() {
            if (Debounce == true) { return; }
            Debounce = true;

            let newData = element.className.split(" ")[2];

            if (ProtectedDocuments.includes(newData)) {
                let noticetweeninfo = new TweenInfo(.3, "SineInOut")
                confirm.style.display = "block";
                options.style.display = "flex";
                new Tween(confirm, noticetweeninfo, [0.8], [confirm.style.opacity], TweenGenericSetters.opacity);
            }

            let pastLine = document.querySelector(`.aLine.${PastData.SectionData}`);
            let pastSub = document.querySelector(`.subSection.${PastData.SectionData}`);

            let tweenpastinfo = new TweenInfo(.3, "SineIn")
            
            new Tween(pastLine, tweenpastinfo, [126,135,145], threevariables(pastLine), TweenGenericSetters.colour).play();
            new Tween(pastSub, tweenpastinfo, [0], pastSub.style.opacity, TweenGenericSetters.opacity).play();

            document.querySelector(`.sidebuttons.${PastData.SectionData}`).innerHTML = PastData.SectionText;

            let newLine = document.querySelector(`.aLine.${newData}`);
            let newSub = document.querySelector(`.subSection.${newData}`);

            delay(300);

            pastSub.style.display = "none";

            PastData.SectionData = newData;
            PastData.SectionText = element.innerHTML

            element.innerHTML = `<b style="color: rgb(255,255,255);">${PastData.SectionText}</b>`
            let tweennewinfo = new TweenInfo(.3, "SineOut")

            new Tween(newLine, tweennewinfo, [255,255,255], threevariables(newLine), TweenGenericSetters.colour).play();
            new Tween(newSub, tweennewinfo, [1], newSub.style.opacity, TweenGenericSetters.opacity).play();

            newSub.style.display = "inline-block";
            if (newSub.scrollHeight > newSub.clientHeight) {
                BackToTop[0].style.display = "inline";
                new Tween(BackToTop[0], tweennewinfo, [1], [0], TweenGenericSetters.opacity).play();
            } else {
                new Tween(BackToTop[0], tweenpastinfo, [0], [1], TweenGenericSetters.opacity).play();
                delay(300);
                BackToTop[0].style.display = "none";
            }
            newSub.style.display = "inline";
            Debounce = false;
        }
    )
})