'use strict';

const display_area = document.getElementById('display_area');

const lilleLeft = document.getElementById('lilleLeft');
const lilleMiddle = document.getElementById('lilleMiddle');
const lilleRight = document.getElementById('lilleRight');

let randomNumber; //乱数格納用変数
let hitProb = 0.5; //当たる確率
let hitCount = 0;

let resultDigit = generateDigits();

let lilleRotation = [false, false, false];

let displayLille = resultDigit;

const results = [
    { probability: 0.005, result: 'special', digit: [[0, 0, 0]] },
    { probability: 0.01, result: 'big', digit: [[7, 7, 7]] },
    { probability: 0.05, result: 'regular', digit: [[1, 1, 1], [3, 3, 3], [5, 5, 5], [9, 9, 9]] },
    { probability: 0.1, result: 'small', digit: [[2, 2, 2], [4, 4, 4], [6, 6, 6], [8, 8, 8]] },
];

// ゾロ目でないランダムな図柄を生成
function generateDigits() {
    let digits;

    do {
        digits = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ];
    } while (digits[0] === digits[1] && digits[1] === digits[2]);

    return digits;
}

function displayDigit(digits) {
    lilleLeft.innerText = digits[0];
    lilleMiddle.innerText = digits[1];
    lilleRight.innerText = digits[2];
}

//更新用
setInterval(() => {
    randomNumber = Math.random();
    //display_area.innerText = randomNumber;

    for (let i = 0; i < lilleRotation.length; i++) {
        if (lilleRotation[i]) {
            displayLille[i] = Math.floor(Math.random() * 10);
        } else {
            displayLille[i] = resultDigit[i]
        }

    }

    displayDigit(displayLille);

}, 1);


document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && lilleRotation.every(x => x === false)) {
        console.log(randomNumber);

        let probability = 0;
        resultDigit = [];

        lilleRotation.fill(true);

        for (const item of results) {
            probability += item.probability;

            if (randomNumber < probability) {
                hitCount += 1;

                resultDigit = item.digit[Math.floor(Math.random() * item.digit.length)]
                console.log(item.result);
                console.log(resultDigit);

                break;
            }
        }

        if (resultDigit.length === 0) {
            resultDigit = generateDigits();
            console.log(resultDigit);
            displayDigit(resultDigit);
        }

    }

    // if (event.key === 'Enter') {
    //     //console.log(generateDigits());
    //     let result = generateDigits()
    //     console.log(result);
    // }

    if (event.key === 'v') {
        console.log("v");
        lilleRotation[0] = false;
    }
    if (event.key === 'b') {
        console.log("b");
        lilleRotation[1] = false;
    }
    if (event.key === 'n') {
        console.log("n");
        lilleRotation[2] = false;
    }

    // if (event.key === 'a') {
    //     lilleRotation.fill(false);
    // }
});