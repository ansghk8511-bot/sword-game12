let money = 50000;
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

const IMAGES = {
    0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 6: "bansageom.png", 
    7: "lose.png", 8: "8th.png", 9: "smell.png", 10: "daguri.png", 
    11: "sams.png", 12: "highpass.png", 13: "forbidden.png"
};

function getSuccessRate() {
    if (swordLevel < 3) return 100;
    return Math.max(100 - ((swordLevel - 2) * 3.5), 1.0);
}

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
    document.getElementById('sell-price').innerText = (swordLevel * 1000).toLocaleString();
    document.getElementById('success-rate').innerText = getSuccessRate().toFixed(1);
    
    // 이미지 처리: 정의된 이미지가 있으면 쓰고, 없으면 기본 bokgeom.png
    document.getElementById('sword-img').src = IMAGES[swordLevel] || "bokgeom.png";

    // 파편 표시
    let fragList = document.getElementById('fragment-list');
    fragList.innerHTML = "";
    fragments.forEach(() => {
        let span = document.createElement("span");
        span.innerText = "💎";
        fragList.appendChild(span);
    });
}

function upgradeSword() {
    let cost = getUpgradeCost();
    if (money < cost) { alert("돈이 부족합니다!"); return; }
    
    money -= cost;
    if (Math.random() * 100 <= getSuccessRate()) {
        swordLevel++;
        log("✨ 성공! +" + swordLevel);
    } else {
        if (shieldCount > 0) {
            shieldCount--;
            log("🛡️ 방지권 소모!");
        } else {
            let earned = Math.floor(swordLevel / 2) + 1;
            for(let i=0; i<earned; i++) fragments.push({});
            swordLevel = 0;
            log("💥 파괴! 파편 " + earned + "개 획득");
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

function combineFragments() {
    if (fragments.length >= 10) {
        fragments.splice(0, 10);
        swordLevel++;
        log("🛠️ 파편으로 검 복구!");
        updateUI();
    } else {
        alert("파편이 10개 필요합니다!");
    }
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
