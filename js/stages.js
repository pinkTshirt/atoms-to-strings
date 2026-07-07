export function ns(t){return document.createElementNS('http://www.w3.org/2000/svg',t);}

export const stages=[
  {
    title:"Atom",scale:"~10\u207B\u00B9\u2070 m",color:"#4aa8ff",glow:"rgba(74,168,255,0.6)",
    short:"A cloud of electrons surrounds a nucleus 100,000\xD7 smaller \u2014 quantum mechanics describes their positions as probability clouds.",
    draw:function(sz){
      var svg=ns("svg");svg.setAttribute("width",sz);svg.setAttribute("height",sz);svg.setAttribute("viewBox","0 0 340 340");
      var c=170;
      [{rx:118,ry:45,rot:-35},{rx:118,ry:45,rot:35},{rx:118,ry:45,rot:90}].forEach(function(o,i){
        var el=ns("ellipse");el.setAttribute("cx",c);el.setAttribute("cy",c);el.setAttribute("rx",o.rx);el.setAttribute("ry",o.ry);
        el.setAttribute("transform","rotate("+o.rot+" "+c+" "+c+")");el.setAttribute("fill","none");
        el.setAttribute("stroke","rgba(74,168,255,0.45)");el.setAttribute("stroke-width","1.5");svg.appendChild(el);
        var a=(i*120-20)*Math.PI/180;
        var e2=ns("circle");e2.setAttribute("cx",c+Math.cos(a)*o.rx*.75);e2.setAttribute("cy",c+Math.sin(a)*o.ry*.75);
        e2.setAttribute("r","6");e2.setAttribute("fill","#4aa8ff");svg.appendChild(e2);
      });
      var n=ns("circle");n.setAttribute("cx",c);n.setAttribute("cy",c);n.setAttribute("r","14");n.setAttribute("fill","#4aa8ff");svg.appendChild(n);
      return svg;
    },
    long:[
      {h:"Quantum shells",t:"Electrons don't orbit like planets. Quantum mechanics constrains them to discrete energy levels described by four quantum numbers. The Pauli exclusion principle means no two electrons share the same state. Valence electrons determine all chemistry."},
      {h:"The nucleus",t:"The nucleus occupies 1/100,000 of the atom's diameter but over 99.9% of its mass. Rutherford's 1911 gold foil experiment revealed this: most alpha particles passed through, but a few bounced back \u2014 evidence of a tiny, dense core surrounded by vast emptiness."},
      {h:"Wave-particle duality",t:"The electron's position genuinely has none until measured. The Born rule gives the probability of finding it at a location from the square of its wavefunction. This is the core strangeness of quantum mechanics."},
      {h:"Scale in context",t:"If a hydrogen atom were scaled to a football stadium, the nucleus would be a marble at the centre spot \u2014 electrons flickering as probability clouds around the outer stands. The atom is almost entirely empty space."}
    ]
  },
  {
    title:"Nucleus",scale:"~10\u207B\u00B9\u2074 m",color:"#50e0a0",glow:"rgba(80,224,160,0.6)",
    short:"Protons and neutrons packed 100,000\xD7 smaller than the atom, held against electrostatic repulsion by the residual strong force.",
    draw:function(sz){
      var svg=ns("svg");svg.setAttribute("width",sz);svg.setAttribute("height",sz);svg.setAttribute("viewBox","0 0 340 340");
      var pos=[{x:152,y:146},{x:186,y:146},{x:169,y:170},{x:142,y:170},{x:196,y:170},{x:169,y:122},{x:152,y:194},{x:186,y:194}];
      var pro=[1,0,1,0,1,0,1,0];
      pos.forEach(function(p,i){
        var c=ns("circle");c.setAttribute("cx",p.x);c.setAttribute("cy",p.y);c.setAttribute("r","20");
        c.setAttribute("fill",pro[i]?"#50e0a0":"#1e3050");c.setAttribute("stroke",pro[i]?"#20a070":"#4a7aaa");c.setAttribute("stroke-width","1");svg.appendChild(c);
        var t=ns("text");t.setAttribute("x",p.x);t.setAttribute("y",p.y+5);t.setAttribute("text-anchor","middle");
        t.setAttribute("fill",pro[i]?"#03050f":"#7ab0d0");t.setAttribute("font-size","13");t.setAttribute("font-weight","500");t.textContent=pro[i]?"p":"n";svg.appendChild(t);
      });
      return svg;
    },
    long:[
      {h:"Residual strong force",t:"The residual strong force \u2014 a leakage of the color force binding quarks \u2014 overcomes electromagnetism at distances below ~2.5 fm. It is the most powerful force in nature at that scale."},
      {h:"Nuclear stability",t:"The neutron-to-proton ratio determines stability. Too many or too few neutrons and the nucleus decays by emitting alpha, beta, or gamma radiation. Iron-56 is the most tightly bound nucleus per nucleon."},
      {h:"Nuclear energy",t:"E = mc\xB2. A nucleus weighs slightly less than its free nucleons \u2014 the mass defect is the binding energy. Fission splits heavy nuclei; fusion merges light ones. Fusion powers every star in the universe."},
      {h:"Shell model",t:"Nucleons occupy discrete energy shells. Nuclei with magic numbers (2, 8, 20, 28, 50, 82, 126) are especially stable \u2014 analogous to noble gas electron configurations."}
    ]
  },
  {
    title:"Proton",scale:"~10\u207B\u00B9\u2075 m",color:"#e8a84a",glow:"rgba(232,168,74,0.6)",
    short:"Three quarks bound by gluons in constant exchange. The strong force generates 99% of the proton's mass from pure field energy.",
    draw:function(sz){
      var svg=ns("svg");svg.setAttribute("width",sz);svg.setAttribute("height",sz);svg.setAttribute("viewBox","0 0 340 340");
      var c=170,qp=[{x:c,y:c-78},{x:c-68,y:c+46},{x:c+68,y:c+46}],ql=["u","u","d"];
      for(var i=0;i<3;i++)for(var j=i+1;j<3;j++){
        var l=ns("line");l.setAttribute("x1",qp[i].x);l.setAttribute("y1",qp[i].y);l.setAttribute("x2",qp[j].x);l.setAttribute("y2",qp[j].y);
        l.setAttribute("stroke","rgba(232,168,74,0.22)");l.setAttribute("stroke-width","9");l.setAttribute("stroke-dasharray","6 5");svg.appendChild(l);
      }
      var r=ns("circle");r.setAttribute("cx",c);r.setAttribute("cy",c);r.setAttribute("r","96");r.setAttribute("fill","none");r.setAttribute("stroke","rgba(232,168,74,0.08)");r.setAttribute("stroke-width","1");svg.appendChild(r);
      qp.forEach(function(p,i){
        var g=ns("circle");g.setAttribute("cx",p.x);g.setAttribute("cy",p.y);g.setAttribute("r","27");g.setAttribute("fill","#e8a84a");svg.appendChild(g);
        var t=ns("text");t.setAttribute("x",p.x);t.setAttribute("y",p.y+6);t.setAttribute("text-anchor","middle");t.setAttribute("fill","#03050f");t.setAttribute("font-size","17");t.setAttribute("font-weight","600");t.textContent=ql[i];svg.appendChild(t);
      });
      return svg;
    },
    long:[
      {h:"Color charge & QCD",t:"Each quark carries one of three color charges (red, green, blue). The proton is always color-neutral. Quantum chromodynamics governs this with 8 types of gluons. The color force grows stronger as quarks are pulled apart."},
      {h:"Quark confinement",t:"As quarks separate, the energy in the gluon field increases linearly until it creates a new quark-antiquark pair. You always end up with new hadrons, never a free quark. Quarks exist only inside bound states."},
      {h:"Mass from energy",t:"The three valence quarks (u,u,d) account for only ~1% of the proton's 938 MeV mass. The rest comes from the kinetic energy of quarks and the gluon field \u2014 a vivid demonstration of E = mc\xB2."},
      {h:"Sea quarks",t:"The proton's interior seethes with virtual quark-antiquark pairs and gluons continuously appearing and annihilating. High-energy scattering at CERN and SLAC mapped these via parton distribution functions."}
    ]
  },
  {
    title:"Quark",scale:"<10\u207B\u00B9\u2079 m",color:"#c060e8",glow:"rgba(192,96,232,0.6)",
    short:"Point-like to every instrument ever built. Six flavors, three colors, no known internal structure.",
    draw:function(sz){
      var svg=ns("svg");svg.setAttribute("width",sz);svg.setAttribute("height",sz);svg.setAttribute("viewBox","0 0 340 340");
      var c=170;
      for(var i=0;i<7;i++){var cr=ns("circle");cr.setAttribute("cx",c);cr.setAttribute("cy",c);cr.setAttribute("r",(i+1)*22);cr.setAttribute("fill","none");cr.setAttribute("stroke","rgba(192,96,232,"+(0.1-i*0.012)+")");cr.setAttribute("stroke-width","1");svg.appendChild(cr);}
      var core=ns("circle");core.setAttribute("cx",c);core.setAttribute("cy",c);core.setAttribute("r","24");core.setAttribute("fill","#c060e8");svg.appendChild(core);
      var lbl=ns("text");lbl.setAttribute("x",c);lbl.setAttribute("y",c+6);lbl.setAttribute("text-anchor","middle");lbl.setAttribute("fill","#fff");lbl.setAttribute("font-size","13");lbl.setAttribute("font-weight","500");lbl.textContent="quark";svg.appendChild(lbl);
      ["up","down","charm","strange","top","bottom"].forEach(function(f,j){
        var rad=j*60*Math.PI/180,r2=130;
        var fx=c+Math.cos(rad)*r2,fy=c+Math.sin(rad)*r2;
        var d=ns("circle");d.setAttribute("cx",fx);d.setAttribute("cy",fy);d.setAttribute("r","9");d.setAttribute("fill","rgba(192,96,232,0.35)");svg.appendChild(d);
        var t=ns("text");t.setAttribute("x",fx);t.setAttribute("y",fy+4);t.setAttribute("text-anchor","middle");t.setAttribute("fill","rgba(200,150,255,0.7)");t.setAttribute("font-size","10");t.textContent=f;svg.appendChild(t);
      });
      return svg;
    },
    long:[
      {h:"Six flavors",t:"Up, down, charm, strange, top, bottom. Ordinary matter uses only u and d. The top quark (Fermilab, 1995) is heavier than a gold atom and decays before forming hadrons."},
      {h:"Fractional charge",t:"Quarks carry +2/3 (u,c,t) or \u22121/3 (d,s,b) electric charge. Fractional charges were controversial when proposed in 1964. They always combine to give integer charges: proton = +2/3+2/3\u22121/3 = +1."},
      {h:"Point-like",t:"Deep inelastic scattering at SLAC (1968) first showed protons contain hard point-like constituents. Experiments below 10\u207B\u00B9\u2079 m find no substructure. Within the Standard Model, quarks are truly elementary."},
      {h:"Three generations",t:"Quarks come in three generations of increasing mass. Only the first (u,d) is stable. Why exactly three generations exist is one of physics's deepest open questions."}
    ]
  },
  {
    title:"String (hypothetical)",scale:"~10\u207B\u00B3\u2075 m",color:"#ff5090",glow:"rgba(255,80,144,0.6)",
    short:"At the Planck scale, superstring theory replaces point particles with vibrating 1D loops \u2014 each vibrational mode a different particle.",
    draw:function(sz){
      var svg=ns("svg");svg.setAttribute("width",sz);svg.setAttribute("height",sz);svg.setAttribute("viewBox","0 0 340 340");
      var c=170;
      for(var i=0;i<8;i++){var e=ns("ellipse");e.setAttribute("cx",c);e.setAttribute("cy",c);e.setAttribute("rx",(i+1)*19);e.setAttribute("ry",(i+1)*9);e.setAttribute("fill","none");e.setAttribute("stroke","rgba(255,80,144,"+(0.07-i*0.008)+")");e.setAttribute("stroke-width","1");svg.appendChild(e);}
      var pts=[];
      for(var j=0;j<=72;j++){var t=j/72*Math.PI*2;pts.push((c+Math.cos(t)*(78+Math.sin(t*3)*14))+","+(c+Math.sin(t)*(36+Math.sin(t*5)*8)));}
      var p=ns("path");p.setAttribute("d","M"+pts.join("L")+"Z");p.setAttribute("fill","none");p.setAttribute("stroke","#ff5090");p.setAttribute("stroke-width","2.5");svg.appendChild(p);
      return svg;
    },
    long:[
      {h:"Core idea",t:"Superstring theory replaces point particles with 1D vibrating strings ~10\u207B\u00B3\u2075 m long. Different vibrational modes correspond to different particles \u2014 the electron, quarks, even the graviton. This would unify all four forces."},
      {h:"Extra dimensions",t:"String theory requires 10 or 11 spacetime dimensions. The extra 6\u20137 are compactified into Calabi-Yau manifolds too small to detect. Their shape determines the low-energy physics we observe."},
      {h:"M-theory",t:"Five competing string theories were unified by Witten in 1995 into 11-dimensional M-theory. Its higher-dimensional branes can collide to generate universes, inspiring the multiverse conjecture."},
      {h:"No experimental confirmation",t:"The Planck scale is ~15 orders of magnitude beyond the LHC. String theory makes no unique, falsifiable prediction accessible to current experiments."},
      {h:"Why physicists take it seriously",t:"The AdS/CFT correspondence (a duality between string theory and a quantum field theory) has deep applications in black hole physics and condensed matter. It remains the only framework consistent with both quantum mechanics and general relativity."}
    ]
  }
];
