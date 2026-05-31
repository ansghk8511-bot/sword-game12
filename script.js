let money = 50000;
let shieldCount = 0;
let swordLevel = 0;

const IMAGES = {
    0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 6: "bansageom.png", 
    7: "lose.png", 8: "8th.png", 9: "smell.png", 10: "daguri.png", 
    11: "sams.png", 12: "highpass.png", 13: "forbidden.png"
};

// 1. 성공 확률: 3강부터 3.5%씩 감소
function getSuccessRate() {
    if (swordLevel < 3) return 100;
    return Math.max(100 - ((swordLevel - 2) * 3.5), 1.0);
}

// 2. 강화 비용: 1~20강은 1000원씩, 20강 이후는 3000원씩 상승
function getUpgradeCost() {
    if (swordLevel < 20) {
        return (swordLevel + 1) * 1000;
    } else {
        return 20000 + ((swordLevel - 19) * 3000);
    }
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shop-money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = getUpgradeCost().toLocaleString();
    document.getElementById('success-rate').innerText = getSuccessRate().toFixed(1);
    
    // 이미지 자동 업데이트
    document.getElementById('sword-img').src = IMAGES[swordLevel] || "bokgeom.png";
}

function upgradeSword() {
    let cost = getUpgradeCost();
    if (money < cost) { alert("돈이 부족합니다!"); return; }
    
    money -= cost;
    if (Math.random() * 100 <= getSuccessRate()) {
        swordLevel++;
        log("성공! +"+swordLevel);
    } else {
        if (shieldCount > 0) {
            shieldCount--;
            log("🛡️ 방지권으로 파괴 방지!");
        } else {
            swordLevel = 0;
            log("💥 실패! 검 파괴됨");
        }
    }
    updateUI();
}

function buyShield() {
    if (money >= 5000) {
        money -= 5000;
        shieldCount++;
        log("🛡️ 방지권 구매 완료");
        updateUI();
    } else {
        alert("돈 부족!");
    }
}

function sellSword() {
    money += (swordLevel * 1000);
    log("💰 판매 완료: +" + (swordLevel * 1000) + "원");
    swordLevel = 0;
    updateUI();
}

function log(msg) {
    document.getElementById('game-log').innerHTML = msg + "<br>" + document.getElementById('game-log').innerHTML;
}

function goToShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
}

function goToGame() {
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

updateUI();
