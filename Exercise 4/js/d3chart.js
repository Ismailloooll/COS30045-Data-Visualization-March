// ============================================================
// PAGE NAVIGATION
// ============================================================
const pageMap = { ex41:1, ex42:2, ex43:3, ex44:4, ex45:5, ex46:6, ex47:7 };

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + name).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('nav-' + name).classList.add('active');
  const n = pageMap[name];
  document.getElementById('progress-fill').style.width = (n / 7 * 100) + '%';
  document.getElementById('progress-text').textContent = n + ' / 7';
  window.scrollTo(0, 0);
}

// ============================================================
// EXERCISE 4.2
// ============================================================
d3.select("h1").style("color", "#0d3d22");

d3.select("#d3-append-target")
  .append("p")
  .text("✅ D3 appended this! Purchasing a low energy TV will help your bills!")
  .style("background", "#e8f5ee")
  .style("padding", "12px 16px")
  .style("border-left", "4px solid #1a5c38")
  .style("border-radius", "0 8px 8px 0")
  .style("margin-top", "10px")
  .style("font-size", "14px")
  .style("color", "#1a2e22");

d3.select("#ex42-svg")
  .append("rect")
  .attr("x", 50).attr("y", 50)
  .attr("width", 100).attr("height", 30)
  .style("fill", "#1a5c38");

d3.select("#ex42-svg")
  .append("text")
  .attr("x", 100).attr("y", 70)
  .attr("text-anchor", "middle")
  .style("font-size", "11px").style("fill", "white")
  .style("font-family", "DM Sans, Arial")
  .text("D3 rect");

// ============================================================
// EXERCISE 4.3
// ============================================================
const svgEx43 = d3.select("#ex43-container")
  .append("svg")
  .attr("viewBox", "0 0 500 120")
  .style("border", "1px solid #ccc");

svgEx43.append("rect")
  .attr("x", 10).attr("y", 40)
  .attr("width", 414).attr("height", 40)
  .attr("fill", "#1a5c38").attr("rx", 4);

svgEx43.append("text")
  .attr("x", 217).attr("y", 65)
  .attr("text-anchor", "middle")
  .style("font-size", "12px").style("fill", "white")
  .style("font-family", "DM Sans, Arial")
  .text("Test rectangle — x=10, y=40, width=414, height=40");

// ============================================================
// EXERCISE 4.4 — Load CSV
// ============================================================
function standardiseBrands(data) {
  const merged = {};
  data.forEach(d => {
    const key = d.brand.toUpperCase().trim()
      .replace("SAMSUNG ELECTRONICS", "SAMSUNG");
    merged[key] = (merged[key] || 0) + d.count;
  });
  return Object.entries(merged)
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count);
}

d3.csv("data/brands.csv", d => ({
  brand: d["Brand_Reg"],
  count: +d["Count*(Submit_ID)"]
})).then(data => {

  console.log("Raw data:", data);
  console.log("Rows:", data.length);
  console.log("Max:", d3.max(data, d => d.count));
  console.log("Min:", d3.min(data, d => d.count));
  console.log("Extent:", d3.extent(data, d => d.count));

  const clean = standardiseBrands(data);
  console.log("Cleaned:", clean);

  const out = document.getElementById("ex44-output");
  if (out) out.innerHTML =
    `<span style="color:#58a6ff">$</span> brands.csv loaded ✓\n\n` +
    `<span style="color:#ffa657">raw rows:      </span>${data.length}\n` +
    `<span style="color:#ffa657">cleaned rows:  </span>${clean.length}\n` +
    `<span style="color:#ffa657">max count:     </span>${d3.max(clean, d => d.count)}\n` +
    `<span style="color:#ffa657">min count:     </span>${d3.min(clean, d => d.count)}\n` +
    `<span style="color:#ffa657">extent:        </span>[${d3.extent(clean, d => d.count)}]\n\n` +
    `<span style="color:#7ee787">top 5 brands:</span>\n` +
    clean.slice(0,5).map(d => `  ${d.brand.padEnd(16)} ${d.count}`).join('\n');

  const top15 = clean.slice(0, 15);
  buildEx45(top15);
  buildEx46(top15);
  buildEx47(top15);

}).catch(err => {
  const out = document.getElementById("ex44-output");
  if (out) out.innerHTML = `<span style="color:#f85149">✗ Error: ${err.message}\nEnsure brands.csv is in data/ folder.</span>`;
  const fallback = [
    {brand:"SAMSUNG",count:1182},{brand:"LG",count:679},{brand:"KOGAN",count:744},
    {brand:"HISENSE",count:351},{brand:"TCL",count:124},{brand:"PHILIPS",count:114},
    {brand:"JVC",count:107},{brand:"SYLVOX",count:131},{brand:"EKO",count:98},
    {brand:"SONY",count:91},{brand:"TOSHIBA",count:56},{brand:"BAUHN",count:85},
    {brand:"CHiQ",count:52},{brand:"EMETE",count:55},{brand:"LOEWE",count:36}
  ].sort((a,b)=>b.count-a.count);
  buildEx45(fallback); buildEx46(fallback); buildEx47(fallback);
});

