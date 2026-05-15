// ============================================================
// HISTOGRAM — Exercise 6.1
// Energy consumption frequency histogram with filter support
// ============================================================

function drawHistogram(data) {

  // Clear previous chart
  d3.select('#histogram-container').selectAll('svg').remove();

  const cont = document.getElementById('histogram-container');
  const W = Math.max(cont.clientWidth || 0, 500);
  const H = 440;
  const w = W - margin.left - margin.right;
  const h = H - margin.top - margin.bottom;

  const svg = d3.select('#histogram-container')
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`);

  // Assign shared innerChart
  innerChart = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Generate bins using shared binGenerator
  const bins = binGenerator(data);
  console.log('Bins created:', bins.length);

  // Define scales from bin extents
  const xMin = bins[0].x0;
  const xMax = bins[bins.length - 1].x1;

  xScale = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([0, w]);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length) * 1.15])
    .range([h, 0]);

  // Grid lines
  innerChart.append('g')
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-w).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line').style('stroke', '#f0f0f0').style('stroke-width', '1'));

  // Draw bars
  innerChart.selectAll('.bar')
    .data(bins)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.x0) + 1)
    .attr('y', h)
    .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
    .attr('height', 0)
    .attr('fill', barColor)
    .attr('rx', 3)
    .transition().duration(700).delay((d, i) => i * 15)
    .attr('y', d => yScale(d.length))
    .attr('height', d => h - yScale(d.length));

  // Bottom axis
  innerChart.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(xScale).ticks(8));

  // Left axis
  innerChart.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale).ticks(6));

  // Axis labels
  innerChart.append('text')
    .attr('x', w / 2).attr('y', h + 50)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Inter,sans-serif').style('font-size', '13px').style('fill', '#888').style('font-weight', '500')
    .text('Labelled Energy Consumption (kWh/year)');

  innerChart.append('text')
    .attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -55)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Inter,sans-serif').style('font-size', '13px').style('fill', '#888').style('font-weight', '500')
    .text('Frequency');
}