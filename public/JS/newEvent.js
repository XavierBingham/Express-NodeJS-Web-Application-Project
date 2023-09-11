window.onload = function(){
    const noAnimElements = document.getElementsByClassName("unanimated");
    Array.prototype.forEach.call(noAnimElements, element => {
        element.addEventListener("mouseover", function(){
            element.classList.remove("unanimated");
            element.classList.add("animated");
            element.removeEventListener("mouseover");
        });
    });
};