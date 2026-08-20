'use strict';

/*


変数・定数・関数定義


*/

const display_name = document.getElementById('display_name');
const display_gameCount = document.getElementById('display_gameCount');

const lilleLeft = document.getElementById('lilleLeft');
const lilleMiddle = document.getElementById('lilleMiddle');
const lilleRight = document.getElementById('lilleRight');

let randomNumber; // 乱数格納用変数
let currentMode; // 現在のモード
let remainCount; // 残りゲームカウント

let hitCount = 0;

let resultDigit = generateDigits(); // 結果確定で出てきた数字を入れる変数 ランダムな値で初期化

let lilleRotation = [false, false, false]; // 各リールが回っているか否か

let displayLille = resultDigit; // 実際に表示されるリールの数字

// アタリ出目リスト
const digitList = {
    zero: [[0, 0, 0]],
    seven: [[7, 7, 7]],
    odd: [[1, 1, 1], [3, 3, 3], [5, 5, 5], [9, 9, 9]],
    even: [[2, 2, 2], [4, 4, 4], [6, 6, 6], [8, 8, 8]],
}

/**　リザルト設定用ファクトリ関数
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

// リール描画
function displayDigit(digits) {
    lilleLeft.innerText = digits[0];
    lilleMiddle.innerText = digits[1];
    lilleRight.innerText = digits[2];
}

/*


モード定義


*/

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
            hitAction: () => { console.log("big"); bigChance.change(); },
            digit: digitList.seven,
        },
        result("regular", 0.05, () => { console.log("reguler"); regularChance.change(); }, digitList.odd),
        result("small", 0.1, () => { console.log("small"); }, digitList.even),
    ],
    change() {
        currentMode = this;
        remainCount = this.gameCount;
    }
}

const regularChance = {
    name: "確変",
    gameCount: 30,
    gameCountOver: () => { normal.change() },
    results: [
        result("special", 0.005, () => { console.log("special"); }, digitList.zero),
        result("big", 0.01, () => { console.log("big"); }, digitList.seven),
        result("regular", 0.05, () => { console.log("regular"); }, digitList.odd),
        result("small", 0.4, () => { console.log("small"); }, digitList.even),
    ],
    change() {
        currentMode = this;
        remainCount = this.gameCount;
    }
}

const bigChance = {
    name: "超確変",
    gameCount: 30,
    gameCountOver: () => { normal.change() },
    results: [
        result("special", 0.005, () => { console.log("special"); }, digitList.zero),
        result("big", 0.01, () => { console.log("big"); }, digitList.seven),
        result("regular", 0.05, () => { console.log("regular"); }, digitList.odd),
        result("small", 0.6, () => { console.log("small"); }, digitList.even),
    ],
    change() {
        currentMode = this;
        remainCount = this.gameCount;
    }
}

/*


処理部分


*/

currentMode = normal;
remainCount = currentMode.gameCount;

display_name.innerText = `現在のモード：${currentMode.name}`
display_gameCount.innerText = ` `;

//画面更新
setInterval(() => {
    randomNumber = Math.random();

    for (let i = 0; i < lilleRotation.length; i++) {
        if (lilleRotation[i]) {
            displayLille[i] = Math.floor(Math.random() * 10);
        } else {
            displayLille[i] = resultDigit[i]
        }

    }

    displayDigit(displayLille);

}, 1);

// キー入力検知
document.addEventListener('keydown', (event) => {

    if (event.key === ' ' && lilleRotation.every(x => x === false)) {
        console.log(randomNumber);

        remainCount--;

        display_name.innerText = `現在のモード：${currentMode.name}`;

        if (currentMode.name === "通常") {
            display_gameCount.innerText = ` `;
        } else {
            display_gameCount.innerText = `残り回数：${remainCount}`;
        }

        let probability = 0;
        resultDigit = [];

        lilleRotation.fill(true);

        for (const result of currentMode.results) {
            probability += result.probability;

            if (randomNumber < probability) {

                resultDigit = result.digit[Math.floor(Math.random() * result.digit.length)]
                result.hitAction();
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

    // if (event.key === 'Enter') {
    //     console.log(currentMode)
    //     console.log(remainCount)
    // }

    if (event.key === 'v') {
        //console.log("v");
        lilleRotation[0] = false;
    }
    if (event.key === 'b') {
        //console.log("b");
        lilleRotation[1] = false;
    }
    if (event.key === 'n') {
        //console.log("n");
        lilleRotation[2] = false;
    }

    // if (event.key === 'a') {
    //     lilleRotation.fill(false);
    // }
});