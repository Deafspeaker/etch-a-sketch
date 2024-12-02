const mainBoard = document.querySelector(".board");
const newGame = document.querySelector(".newGame");
const reset = document.querySelector(".reset");
const randColor = document.querySelector(".random");
const colors = document.querySelector(".colors");
const colorsArray = ["random", "red", "green", "pink", "yellow", "black", "orange", "blue", "white", "purple", "grey", "brown"];
const allColorButtons = document.querySelectorAll(".color");
const showColor = document.querySelector(".showColor");
const chooseMethod = document.querySelector("#drawMethod");
let chosenColor = "";
let chosenMethod = "moveOnly";
let isDrawing = false;

document.addEventListener('mousedown', () => isDrawing = true);
document.addEventListener('mouseup', () => isDrawing = false);


createColorButtons();

chooseMethod.addEventListener("change", function () {
    chosenMethod = this.value;
    setDrawingMethod();
})

function setNewGame() {
    chosenColor = "";
    let limit = parseInt(prompt("How Many squares should we use? Limit 100" || 16));

    showColor.style.background = "";
    showColor.style.backgroundImage = "";
    showColor.style.backgroundColor = "black";
    
    if (limit % 2 !== 0) {
        limit += 1;
    }

    if (limit !== limit || Number(limit) === 0 || Number(limit) > 100 || Number(limit) === "") {
        limit = 16;
    };

    removeOldGrid(limit);

    setDrawingMethod();
}

newGame.addEventListener("click", () => {
    setNewGame()
});



function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


reset.addEventListener("click", () => {

    const gridItems = document.querySelectorAll(".grid");
    gridItems.forEach(grid => {
        grid.style.backgroundColor = "white";
        grid.isColored = false;
    });



})



function createColorButtons() {
    for (let i = 0; i < colorsArray.length; i++) {


        const newButton = document.createElement("button");
        newButton.classList.add("color", colorsArray[i]);

        // Set gradient for random button
        if (i === 0) {
            newButton.style.background = "linear-gradient(45deg, red, purple, green, blue, orange, black, yellow, pink)";
            newButton.style.backgroundImage = "linear-gradient(45deg, red, purple, green, blue, orange, black, yellow, pink)";
        } else {
            newButton.style.backgroundColor = colorsArray[i];
        }


        newButton.addEventListener("click", () => {
            chosenColor = colorsArray[i];
            console.log(`this listener has color ${chosenColor}`);
            if (chosenColor === "random") {
                // Reset all background properties first

                // Set both background and backgroundImage for maximum compatibility
                showColor.style.background = "linear-gradient(45deg, red, purple, green, blue, orange, black, yellow, pink)";
                showColor.style.backgroundImage = "linear-gradient(45deg, red, purple, green, blue, orange, black, yellow, pink)";
            } else {
                // Reset gradient properties
                showColor.style.background = "";
                showColor.style.backgroundImage = "";
                // Set solid color
                showColor.style.backgroundColor = chosenColor;
            }
        });

        colors.appendChild(newButton);
    }
}




    function setDrawingMethod() {
        const grids = document.querySelectorAll(".grid");
        clearGridEventListeners(grids);


        document.addEventListener("mouseup", () => {
            isDrawing = false;
        })

        gridAddEventListeners(grids);


    }

    function checkColor(event) {

        if (chosenColor === "random") {
            this.style.backgroundColor = getRandomColor();
        } else {
            this.style.backgroundColor = chosenColor || "black";
        }
    };



    function removeOldGrid(limit) {

        const getGrid = document.querySelectorAll(".grid");
        getGrid.forEach(grid => {
            mainBoard.removeChild(grid)
        })

        // let gridDimension = mainBoard.clientWidth / limit;
        const percentage = 100 / limit;


        for (let i = 0; i < limit * (limit / 2); i++) {
            const createNewGrid = document.createElement("div");
            createNewGrid.style.height = `${percentage * 2}%`;
            createNewGrid.style.width = `${percentage}%`;
            createNewGrid.classList.add("grid");
            mainBoard.appendChild(createNewGrid);
        }
    }

    function clearGridEventListeners(grids) {

        grids.forEach(grid => {
            grid.removeEventListener('mouseover', grid.boundCheckColor);
            grid.removeEventListener('mousedown', grid.boundCheckColor);
            grid.removeEventListener("mousemove", grid.boundCheckColor);
            grid.removeEventListener('click', grid.boundCheckColor);
        });


    }

    function gridAddEventListeners(grids) {

        grids.forEach(grid => {
            grid.boundCheckColor = checkColor.bind(grid);

            switch (chosenMethod) {
                case 'moveOnly':
                    grid.addEventListener('mouseover', grid.boundCheckColor);
                    break;
                case "clickDrag":
                    grid.addEventListener("mousedown", (e) => {
                        isDrawing = true;
                        grid.boundCheckColor(e);
                    });
                    grid.addEventListener("mouseover", (e) => {
                        if (isDrawing) {

                            grid.boundCheckColor(e);
                        }
                    });

                    grid.addEventListener("dragstart", (e) => {
                        e.preventDefault();

                    });
                    break;

                case "clickOnly":
                    grid.addEventListener("click", grid.boundCheckColor);
                    break;
            }
        });

    }