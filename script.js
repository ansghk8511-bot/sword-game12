let money = 50000; 
let shieldCount = 0;
let swordLevel = 0;
let fragments = [];

function goToShop() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'block';
    document.getElementById('shop-money').innerText = money.toLocaleString();
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
    
    // 판매가: 레벨이 높을수록 제곱으로 비싸지게 설정 (예: 10강=10만, 20강=40만)
    let price = swordLevel * swordLevel * 1000;
    document.getElementById('sell-price').innerText = price.toLocaleString();
    
    // 이미지 자동 매칭
    document.getElementById('sword-img').src = "level" + swordLevel + ".png";

    let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
    document.getElementById('shield-req').innerText = req > 0 ? `⚠️ 실패 시 방지권 ${req}개 소모!` : "방어 불가";
    
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
    let rate = Math.max(100 - (swordLevel * 5), 0.5);
    
    if (Math.random() * 100 <= rate) {
        swordLevel++;
        logMessage(`✨ 강화 성공: +${swordLevel}`);
    } else {
        let req = (swordLevel < 5) ? 0 : Math.floor((swordLevel - 5) / 1) + 2;
        if (req > 0 && shieldCount >= req) {
            shieldCount -= req;
            logMessage(`🛡️ 방지권 ${req}개 소모하여 방어!`);
        } else {
            // 파편 지급 로직 명확화
            let earned = Math.floor(swordLevel / 2) + 1;
            for(let i = 0; i < earned; i++) fragments.push({});
            swordLevel = 0;
            logMessage(`💥 검 파괴! 파편 ${earned}개 획득`);
        }
    }
    updateUI();
}

function buyShield() {
    if (money >= 5000) { 
        money -= 5000; 
        shieldCount++; 
        logMessage("🛡️ 방지권 구매 완료 (-5,000원)"); 
        document.getElementById('shop-money').innerText = money.toLocaleString();
    } else { alert("잔액 부족!"); }
}

function sellSword() {
    if (swordLevel === 0) return;
    let price = swordLevel * swordLevel * 1000;
    money += price;
    logMessage(`💰 판매 완료: +${price.toLocaleString()}원`);
    swordLevel = 0;
    updateUI();
}

function combineFragments() {
    if (fragments.length >= 10) { 
        fragments.splice(0, 10); 
        swordLevel++; 
        logMessage("🛠️ 파편 10개 결합! 단계 상승");
        updateUI(); 
    } else { alert("파편이 10개 필요합니다!"); }
}

updateUI();
