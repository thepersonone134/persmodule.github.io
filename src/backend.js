var elements = document.querySelectorAll(".sidebuttons");
var subsections = document.querySelectorAll(".SubSection");

for (let i = 0; i < elements.length; i++) {
    if (elements[i].id) {
        elements[i].addEventListener("click", 
            function() {
                var element = elements[i]
                var associatedElements = document.querySelectorAll("#"+(element.id))
                for (let i = 0; i < subsections.length; i++) {
                    subsections[i].style.display = 'none';
                }
                for (let i = 0; i < associatedElements.length; i++) {
                    if (associatedElements[i].class != "sidebuttons") {
                        associatedElements[i].style.display = 'block';
                    }
                }
            }
        )
    }
}