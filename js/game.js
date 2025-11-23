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

    // Phase 4: Global pollination
    earthPollinated: 0,

    // Phase 5: Universe
    universePollinated: 0,

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
        geneticsUnlock: { purchased: false, cost: 10000 },
        globalNetwork: { purchased: false, cost: 100000 }
    },

    // Phase 2: Flowers
    flowers: {
        wildflower: { owned: 0, baseCost: 50, costMultiplier: 1.2, bonus: 0.05 },
        lavender: { owned: 0, baseCost: 200, costMultiplier: 1.2, bonus: 0.10 },
        sunflower: { owned: 0, baseCost: 1000, costMultiplier: 1.2, bonus: 0.20 }
    },

    // Phase 2: Products
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

    // Phase 3: Mutations
    mutations: {
        immunity: { purchased: false, cost: 20 },
        longevity: { purchased: false, cost: 30 },
        hyperBreeding: { purchased: false, cost: 50 }
    },

    // Phase 4: Regions
    regions: {
        meadows: { swarms: 0, baseCost: 50000, costMultiplier: 1.5, hps: 1000, pollination: 0.001 },
        forests: { swarms: 0, baseCost: 250000, costMultiplier: 1.5, hps: 5000, pollination: 0.005 },
        mountains: { swarms: 0, baseCost: 1000000, costMultiplier: 1.5, hps: 20000, pollination: 0.01 },
        oceans: { swarms: 0, baseCost: 5000000, costMultiplier: 1.5, hps: 100000, pollination: 0.05 }
    },

    // Phase 4: Eco upgrades
    ecoUpgrades: {
        biodiversity: { purchased: false, cost: 100000 },
        climate: { purchased: false, cost: 1000000 }
    },

    // Phase 5: Planets
    planets: {
        mars: { domes: 0, baseCost: 10000000, costMultiplier: 2, hps: 500000, universe: 0.0001 },
        europa: { domes: 0, baseCost: 50000000, costMultiplier: 2, hps: 2000000, universe: 0.0005 },
        titan: { domes: 0, baseCost: 250000000, costMultiplier: 2, hps: 10000000, universe: 0.001 },
        exoplanet: { domes: 0, baseCost: 1000000000, costMultiplier: 2, hps: 100000000, universe: 0.01 }
    },

    // Phase 5: Space tech
    spaceTech: {
        warpDrive: { purchased: false, cost: 100000000 },
        dysonSwarm: { purchased: false, cost: 1000000000 }
    },

    // Multipliers
    multipliers: {
        workerBee: 1,
        hive: 1,
        click: 1,
        global: 1,
        price: 1,
        region: 1,
        space: 1
    },

    // Market
    market: {
        basePrice: 1,
        demand: 1,
        demandTimer: 0
    },

    // Achievements
    achievements: {}
};

