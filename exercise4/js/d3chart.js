// ============================================================
// PAGE NAVIGATION — Exercise 4.1 and 4.6 only
// ============================================================
const pageMap = { ex41: 1, ex46: 2 };

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + name).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + name).classList.add('active');
  const n = pageMap[name];
  document.getElementById('progress-fill').style.width = (n / 2 * 100) + '%';
  document.getElementById('progress-text').textContent = n + ' / 2';
  window.scrollTo(0, 0);
}

// ============================================================
// EXERCISE 4.6 — Scaled bar chart with axes and labels
// ============================================================
function standardiseBrands(data) {
  const merged = {};
  data.forEach(d => {
    const key = d.brand.toUpperCase().trim()
      .replace('SAMSUNG ELECTRONICS', 'SAMSUNG');
    merged[key] = (merged[key] || 0) + d.count;
  });
  return Object.entries(merged)
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count);
}

d3.csv('data/brands.csv', d => ({
  brand: d['Brand_Reg'],
  count: +d['Count*(Submit_ID)']
})).then(data => {

  console.log('Raw data:', data);
  console.log('Rows:', data.length);
  console.log('Max:', d3.max(data, d => d.count));
  console.log('Min:', d3.min(data, d => d.count));
  console.log('Extent:', d3.extent(data, d => d.count));

  const clean = standardiseBrands(data);
  console.log('Cleaned:', clean);

  buildEx46(clean.slice(0, 15));

}).catch(err => {
  console.log('CSV error, using fallback:', err.message);
  const fallback = [
    {brand:'SAMSUNG',count:1182},{brand:'LG',count:679},{brand:'KOGAN',count:744},
    {brand:'HISENSE',count:351},{brand:'TCL',count:124},{brand:'PHILIPS',count:114},
    {brand:'JVC',count:107},{brand:'SYLVOX',count:131},{brand:'EKO',count:98},
    {brand:'SONY',count:91},{brand:'TOSHIBA',count:56},{brand:'BAUHN',count:85},
    {brand:'CHiQ',count:52},{brand:'EMETE',count:55},{brand:'LOEWE',count:36}
  ].sort((a,b) => b.count - a.count);
  buildEx46(fallback);
});

function buildEx46(data) {

  const margin = { top: 60, right: 70, bottom: 60, left: 120 };
  const svgW = 620;
  const svgH = data.length * 36 + margin.top + margin.bottom;
  const w = svgW - margin.left - margin.right;
  const h = svgH - margin.top - margin.bottom;

  const svg = d3.select('#ex46-container')
    .append('svg')
    .attr('viewBox', `0 0 ${svgW} ${svgH}`);

  // ---- CHART TITLE ----
  svg.append('text')
    .attr('x', svgW / 2).attr('y', 22)
    .attr('text-anchor', 'middle')
    .style('font-size', '15px').style('font-weight', '700')
    .style('fill', '#0d3d22').style('font-family', 'DM Sans, Arial')
    .text('TV Models by Brand — Australian Market');

  // ---- CHART SUBTITLE ----
  svg.append('text')
    .attr('x', svgW / 2).attr('y', 40)
    .attr('text-anchor', 'middle')
    .style('font-size', '11px').style('fill', '#6b8c7a')
    .style('font-family', 'DM Sans, Arial')
    .text('Top 15 brands · brand names standardised to uppercase');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // xScale: scaleLinear — maps count to pixel width
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, w]);

  // yScale: scaleBand — divides y-axis into equal bands per brand
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, h])
    .padding(0.25);

  // ---- GRID LINES ----
  g.append('g')
    .call(d3.axisBottom(xScale).ticks(5).tickSize(h).tickFormat(''))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('line')
      .style('stroke', '#e8f0eb')
      .style('stroke-dasharray', '3,3'));

  // ---- BARS ----
  g.selectAll('.bar').data(data).join('rect')
    .attr('class', d => `bar bar-${d.count}`)
    .attr('x', 0)
    .attr('y', d => yScale(d.brand))
    .attr('width', d => xScale(d.count))
    .attr('height', yScale.bandwidth())
    .attr('fill', '#1a5c38')
    .attr('rx', 3);

  // ---- X AXIS ----
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .call(g => g.selectAll('text')
      .style('font-family', 'DM Sans, Arial')
      .style('font-size', '11px')
      .style('fill', '#888'));

  // ---- Y AXIS ----
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale))
    .call(g => g.selectAll('text')
      .style('font-family', 'DM Sans, Arial')
      .style('font-size', '12px')
      .style('fill', '#1a2e22'));

  // ---- X AXIS LABEL ----
  g.append('text')
    .attr('x', w / 2)
    .attr('y', h + 48)
    .attr('text-anchor', 'middle')
    .style('font-family', 'DM Sans, Arial')
    .style('font-size', '12px')
    .style('fill', '#6b8c7a')
    .text('Number of TV Models');

  // ---- Y AXIS LABEL ----
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -h / 2)
    .attr('y', -margin.left + 14)
    .attr('text-anchor', 'middle')
    .style('font-family', 'DM Sans, Arial')
    .style('font-size', '12px')
    .style('fill', '#6b8c7a')
    .text('Brand Name');

  // ---- COUNT LABELS right of each bar ----
  g.selectAll('.count-label').data(data).join('text')
    .attr('class', 'count-label')
    .attr('x', d => xScale(d.count) + 5)
    .attr('y', d => yScale(d.brand) + yScale.bandwidth() / 2 + 4)
    .style('font-family', 'DM Mono, monospace')
    .style('font-size', '11px')
    .style('fill', '#6b8c7a')
    .text(d => d.count.toLocaleString());
}
