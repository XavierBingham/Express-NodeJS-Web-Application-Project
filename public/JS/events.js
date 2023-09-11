window.onload = function(){

    //Animation loader
    const noAnimElements = document.getElementsByClassName("unanimated");

    Array.prototype.forEach.call(noAnimElements, element => {
        const animEvent = function(){
            element.classList.remove("unanimated");
            element.classList.add("animated");
            element.removeEventListener("mouseover", animEvent);
        }
        element.addEventListener("mouseover", animEvent);
    });

    //Nav loader
    const categoryMap = new Map();
    const selectedCategoryElement = document.getElementById("event-navigation").querySelector("[selected]")
    if(!selectedCategoryElement){return;}

    let currContainer = selectedCategoryElement.value;

    Array.prototype.forEach.call(document.getElementsByClassName("events-container"), categoryContainer => {
        const containerValue = categoryContainer.attributes["id"].value;
        categoryMap.set(containerValue, categoryContainer);
        if(containerValue === currContainer){
            categoryMap.get(containerValue).classList.remove("hide");
        }
    })

    Array.prototype.forEach.call(document.getElementById("event-navigation").children, navButton => {
        const containerValue = navButton.value;
        navButton.addEventListener("click", function(){
            if(currContainer === containerValue){return;}
            categoryMap.get(currContainer).classList.add("hide");
            categoryMap.get(containerValue).classList.remove("hide");
            currContainer = containerValue;
        });
    })

};