// Achievement definitions
const achievementDefs = {
    firstClick: { name: "First Steps", desc: "Click to collect honey", icon: "🐝", check: () => game.totalClicks >= 1 },
    hundredClicks: { name: "Busy Bee", desc: "Click 100 times", icon: "👆", check: () => game.totalClicks >= 100 },
    thousandClicks: { name: "Click Master", desc: "Click 1,000 times", icon: "🖱️", check: () => game.totalClicks >= 1000 },
    firstHundred: { name: "Sweet Start", desc: "Collect 100 honey", icon: "🍯", check: () => game.totalHoney >= 100 },
    firstThousand: { name: "Honey Hoarder", desc: "Collect 1,000 honey", icon: "🏆", check: () => game.totalHoney >= 1000 },
    firstMillion: { name: "Millionaire", desc: "Collect 1M honey", icon: "💰", check: () => game.totalHoney >= 1000000 },
    firstBillion: { name: "Billionaire", desc: "Collect 1B honey", icon: "🤑", check: () => game.totalHoney >= 1000000000 },
    tenWorkers: { name: "Workforce", desc: "Own 10 worker bees", icon: "👷", check: () => game.upgrades.workerBee.owned >= 10 },
    firstHive: { name: "Hive Mind", desc: "Build your first hive", icon: "🏠", check: () => game.upgrades.hive.owned >= 1 },
    fiveHives: { name: "Colony", desc: "Own 5 hives", icon: "🏘️", check: () => game.upgrades.hive.owned >= 5 },
    firstApiary: { name: "Beekeeper", desc: "Build your first apiary", icon: "🏭", check: () => game.upgrades.apiary.owned >= 1 },
    firstQueen: { name: "Royalty", desc: "Get your first queen bee", icon: "👑", check: () => game.upgrades.queenBee.owned >= 1 },
    marketUnlock: { name: "Entrepreneur", desc: "Unlock the market", icon: "📈", check: () => game.research.marketing.purchased },
    firstSale: { name: "First Sale", desc: "Earn your first coin", icon: "🪙", check: () => game.totalMoney >= 1 },
    richBee: { name: "Rich Bee", desc: "Earn 10,000 coins", icon: "💎", check: () => game.totalMoney >= 10000 },
    geneticist: { name: "Geneticist", desc: "Unlock the genetics lab", icon: "🧬", check: () => game.research.geneticsUnlock.purchased },
    firstDNA: { name: "DNA Discovery", desc: "Generate your first DNA", icon: "🔬", check: () => game.dna >= 1 },
    mutated: { name: "Mutated", desc: "Buy your first mutation", icon: "☣️", check: () => Object.values(game.mutations).some(m => m.purchased) },
    globalReach: { name: "Global Reach", desc: "Unlock global pollination", icon: "🌍", check: () => game.research.globalNetwork.purchased },
    earthComplete: { name: "Earth Saved", desc: "Pollinate 100% of Earth", icon: "🌎", check: () => game.earthPollinated >= 100 },
    spaceExplorer: { name: "Space Explorer", desc: "Colonize your first planet", icon: "🚀", check: () => game.planets.mars.domes >= 1 },
    universeConquer: { name: "Universal", desc: "Pollinate 1% of universe", icon: "✨", check: () => game.universePollinated >= 1 }
};

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Cost calculations
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

function getRegionCost(regionId) {
    const region = game.regions[regionId];
    return Math.floor(region.baseCost * Math.pow(region.costMultiplier, region.swarms));
}

function getPlanetCost(planetId) {
    const planet = game.planets[planetId];
    return Math.floor(planet.baseCost * Math.pow(planet.costMultiplier, planet.domes));
}

// Calculate bonuses
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

    // Base upgrades
    for (const [id, upgrade] of Object.entries(game.upgrades)) {
        let multiplier = game.multipliers[id] || 1;
        hps += upgrade.owned * upgrade.hps * multiplier;
    }

    // Regions (Phase 4)
    for (const region of Object.values(game.regions)) {
        hps += region.swarms * region.hps * game.multipliers.region;
    }

    // Planets (Phase 5)
    for (const planet of Object.values(game.planets)) {
        hps += planet.domes * planet.hps * game.multipliers.space;
    }

    // Apply flower bonus
    hps *= (1 + getFlowerBonus());

    // Apply global multiplier
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

    if (event) {
        createFloatingText(event, amount);
        createRipple(event);
    }

    const btn = document.getElementById('collect-btn');
    btn.classList.remove('clicked');
    void btn.offsetWidth;
    btn.classList.add('clicked');

    checkAchievements();
    updateUI();
}

// Create floating text animation
function createFloatingText(event, amount) {
    const container = document.getElementById('float-container');
    const containerRect = container.getBoundingClientRect();

    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    floatText.textContent = `+${formatNumber(amount)}`;

    const x = event.clientX - containerRect.left + (Math.random() - 0.5) * 40;
    const y = event.clientY - containerRect.top - 10;

    floatText.style.left = `${x}px`;
    floatText.style.top = `${y}px`;

    container.appendChild(floatText);
    setTimeout(() => floatText.remove(), 1000);
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
    setTimeout(() => ripple.remove(), 400);
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const cost = getUpgradeCost(upgradeId);
    if (game.honey >= cost) {
        game.honey -= cost;
        game.upgrades[upgradeId].owned++;
        checkUnlocks();
        checkAchievements();
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
        checkAchievements();
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
            document.getElementById('research-globalNetwork').style.display = 'block';
            break;
        case 'globalNetwork':
            document.getElementById('tab-global').style.display = 'block';
            break;
    }
}

