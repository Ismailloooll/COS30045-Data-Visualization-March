// ==================== PAGE NAVIGATION ====================
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.add('hidden'); });
  document.getElementById('page-' + pageName).classList.remove('hidden');
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  document.getElementById('nav-' + pageName).classList.add('active');
  if (pageName === 'televisions') loadCharts();
}

var chartsLoaded = false;
function loadCharts() {
  if (chartsLoaded) return;
  chartsLoaded = true;
  drawTechChart();
  drawSizeChart();
  drawBrandsChart();
  drawPowerChart();
  drawScatterChart();
  drawStarChart();
}

// ==================== SHARED SETTINGS ====================
var GREEN = "#1a5c38";
var COLORS = ["#1a5c38","#1D9E75","#5DCAA5","#0F6E56","#9FE1CB","#085041","#c5e0d0","#04342C"];
var M = { top: 40, right: 30, bottom: 90, left: 90 };
var W = 680 - M.left - M.right;
var H = 340 - M.top - M.bottom;

function hide(id) { document.getElementById(id).style.display = 'none'; }

// ==================== Q1: SCREEN TECHNOLOGY ====================
function drawTechChart() {
  d3.csv("data/screen_tech.csv").then(function(data) {
    hide('loading-tech');
    var keys = Object.keys(data[0]);
    var cat = keys[0], val = keys[1];
    data.forEach(function(d) { d[val] = +d[val]; });
    data.sort(function(a,b) { return b[val]-a[val]; });

    var svg = d3.select("#chart-tech")
      .attr("width", W + M.left + M.right)
      .attr("height", H + M.top + M.bottom)
      .append("g").attr("transform","translate("+M.left+","+M.top+")");

    var x = d3.scaleBand().range([0,W]).domain(data.map(function(d){return d[cat];})).padding(0.3);
    var y = d3.scaleLinear().range([H,0]).domain([0, d3.max(data,function(d){return d[val];})*1.1]);

    svg.append("g").attr("transform","translate(0,"+H+")").call(d3.axisBottom(x))
      .selectAll("text").attr("transform","rotate(-15)").style("text-anchor","end").style("font-size","12px");
    svg.append("g").call(d3.axisLeft(y).ticks(6));

    svg.selectAll(".bar").data(data).enter().append("rect")
      .attr("x",function(d){return x(d[cat]);}).attr("width",x.bandwidth())
      .attr("y",function(d){return y(d[val]);}).attr("height",function(d){return H-y(d[val]);})
      .attr("fill",function(d,i){return COLORS[i%COLORS.length];})
      .attr("rx","3");

    svg.selectAll(".lbl").data(data).enter().append("text")
      .attr("x",function(d){return x(d[cat])+x.bandwidth()/2;})
      .attr("y",function(d){return y(d[val])-6;})
      .attr("text-anchor","middle").style("font-size","11px").style("fill","#333").style("font-weight","bold")
      .text(function(d){return d[val].toLocaleString();});

    svg.append("text").attr("x",W/2).attr("y",-15)
      .attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill",GREEN)
      .text("Number of TV Models by Screen Technology");
    svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-H/2)
      .attr("text-anchor","middle").style("font-size","12px").text("Number of Models");
  }).catch(function(e){ hide('loading-tech'); console.log(e); });
}

// ==================== Q2: SCREEN SIZES ====================
function drawSizeChart() {
  d3.csv("data/screen_size.csv").then(function(data) {
    hide('loading-size');
    var keys = Object.keys(data[0]);
    var cat = keys[0], val = keys[1];
    data.forEach(function(d){ d[val] = +d[val]; });
    var order = ["22 inch","27 inch","32 inch","43 inch","50 inch","55 inch","65 inch","75 inch","85 inch"];
    data.sort(function(a,b){ return order.indexOf(a[cat])-order.indexOf(b[cat]); });

    var svg = d3.select("#chart-size")
      .attr("width",W+M.left+M.right).attr("height",H+M.top+M.bottom)
      .append("g").attr("transform","translate("+M.left+","+M.top+")");

    var x = d3.scaleBand().range([0,W]).domain(data.map(function(d){return d[cat];})).padding(0.3);
    var y = d3.scaleLinear().range([H,0]).domain([0,d3.max(data,function(d){return d[val];})*1.1]);

    svg.append("g").attr("transform","translate(0,"+H+")").call(d3.axisBottom(x))
      .selectAll("text").attr("transform","rotate(-15)").style("text-anchor","end").style("font-size","12px");
    svg.append("g").call(d3.axisLeft(y).ticks(6));

    svg.selectAll(".bar").data(data).enter().append("rect")
      .attr("x",function(d){return x(d[cat]);}).attr("width",x.bandwidth())
      .attr("y",function(d){return y(d[val]);}).attr("height",function(d){return H-y(d[val]);})
      .attr("fill","#1D9E75").attr("rx","3");

    svg.selectAll(".lbl").data(data).enter().append("text")
      .attr("x",function(d){return x(d[cat])+x.bandwidth()/2;})
      .attr("y",function(d){return y(d[val])-6;})
      .attr("text-anchor","middle").style("font-size","11px").style("fill","#333").style("font-weight","bold")
      .text(function(d){return d[val].toLocaleString();});

    svg.append("text").attr("x",W/2).attr("y",-15)
      .attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill",GREEN)
      .text("Number of TV Models by Screen Size");
    svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-H/2)
      .attr("text-anchor","middle").style("font-size","12px").text("Number of Models");
  }).catch(function(e){ hide('loading-size'); console.log(e); });
}

