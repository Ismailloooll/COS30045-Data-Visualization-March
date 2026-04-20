// ==================== PAGE NAVIGATION ====================
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.add('hidden'); });
  document.getElementById('page-' + pageName).classList.remove('hidden');
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  document.getElementById('nav-' + pageName).classList.add('active');
  if (pageName === 'televisions') loadTVCharts();
  if (pageName === 'story') loadStoryCharts();
}

var tvChartsLoaded = false;
var storyChartsLoaded = false;

function loadTVCharts() {
  if (tvChartsLoaded) return;
  tvChartsLoaded = true;
  drawTechChart(); drawSizeChart(); drawBrandsChart(); drawPowerChart(); drawScatterChart(); drawStarChart();
}

function loadStoryCharts() {
  if (storyChartsLoaded) return;
  storyChartsLoaded = true;
  drawStoryTechChart(); drawStoryBrandsChart(); drawStoryScatterChart();
}

var GREEN = "#1a5c38";
var COLORS = ["#1a5c38","#1D9E75","#5DCAA5","#0F6E56","#9FE1CB","#085041","#c5e0d0","#04342C"];
var M = { top:40, right:30, bottom:90, left:90 };
var W = 660 - M.left - M.right;
var H = 320 - M.top - M.bottom;

function hide(id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; }

// ==================== TV PAGE CHARTS ====================
function drawTechChart() {
  d3.csv("data/screen_tech.csv").then(function(data) {
    hide('loading-tech');
    var keys = Object.keys(data[0]); var cat = keys[0], val = keys[1];
    data.forEach(function(d){d[val]=+d[val];}); data.sort(function(a,b){return b[val]-a[val];});
    buildBarChart("#chart-tech",data,cat,val,"Number of TV Models by Screen Technology","Number of Models",false);
  }).catch(function(){hide('loading-tech');});
}

function drawSizeChart() {
  d3.csv("data/screen_size.csv").then(function(data) {
    hide('loading-size');
    var keys = Object.keys(data[0]); var cat = keys[0], val = keys[1];
    data.forEach(function(d){d[val]=+d[val];});
    var order=["22 inch","27 inch","32 inch","43 inch","50 inch","55 inch","65 inch","75 inch","85 inch"];
    data.sort(function(a,b){return order.indexOf(a[cat])-order.indexOf(b[cat]);});
    buildBarChart("#chart-size",data,cat,val,"TV Models by Screen Size","Number of Models",false);
  }).catch(function(){hide('loading-size');});
}

function drawBrandsChart() {
  d3.csv("data/brands.csv").then(function(data) {
    hide('loading-brands');
    var keys = Object.keys(data[0]); var cat = keys[0], val = keys[1];
    data.forEach(function(d){d[val]=+d[val];}); data.sort(function(a,b){return b[val]-a[val];});
    buildHorizontalBarChart("#chart-brands",data.slice(0,20),cat,val,"Top 20 Brands by Number of TV Models",500);
  }).catch(function(){hide('loading-brands');});
}

function drawPowerChart() {
  d3.csv("data/tech_power.csv").then(function(data) {
    hide('loading-power');
    var keys = Object.keys(data[0]); var cat = keys[0], val = keys[1];
    data.forEach(function(d){d[val]=+d[val];}); data.sort(function(a,b){return a[val]-b[val];});
    buildBarChart("#chart-power",data,cat,val,"Average Power Consumption by Technology (Watts)","Average Power (Watts)",true);
  }).catch(function(){hide('loading-power');});
}

