// Game State
const game = {
    honey: 0,
    totalHoney: 0,
    totalClicks: 0,
    clickValue: 1,

    // Phase 2: Money system
    money: 0,
    totalMoney: 0,

    // Phase 3: DNA system
    dna: 0,

    // Upgrades
    upgrades: {
        workerBee: { owned: 0, baseCost: 10, costMultiplier: 1.15, hps: 0.1 },
        hive: { owned: 0, baseCost: 100, costMultiplier: 1.15, hps: 1 },
        apiary: { owned: 0, baseCost: 1000, costMultiplier: 1.15, hps: 10 },
        queenBee: { owned: 0, baseCost: 5000, costMultiplier: 1.15, hps: 50 },
        flowerField: { owned: 0, baseCost: 25000, costMultiplier: 1.15, hps: 200 }
    },

    // Research (one-time purchases)
    research: {
        efficiency: { purchased: false, cost: 50 },
        breeding: { purchased: false, cost: 500 },
        marketing: { purchased: false, cost: 1000 },
        geneticsUnlock: { purchased: false, cost: 10000 }
    },

    // Phase 2: Flowers (boost production)
    flowers: {
        wildflower: { owned: 0, baseCost: 50, costMultiplier: 1.2, bonus: 0.05 },
        lavender: { owned: 0, baseCost: 200, costMultiplier: 1.2, bonus: 0.10 },
        sunflower: { owned: 0, baseCost: 1000, costMultiplier: 1.2, bonus: 0.20 }
    },

    // Phase 2: Products (passive money income)
    products: {
        beeswax: { owned: 0, baseCost: 500, costMultiplier: 1.15, mps: 1 },
        royalJelly: { owned: 0, baseCost: 5000, costMultiplier: 1.15, mps: 10 },
        propolis: { owned: 0, baseCost: 25000, costMultiplier: 1.15, mps: 50 }
    },

    // Phase 3: Bee strains
    strains: {
        speedBee: { level: 0, baseCost: 5, costMultiplier: 2, effect: 0.25 },
        tankBee: { level: 0, baseCost: 5, costMultiplier: 2, effect: 0.50 },
        goldenBee: { level: 0, baseCost: 10, costMultiplier: 2, effect: 0.20 },
        mutantBee: { level: 0, baseCost: 25, costMultiplier: 2.5, effect: 0.10 }
    },

    // Phase 3: Mutations (one-time DNA purchases)
    mutations: {
        immunity: { purchased: false, cost: 20 },
        longevity: { purchased: false, cost: 30 },
        hyperBreeding: { purchased: false, cost: 50 }
    },

    // Multipliers
    multipliers: {
        workerBee: 1,
        hive: 1,
        click: 1,
        global: 1,
        price: 1
    },

    // Market
    market: {
        basePrice: 1,
        demand: 1,
        demandTimer: 0
    }
};

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Calculate cost of upgrade
function getUpgradeCost(upgradeId) {
    const upgrade = game.upgrades[upgradeId];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
}

function getFlowerCost(flowerId) {
    const flower = game.flowers[flowerId];
    return Math.floor(flower.baseCost * Math.pow(flower.costMultiplier, flower.owned));
}

function getProductCost(productId) {
    const product = game.products[productId];
    return Math.floor(product.baseCost * Math.pow(product.costMultiplier, product.owned));
}

function getStrainCost(strainId) {
    const strain = game.strains[strainId];
    return Math.floor(strain.baseCost * Math.pow(strain.costMultiplier, strain.level));
}

// Calculate flower bonus
function getFlowerBonus() {
    let bonus = 0;
    for (const flower of Object.values(game.flowers)) {
        bonus += flower.owned * flower.bonus;
    }
    return bonus;
}

// Calculate honey per second
function getHoneyPerSecond() {
    let hps = 0;

    for (const [id, upgrade] of Object.entries(game.upgrades)) {
        let multiplier = game.multipliers[id] || 1;
        hps += upgrade.owned * upgrade.hps * multiplier;
    }

    // Apply flower bonus
    hps *= (1 + getFlowerBonus());

    // Apply global multiplier (from strains)
    hps *= game.multipliers.global;

    return hps;
}

// Calculate money per second
function getMoneyPerSecond() {
    let mps = 0;
    for (const product of Object.values(game.products)) {
        mps += product.owned * product.mps;
    }
    return mps;
}