// ============================================================
// EXERCISE 4.5 — Unscaled bars
// ============================================================
function buildEx45(data) {
  const h = data.length * 28 + 50;
  const svg = d3.select("#ex45-container")
    .append("svg").attr("viewBox", `0 0 500 ${h}`);

  svg.append("text").attr("x",250).attr("y",18).attr("text-anchor","middle")
    .style("font-size","12px").style("font-weight","600").style("fill","#0d3d22")
    .style("font-family","DM Sans, Arial").text("Unscaled — 1 count = 1 pixel (bars overflow)");

  svg.selectAll("rect").data(data).join("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", 0).attr("y", (d,i) => 28 + i*28)
    .attr("width", d => d.count * 0.05)
    .attr("height", 20).attr("fill","#1a5c38").attr("rx",2);
}

// ============================================================
// EXERCISE 4.6 — Scaled bars
// ============================================================
function buildEx46(data) {
  const svgW = 500, h = data.length * 34 + 50;
  const svg = d3.select("#ex46-container")
    .append("svg").attr("viewBox", `0 0 ${svgW} ${h}`);

  svg.append("text").attr("x",svgW/2).attr("y",18).attr("text-anchor","middle")
    .style("font-size","12px").style("font-weight","600").style("fill","#0d3d22")
    .style("font-family","DM Sans, Arial").text("Scaled bars — xScale linear + yScale band");

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).range([0, 370]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand)).range([28, h-10]).padding(0.25);

  svg.selectAll("rect").data(data).join("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x",100).attr("y", d => yScale(d.brand))
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill","#1a5c38").attr("rx",3);
}

// ============================================================
// EXERCISE 4.7 — Final chart with labels
// ============================================================
function buildEx47(data) {
  const svgW = 500, h = data.length * 38 + 70;
  const svg = d3.select("#ex47-container")
    .append("svg").attr("viewBox", `0 0 ${svgW} ${h}`);

  svg.append("text").attr("x",svgW/2).attr("y",20).attr("text-anchor","middle")
    .style("font-size","14px").style("font-weight","700").style("fill","#0d3d22")
    .style("font-family","DM Sans, Arial").text("TV Models by Brand — Australia");

  svg.append("text").attr("x",svgW/2).attr("y",36).attr("text-anchor","middle")
    .style("font-size","11px").style("fill","#6b8c7a")
    .style("font-family","DM Sans, Arial").text("Top 15 brands · standardised");

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).range([0, 365]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand)).range([46, h-14]).padding(0.26);

  // Zebra rows
  svg.selectAll(".row-bg").data(data).join("rect")
    .attr("class","row-bg").attr("x",0).attr("y", d => yScale(d.brand)-2)
    .attr("width",svgW).attr("height", yScale.bandwidth()+4)
    .attr("fill",(d,i) => i%2===0 ? "#f0f7f3" : "white").attr("opacity",0.5);

  // Groups
  const g = svg.selectAll("g.row").data(data).join("g")
    .attr("class","row")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // Bars — gradient green by rank
  const colors = ["#0d3d22","#1a5c38","#1D9E75","#5DCAA5","#7ee7c0"];
  g.append("rect")
    .attr("x",105).attr("y",0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", (d,i) => colors[Math.min(Math.floor(i/3), colors.length-1)])
    .attr("rx",3);

  // Brand name left
  g.append("text").text(d => d.brand)
    .attr("x",100).attr("y", yScale.bandwidth()/2 + 4)
    .attr("text-anchor","end")
    .style("font-family","DM Sans, Arial").style("font-size","12px").style("fill","#1a2e22");

  // Count right
  g.append("text").text(d => d.count.toLocaleString())
    .attr("x", d => 105 + xScale(d.count) + 5)
    .attr("y", yScale.bandwidth()/2 + 4)
    .style("font-family","DM Mono, monospace").style("font-size","11px").style("fill","#6b8c7a");
}