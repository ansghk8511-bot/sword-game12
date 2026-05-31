let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

// 검 이미지 데이터
const IMAGES = {
    0: "bokgeom.png", 4: "bat.png", 5: "yugi.png", 
    6: "bansageom.png", 7: "lose.png", 8: "8th.png", 
    9: "smell.png", 10: "daguri.png", 11: "sams.png", 
    12: "highpass.png", 13: "forbidden.png"
};

function goToShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
}

function goToGame() {
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updateUI();
}

function updateUI() {
    document.getElementById('money').innerText = money.toLocaleString();
    document.getElementById('shield-count').innerText = shieldCount;
    document.getElementById('level-display').innerText = "+" + swordLevel;
    document.getElementById('upgrade-cost').innerText = (500 + (swordLevel * 500)).toLocaleString();
    
    // 이미지 업데이트
    let imgDisplay = document.getElementById('sword-img');
    let img = "bokgeom.png"; // 기본값
    for (let i = swordLevel; i >= 0; i--) {
        if (IMAGES[i]) { img = IMAGES[i]; break; }
    }
    if (imgDisplay) imgDisplay.src = img;

    let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
    document.getElementById('shield-req').innerText = req > 0 ? `실패 시 방지권 ${req}개 소모` : "방어 불가";
    
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
    if(logEl) logEl.innerHTML = msg + "<br>" + logEl.innerHTML;
}

function upgradeSword() {
    let cost = 500 + (swordLevel * 500);
    if (swordLevel === 0 && money < cost) { alert("💀 파산!"); location.reload(); return; }
    if (money < cost) { alert("⚠️ 돈 부족!"); return; }
    
    money -= cost;
    let rate = Math.max(100 - (swordLevel * 5), 0.5);
    
    if (Math.random() * 100 <= rate) {
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

function buyShield() {
    if (money >= 5000) { money -= 5000; shieldCount++; logMessage("🛡️ 방지권 구매"); updateUI(); }
    else { alert("❌ 돈 부족!"); }
}

function sellSword() {
    if (swordLevel === 0) return;
    money += (swordLevel * 1000);
    swordLevel = 0;
    updateUI();
}

function combineFragments() {
    if (fragments.length >= 10) { fragments.splice(0, 10); swordLevel++; updateUI(); }
    else { alert("❌ 파편 부족!"); }
}

updateUI();