// Get current honey price
function getHoneyPrice() {
    return game.market.basePrice * game.market.demand * game.multipliers.price;
}

// Collect honey (click action)
function collectHoney(event) {
    const amount = game.clickValue * game.multipliers.click;
    game.honey += amount;
    game.totalHoney += amount;
    game.totalClicks++;

    // Create floating text
    if (event) {
        createFloatingText(event, amount);
        createRipple(event);
    }

    // Button pulse animation
    const btn = document.getElementById('collect-btn');
    btn.classList.remove('clicked');
    void btn.offsetWidth; // Trigger reflow
    btn.classList.add('clicked');

    updateUI();
}

// Create floating text animation
function createFloatingText(event, amount) {
    const container = document.getElementById('float-container');
    const btn = document.getElementById('collect-btn');
    const rect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    floatText.textContent = `+${amount}`;

    // Position near click with some randomness
    const x = event.clientX - containerRect.left + (Math.random() - 0.5) * 40;
    const y = event.clientY - containerRect.top - 10;

    floatText.style.left = `${x}px`;
    floatText.style.top = `${y}px`;

    container.appendChild(floatText);

    // Remove after animation
    setTimeout(() => {
        floatText.remove();
    }, 1000);
}

// Create ripple effect
function createRipple(event) {
    const btn = document.getElementById('collect-btn');
    const rect = btn.getBoundingClientRect();

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 400);
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const cost = getUpgradeCost(upgradeId);

    if (game.honey >= cost) {
        game.honey -= cost;
        game.upgrades[upgradeId].owned++;
        checkUnlocks();
        updateUI();
    }
}

// Buy research
function buyResearch(researchId) {
    const research = game.research[researchId];

    if (!research.purchased && game.honey >= research.cost) {
        game.honey -= research.cost;
        research.purchased = true;
        applyResearch(researchId);
        document.getElementById(`research-${researchId}`).style.display = 'none';
        updateUI();
    }
}

// Apply research effects
function applyResearch(researchId) {
    switch (researchId) {
        case 'efficiency':
            game.multipliers.click = 2;
            document.getElementById('collect-btn').querySelector('.btn-info').textContent =
                `+${game.clickValue * game.multipliers.click} honey`;
            document.getElementById('research-breeding').style.display = 'block';
            break;
        case 'breeding':
            game.multipliers.workerBee = 2;
            document.getElementById('research-marketing').style.display = 'block';
            break;
        case 'marketing':
            document.getElementById('tab-market').style.display = 'block';
            document.getElementById('secondary-display').style.display = 'block';
            document.getElementById('total-money-stat').style.display = 'block';
            document.getElementById('flower-bonus-stat').style.display = 'block';
            document.getElementById('research-genetics').style.display = 'block';
            break;
        case 'geneticsUnlock':
            document.getElementById('tab-genetics').style.display = 'block';
            break;
    }
}

// Phase 2: Sell honey
function sellHoney(amount) {
    const toSell = Math.min(amount, Math.floor(game.honey));
    if (toSell > 0) {
        const earnings = toSell * getHoneyPrice();
        game.honey -= toSell;
        game.money += earnings;
        game.totalMoney += earnings;
        updateUI();
    }
}

function sellAllHoney() {
    sellHoney(Math.floor(game.honey));
}

// Phase 2: Buy flowers
function buyFlower(flowerId) {
    const cost = getFlowerCost(flowerId);
    if (game.money >= cost) {
        game.money -= cost;
        game.flowers[flowerId].owned++;
        checkUnlocks();
        updateUI();
    }
}

// Phase 2: Buy products
function buyProduct(productId) {
    const cost = getProductCost(productId);
    if (game.money >= cost) {
        game.money -= cost;
        game.products[productId].owned++;
        checkUnlocks();
        updateUI();
    }
}

// Phase 3: Generate DNA
function generateDNA() {
    let cost = 1000;
    if (game.mutations.hyperBreeding.purchased) {
        cost = 500;
    }

    if (game.honey >= cost) {
        game.honey -= cost;
        game.dna += 1;
        updateUI();
    }
}

