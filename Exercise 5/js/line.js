// LINE — Electricity spot prices
(function() {
  const tip = document.getElementById('tip');
  const m = {top:30,right:130,bottom:60,left:70};
  const states = [
    {key:'Queensland ($ per megawatt hour)',      label:'QLD', color:'#10b981'},
    {key:'New South Wales ($ per megawatt hour)', label:'NSW', color:'#0ea5e9'},
    {key:'Victoria ($ per megawatt hour)',        label:'VIC', color:'#8b5cf6'},
    {key:'South Australia ($ per megawatt hour)', label:'SA',  color:'#f59e0b'},
    {key:'Average Price (notTas-Snowy)',           label:'AVG', color:'#111', dash:true}
  ];

  // Legend
  const leg = document.getElementById('ln-leg');
  if(leg) states.forEach(s=>{
    const style = s.dash
      ? `background:repeating-linear-gradient(90deg,${s.color} 0,${s.color} 5px,transparent 5px,transparent 9px)`
      : `background:${s.color}`;
    leg.innerHTML += `<div class="leg-i"><div class="leg-ln" style="${style}"></div>${s.label}</div>`;
  });

  d3.csv('data/Ex5_ARE_Spot_Prices.csv', d=>{
    const r={year:+d['Year']};
    states.forEach(s=>{ const v=d[s.key]; r[s.key]=(v===''||v==null)?null:+v; });
    return r;
  }).then(data=>{
    const cont = document.getElementById('line-container');
    const W = Math.max(cont.clientWidth||0, 500);
    const H = 440, w=W-m.left-m.right, h=H-m.top-m.bottom;

    const xSc = d3.scaleLinear().domain(d3.extent(data,d=>d.year)).range([0,w]);
    const allV = states.flatMap(s=>data.map(d=>d[s.key]).filter(v=>v!==null&&!isNaN(v)));
    const ySc = d3.scaleLinear().domain([0,d3.max(allV)]).nice().range([h,0]);

    const svg = d3.select('#line-container').append('svg').attr('viewBox',`0 0 ${W} ${H}`);
    const g = svg.append('g').attr('transform',`translate(${m.left},${m.top})`);

    // Grid
    g.append('g').call(d3.axisLeft(ySc).ticks(6).tickSize(-w).tickFormat(''))
      .call(g=>g.select('.domain').remove())
      .call(g=>g.selectAll('line').style('stroke','#f0f0f0').style('stroke-width','1'));

    g.append('g').attr('class','axis').attr('transform',`translate(0,${h})`).call(d3.axisBottom(xSc).ticks(8).tickFormat(d3.format('d')));
    g.append('g').attr('class','axis').call(d3.axisLeft(ySc).ticks(6));

    g.append('text').attr('x',w/2).attr('y',h+50).attr('text-anchor','middle')
      .style('font-family','Inter,sans-serif').style('font-size','13px').style('fill','#888').style('font-weight','500').text('Year');
    g.append('text').attr('transform','rotate(-90)').attr('x',-h/2).attr('y',-55).attr('text-anchor','middle')
      .style('font-family','Inter,sans-serif').style('font-size','13px').style('fill','#888').style('font-weight','500').text('$ per megawatt hour');

    const lineGen = d3.line()
      .defined(d=>d[1]!==null&&!isNaN(d[1]))
      .x(d=>xSc(d[0])).y(d=>ySc(d[1]))
      .curve(d3.curveMonotoneX);

    // Draw lines with animation
    states.forEach((s,si)=>{
      const ld = data.filter(d=>d[s.key]!==null&&!isNaN(d[s.key])).map(d=>[d.year,d[s.key]]);
      const path = g.append('path').datum(ld)
        .attr('fill','none').attr('stroke',s.color)
        .attr('stroke-width', s.dash?2.5:2)
        .attr('opacity', s.dash?1:0.85)
        .attr('d', lineGen);
      const tl = path.node().getTotalLength();
      path.attr('stroke-dasharray',`${tl} ${tl}`).attr('stroke-dashoffset',tl)
        .transition().duration(1600).delay(si*200).ease(d3.easeLinear)
        .attr('stroke-dashoffset',0)
        .on('end',()=>{ if(s.dash) path.attr('stroke-dasharray','7,4'); });
    });

    // Right-side legend in SVG
    const leg2 = svg.append('g').attr('transform',`translate(${W-m.right+10},${m.top})`);
    states.forEach((s,i)=>{
      const row = leg2.append('g').attr('transform',`translate(0,${i*28})`);
      row.append('line').attr('x1',0).attr('x2',20).attr('y1',8).attr('y2',8)
        .attr('stroke',s.color).attr('stroke-width',s.dash?2.5:2)
        .attr('stroke-dasharray',s.dash?'6,3':'none');
      row.append('text').attr('x',26).attr('y',12)
        .style('font-family','Inter,sans-serif').style('font-weight','600').style('font-size','12px').style('fill','#555')
        .text(s.label);
    });

    // Crosshair + tooltip
    const xline = g.append('line').attr('y1',0).attr('y2',h)
      .attr('stroke','#ddd').attr('stroke-dasharray','4,4').attr('opacity',0);
    const bis = d3.bisector(d=>d.year).left;

    g.append('rect').attr('width',w).attr('height',h).attr('fill','transparent')
      .on('mousemove',function(event){
        const [mx]=d3.pointer(event); const yr=Math.round(xSc.invert(mx));
        const idx=bis(data,yr); const d=data[Math.min(idx,data.length-1)]; if(!d) return;
        xline.attr('x1',xSc(d.year)).attr('x2',xSc(d.year)).attr('opacity',1);
        const rows=states.filter(s=>d[s.key]!==null&&!isNaN(d[s.key]))
          .map(s=>`<span style="color:${s.color==='#111'?'#6ee7b7':s.color}">${s.label}</span> $${Math.round(d[s.key])}`).join('<br>');
        tip.style.opacity=1; tip.innerHTML=`<b>${d.year}</b>${rows}`;
        tip.style.left=(event.clientX+14)+'px'; tip.style.top=(event.clientY-10)+'px';
      })
      .on('mouseout',()=>{ xline.attr('opacity',0); tip.style.opacity=0; });
  }).catch(e=>console.log('line:',e));
})();