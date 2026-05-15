// SCATTER — Energy vs Star Rating
(function() {
  const tip = document.getElementById('tip');
  const C = {'LCD':'#10b981','LCD (LED)':'#0ea5e9','OLED':'#f59e0b','Plasma':'#ef4444'};

  const leg = document.getElementById('sc-leg');
  if(leg) Object.entries(C).forEach(([k,v]) => {
    leg.innerHTML += `<div class="leg-i"><div class="leg-d" style="background:${v}"></div>${k}</div>`;
  });

  d3.csv('data/Ex5_TV_energy.csv', d => ({
    brand:d.brand, tech:d.screen_tech, size:+d.screensize,
    energy:+d.energy_consumpt, star:+d.star2
  })).then(data => {
    data = data.filter(d => !isNaN(d.energy)&&!isNaN(d.star)&&d.star>0&&d.energy>0&&d.energy<3000);

    let c=0, target=data.length;
    const el=document.getElementById('stat-n');
    const tmr=setInterval(()=>{ c+=Math.ceil(target/40); if(c>=target){c=target;clearInterval(tmr);} if(el) el.textContent=c.toLocaleString(); },30);

    const m={top:30,right:30,bottom:60,left:70};
    const cont=document.getElementById('scatter-container');
    const W=Math.max(cont.clientWidth||0,500), H=440;
    const w=W-m.left-m.right, h=H-m.top-m.bottom;

    const svg=d3.select('#scatter-container').append('svg').attr('viewBox',`0 0 ${W} ${H}`);
    const g=svg.append('g').attr('transform',`translate(${m.left},${m.top})`);

    const xSc=d3.scaleLinear().domain(d3.extent(data,d=>d.star)).nice().range([0,w]);
    const ySc=d3.scaleLinear().domain([0,d3.max(data,d=>d.energy)]).nice().range([h,0]);

    // Grid lines
    g.append('g').call(d3.axisLeft(ySc).ticks(6).tickSize(-w).tickFormat(''))
      .call(g=>g.select('.domain').remove())
      .call(g=>g.selectAll('line').style('stroke','#f0f0f0').style('stroke-width','1'));
    g.append('g').attr('transform',`translate(0,${h})`).call(d3.axisBottom(xSc).ticks(7).tickSize(-h).tickFormat(''))
      .call(g=>g.select('.domain').remove())
      .call(g=>g.selectAll('line').style('stroke','#f0f0f0').style('stroke-width','1'));

    g.append('g').attr('class','axis').attr('transform',`translate(0,${h})`).call(d3.axisBottom(xSc).ticks(7));
    g.append('g').attr('class','axis').call(d3.axisLeft(ySc).ticks(6));

    g.append('text').attr('x',w/2).attr('y',h+50).attr('text-anchor','middle')
      .style('font-family','Inter,sans-serif').style('font-size','13px').style('fill','#888').style('font-weight','500')
      .text('Star Rating (Energy Efficiency)');
    g.append('text').attr('transform','rotate(-90)').attr('x',-h/2).attr('y',-55).attr('text-anchor','middle')
      .style('font-family','Inter,sans-serif').style('font-size','13px').style('fill','#888').style('font-weight','500')
      .text('Energy Consumption (kWh/year)');

    g.selectAll('.dot').data(data).join('circle')
      .attr('cx',d=>xSc(d.star)).attr('cy',h).attr('r',0)
      .attr('fill',d=>C[d.tech]||'#10b981').attr('opacity',0)
      .attr('stroke','#fff').attr('stroke-width',1)
      .transition().duration(700).delay(()=>Math.random()*900)
      .attr('cy',d=>ySc(d.energy)).attr('r',5).attr('opacity',0.75);

    g.selectAll('.dot')
      .on('mouseover',function(e,d){
        d3.select(this).transition().duration(100).attr('r',9).attr('opacity',1).attr('stroke-width',2);
        tip.style.opacity=1;
        tip.innerHTML=`<b>${d.brand.toUpperCase()}</b>Tech: ${d.tech}<br>Size: ${d.size}"<br>Energy: ${d.energy} kWh/yr<br>Stars: ★${d.star}`;
      })
      .on('mousemove',e=>{ tip.style.left=(e.clientX+14)+'px'; tip.style.top=(e.clientY-10)+'px'; })
      .on('mouseout',function(){ d3.select(this).transition().duration(100).attr('r',5).attr('opacity',0.75).attr('stroke-width',1); tip.style.opacity=0; });
  }).catch(e=>console.log('scatter:',e));
})();