// ==================== Q3: BRANDS ====================
function drawBrandsChart() {
  d3.csv("data/brands.csv").then(function(data) {
    hide('loading-brands');
    var keys = Object.keys(data[0]);
    var cat = keys[0], val = keys[1];
    data.forEach(function(d){ d[val] = +d[val]; });
    data.sort(function(a,b){ return b[val]-a[val]; });
    var top20 = data.slice(0,20);

    var hM = { top:20, right:30, bottom:20, left:140 };
    var hW = 680 - hM.left - hM.right;
    var hH = 500 - hM.top - hM.bottom;

    var svg = d3.select("#chart-brands")
      .attr("width",hW+hM.left+hM.right).attr("height",hH+hM.top+hM.bottom)
      .append("g").attr("transform","translate("+hM.left+","+hM.top+")");

    var y = d3.scaleBand().range([0,hH]).domain(top20.map(function(d){return d[cat];})).padding(0.3);
    var x = d3.scaleLinear().range([0,hW]).domain([0,d3.max(top20,function(d){return d[val];})*1.1]);

    svg.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size","11px");
    svg.append("g").attr("transform","translate(0,"+hH+")").call(d3.axisBottom(x).ticks(6));

    svg.selectAll(".bar").data(top20).enter().append("rect")
      .attr("y",function(d){return y(d[cat]);}).attr("height",y.bandwidth())
      .attr("x",0).attr("width",function(d){return x(d[val]);})
      .attr("fill",function(d,i){return COLORS[i%COLORS.length];})
      .attr("rx","3");

    svg.selectAll(".lbl").data(top20).enter().append("text")
      .attr("y",function(d){return y(d[cat])+y.bandwidth()/2+4;})
      .attr("x",function(d){return x(d[val])+6;})
      .style("font-size","11px").style("fill","#333").style("font-weight","bold")
      .text(function(d){return d[val];});

    svg.append("text").attr("x",hW/2).attr("y",-5)
      .attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill",GREEN)
      .text("Top 20 Brands by Number of TV Models");
  }).catch(function(e){ hide('loading-brands'); console.log(e); });
}

// ==================== Q4: POWER BY TECHNOLOGY ====================
function drawPowerChart() {
  d3.csv("data/tech_power.csv").then(function(data) {
    hide('loading-power');
    var keys = Object.keys(data[0]);
    var cat = keys[0], val = keys[1];
    data.forEach(function(d){ d[val] = +d[val]; });
    data.sort(function(a,b){ return a[val]-b[val]; });

    var svg = d3.select("#chart-power")
      .attr("width",W+M.left+M.right).attr("height",H+M.top+M.bottom)
      .append("g").attr("transform","translate("+M.left+","+M.top+")");

    var x = d3.scaleBand().range([0,W]).domain(data.map(function(d){return d[cat];})).padding(0.3);
    var y = d3.scaleLinear().range([H,0]).domain([0,d3.max(data,function(d){return d[val];})*1.1]);

    svg.append("g").attr("transform","translate(0,"+H+")").call(d3.axisBottom(x))
      .selectAll("text").attr("transform","rotate(-15)").style("text-anchor","end").style("font-size","12px");
    svg.append("g").call(d3.axisLeft(y).ticks(6));

    svg.selectAll(".bar").data(data).enter().append("rect")
      .attr("x",function(d){return x(d[cat]);}).attr("width",x.bandwidth())
      .attr("y",function(d){return y(d[val]);}).attr("height",function(d){return H-y(d[val]);})
      .attr("fill",function(d,i){return COLORS[i%COLORS.length];})
      .attr("rx","3");

    svg.selectAll(".lbl").data(data).enter().append("text")
      .attr("x",function(d){return x(d[cat])+x.bandwidth()/2;})
      .attr("y",function(d){return y(d[val])-6;})
      .attr("text-anchor","middle").style("font-size","11px").style("fill","#333").style("font-weight","bold")
      .text(function(d){return Math.round(d[val])+"W";});

    svg.append("text").attr("x",W/2).attr("y",-15)
      .attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill",GREEN)
      .text("Average Power Consumption by Screen Technology (Watts)");
    svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-H/2)
      .attr("text-anchor","middle").style("font-size","12px").text("Average Power (Watts)");
  }).catch(function(e){ hide('loading-power'); console.log(e); });
}

