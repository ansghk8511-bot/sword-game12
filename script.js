let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

const IMAGES = {
    0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 6: "bansageom.png", 
    7: "lose.png", 8: "8th.png", 9: "smell.png", 10: "daguri.png", 
    11: "sams.png", 12: "highpass.png", 13: "forbidden.png"
};

// 성공 확률: 3강부터 3.5%씩 감소
function getSuccessRate() {
    if (swordLevel < 3) return 100;
    return Math.max(100 - ((swordLevel - 2) * 3.5), 1.0); // 1.0% 아래로 떨어지지 않게 설정
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = (500 + (swordLevel * 500)).toLocaleString();
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

function logMessage(msg) {
    let logEl = document.getElementById('game-log');
    logEl.innerHTML = msg + "<br>" + logEl.innerHTML;
}

function upgradeSword() {
    let cost = 500 + (swordLevel * 500);
    if (money < cost) { alert("돈이 부족합니다!"); return; }
    money -= cost;
    
    if (Math.random() * 100 <= getSuccessRate()) {
        swordLevel++;
        logMessage(`✨ 성공: +${swordLevel}`);
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

// 나머지 기능
function goToShop() { document.getElementById('game-screen').style.display = 'none'; document.getElementById('shop-screen').style.display = 'block'; document.getElementById('shop-money').innerText = money.toLocaleString(); }
function goToGame() { document.getElementById('shop-screen').style.display = 'none'; document.getElementById('game-screen').style.display = 'block'; updateUI(); }
function buyShield() { if (money >= 5000) { money -= 5000; shieldCount++; logMessage("🛡️ 구매 완료"); updateUI(); } else { alert("돈 부족!"); } }
function sellSword() { if (swordLevel === 0) return; money += (swordLevel * 1000); logMessage(`💰 판매: +${(swordLevel * 1000).toLocaleString()}원`); swordLevel = 0; updateUI(); }
function combineFragments() { if (fragments.length >= 10) { fragments.splice(0, 10); swordLevel++; updateUI(); } else { alert("파편이 10개 필요합니다!"); } }

updateUI();
