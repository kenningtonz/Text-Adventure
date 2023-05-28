//html dom stuff
const docText = document.getElementById("whereTextGoes");
const docButtons = document.getElementById("optionButtons");
const docInput = document.getElementById("inputFields");

//html buttons
const inventoryButton = document.getElementById("inventory");
inventoryButton.addEventListener('click', outputInventory);

const restartButton = document.getElementById("restart");
restartButton.addEventListener('click', startStory);

//initialize player
let player = {}
let storyName = `placeholder`;

function startStory() {
    //*start story,
    //clear everything
    clear(docButtons);
    clear(docText);
    //reset player
    player = {
        inventory: ['coin'],
        playerName: "player",
        completed:false,
        loverName: "Clyde"
    }
    //start the story
    setStoryName();
    nextPart(0);
}


function outputInventory() {
    //*outputs inventory
    let msg = `you have `;

    //get everything in player inventory and add it to the messages
    for (let i = 0; i < player.inventory.length; i++) {
        msg += player.inventory[i]
    }
if(player.inventory.length == 0){
    msg = `wow you have nothing`;
}

    writeElement("p", msg);

}


function setStoryName() {
    //*sets story name ramdomly each time
    switch (Math.floor(Math.random() * 10)) {
        case 0:
            storyName = `the painting heist`;
            break;
        case 1:
            storyName = `peppa is climbing the screen door`;
            break;
        case 2:
            storyName = `boss man's big challenge`;
            break;
        case 3:
            storyName = `will you go to jail?`;
            break;
        case 4:
            storyName = `story of gay lovers`;
            break;
        case 5:
            storyName = `will your family die?`;
            break;
        case 6:
            storyName = `betrayle`;
            break;
        case 7:
            storyName = `oooOOoOoooOoOOoOoo`;
            break;
        case 8:
            storyName = `mona lisa gets stolen`;
            break;
        case 9:
            storyName = `lovers in paris`;
            break;
        default:
            storyName = `the story`;
    }
}

//used lto see if element is being written
let elementIsWriting = false;

function writeElement(tag, msg) {
    // * will add any tag and its text to the screen
    let showTag = document.createElement(tag);
    docText.appendChild(showTag);


    let i = 0;
    //starts typewriter
    typeWriter(msg);

    //recursive function that gets each character and outputs it one at a time
    function typeWriter() {
        if (i < msg.length) {
            //message is currently writing
            elementIsWriting = true;
            showTag.innerHTML += msg.charAt(i);
            i++;
            //wait a few seconds call the function again
            setTimeout(typeWriter, 30)
        } else {
            //message is now done
            elementIsWriting = false;
        }
    }

    //outputs message to console
    console.log(msg);
}


function createButton(inputVariable, nextPartID, msg) {
    //* creates a button
    let newButton = document.createElement("button");
    newButton.innerText = msg;
    newButton.id = nextPartID;

    if (inputVariable != 0) {
        newButton.inputV = inputVariable;
    }

    newButton.addEventListener('click', buttonClick)
    docButtons.appendChild(newButton);

}


function buttonClick(button) {
    //* if button is clicked
    console.log("clicked");
    if (button.target.inputV != null) {
        //if button has an input value set that value
        let inputField = document.getElementById("input");

        if(inputField.value != ``){
            player[button.target.inputV] = inputField.value;
        }

        console.log(player[button.target.inputV]);
    }
    nextPart(button.target.id);
}

function addInput(inputVariable, id) {
    //*creates an input feilds
    let inputField = document.createElement("INPUT");
    inputField.setAttribute("type", "text");
    inputField.id = "input";
    docButtons.appendChild(inputField);
    createButton(inputVariable, id, "submit");
}


function clear(target) {
    //*loops through each child element and removes them
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }
}


function nextPart(storyPartIndex) {
    clear(docButtons);
    updateStoryParts();

    //gets the  object  of storyparts that matches the index wanted
    let currentStoryPart = storyParts.find(currentStoryPart => currentStoryPart.id == storyPartIndex);

    //sets any player stuff
    player = Object.assign(player, currentStoryPart.setPlayer);

    //this is for the required sections
    //if the next story part has a next text (not a button option) then grabs that
    if (currentStoryPart.nextText != null) {
        let nextStoryPart = storyParts.find(nextStoryPart => nextStoryPart.id == currentStoryPart.nextText);
        console.log(nextStoryPart.id);

        //checks required inventory length, if the player has the inventory item then switches to the other next text
        switch (nextStoryPart.required.inventory.length) {
            case 0:
                break;
            case 1:
                if (nextStoryPart.required.inventory[0] != player.inventory) {
                    currentStoryPart.nextText = currentStoryPart.otherNextText;
                }
                break;
            case 2:
                if (nextStoryPart.required.inventory[0] != player.inventory && nextStoryPart.required.inventory[1] != player.inventory) {
                    currentStoryPart.nextText = currentStoryPart.otherNextText;
                }
                break;
        }
    }

    writeElement("p", currentStoryPart.text);

    //checks if player has completed
    if(!player.completed){
        checkReady();
    }

    function checkReady() {
        //*ichecks if something is being outputed and waits to call this again to check
        if (!elementIsWriting) {
            if (currentStoryPart.type == "buttonOptions") {
                //if story part has buttons, create a button
                currentStoryPart.options.forEach(option => {
                    createButton(0, option.nextText, option.text)
                })
            } else if (currentStoryPart.type == "inputOption") {
                //if story part is input, create an inpur feild
                addInput(currentStoryPart.inputVariable, currentStoryPart.nextText);
            } else if (currentStoryPart.type == "text") {
                //if story part is text, just continue
                createButton(0, currentStoryPart.nextText, `Continue`)
            }
        } else {
            setTimeout(checkReady, 10)
        }
    }



}