function drawScatterChart() {
  d3.csv("data/screen_size.csv").then(function(sizeData) {
    hide('loading-scatter');
    var skeys = Object.keys(sizeData[0]); sizeData.forEach(function(d){d[skeys[1]]=+d[skeys[1]];});
    var sizeInches={"22 inch":22,"27 inch":27,"32 inch":32,"43 inch":43,"50 inch":50,"55 inch":55,"65 inch":65,"75 inch":75,"85 inch":85};
    var scatterData=Object.keys(sizeInches).map(function(s){
      var row=sizeData.find(function(d){return d[skeys[0]]===s;});
      return{size:sizeInches[s],power:sizeInches[s]*1.8,count:row?row[skeys[1]]:0,label:s};
    }).filter(function(d){return d.count>0;});
    buildScatterChart("#chart-scatter",scatterData,"Screen Size vs Estimated Power Consumption",W,H);
  }).catch(function(){hide('loading-scatter');});
}

function drawStarChart() {
  d3.csv("data/size_star.csv").then(function(data) {
    hide('loading-star');
    var keys = Object.keys(data[0]); var cat = keys[0], val = keys[1];
    data.forEach(function(d){d[val]=+d[val];});
    var order=["22 inch","27 inch","32 inch","43 inch","50 inch","55 inch","65 inch","75 inch","85 inch"];
    data.sort(function(a,b){return order.indexOf(a[cat])-order.indexOf(b[cat]);});
    buildBarChart("#chart-star",data,cat,val,"Average Star Rating by Screen Size","Average Star Rating",false);
  }).catch(function(){hide('loading-star');});
}

// ==================== STORY PAGE CHARTS ====================
function drawStoryTechChart() {
  d3.csv("data/screen_tech.csv").then(function(data) {
    hide('loading-story-tech');
    var keys=Object.keys(data[0]); var cat=keys[0],val=keys[1];
    data.forEach(function(d){d[val]=+d[val];}); data.sort(function(a,b){return b[val]-a[val];});
    var sW=420-M.left-M.right, sH=280-M.top-M.bottom;
    var svg=d3.select("#chart-story-tech").attr("width",sW+M.left+M.right).attr("height",sH+M.top+M.bottom)
      .append("g").attr("transform","translate("+M.left+","+M.top+")");
    var x=d3.scaleBand().range([0,sW]).domain(data.map(function(d){return d[cat];})).padding(0.3);
    var y=d3.scaleLinear().range([sH,0]).domain([0,d3.max(data,function(d){return d[val];})*1.15]);
    svg.append("g").attr("transform","translate(0,"+sH+")").call(d3.axisBottom(x)).selectAll("text").attr("transform","rotate(-15)").style("text-anchor","end").style("font-size","11px");
    svg.append("g").call(d3.axisLeft(y).ticks(5));
    svg.selectAll(".bar").data(data).enter().append("rect").attr("x",function(d){return x(d[cat]);}).attr("width",x.bandwidth()).attr("y",function(d){return y(d[val]);}).attr("height",function(d){return sH-y(d[val]);}).attr("fill",function(d,i){return COLORS[i%COLORS.length];}).attr("rx","3");
    svg.selectAll(".lbl").data(data).enter().append("text").attr("x",function(d){return x(d[cat])+x.bandwidth()/2;}).attr("y",function(d){return y(d[val])-5;}).attr("text-anchor","middle").style("font-size","10px").style("fill","#333").style("font-weight","bold").text(function(d){return d[val].toLocaleString();});
    svg.append("text").attr("x",sW/2).attr("y",-15).attr("text-anchor","middle").style("font-size","12px").style("font-weight","bold").style("fill",GREEN).text("Models by Technology");
  }).catch(function(){hide('loading-story-tech');});
}