// Phase 3: Breed strain
function breedStrain(strainId) {
    const cost = getStrainCost(strainId);
    if (game.dna >= cost) {
        game.dna -= cost;
        game.strains[strainId].level++;
        applyStrain(strainId);
        checkUnlocks();
        updateUI();
    }
}

// Apply strain effects
function applyStrain(strainId) {
    const strain = game.strains[strainId];
    switch (strainId) {
        case 'speedBee':
            game.multipliers.global = 1 + (strain.level * strain.effect);
            break;
        case 'tankBee':
            game.multipliers.hive = 1 + (strain.level * strain.effect);
            break;
        case 'goldenBee':
            game.multipliers.price = 1 + (strain.level * strain.effect);
            break;
        case 'mutantBee':
            // Boost all existing multipliers
            const boost = 1 + (strain.level * strain.effect);
            game.multipliers.global *= boost;
            break;
    }
}

// Phase 3: Buy mutation
function buyMutation(mutationId) {
    const mutation = game.mutations[mutationId];
    if (!mutation.purchased && game.dna >= mutation.cost) {
        game.dna -= mutation.cost;
        mutation.purchased = true;
        applyMutation(mutationId);
        document.getElementById(`mutation-${mutationId}`).style.display = 'none';
        checkUnlocks();
        updateUI();
    }
}

// Apply mutation effects
function applyMutation(mutationId) {
    switch (mutationId) {
        case 'immunity':
            // Prevents random events (not implemented yet)
            break;
        case 'longevity':
            // Handled in offline calculation
            break;
        case 'hyperBreeding':
            // Updates DNA cost display
            document.getElementById('generate-dna-btn').textContent = 'Generate DNA (500 honey)';
            break;
    }
}

// Check for unlocks based on progress
function checkUnlocks() {
    // Unlock research section
    if (game.totalHoney >= 30) {
        document.getElementById('research').style.display = 'block';
    }

    // Unlock hive
    if (game.upgrades.workerBee.owned >= 5 || game.totalHoney >= 50) {
        document.getElementById('buy-hive').style.display = 'block';
    }

    // Unlock apiary
    if (game.upgrades.hive.owned >= 3 || game.totalHoney >= 500) {
        document.getElementById('buy-apiary').style.display = 'block';
    }

    // Unlock queen bee
    if (game.upgrades.apiary.owned >= 2 || game.totalHoney >= 2500) {
        document.getElementById('buy-queenBee').style.display = 'block';
    }

    // Unlock flower field
    if (game.upgrades.queenBee.owned >= 2 || game.totalHoney >= 12500) {
        document.getElementById('buy-flowerField').style.display = 'block';
    }

    // Phase 2 unlocks
    if (game.flowers.wildflower.owned >= 3) {
        document.getElementById('buy-lavender').style.display = 'block';
    }
    if (game.flowers.lavender.owned >= 3) {
        document.getElementById('buy-sunflower').style.display = 'block';
    }
    if (game.products.beeswax.owned >= 3) {
        document.getElementById('buy-royalJelly').style.display = 'block';
    }
    if (game.products.royalJelly.owned >= 3) {
        document.getElementById('buy-propolis').style.display = 'block';
    }

    // Phase 3 unlocks
    if (game.strains.speedBee.level >= 2 && game.strains.tankBee.level >= 2) {
        document.getElementById('breed-mutantBee').style.display = 'block';
    }
    if (game.mutations.longevity.purchased) {
        document.getElementById('mutation-hyperBreeding').style.display = 'block';
    }
}

// Update market demand
function updateMarket() {
    game.market.demandTimer++;
    if (game.market.demandTimer >= 100) { // Every 10 seconds
        game.market.demandTimer = 0;
        game.market.demand = 0.5 + Math.random() * 1.5; // 0.5 to 2.0
    }
}

