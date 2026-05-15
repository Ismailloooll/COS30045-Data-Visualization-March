// ============================================================
// SCATTER PLOT — Exercise 6.2
// Energy consumption vs star rating, colour by screenTech
// Tooltip shows brand, model, screenSize
// ============================================================

function drawScatterplot(data) {

  // Build legend
  const leg = document.getElementById('sc-leg');
  if (leg) {
    leg.innerHTML = '';
    ['LED', 'LCD', 'OLED'].forEach(tech => {
      leg.innerHTML += `<div class="leg-i"><div class="leg-d" style="background:${techColors[tech]}"></div>${tech}</div>`;
    });
  }

  const cont = document.getElementById('scatter-container');
  const W = Math.max(cont.clientWidth || 0, 500);
  const H = 440;
  const w = W - margin.left - margin.right;
  const h = H - margin.top - margin.bottom;

  const svg = d3.select('#scatter-container')
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`);

  // Assign shared innerChartS
  innerChartS = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  xScaleS = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.star) + 0.5])
    .range([0, w]);

  yScaleS = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energyConsumption) * 1.05])
    .nice()
    .range([h, 0]);

  // Colour scale from shared constants
  colorScale.domain(['LED', 'LCD', 'OLED']).range(['#10b981', '#0ea5e9', '#f59e0b']);

  // Grid lines
  innerChartS.append('g')
    .call(d3.axisLeft(yScaleS).ticks(6).tickSize(-w).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', '#f0f0f0').style('stroke-width', '1'));

  innerChartS.append('g')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(xScaleS).ticks(8).tickSize(-h).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', '#f0f0f0').style('stroke-width', '1'));

  // Axes
  innerChartS.append('g').attr('class', 'axis')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(xScaleS).ticks(8));

  innerChartS.append('g').attr('class', 'axis')
    .call(d3.axisLeft(yScaleS).ticks(6));

  // Axis labels
  innerChartS.append('text')
    .attr('x', w / 2).attr('y', h + 50).attr('text-anchor', 'middle')
    .style('font-family', 'Inter,sans-serif').style('font-size', '13px').style('fill', '#888').style('font-weight', '500')
    .text('Star Rating (Energy Efficiency)');

  innerChartS.append('text')
    .attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -55).attr('text-anchor', 'middle')
    .style('font-family', 'Inter,sans-serif').style('font-size', '13px').style('fill', '#888').style('font-weight', '500')
    .text('Labelled Energy Consumption (kWh/year)');

  // Draw circles — animate in
  innerChartS.selectAll('.dot')
    .data(data)
    .join('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScaleS(d.star))
    .attr('cy', h)
    .attr('r', 0)
    .attr('fill', d => colorScale(d.screenTech))
    .attr('opacity', 0)
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    .transition().duration(600).delay(() => Math.random() * 900)
    .attr('cy', d => yScaleS(d.energyConsumption))
    .attr('r', 4.5)
    .attr('opacity', 0.65);
}