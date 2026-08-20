'use strict';

const display_area = document.getElementById('display_area');

const lilleLeft = document.getElementById('lilleLeft');
const lilleMiddle = document.getElementById('lilleMiddle');
const lilleRight = document.getElementById('lilleRight');

let randomNumber; //乱数格納用変数
let hitCount = 0;
let currentMode;
let remainCount;

let resultDigit = generateDigits(); // 結果確定で出てきた数字を入れる変数 ランダムな値で初期化

let lilleRotation = [false, false, false]; // リールが回っているか否か

let displayLille = resultDigit; // 実際に表示されるリールの数字

// const results = [
//     { probability: 0.005, result: 'special', digit: [[0, 0, 0]] },
//     { probability: 0.01, result: 'big', digit: [[7, 7, 7]] },
//     { probability: 0.05, result: 'regular', digit: [[1, 1, 1], [3, 3, 3], [5, 5, 5], [9, 9, 9]] },
//     { probability: 0.1, result: 'small', digit: [[2, 2, 2], [4, 4, 4], [6, 6, 6], [8, 8, 8]] },
// ];

const digitList = {
    zero: [[0, 0, 0]],
    seven: [[7, 7, 7]],
    odd: [[1, 1, 1], [3, 3, 3], [5, 5, 5], [9, 9, 9]],
    even: [[2, 2, 2], [4, 4, 4], [6, 6, 6], [8, 8, 8]],
}

/**
 * Mode
 *
 * name: モード名 (string)  
 * gameCount: 残りゲーム数 (number)  
 * results: 結果の配列 (result[])  
 *  - resultName: 結果の名前 (string)  
 *  - probability: 結果の確率 (number)  
 *  - hitAction: 当選時の処理 (function)
 */

/**
 * 
 * @param {string} resultName 
 * @param {number} probability 
 * @param {() => void} hitAction 
 * @param {digitList} digit
 * @returns 
 */
const result = (resultName, probability, hitAction, digit) => ({
    resultName,
    probability,
    hitAction,
    digit,
});

const normal = {
    name: "通常",
    gameCount: Infinity,
    gameCountOver: () => { console.log("gameCountOver"); },
    results: [
        {
            resultName: "special",
            probability: 0.005,
            hitAction: () => { console.log("special"); },
            digit: digitList.zero,
        },
        {
            resultName: "big",
            probability: 0.01,
            hitAction: () => { console.log("big"); },
            digit: digitList.seven,
        },
        result("regular", 0.05, () => { console.log("reguler"); chance.change(); }, digitList.odd),
        result("small", 0.1, () => { console.log("small"); }, digitList.even),
    ],
    change(){
        currentMode = this;
        remainCount = this.gameCount;
    }
}

const chance = {
    name: "確変",
    gameCount: 50,
    gameCountOver: () => { normal.change() },
    results: [
        result("special", 0.005, () => { console.log("special"); }, digitList.zero),
        result("big", 0.01, () => { console.log("big"); }, digitList.seven),
        result("regular", 0.05, () => { console.log("regular"); }, digitList.odd),
        result("small", 0.3, () => { console.log("small"); }, digitList.even),
    ],
    change(){
        currentMode = this;
        remainCount = this.gameCount;
    }
}

// ゾロ目ではないランダムな図柄を生成
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

currentMode = normal;
remainCount = currentMode.gameCount;

document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && lilleRotation.every(x => x === false)) {
        console.log(randomNumber);

        let probability = 0;
        resultDigit = [];

        remainCount--;
        lilleRotation.fill(true);

        for (const result of currentMode.results) {
            probability += result.probability;

            if (randomNumber < probability) {

                resultDigit = result.digit[Math.floor(Math.random() * result.digit.length)]
                result.hitAction();
                //console.log(result.resultName);
                console.log(resultDigit);

                break;
            }
        }

        if (resultDigit.length === 0) {
            resultDigit = generateDigits();
            console.log(resultDigit);
            displayDigit(resultDigit);
        }

        if (remainCount === 0) {
            currentMode.gameCountOver()
        }
    }

    if (event.key === 'Enter') {
        console.log(currentMode)
        console.log(remainCount)
    }

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