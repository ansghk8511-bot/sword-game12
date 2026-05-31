let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

const IMAGES = {
    0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 6: "bansageom.png", 
    7: "lose.png", 8: "8th.png", 9: "smell.png", 10: "daguri.png", 
    11: "sams.png", 12: "highpass.png", 13: "forbidden.png"
};

/**
 * [강화 규칙]
 * 1. 성공 확률: 3강부터 3.5%씩 감소 (최소 1%)
 * 2. 강화 비용: 1~20강은 1000원씩 상승, 20강 이후는 3000원씩 상승
 */

// 1. 성공 확률 계산
function getSuccessRate() {
    if (swordLevel < 3) return 100;
    // 3강일 때 100 - (1 * 3.5), 4강일 때 100 - (2 * 3.5)...
    return Math.max(100 - ((swordLevel - 2) * 3.5), 1.0);
}

// 2. 강화 비용 계산
function getUpgradeCost() {
    // 0강 -> 1강 갈 때: (0 + 1) * 1000 = 1000원
    // 19강 -> 20강 갈 때: (19 + 1) * 1000 = 20000원
    if (swordLevel < 20) {
        return (swordLevel + 1) * 1000;
    } else {
        // 20강(20000원) 이후 3000원씩 추가
        return 20000 + ((swordLevel - 19) * 3000);
    }
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    
    // 비용과 확률 업데이트
    document.getElementById('upgrade-cost').innerText = getUpgradeCost().toLocaleString();
    document.getElementById('sell-price').innerText = (swordLevel * 1000).toLocaleString();
    document.getElementById('success-rate').innerText = getSuccessRate().toFixed(1);
    
    document.getElementById('sword-img').src = IMAGES[swordLevel] || "bokgeom.png";

    let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
    document.getElementById('shield-req').innerText = req > 0 ? `⚠️ 실패 시 방지권 ${req}개 소모!` : "";
    
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
    if (money < cost) { 
        alert("돈이 부족합니다!"); 
        return; 
    }
    
    money -= cost;
    
    if (Math.random() * 100 <= getSuccessRate()) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel} (비용: ${cost.toLocaleString()}원)`);
    } else {
        let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
        if (req > 0 && shieldCount >= req) {
            shieldCount -= req;
            logMessage(`🛡️ 방지권 ${req}개 소모!`);
        } else {
            let earned = Math.floor(swordLevel / 2) + 1;
            for(let i = 0; i < earned; i++) fragments.push({});
            swordLevel = 0;
            logMessage(`💥 파괴! 파편 ${earned}개 획득`);
        }
    }
    updateUI();
}

// 상점 및 기타 기능
function logMessage(msg) { let logEl = document.getElementById('game-log'); logEl.innerHTML = msg + "<br>" + logEl.innerHTML; }
function goToShop() { document.getElementById('game-screen').style.display = 'none'; document.getElementById('shop-screen').style.display = 'block'; document.getElementById('shop-money').innerText = money.toLocaleString(); }
function goToGame() { document.getElementById('shop-screen').style.display = 'none'; document.getElementById('game-screen').style.display = 'block'; updateUI(); }
function buyShield() { if (money >= 5000) { money -= 5000; shieldCount++; logMessage("🛡️ 구매 완료"); updateUI(); } else { alert("돈 부족!"); } }
function sellSword() { if (swordLevel === 0) return; money += (swordLevel * 1000); logMessage(`💰 판매: +${(swordLevel * 1000).toLocaleString()}원`); swordLevel = 0; updateUI(); }
function combineFragments() { if (fragments.length >= 10) { fragments.splice(0, 10); swordLevel++; updateUI(); } else { alert("파편이 10개 필요합니다!"); } }

updateUI();