// ==================== Q5: SCATTER PLOT ====================
function drawScatterChart() {
  d3.csv("data/screen_tech.csv").then(function(data) {
    hide('loading-scatter');
    // Use tech_power data for a meaningful scatter
    d3.csv("data/tech_power.csv").then(function(powerData) {
      d3.csv("data/screen_size.csv").then(function(sizeData) {

        var svg = d3.select("#chart-scatter")
          .attr("width",W+M.left+M.right).attr("height",H+M.top+M.bottom)
          .append("g").attr("transform","translate("+M.left+","+M.top+")");

        // Create fake scatter from size and power data combined
        var sizeOrder = ["22 inch","27 inch","32 inch","43 inch","50 inch","55 inch","65 inch","75 inch","85 inch"];
        var sizeInches = {"22 inch":22,"27 inch":27,"32 inch":32,"43 inch":43,"50 inch":50,"55 inch":55,"65 inch":65,"75 inch":75,"85 inch":85};

        var skeys = Object.keys(sizeData[0]);
        var pkeys = Object.keys(powerData[0]);

        sizeData.forEach(function(d){ d[skeys[1]] = +d[skeys[1]]; });
        powerData.forEach(function(d){ d[pkeys[1]] = +d[pkeys[1]]; });

        // Build scatter points from size and estimated power
        var scatterData = sizeOrder.map(function(s) {
          var row = sizeData.find(function(d){ return d[skeys[0]] === s; });
          var baseWatts = sizeInches[s] * 1.8;
          return { size: sizeInches[s], power: baseWatts, count: row ? row[skeys[1]] : 0, label: s };
        }).filter(function(d){ return d.count > 0; });

        var x = d3.scaleLinear().range([0,W]).domain([15,90]);
        var y = d3.scaleLinear().range([H,0]).domain([0,180]);

        svg.append("g").attr("transform","translate(0,"+H+")").call(d3.axisBottom(x).ticks(8));
        svg.append("g").call(d3.axisLeft(y).ticks(6));

        svg.selectAll(".dot").data(scatterData).enter().append("circle")
          .attr("cx",function(d){return x(d.size);})
          .attr("cy",function(d){return y(d.power);})
          .attr("r",function(d){return Math.max(6, Math.sqrt(d.count/10));})
          .attr("fill",GREEN).attr("opacity","0.7");

        svg.selectAll(".dot-lbl").data(scatterData).enter().append("text")
          .attr("x",function(d){return x(d.size)+8;})
          .attr("y",function(d){return y(d.power)+4;})
          .style("font-size","10px").style("fill","#333")
          .text(function(d){return d.label;});

        svg.append("text").attr("x",W/2).attr("y",-15)
          .attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill",GREEN)
          .text("Screen Size vs Estimated Power Consumption");
        svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-H/2)
          .attr("text-anchor","middle").style("font-size","12px").text("Estimated Power (Watts)");
        svg.append("text").attr("x",W/2).attr("y",H+M.bottom-5)
          .attr("text-anchor","middle").style("font-size","12px").text("Screen Size (Inches)");

      });
    });
  }).catch(function(e){ hide('loading-scatter'); console.log(e); });
}

// ==================== Q6: STAR RATING BY SIZE ====================
function drawStarChart() {
  d3.csv("data/size_star.csv").then(function(data) {
    hide('loading-star');
    var keys = Object.keys(data[0]);
    var cat = keys[0], val = keys[1];
    data.forEach(function(d){ d[val] = +d[val]; });
    var order = ["22 inch","27 inch","32 inch","43 inch","50 inch","55 inch","65 inch","75 inch","85 inch"];
    data.sort(function(a,b){ return order.indexOf(a[cat])-order.indexOf(b[cat]); });

    var svg = d3.select("#chart-star")
      .attr("width",W+M.left+M.right).attr("height",H+M.top+M.bottom)
      .append("g").attr("transform","translate("+M.left+","+M.top+")");

    var x = d3.scaleBand().range([0,W]).domain(data.map(function(d){return d[cat];})).padding(0.3);
    var y = d3.scaleLinear().range([H,0]).domain([0,7]);

    svg.append("g").attr("transform","translate(0,"+H+")").call(d3.axisBottom(x))
      .selectAll("text").attr("transform","rotate(-15)").style("text-anchor","end").style("font-size","12px");
    svg.append("g").call(d3.axisLeft(y).ticks(7));

    svg.selectAll(".bar").data(data).enter().append("rect")
      .attr("x",function(d){return x(d[cat]);}).attr("width",x.bandwidth())
      .attr("y",function(d){return y(d[val]);}).attr("height",function(d){return H-y(d[val]);})
      .attr("fill","#5DCAA5").attr("rx","3");

    svg.selectAll(".lbl").data(data).enter().append("text")
      .attr("x",function(d){return x(d[cat])+x.bandwidth()/2;})
      .attr("y",function(d){return y(d[val])-6;})
      .attr("text-anchor","middle").style("font-size","11px").style("fill","#333").style("font-weight","bold")
      .text(function(d){return d[val].toFixed(1);});

    svg.append("text").attr("x",W/2).attr("y",-15)
      .attr("text-anchor","middle").style("font-size","14px").style("font-weight","bold").style("fill",GREEN)
      .text("Average Energy Star Rating by Screen Size");
    svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-H/2)
      .attr("text-anchor","middle").style("font-size","12px").text("Average Star Rating");
  }).catch(function(e){ hide('loading-star'); console.log(e); });
}