function drawStoryBrandsChart() {
  d3.csv("data/brands.csv").then(function(data) {
    hide('loading-story-brands');
    var keys=Object.keys(data[0]); var cat=keys[0],val=keys[1];
    data.forEach(function(d){d[val]=+d[val];}); data.sort(function(a,b){return b[val]-a[val];});
    var top10=data.slice(0,10);
    var hM={top:20,right:20,bottom:20,left:120}, hW=420-hM.left-hM.right, hH=280-hM.top-hM.bottom;
    var svg=d3.select("#chart-story-brands").attr("width",hW+hM.left+hM.right).attr("height",hH+hM.top+hM.bottom)
      .append("g").attr("transform","translate("+hM.left+","+hM.top+")");
    var y=d3.scaleBand().range([0,hH]).domain(top10.map(function(d){return d[cat];})).padding(0.3);
    var x=d3.scaleLinear().range([0,hW]).domain([0,d3.max(top10,function(d){return d[val];})*1.15]);
    svg.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size","10px");
    svg.append("g").attr("transform","translate(0,"+hH+")").call(d3.axisBottom(x).ticks(5));
    svg.selectAll(".bar").data(top10).enter().append("rect").attr("y",function(d){return y(d[cat]);}).attr("height",y.bandwidth()).attr("x",0).attr("width",function(d){return x(d[val]);}).attr("fill",function(d,i){return COLORS[i%COLORS.length];}).attr("rx","3");
    svg.selectAll(".lbl").data(top10).enter().append("text").attr("y",function(d){return y(d[cat])+y.bandwidth()/2+4;}).attr("x",function(d){return x(d[val])+4;}).style("font-size","10px").style("fill","#333").style("font-weight","bold").text(function(d){return d[val];});
    svg.append("text").attr("x",hW/2).attr("y",-5).attr("text-anchor","middle").style("font-size","12px").style("font-weight","bold").style("fill",GREEN).text("Top 10 Brands by Model Count");
  }).catch(function(){hide('loading-story-brands');});
}

function drawStoryScatterChart() {
  d3.csv("data/screen_size.csv").then(function(sizeData) {
    hide('loading-story-scatter');
    var skeys=Object.keys(sizeData[0]); sizeData.forEach(function(d){d[skeys[1]]=+d[skeys[1]];});
    var sizeInches={"22 inch":22,"27 inch":27,"32 inch":32,"43 inch":43,"50 inch":50,"55 inch":55,"65 inch":65,"75 inch":75,"85 inch":85};
    var scatterData=Object.keys(sizeInches).map(function(s){
      var row=sizeData.find(function(d){return d[skeys[0]]===s;});
      return{size:sizeInches[s],power:sizeInches[s]*1.8,count:row?row[skeys[1]]:0,label:s};
    }).filter(function(d){return d.count>0;});
    buildScatterChart("#chart-story-scatter",scatterData,"Screen Size vs Power Consumption",420-M.left-M.right,280-M.top-M.bottom);
  }).catch(function(){hide('loading-story-scatter');});
}

// ==================== CHART BUILDERS ====================
function buildBarChart(selector,data,cat,val,title,yLabel,showUnits) {
  var svg=d3.select(selector).attr("width",W+M.left+M.right).attr("height",H+M.top+M.bottom)
    .append("g").attr("transform","translate("+M.left+","+M.top+")");
  var x=d3.scaleBand().range([0,W]).domain(data.map(function(d){return d[cat];})).padding(0.3);
  var y=d3.scaleLinear().range([H,0]).domain([0,d3.max(data,function(d){return d[val];})*1.15]);
  svg.append("g").attr("transform","translate(0,"+H+")").call(d3.axisBottom(x)).selectAll("text").attr("transform","rotate(-15)").style("text-anchor","end").style("font-size","12px");
  svg.append("g").call(d3.axisLeft(y).ticks(6));
  svg.selectAll(".bar").data(data).enter().append("rect").attr("x",function(d){return x(d[cat]);}).attr("width",x.bandwidth()).attr("y",function(d){return y(d[val]);}).attr("height",function(d){return H-y(d[val]);}).attr("fill",function(d,i){return COLORS[i%COLORS.length];}).attr("rx","3");
  svg.selectAll(".lbl").data(data).enter().append("text").attr("x",function(d){return x(d[cat])+x.bandwidth()/2;}).attr("y",function(d){return y(d[val])-5;}).attr("text-anchor","middle").style("font-size","11px").style("fill","#333").style("font-weight","bold").text(function(d){return showUnits?Math.round(d[val])+"W":d[val].toLocaleString?d[val].toLocaleString():d[val];});
  svg.append("text").attr("x",W/2).attr("y",-15).attr("text-anchor","middle").style("font-size","13px").style("font-weight","bold").style("fill",GREEN).text(title);
  svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-H/2).attr("text-anchor","middle").style("font-size","12px").text(yLabel);
}

