const elements = document.getElementsByClassName("sidebuttons");
const subsections = document.getElementsByClassName("SubSection");

function handleButtonInteraction(element) {
    var associatedElements = document.getElementById(element.id)
    for (let i = 0; i < subsections.length; i++) {
        subsections[i].style.display = 'none';
    }
    for (let i = 0; i < associatedElements.length; i++) {
        if (associatedElements[i].class != "sidebuttons") {
            associatedElements[i].style.display = 'block';
        }
    }
}

for (let i = 0; i < elements.length; i++) {
    if (elements[i].id) {
       elements[i].onclick = handleButtonInteraction(elements[i])
    }
}