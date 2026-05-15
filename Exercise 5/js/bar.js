// BAR — 55inch energy by tech
(function() {
  const tip = document.getElementById('tip');
  const C = ['#10b981','#0ea5e9','#f59e0b'];
  const m = {top:30,right:20,bottom:64,left:70};

  d3.csv('data/Ex5_TV_energy_55inchtv_byScreenType.csv', d => ({
    tech: d['Screen_Tech'],
    value: +d['Mean(Labelled energy consumption (kWh/year))']
  })).then(data => {
    const cont = document.getElementById('bar-container');
    const W = Math.max(cont.clientWidth||0, 340);
    const H = 320, w = W-m.left-m.right, h = H-m.top-m.bottom;

    const cSc = d3.scaleOrdinal().domain(data.map(d=>d.tech)).range(C);
    const xSc = d3.scaleBand().domain(data.map(d=>d.tech)).range([0,w]).padding(0.35);
    const ySc = d3.scaleLinear().domain([0,d3.max(data,d=>d.value)*1.2]).nice().range([h,0]);

    const svg = d3.select('#bar-container').append('svg').attr('viewBox',`0 0 ${W} ${H}`);
    const g = svg.append('g').attr('transform',`translate(${m.left},${m.top})`);

    g.append('g').call(d3.axisLeft(ySc).ticks(4).tickSize(-w).tickFormat(''))
      .call(g=>g.select('.domain').remove())
      .call(g=>g.selectAll('line').style('stroke','#f0f0f0').style('stroke-width','1'));

    g.append('g').attr('class','axis').attr('transform',`translate(0,${h})`).call(d3.axisBottom(xSc));
    g.append('g').attr('class','axis').call(d3.axisLeft(ySc).ticks(4));

    g.append('text').attr('transform','rotate(-90)').attr('x',-h/2).attr('y',-55).attr('text-anchor','middle')
      .style('font-family','Inter,sans-serif').style('font-size','12px').style('fill','#888').style('font-weight','500')
      .text('Mean Energy (kWh/year)');

    // Bars with grow animation
    g.selectAll('.bar').data(data).join('rect').attr('class','bar')
      .attr('x',d=>xSc(d.tech)).attr('y',h).attr('width',xSc.bandwidth()).attr('height',0)
      .attr('fill',d=>cSc(d.tech)).attr('rx',6).style('cursor','pointer')
      .transition().duration(900).delay((_,i)=>i*160).ease(d3.easeCubicOut)
      .attr('y',d=>ySc(d.value)).attr('height',d=>h-ySc(d.value));

    // Hover after animation settles
    setTimeout(()=>{
      g.selectAll('.bar')
        .on('mouseover',function(e,d){ d3.select(this).transition().duration(100).attr('opacity',0.75); tip.style.opacity=1; tip.innerHTML=`<b>${d.tech}</b>55" mean: ${Math.round(d.value)} kWh/yr`; })
        .on('mousemove',e=>{ tip.style.left=(e.clientX+14)+'px'; tip.style.top=(e.clientY-10)+'px'; })
        .on('mouseout',function(){ d3.select(this).transition().duration(100).attr('opacity',1); tip.style.opacity=0; });
    }, 1500);

    // Value labels
    g.selectAll('.val').data(data).join('text').attr('class','val')
      .attr('x',d=>xSc(d.tech)+xSc.bandwidth()/2).attr('y',d=>ySc(d.value)-10)
      .attr('text-anchor','middle')
      .style('font-family','Syne,sans-serif').style('font-weight','700').style('font-size','14px')
      .style('fill',d=>cSc(d.tech)).attr('opacity',0)
      .text(d=>Math.round(d.value))
      .transition().delay(1200).duration(400).attr('opacity',1);

  }).catch(e=>console.log('bar:',e));
})();