function buildHorizontalBarChart(selector,data,cat,val,title,chartHeight) {
  var hM={top:20,right:30,bottom:30,left:140}, hW=660-hM.left-hM.right, hH=chartHeight-hM.top-hM.bottom;
  var svg=d3.select(selector).attr("width",hW+hM.left+hM.right).attr("height",hH+hM.top+hM.bottom)
    .append("g").attr("transform","translate("+hM.left+","+hM.top+")");
  var y=d3.scaleBand().range([0,hH]).domain(data.map(function(d){return d[cat];})).padding(0.3);
  var x=d3.scaleLinear().range([0,hW]).domain([0,d3.max(data,function(d){return d[val];})*1.15]);
  svg.append("g").call(d3.axisLeft(y)).selectAll("text").style("font-size","11px");
  svg.append("g").attr("transform","translate(0,"+hH+")").call(d3.axisBottom(x).ticks(6));
  svg.selectAll(".bar").data(data).enter().append("rect").attr("y",function(d){return y(d[cat]);}).attr("height",y.bandwidth()).attr("x",0).attr("width",function(d){return x(d[val]);}).attr("fill",function(d,i){return COLORS[i%COLORS.length];}).attr("rx","3");
  svg.selectAll(".lbl").data(data).enter().append("text").attr("y",function(d){return y(d[cat])+y.bandwidth()/2+4;}).attr("x",function(d){return x(d[val])+5;}).style("font-size","11px").style("fill","#333").style("font-weight","bold").text(function(d){return d[val];});
  svg.append("text").attr("x",hW/2).attr("y",-5).attr("text-anchor","middle").style("font-size","13px").style("font-weight","bold").style("fill",GREEN).text(title);
}

function buildScatterChart(selector,scatterData,title,sW,sH) {
  var svg=d3.select(selector).attr("width",sW+M.left+M.right).attr("height",sH+M.top+M.bottom)
    .append("g").attr("transform","translate("+M.left+","+M.top+")");
  var x=d3.scaleLinear().range([0,sW]).domain([15,90]);
  var y=d3.scaleLinear().range([sH,0]).domain([0,180]);
  svg.append("g").attr("transform","translate(0,"+sH+")").call(d3.axisBottom(x).ticks(8));
  svg.append("g").call(d3.axisLeft(y).ticks(6));
  svg.selectAll(".dot").data(scatterData).enter().append("circle").attr("cx",function(d){return x(d.size);}).attr("cy",function(d){return y(d.power);}).attr("r",function(d){return Math.max(6,Math.sqrt(d.count/10));}).attr("fill",GREEN).attr("opacity","0.75");
  svg.selectAll(".dot-lbl").data(scatterData).enter().append("text").attr("x",function(d){return x(d.size)+8;}).attr("y",function(d){return y(d.power)+4;}).style("font-size","10px").style("fill","#333").text(function(d){return d.label;});
  svg.append("text").attr("x",sW/2).attr("y",-15).attr("text-anchor","middle").style("font-size","13px").style("font-weight","bold").style("fill",GREEN).text(title);
  svg.append("text").attr("transform","rotate(-90)").attr("y",-70).attr("x",-sH/2).attr("text-anchor","middle").style("font-size","12px").text("Estimated Power (Watts)");
  svg.append("text").attr("x",sW/2).attr("y",sH+M.bottom-5).attr("text-anchor","middle").style("font-size","12px").text("Screen Size (Inches)");
}