// Sell honey
function sellHoney(amount) {
    const toSell = Math.min(amount, Math.floor(game.honey));
    if (toSell > 0) {
        const earnings = toSell * getHoneyPrice();
        game.honey -= toSell;
        game.money += earnings;
        game.totalMoney += earnings;
        checkAchievements();
        updateUI();
    }
}

function sellAllHoney() {
    sellHoney(Math.floor(game.honey));
}

// Buy flowers
function buyFlower(flowerId) {
    const cost = getFlowerCost(flowerId);
    if (game.money >= cost) {
        game.money -= cost;
        game.flowers[flowerId].owned++;
        checkUnlocks();
        updateUI();
    }
}

// Buy products
function buyProduct(productId) {
    const cost = getProductCost(productId);
    if (game.money >= cost) {
        game.money -= cost;
        game.products[productId].owned++;
        checkUnlocks();
        updateUI();
    }
}

// Generate DNA
function generateDNA() {
    let cost = game.mutations.hyperBreeding.purchased ? 500 : 1000;
    if (game.honey >= cost) {
        game.honey -= cost;
        game.dna += 1;
        checkAchievements();
        updateUI();
    }
}

// Breed strain
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
            const boost = 1 + (strain.level * strain.effect);
            game.multipliers.global *= boost;
            break;
    }
}

// Buy mutation
function buyMutation(mutationId) {
    const mutation = game.mutations[mutationId];
    if (!mutation.purchased && game.dna >= mutation.cost) {
        game.dna -= mutation.cost;
        mutation.purchased = true;
        applyMutation(mutationId);
        document.getElementById(`mutation-${mutationId}`).style.display = 'none';
        checkUnlocks();
        checkAchievements();
        updateUI();
    }
}

// Apply mutation effects
function applyMutation(mutationId) {
    switch (mutationId) {
        case 'hyperBreeding':
            document.getElementById('generate-dna-btn').textContent = 'Generate DNA (500 honey)';
            break;
    }
}

// Phase 4: Deploy to region
function deployToRegion(regionId) {
    const cost = getRegionCost(regionId);
    if (game.money >= cost) {
        game.money -= cost;
        game.regions[regionId].swarms++;
        checkUnlocks();
        updateUI();
    }
}

// Phase 4: Buy eco upgrade
function buyEcoUpgrade(upgradeId) {
    const upgrade = game.ecoUpgrades[upgradeId];
    if (!upgrade.purchased && game.money >= upgrade.cost) {
        game.money -= upgrade.cost;
        upgrade.purchased = true;
        applyEcoUpgrade(upgradeId);
        document.getElementById(`eco-${upgradeId}`).style.display = 'none';
        checkUnlocks();
        updateUI();
    }
}

function applyEcoUpgrade(upgradeId) {
    switch (upgradeId) {
        case 'biodiversity':
            game.multipliers.region = 1.5;
            document.getElementById('eco-climate').style.display = 'block';
            break;
        case 'climate':
            document.getElementById('tab-space').style.display = 'block';
            break;
    }
}

// Phase 5: Colonize planet
function colonizePlanet(planetId) {
    const cost = getPlanetCost(planetId);
    if (game.money >= cost) {
        game.money -= cost;
        game.planets[planetId].domes++;
        checkUnlocks();
        checkAchievements();
        updateUI();
    }
}

// Phase 5: Buy space tech
function buySpaceTech(techId) {
    const tech = game.spaceTech[techId];
    if (!tech.purchased && game.money >= tech.cost) {
        game.money -= tech.cost;
        tech.purchased = true;
        applySpaceTech(techId);
        document.getElementById(`tech-${techId}`).style.display = 'none';
        checkUnlocks();
        updateUI();
    }
}

function applySpaceTech(techId) {
    switch (techId) {
        case 'warpDrive':
            game.multipliers.space = 2;
            document.getElementById('tech-dysonSwarm').style.display = 'block';
            break;
        case 'dysonSwarm':
            game.multipliers.space = 10;
            game.multipliers.global *= 10;
            break;
    }
}