//intiliaze story
storyParts = [

]

//the reason i have to relinitialize every time is because updating the varibles the object referneces doesnt update the object,
//I know its a little jank and would NOT work well with big programs but its the best i got rn
function updateStoryParts() {
    storyParts = [{
            id: 0,
            text: `The story starts with you a player, what is your name?`,
            type: "inputOption",
            inputVariable: `playerName`,
            nextText: 1,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        //part 1
        {
            id: 1,
            text: `Hello ${player.playerName}, welcome to ${storyName} , the land of the free ( well not actually because a utopia is impossible).  
            You are a well loved and tough trailblazer.
            You have been tasked with a mighty heist, that may cost you your morals. Will you accept this task?`,
            type: "buttonOptions",
            setPlayer: {},
            required: {
                inventory: []
            },
            options: [{
                    text: `Yes, I accept this task`,
                    nextText: 2,
                },
                {
                    text: `No, I would rather not.`,
                    nextText: 3
                }
            ]
        },
        {
            id: 2,
            type: "text",
            text: `Amazing then let’s get this started.`,
            nextText: 31,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 3,
            type: "text",
            text: `Well too bad if you don’t accept your whole family will die, so buckle up buddy.`,
            nextText: 31,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 31,
            text: `What is your lovers name?`,
            type: "inputOption",
            inputVariable: `loverName`,
            nextText: 4,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 4,
            type: "text",
            text: `Boss man: you will be working with ${player.loverName}, a philanthropist, they’ve had a troubled past but that makes them great for this heist. I think you two will work great together. Well go ahead, get started.`,
            nextText: 5,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 5,
            type: "text",
            text: `${player.loverName}: Wait boss man, what is the task? `,
            nextText: 6,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 6,
            type: "text",
            text: `Boss man: Oh right that’s important lol. Alright, your task is to steal the Mona Lisa, it’s located in the Louvre Museum in Paris, France. If you bring the painting back to me I will pay you big money, however, if you don’t bring it within a week, I will kill your entire family. You are dismissed.`,
            nextText: 7,
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 7,
            text: `${player.loverName}: Let’s start with the planning. How should we enter?`,
            type: "buttonOptions",
            options: [{
                    text: `Dressed as police`,
                    nextText: 8
                },
                {
                    text: `Dressed as tourists`,
                    nextText: 12
                }
            ],
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 8,
            text: `${player.loverName}: Sounds like a good plan to me, I’ll get the masks and you get the duck tape.
            You exit the room and go to Staples, you realize you don’t have enough money. You see a homeless man with a can of coins outside the store, do you take some?`,
            type: "buttonOptions",
            options: [{
                    text: `Take the money from the homeless man`,
                    nextText: 9
                },
                {
                    text: `Give the coin that you do have to the homeless man`,
                    nextText: 10
                }
            ],
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 9,
            text: `The homeless man shouts at you and creates a scene, wow you are a terrible person, but at least you have money for duct tape.`,
            type: "text",
            setPlayer: {
                inventory: ['coin', ' and another coin']
            },
            required: {},
            nextText: 11
        },
        {
            id: 11,
            text: ` You enter staples and get the best duct tape they have`,
            type: "text",
            setPlayer: {
                inventory: ['good duct tape']
            },
            required: {
                inventory: []
            },
            nextText: 16
        },
        {
            id: 10,
            text: `You give the homeless man the change you have and the man gives you some duct tape`,
            type: "text",
            setPlayer: {
                inventory: ['bad duct tape']
            },
            required: {
                inventory: []
            },
            nextText: 16
        },
        {
            id: 12,
            text: `${player.loverName}: sounds like a good plan to me, I’ll get the masks and you get the slushy.`,
            type: "text",
            setPlayer: {},
            required: {
                inventory: []
            },
            nextText: 13
        },
        {
            id: 13,
            text: `You exit the room and to to circle K, which used to be a Macs milk. You realize you don’t have enough money for the biggest slushy. Do you find more money?`,
            type: "buttonOptions",
            options: [{
                    text: `Look around for some money`,
                    nextText: 14
                },
                {
                    text: `Get a small slushy`,
                    nextText: 15
                }
            ],
            setPlayer: {},
            required: {
                inventory: []
            }
        },
        {
            id: 14,
            text: `You leave the circle k, and search around in the garbages outside the store. You manage to find enough change, but everyone is giving you mean looks and now you are sad. 
            You go back in and buy the biggest size slushy.`,
            type: "text",
            setPlayer: {
                inventory: ['big slushy']
            },
            required: {
                inventory: []
            },
            nextText: 16,
        },
        {
            id: 15,
            text: `You decide to get a small slushy, and hope it is good enough for a distraction. `,
            type: "text",
            setPlayer: {
                inventory: ['small slushy']
            },
            required: {
                inventory: []
            },
            nextText: 16
        },

        {
            id: 16,
            text: `${player.loverName} sends you a text saying to meet them outside the party city where they got the masks. You both put on your masks, and look at each other. They put their hand on your shoulder and although
            you can only see ${player.loverName}'s eyes, they look beautiful. You both travel to the museum at night. The painting is in the Louvre's largest room, the Salle des États. `,
            type: "text",
            setPlayer: {},
            required: {
                inventory: []
            },
            nextText: 17,
            otherNextText: 19
        },

        //!police
        {
            id: 17,
            text: `You enter first, dressed as a police person, with such confidence that the guards don’t even notice you. 
            ${player.loverName} enters in after, and you both knock out the two guards, and duct tape them to the pipes.`,
            type: "text",
            required: {
                inventory: ['bad duct tape', 'good duct tape'],
            },
            setPlayer: {},
            nextText: 18
        },
        {
            id: 18,
            text: `${player.loverName}: I’ll watch the guards, you grab the painting.`,
            type: "text",
            setPlayer: {},
            required: {
                inventory: []
            },
            nextText: 20,
            otherNextText: 28
        },

        //!tourist
        {
            id: 19,
            text: `${player.loverName} has taken your slushy and put it inside pocket of their coat. They enter first and a couple minutes later you enter. You pretend to trip and bump into ${player.loverName}. They fall and opens their coat creating a massive mess in the museum. 
            While ${player.loverName} apologizes for making a mess, they give you the signal to continue.`,
            type: "text",
            setPlayer: {},
            required: {
                inventory: []
            },
            nextText: 20,
            otherNextText: 24
        },


        //! good 
        {
            id: 20,
            text: `You go to the room where the painting is and cut the canvas out of the frame.
            Running into the room, ${player.loverName} shouts that you two have to leave. You lead the way into a hallway and see an exit.
            Once you leave the building, ${player.loverName} looks at you.`,
            type: "text",
            setPlayer: {
                inventory: ['painting']
            },
            required: {
                inventory: ['good duct tape', 'big slushy'],
            },
            nextText: 21
        },
        {
            id: 21,
            text: `${player.loverName}: ${player.playerName}, I love you, let’s keep the painting of our selves.`,
            type: "buttonOptions",
            setPlayer: {},
            options: [{
                    text: `Keep the painting`,
                    nextText: 22
                },
                {
                    text: `Give the painting to the boss`,
                    nextText: 23
                }
            ],
            required: {
                inventory: []
            }
        },
        {
            id: 22,
            text: `You have decided to keep the painting. Your entire family dies, but you and ${player.loverName} are in love.
            You two have a gay wedding and live in the country side with the Mona Lisa above your fireplace.`,
            type: "text",
            setPlayer: {
            },
            required: {
                inventory: []
            },
            nextText :29
        },
        {
            id: 23,
            text: `You decided to complete the task. You have become rich and your family is alive. 
            But ${player.loverName} hates you now and kills your entire family anyway. You continue the rest of your sad life alone.`,
            type: "text",
            setPlayer: {
                inventory: ['big money']
            },
            required: {
                inventory: []
            },
            nextText :29
        },


        //! bad duct tape
        {
            id: 28,
            text: `Because you took the duct tape from the homeless man, it was terrible quality and the guards escaped.`,
            type: "text",
            setPlayer: {},
            nextText: 25,
            required: {
                inventory: ['small duct tape'],
            },

        },

        //!bad tourist
        {
            id: 24,
            text: `Because you decided to get the small slushy, the mess wasn’t big enough of a distraction.  `,
            type: "text",
            setPlayer: {},
            nextText: 25,
            required: {
                inventory: ['small slushy'],
            }
        },

        {
            id: 25,
            text: `While you are cutting out the painting, guards rush into the room and take you down. 
            You and ${player.loverName} are escorted into a prison. You receive a call from the boss man. `,
            type: "text",
            setPlayer: {
                inventory: ['']
            },
            required: {
                inventory: []
            },
            nextText: 26
        },

        {
            id: 26,
            text: `Boss man: well you failed so uh imma kill your whole family lol. `,
            type: "text",
            setPlayer: {},
            required: {
                inventory: []
            },
            nextText: 27
        },
        {
            id: 27,
            text: `You and ${player.loverName} are sentenced to life and become prison lovers, but your whole family is dead`,
            type: "text",
            required: {
                inventory: []
            },
            setPlayer: {
                inventory: ['']
            },
            nextText: 29,
        },
        {
            id: 29,
            text: `the end!`,
            type: "text",
            required: {
                inventory: []
            },
            setPlayer: { 
                completed :true
            }
        },
    ];
}

//main
startStory();