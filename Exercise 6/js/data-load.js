// ============================================================
// DATA LOAD — Exercise 6
// Loads Ex6_TVdata.csv and calls chart/interaction functions
// Columns: brand, model, screenSize, screenTech, energyConsumption, star
// ============================================================

let allData = [];

d3.csv('data/Ex6_TVdata.csv', d => ({
  brand:             d.brand,
  model:             d.model,
  screenSize:        +d.screenSize,
  screenTech:        d.screenTech,
  energyConsumption: +d.energyConsumption,
  star:              +d.star
})).then(data => {

  // Filter out invalid rows
  allData = data.filter(d =>
    !isNaN(d.energyConsumption) &&
    d.energyConsumption > 0 &&
    d.energyConsumption <= 1800 &&   // cap as per exercise instructions
    ['LED','LCD','OLED'].includes(d.screenTech)
  );

  console.log('Data loaded:', allData.length, 'rows');
  console.log('Sample row:', allData[0]);
  console.log('Max energy:', d3.max(allData, d => d.energyConsumption));
  console.log('Min energy:', d3.min(allData, d => d.energyConsumption));
  console.log('Extent:', d3.extent(allData, d => d.energyConsumption));

  // Update hero stats
  const statN = document.getElementById('stat-n');
  const statMax = document.getElementById('stat-max');
  const statAvg = document.getElementById('stat-avg');

  if (statN) {
    let c = 0;
    const timer = setInterval(() => {
      c += Math.ceil(allData.length / 40);
      if (c >= allData.length) { c = allData.length; clearInterval(timer); }
      statN.textContent = c.toLocaleString();
    }, 30);
  }

  if (statMax) statMax.textContent = d3.max(allData, d => d.energyConsumption);
  if (statAvg) statAvg.textContent = Math.round(d3.mean(allData, d => d.energyConsumption));

  // Draw charts
  drawHistogram(allData);
  drawScatterplot(allData);

  // Set up interactive filters and tooltips
  populateFilters(allData);
  createTooltip(allData);

}).catch(err => {
  console.log('Error loading data:', err);
});