// Check for unlocks
function checkUnlocks() {
    // Research section
    if (game.totalHoney >= 30) {
        document.getElementById('research').style.display = 'block';
    }

    // Upgrades
    if (game.upgrades.workerBee.owned >= 5 || game.totalHoney >= 50) {
        document.getElementById('buy-hive').style.display = 'block';
    }
    if (game.upgrades.hive.owned >= 3 || game.totalHoney >= 500) {
        document.getElementById('buy-apiary').style.display = 'block';
    }
    if (game.upgrades.apiary.owned >= 2 || game.totalHoney >= 2500) {
        document.getElementById('buy-queenBee').style.display = 'block';
    }
    if (game.upgrades.queenBee.owned >= 2 || game.totalHoney >= 12500) {
        document.getElementById('buy-flowerField').style.display = 'block';
    }

    // Flowers
    if (game.flowers.wildflower.owned >= 3) {
        document.getElementById('buy-lavender').style.display = 'block';
    }
    if (game.flowers.lavender.owned >= 3) {
        document.getElementById('buy-sunflower').style.display = 'block';
    }

    // Products
    if (game.products.beeswax.owned >= 3) {
        document.getElementById('buy-royalJelly').style.display = 'block';
    }
    if (game.products.royalJelly.owned >= 3) {
        document.getElementById('buy-propolis').style.display = 'block';
    }

    // Strains
    if (game.strains.speedBee.level >= 2 && game.strains.tankBee.level >= 2) {
        document.getElementById('breed-mutantBee').style.display = 'block';
    }

    // Mutations
    if (game.mutations.longevity.purchased) {
        document.getElementById('mutation-hyperBreeding').style.display = 'block';
    }

    // Regions
    if (game.regions.meadows.swarms >= 2) {
        document.getElementById('region-forests').style.display = 'block';
    }
    if (game.regions.forests.swarms >= 2) {
        document.getElementById('region-mountains').style.display = 'block';
    }
    if (game.regions.mountains.swarms >= 2) {
        document.getElementById('region-oceans').style.display = 'block';
    }

    // Planets
    if (game.planets.mars.domes >= 2) {
        document.getElementById('planet-europa').style.display = 'block';
    }
    if (game.planets.europa.domes >= 2) {
        document.getElementById('planet-titan').style.display = 'block';
    }
    if (game.planets.titan.domes >= 2) {
        document.getElementById('planet-exoplanet').style.display = 'block';
    }
}

// Achievements
function checkAchievements() {
    for (const [id, def] of Object.entries(achievementDefs)) {
        if (!game.achievements[id] && def.check()) {
            game.achievements[id] = true;
            showAchievementPopup(def.name);
            renderAchievements();
        }
    }
}

function showAchievementPopup(name) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('popup-achievement-name').textContent = name;
    popup.classList.remove('hidden');
    popup.style.animation = 'none';
    void popup.offsetWidth;
    popup.style.animation = 'slideIn 0.5s ease, slideOut 0.5s ease 2.5s forwards';

    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000);
}

