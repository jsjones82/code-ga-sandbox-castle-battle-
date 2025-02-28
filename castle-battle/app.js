const prompt = require('prompt-sync')();
const readlineSync = require('readline-sync');

const username = prompt('What is your name? ');
console.log(`Your name is ${username}`);

function getInput(promptText) {
  return readlineSync.question(promptText);
}

function CastleBattle() {
  let playerHP = 10;
  let computerHP = 10;
  const playerBarracks = [];
  const computerBarracks = [];
  let turnCount = 0;

  function Peon(name) {
    this.name = name;
    this.job = "nothing";
  }

  function displayStatus() {
    console.log(`\n--- Status ---`);
    console.log(`Player HP: ${playerHP}`);
    console.log(`Computer HP: ${computerHP}`);
    console.log(`Player Peons:`, playerBarracks);
    console.log(`Computer Peons:`, computerBarracks);
    console.log(`Turn: ${turnCount}`);
    console.log(`---`);
  }

  function playerTurn() {
    turnCount++;
    displayStatus();
    const action = getInput("What do you want to do? (create/select/view) ");

    if (action === "create") {
      const peonName = getInput("Enter peon's name: ");
      playerBarracks.push(new Peon(peonName));
      console.log(`${peonName} created!`);
      processPlayerActions();
    } else if (action === "select") {
      if (playerBarracks.length === 0) {
        console.log("No peons available.");
        playerTurn();
        return;
      }
      const peonNames = playerBarracks.map(peon => peon.name).join(", ");
      const peonName = getInput(`Enter peon's name to select (${peonNames}): `);
      const selectedPeon = playerBarracks.find(peon => peon.name === peonName);

      if (selectedPeon) {
        const peonAction = getInput(
          `What action should ${selectedPeon.name} perform? (attack/repair/nothing) `
        );

        if (peonAction === "attack") {
          selectedPeon.job = "attack";
        } else if (peonAction === "repair") {
          selectedPeon.job = "repair";
        } else if (peonAction === "nothing") {
          selectedPeon.job = "nothing";
        } else {
          console.log("Invalid action.");
          playerTurn();
          return;
        }
        processPlayerActions();
      } else {
        console.log("Invalid peon selection.");
        playerTurn();
      }
    } else if (action === "view") {
      if (playerBarracks.length === 0) {
        console.log("No peons available.");
        playerTurn();
        return;
      }
      const peonNames = playerBarracks.map(peon => peon.name).join(", ");
      const peonName = getInput(`Enter peon's name to view (${peonNames}): `);
      const selectedPeon = playerBarracks.find(peon => peon.name === peonName);

      if (selectedPeon) {
        console.log(`${selectedPeon.name}'s current job is: ${selectedPeon.job}`);
        playerTurn();
      } else {
        console.log("Invalid peon selection.");
        playerTurn();
      }
    } else {
      console.log("Invalid action.");
      playerTurn();
    }
  }

  function processPlayerActions() {
    playerBarracks.forEach((peon) => {
      if (peon.job === "repair") {
        playerHP++;
        peon.job = "nothing";
      } else if (peon.job === "attack") {
        computerHP--;
        peon.job = "nothing";
      }
    });
    computerTurn();
  }

  function computerTurn() {
    const computerAction = Math.floor(Math.random() * 3);
    const amount = Math.floor(Math.random() * 5) + 1;

    if (computerAction === 0) {
      computerHP += amount;
      console.log(`Computer repaired itself for ${amount} HP.`);
    } else if (computerAction === 1) {
      playerHP -= amount;
      console.log(`Computer attacked you for ${amount} HP.`);
    } else {
      const peonName = "ComputerPeon" + computerBarracks.length;
      computerBarracks.push(new Peon(peonName));
      console.log("Computer created a peon");
    }

    computerBarracks.forEach((peon) => {
      if (Math.random() < 0.5) {
        playerHP--;
      } else {
        computerHP++;
      }
    });

    checkGameState();
  }

  function checkGameState() {
    if (computerHP <= 0 && playerHP <= 0) {
      console.log("It's a tie!");
      return;
    } else if (computerHP <= 0) {
      console.log("You win!");
      return;
    } else if (playerHP <= 0) {
      console.log("Computer wins!");
      return;
    } else {
      playerTurn();
    }
  }

  playerTurn();
}

CastleBattle();