// Update UI
function updateUI() {
    // Main display
    document.getElementById('honey-count').textContent = formatNumber(Math.floor(game.honey));
    document.getElementById('hps').textContent = formatNumber(getHoneyPerSecond(), 1);
    document.getElementById('money-count').textContent = formatNumber(Math.floor(game.money));

    // Stats
    document.getElementById('total-honey').textContent = formatNumber(Math.floor(game.totalHoney));
    document.getElementById('total-clicks').textContent = formatNumber(game.totalClicks);
    document.getElementById('total-money').textContent = formatNumber(Math.floor(game.totalMoney));
    document.getElementById('flower-bonus').textContent = Math.round(getFlowerBonus() * 100);

    // Market
    const price = getHoneyPrice();
    document.getElementById('honey-price').textContent = price.toFixed(2);
    const demandText = game.market.demand < 0.8 ? 'Low' : game.market.demand > 1.3 ? 'High' : 'Normal';
    document.getElementById('market-demand').textContent = demandText;

    // DNA
    document.getElementById('dna-count').textContent = game.dna;
    const dnaCost = game.mutations.hyperBreeding.purchased ? 500 : 1000;
    document.getElementById('generate-dna-btn').disabled = game.honey < dnaCost;

    // Upgrades
    for (const [id, upgrade] of Object.entries(game.upgrades)) {
        const cost = getUpgradeCost(id);
        const costEl = document.getElementById(`${id}-cost`);
        const ownedEl = document.getElementById(`${id}-owned`);
        const btnEl = document.getElementById(`buy-${id}`);

        if (costEl) costEl.textContent = formatNumber(cost);
        if (ownedEl) ownedEl.textContent = upgrade.owned;

        if (btnEl) {
            btnEl.disabled = game.honey < cost;
            btnEl.classList.toggle('affordable', game.honey >= cost);
        }
    }

    // Research
    for (const [id, research] of Object.entries(game.research)) {
        const btnEl = document.getElementById(`research-${id}`);
        if (btnEl && !research.purchased) {
            btnEl.disabled = game.honey < research.cost;
            btnEl.classList.toggle('affordable', game.honey >= research.cost);
        }
    }

    // Flowers
    for (const [id, flower] of Object.entries(game.flowers)) {
        const cost = getFlowerCost(id);
        const costEl = document.getElementById(`${id}-cost`);
        const ownedEl = document.getElementById(`${id}-owned`);
        const btnEl = document.getElementById(`buy-${id}`);

        if (costEl) costEl.textContent = formatNumber(cost);
        if (ownedEl) ownedEl.textContent = flower.owned;

        if (btnEl) {
            btnEl.disabled = game.money < cost;
            btnEl.classList.toggle('affordable', game.money >= cost);
        }
    }

    // Products
    for (const [id, product] of Object.entries(game.products)) {
        const cost = getProductCost(id);
        const costEl = document.getElementById(`${id}-cost`);
        const ownedEl = document.getElementById(`${id}-owned`);
        const btnEl = document.getElementById(`buy-${id}`);

        if (costEl) costEl.textContent = formatNumber(cost);
        if (ownedEl) ownedEl.textContent = product.owned;

        if (btnEl) {
            btnEl.disabled = game.money < cost;
            btnEl.classList.toggle('affordable', game.money >= cost);
        }
    }

    // Strains
    for (const [id, strain] of Object.entries(game.strains)) {
        const cost = getStrainCost(id);
        const costEl = document.getElementById(`${id}-cost`);
        const levelEl = document.getElementById(`${id}-level`);
        const btnEl = document.getElementById(`breed-${id}`);

        if (costEl) costEl.textContent = cost;
        if (levelEl) levelEl.textContent = strain.level;

        if (btnEl) {
            btnEl.disabled = game.dna < cost;
            btnEl.classList.toggle('affordable', game.dna >= cost);
        }
    }

    // Mutations
    for (const [id, mutation] of Object.entries(game.mutations)) {
        const btnEl = document.getElementById(`mutation-${id}`);
        if (btnEl && !mutation.purchased) {
            btnEl.disabled = game.dna < mutation.cost;
            btnEl.classList.toggle('affordable', game.dna >= mutation.cost);
        }
    }
}

// Format large numbers
function formatNumber(num, decimals = 0) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return decimals ? num.toFixed(decimals) : num.toString();
}

// Game loop
function gameLoop() {
    const hps = getHoneyPerSecond();
    const mps = getMoneyPerSecond();

    // Running at 10 ticks per second
    const honeyGained = hps / 10;
    const moneyGained = mps / 10;

    game.honey += honeyGained;
    game.totalHoney += honeyGained;
    game.money += moneyGained;
    game.totalMoney += moneyGained;

    updateMarket();
    updateUI();
}