function renderAchievements() {
    const container = document.getElementById('achievements-list');
    container.innerHTML = '';

    let unlocked = 0;
    const total = Object.keys(achievementDefs).length;

    for (const [id, def] of Object.entries(achievementDefs)) {
        const isUnlocked = game.achievements[id];
        if (isUnlocked) unlocked++;

        const div = document.createElement('div');
        div.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="achievement-icon-small">${def.icon}</div>
            <div class="achievement-name-small">${def.name}</div>
            <div class="achievement-desc">${def.desc}</div>
        `;
        container.appendChild(div);
    }

    document.getElementById('achievement-count').textContent = `(${unlocked}/${total})`;
}

// Update market
function updateMarket() {
    game.market.demandTimer++;
    if (game.market.demandTimer >= 100) {
        game.market.demandTimer = 0;
        game.market.demand = 0.5 + Math.random() * 1.5;
    }
}

// Update pollination
function updatePollination() {
    // Earth pollination
    let earthRate = 0;
    for (const region of Object.values(game.regions)) {
        earthRate += region.swarms * region.pollination * game.multipliers.region;
    }
    game.earthPollinated = Math.min(100, game.earthPollinated + earthRate / 10);

    // Universe pollination
    let universeRate = 0;
    for (const planet of Object.values(game.planets)) {
        universeRate += planet.domes * planet.universe * game.multipliers.space;
    }
    game.universePollinated = Math.min(100, game.universePollinated + universeRate / 10);
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

    // Pollination progress
    document.getElementById('earth-pollinated').textContent = game.earthPollinated.toFixed(2);
    document.getElementById('earth-progress').style.width = `${game.earthPollinated}%`;
    document.getElementById('universe-pollinated').textContent = game.universePollinated.toFixed(4);
    document.getElementById('universe-progress-bar').style.width = `${game.universePollinated}%`;

    // Update all buttons
    updateButtons();
}

function updateButtons() {
    // Upgrades
    for (const [id, upgrade] of Object.entries(game.upgrades)) {
        const cost = getUpgradeCost(id);
        updateButton(`buy-${id}`, `${id}-cost`, `${id}-owned`, cost, game.honey, upgrade.owned);
    }

    // Research
    for (const [id, research] of Object.entries(game.research)) {
        const btn = document.getElementById(`research-${id}`);
        if (btn && !research.purchased) {
            btn.disabled = game.honey < research.cost;
            btn.classList.toggle('affordable', game.honey >= research.cost);
        }
    }

    // Flowers
    for (const [id, flower] of Object.entries(game.flowers)) {
        const cost = getFlowerCost(id);
        updateButton(`buy-${id}`, `${id}-cost`, `${id}-owned`, cost, game.money, flower.owned);
    }

    // Products
    for (const [id, product] of Object.entries(game.products)) {
        const cost = getProductCost(id);
        updateButton(`buy-${id}`, `${id}-cost`, `${id}-owned`, cost, game.money, product.owned);
    }

    // Strains
    for (const [id, strain] of Object.entries(game.strains)) {
        const cost = getStrainCost(id);
        updateButton(`breed-${id}`, `${id}-cost`, `${id}-level`, cost, game.dna, strain.level);
    }

    // Mutations
    for (const [id, mutation] of Object.entries(game.mutations)) {
        const btn = document.getElementById(`mutation-${id}`);
        if (btn && !mutation.purchased) {
            btn.disabled = game.dna < mutation.cost;
            btn.classList.toggle('affordable', game.dna >= mutation.cost);
        }
    }

    // Regions
    for (const [id, region] of Object.entries(game.regions)) {
        const cost = getRegionCost(id);
        updateButton(`region-${id}`, `${id}-cost`, `${id}-swarms`, cost, game.money, region.swarms);
    }

    // Eco upgrades
    for (const [id, upgrade] of Object.entries(game.ecoUpgrades)) {
        const btn = document.getElementById(`eco-${id}`);
        if (btn && !upgrade.purchased) {
            btn.disabled = game.money < upgrade.cost;
            btn.classList.toggle('affordable', game.money >= upgrade.cost);
        }
    }

    // Planets
    for (const [id, planet] of Object.entries(game.planets)) {
        const cost = getPlanetCost(id);
        updateButton(`planet-${id}`, `${id}-cost`, `${id}-domes`, cost, game.money, planet.domes);
    }

    // Space tech
    for (const [id, tech] of Object.entries(game.spaceTech)) {
        const btn = document.getElementById(`tech-${id}`);
        if (btn && !tech.purchased) {
            btn.disabled = game.money < tech.cost;
            btn.classList.toggle('affordable', game.money >= tech.cost);
        }
    }
}

function updateButton(btnId, costId, ownedId, cost, currency, owned) {
    const costEl = document.getElementById(costId);
    const ownedEl = document.getElementById(ownedId);
    const btnEl = document.getElementById(btnId);

    if (costEl) costEl.textContent = formatNumber(cost);
    if (ownedEl) ownedEl.textContent = owned;

    if (btnEl) {
        btnEl.disabled = currency < cost;
        btnEl.classList.toggle('affordable', currency >= cost);
    }
}

// Format numbers
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

    const honeyGained = hps / 10;
    const moneyGained = mps / 10;

    game.honey += honeyGained;
    game.totalHoney += honeyGained;
    game.money += moneyGained;
    game.totalMoney += moneyGained;

    updateMarket();
    updatePollination();
    checkAchievements();
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
        earthPollinated: game.earthPollinated,
        universePollinated: game.universePollinated,
        upgrades: game.upgrades,
        research: game.research,
        flowers: game.flowers,
        products: game.products,
        strains: game.strains,
        mutations: game.mutations,
        regions: game.regions,
        ecoUpgrades: game.ecoUpgrades,
        planets: game.planets,
        spaceTech: game.spaceTech,
        multipliers: game.multipliers,
        market: game.market,
        achievements: game.achievements,
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

        // Load basic values
        game.honey = data.honey || 0;
        game.totalHoney = data.totalHoney || 0;
        game.totalClicks = data.totalClicks || 0;
        game.clickValue = data.clickValue || 1;
        game.money = data.money || 0;
        game.totalMoney = data.totalMoney || 0;
        game.dna = data.dna || 0;
        game.earthPollinated = data.earthPollinated || 0;
        game.universePollinated = data.universePollinated || 0;

        // Load objects
        const loadObj = (target, source) => {
            if (source) {
                for (const [id, val] of Object.entries(source)) {
                    if (target[id]) Object.assign(target[id], val);
                }
            }
        };

        loadObj(game.upgrades, data.upgrades);
        loadObj(game.flowers, data.flowers);
        loadObj(game.products, data.products);
        loadObj(game.strains, data.strains);
        loadObj(game.regions, data.regions);
        loadObj(game.planets, data.planets);

        // Load research and apply effects
        if (data.research) {
            for (const [id, research] of Object.entries(data.research)) {
                if (game.research[id]) {
                    game.research[id].purchased = research.purchased;
                    if (research.purchased) applyResearch(id);
                }
            }
        }

        // Load mutations
        if (data.mutations) {
            for (const [id, mutation] of Object.entries(data.mutations)) {
                if (game.mutations[id]) {
                    game.mutations[id].purchased = mutation.purchased;
                    if (mutation.purchased) applyMutation(id);
                }
            }
        }

        // Load eco upgrades
        if (data.ecoUpgrades) {
            for (const [id, upgrade] of Object.entries(data.ecoUpgrades)) {
                if (game.ecoUpgrades[id]) {
                    game.ecoUpgrades[id].purchased = upgrade.purchased;
                    if (upgrade.purchased) applyEcoUpgrade(id);
                }
            }
        }

        // Load space tech
        if (data.spaceTech) {
            for (const [id, tech] of Object.entries(data.spaceTech)) {
                if (game.spaceTech[id]) {
                    game.spaceTech[id].purchased = tech.purchased;
                    if (tech.purchased) applySpaceTech(id);
                }
            }
        }

        // Load strains and reapply
        if (data.strains) {
            for (const [id, strain] of Object.entries(data.strains)) {
                if (game.strains[id] && strain.level > 0) {
                    applyStrain(id);
                }
            }
        }

        if (data.multipliers) game.multipliers = { ...game.multipliers, ...data.multipliers };
        if (data.market) game.market = { ...game.market, ...data.market };
        if (data.achievements) game.achievements = data.achievements;

        // Offline progress
        if (data.timestamp) {
            const offlineSeconds = (Date.now() - data.timestamp) / 1000;
            const efficiency = game.mutations.longevity.purchased ? 1.0 : 0.5;

            const offlineHoney = getHoneyPerSecond() * offlineSeconds * efficiency;
            const offlineMoney = getMoneyPerSecond() * offlineSeconds * efficiency;

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
        renderAchievements();
        updateUI();
    } else {
        renderAchievements();
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
        localStorage.removeItem('universalHoneySave');
        location.reload();
    }
}

// Auto-save every 10 minutes
setInterval(saveGame, 600000);

// Initialize
window.onload = function() {
    loadGame();
    checkUnlocks();
    updateUI();
    setInterval(gameLoop, 100);
};

window.onbeforeunload = function() {
    saveGame();
};