// Save game
function saveGame() {
    const saveData = {
        honey: game.honey,
        totalHoney: game.totalHoney,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        money: game.money,
        totalMoney: game.totalMoney,
        dna: game.dna,
        upgrades: game.upgrades,
        research: game.research,
        flowers: game.flowers,
        products: game.products,
        strains: game.strains,
        mutations: game.mutations,
        multipliers: game.multipliers,
        market: game.market,
        timestamp: Date.now()
    };

    localStorage.setItem('universalHoneySave', JSON.stringify(saveData));
    document.getElementById('save-status').textContent = 'Game saved!';
    setTimeout(() => {
        document.getElementById('save-status').textContent = '';
    }, 2000);
}

// Load game
function loadGame() {
    const saveData = localStorage.getItem('universalHoneySave');

    if (saveData) {
        const data = JSON.parse(saveData);

        game.honey = data.honey || 0;
        game.totalHoney = data.totalHoney || 0;
        game.totalClicks = data.totalClicks || 0;
        game.clickValue = data.clickValue || 1;
        game.money = data.money || 0;
        game.totalMoney = data.totalMoney || 0;
        game.dna = data.dna || 0;

        // Load upgrades
        if (data.upgrades) {
            for (const [id, upgrade] of Object.entries(data.upgrades)) {
                if (game.upgrades[id]) {
                    game.upgrades[id].owned = upgrade.owned;
                }
            }
        }

        // Load research
        if (data.research) {
            for (const [id, research] of Object.entries(data.research)) {
                if (game.research[id]) {
                    game.research[id].purchased = research.purchased;
                    if (research.purchased) {
                        applyResearch(id);
                    }
                }
            }
        }

        // Load flowers
        if (data.flowers) {
            for (const [id, flower] of Object.entries(data.flowers)) {
                if (game.flowers[id]) {
                    game.flowers[id].owned = flower.owned;
                }
            }
        }

        // Load products
        if (data.products) {
            for (const [id, product] of Object.entries(data.products)) {
                if (game.products[id]) {
                    game.products[id].owned = product.owned;
                }
            }
        }

        // Load strains
        if (data.strains) {
            for (const [id, strain] of Object.entries(data.strains)) {
                if (game.strains[id]) {
                    game.strains[id].level = strain.level;
                    if (strain.level > 0) {
                        applyStrain(id);
                    }
                }
            }
        }

        // Load mutations
        if (data.mutations) {
            for (const [id, mutation] of Object.entries(data.mutations)) {
                if (game.mutations[id]) {
                    game.mutations[id].purchased = mutation.purchased;
                    if (mutation.purchased) {
                        applyMutation(id);
                    }
                }
            }
        }

        // Load multipliers
        if (data.multipliers) {
            game.multipliers = { ...game.multipliers, ...data.multipliers };
        }

        // Load market
        if (data.market) {
            game.market = { ...game.market, ...data.market };
        }

        // Calculate offline progress
        if (data.timestamp) {
            const offlineSeconds = (Date.now() - data.timestamp) / 1000;
            let offlineEfficiency = 0.5;
            if (game.mutations.longevity.purchased) {
                offlineEfficiency = 1.0;
            }

            const offlineHoney = getHoneyPerSecond() * offlineSeconds * offlineEfficiency;
            const offlineMoney = getMoneyPerSecond() * offlineSeconds * offlineEfficiency;

            if (offlineHoney > 0 || offlineMoney > 0) {
                game.honey += offlineHoney;
                game.totalHoney += offlineHoney;
                game.money += offlineMoney;
                game.totalMoney += offlineMoney;

                let message = `Welcome back! You earned `;
                if (offlineHoney > 0) message += `${formatNumber(Math.floor(offlineHoney))} honey`;
                if (offlineHoney > 0 && offlineMoney > 0) message += ` and `;
                if (offlineMoney > 0) message += `${formatNumber(Math.floor(offlineMoney))} coins`;
                message += ` while away.`;

                alert(message);
            }
        }

        checkUnlocks();
        updateUI();
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
        localStorage.removeItem('universalHoneySave');
        location.reload();
    }
}

// Auto-save every 30 seconds
setInterval(saveGame, 30000);

// Initialize game
window.onload = function() {
    loadGame();
    checkUnlocks();
    updateUI();

    // Start game loop (10 ticks per second)
    setInterval(gameLoop, 100);
};

// Save before closing
window.onbeforeunload = function() {
    saveGame();
};
