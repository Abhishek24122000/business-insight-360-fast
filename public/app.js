(function(){
"use strict";
var T=I18N.T,dimT=I18N.dim,$=function(id){return document.getElementById(id);};
var S={lang:"en",f:{d0:0,d1:0,region:-1,category:-1,sub:-1,state:-1,city:-1},page:0,sortKey:null,sortDir:1};
var D=null,SEL=null,A=null,SORTED=null,pending=false;
var COLORS=["#6D4AFF","#FF7A1A","#1FA971","#E5484D","#0EA5B7","#C06BFF","#E9B824","#8D6E63"];
try{var sv=localStorage.getItem("bilang");if(sv==="ja"||sv==="en")S.lang=sv;else if(/^ja/i.test(navigator.language||""))S.lang="ja";}catch(e){if(/^ja/i.test(navigator.language||""))S.lang="ja";}
try{var q=new URLSearchParams(location.search).get("lang");if(q==="ja"||q==="en")S.lang=q;}catch(e){}
function t(){return T[S.lang];}
function dn(dim,i){return dimT(S.lang,dim,D.dims[dim][i]);}
function money(v){return "$"+Math.round(v).toLocaleString("en-US");}
function money2(v){return "$"+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}
function compact(v){
  var a=Math.abs(v);
  if(S.lang==="ja"){if(a>=1e8)return "$"+(v/1e8).toFixed(2)+"億";if(a>=1e4)return "$"+(v/1e4).toFixed(a>=1e6?0:1)+"万";return "$"+Math.round(v);}
  if(a>=1e9)return "$"+(v/1e9).toFixed(2)+"B";if(a>=1e6)return "$"+(v/1e6).toFixed(2)+"M";if(a>=1e3)return "$"+(v/1e3).toFixed(1)+"K";return "$"+Math.round(v);
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function num(v){return v.toLocaleString("en-US");}

/* ---------- static text ---------- */
function applyStatic(){
  var L=t();document.documentElement.lang=S.lang;document.title=L.brand;
  document.querySelectorAll("[data-i]").forEach(function(el){var v=L[el.getAttribute("data-i")];if(typeof v==="string")el.textContent=v;});
  $("langBtn").textContent=L.langBtn;$("langBtn").title=L.langTitle;$("langBtn").setAttribute("aria-label",L.langTitle);
  var g=$("gloss");g.innerHTML=L.gloss.map(function(r){return "<li><b>"+esc(r[0])+"</b>: "+esc(r[1])+"</li>";}).join("");
}
function fillSelect(id,dim,cur){
  var el=$(id),L=t(),h='<option value="-1">'+esc(L.all)+"</option>";
  D.dims[dim].forEach(function(_,i){h+='<option value="'+i+'">'+esc(dn(dim,i))+"</option>";});
  el.innerHTML=h;el.value=String(cur);
}
function fillFilters(){
  fillSelect("fRegion","region",S.f.region);fillSelect("fCategory","category",S.f.category);fillSelect("fSub","sub",S.f.sub);
  fillSelect("fState","state",S.f.state);fillSelect("fCity","city",S.f.city);
}

/* ---------- plotting ---------- */
var CFG={displayModeBar:false,responsive:true};
function base(extra){
  var o={margin:{l:56,r:16,t:8,b:40},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{family:'system-ui,-apple-system,"Segoe UI","Hiragino Sans","Yu Gothic UI","Meiryo",sans-serif',size:12,color:"#1f2937"},
    xaxis:{gridcolor:"#e5e7eb",linecolor:"#cbd5e1",zeroline:false,automargin:true,tickfont:{color:"#1f2937",size:12},title:{font:{color:"#374151",size:12}}},yaxis:{gridcolor:"#e5e7eb",linecolor:"#cbd5e1",zeroline:false,automargin:true,tickfont:{color:"#1f2937",size:12},title:{font:{color:"#374151",size:12}}},showlegend:false,hoverlabel:{font:{size:12}}};
  for(var k in extra){if(typeof extra[k]==="object"&&!Array.isArray(extra[k])&&o[k])Object.assign(o[k],extra[k]);else o[k]=extra[k];}
  return o;
}
function plot(id,data,layout){Plotly.react(id,data,layout,CFG);}
function monthStrs(){return A.months.map(function(m){return m[0]+"-"+(m[1]<10?"0":"")+m[1]+"-01";});}
function trend(id,vals,name,color){
  var L=t(),x=monthStrs(),fmt=S.lang==="ja"?"%Y年%-m月":"%b %Y";
  plot(id,[{x:x,y:vals,type:"scatter",mode:"lines+markers",line:{color:color,width:2.5},marker:{size:6,color:color},
    customdata:vals.map(money),hovertemplate:"%{x|"+fmt+"}<br>"+esc(name)+": %{customdata}<extra></extra>"}],
    base({xaxis:{tickformat:fmt,title:{text:L.month}},yaxis:{tickprefix:"$",tickformat:"~s",title:{text:name}}}));
}
function barV(id,labels,vals,colors,name){
  var L=t();
  plot(id,[{x:labels,y:vals,type:"bar",marker:{color:colors},text:vals.map(compact),textposition:"outside",textfont:{color:"#1f2937"},cliponaxis:false,customdata:vals.map(money),hovertemplate:"%{x}<br>"+esc(name)+": %{customdata}<extra></extra>"}],
    base({margin:{l:56,r:16,t:24,b:48},yaxis:{tickprefix:"$",tickformat:"~s",title:{text:name}}}));
}
function barH(id,items,dim,color,name,nameFn){
  var rows=items.slice().reverse();
  var labels=rows.map(function(r){return nameFn?nameFn(r.i):dn(dim,r.i);}),vals=rows.map(function(r){return r.v;});
  var longest=labels.reduce(function(m,s){return Math.max(m,s.length);},0);
  plot(id,[{y:labels,x:vals,type:"bar",orientation:"h",marker:{color:color},text:vals.map(compact),textposition:"outside",textfont:{color:"#1f2937"},cliponaxis:false,customdata:vals.map(money),hovertemplate:"%{y}<br>"+esc(name)+": %{customdata}<extra></extra>"}],
    base({margin:{l:Math.min(190,40+longest*(S.lang==="ja"?13:6.5)),r:64,t:8,b:40},xaxis:{tickprefix:"$",tickformat:"~s",title:{text:name}}}));
}
function charts(){
  var L=t(),i,n=D.dims;
  trend("ch_rev_trend",A.mRev,L.revenue,COLORS[0]);
  trend("ch_pro_trend",A.mPro,L.profit,COLORS[2]);
  var ri=[],rl=[],rv=[],rc=[];for(i=0;i<n.region.length;i++){ri.push(i);}
  ri.sort(function(a,b){return A.region[b]-A.region[a];});
  barV("ch_region",ri.map(function(i){return dn("region",i);}),ri.map(function(i){return A.region[i];}),ri.map(function(i){return COLORS[i%COLORS.length];}),L.revenue);
  var ci=[];for(i=0;i<n.category.length;i++)ci.push(i);
  var cl=ci.map(function(i){return dn("category",i);});
  plot("ch_cat",[{labels:cl,values:ci.map(function(i){return A.cat[i];}),type:"pie",hole:.45,sort:false,marker:{colors:COLORS},textinfo:"percent",hovertemplate:"%{label}<br>"+esc(L.revenue)+": $%{value:,.0f}<br>%{percent}<extra></extra>"}],
    base({margin:{l:8,r:8,t:8,b:8},showlegend:true,legend:{orientation:"h",y:-0.05,font:{color:"#1f2937"}}}));
  var pi=ci.slice().sort(function(a,b){return A.catProfit[b]-A.catProfit[a];});
  barV("ch_pcat",pi.map(function(i){return dn("category",i);}),pi.map(function(i){return A.catProfit[i];}),pi.map(function(i){return COLORS[i%COLORS.length];}),L.profit);
  barH("ch_sub",A.subTop,"sub",COLORS[0],L.revenue);
  barH("ch_prod",A.prodTop,"product",COLORS[1],L.revenue);
  barH("ch_cust",A.custTop,null,COLORS[5],L.revenue,function(i){return D.customers[i];});
  barH("ch_state",A.stateTop,"state",COLORS[2],L.revenue);
  barH("ch_city",A.cityTop,"city",COLORS[4],L.revenue);
  // scatter
  var ids=Core.sample(SEL,5000,42),byCat={};
  ids.forEach(function(k){var c=D.category[k];(byCat[c]=byCat[c]||[]).push(k);});
  var tr=Object.keys(byCat).map(function(c){var a=byCat[c];
    return {name:dn("category",+c),type:"scattergl",mode:"markers",x:a.map(function(k){return D.price[k]/100;}),y:a.map(function(k){return D.profit[k]/100;}),
      marker:{color:COLORS[c%COLORS.length],opacity:.65,size:a.map(function(k){return 5+D.qty[k]*2;}),line:{width:0}},
      text:a.map(function(k){return esc(dn("product",D.product[k]))+"<br>"+esc(dn("category",D.category[k]))+" / "+esc(dn("region",D.region[k]))+"<br>"+esc(D.customers[D.customer[k]])+"<br>"+esc(L.qty)+": "+D.qty[k];}),
      hovertemplate:"%{text}<br>"+esc(L.unitPrice)+": $%{x:,.2f}<br>"+esc(L.profit)+": $%{y:,.2f}<extra></extra>"};});
  // scattergl is not in basic bundle -> use scatter
  tr.forEach(function(x){x.type="scatter";});
  plot("ch_scatter",tr,base({showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#1f2937"}},xaxis:{tickprefix:"$",title:{text:L.unitPrice}},yaxis:{tickprefix:"$",title:{text:L.profit}}}));
}

/* ---------- KPIs, snapshot, banner ---------- */
function kpis(){
  var L=t();
  var items=[[L.kRev,money(A.revenue)],[L.kProfit,money(A.profit)],[L.kMargin,A.margin.toFixed(1)+"%"],[L.kOrders,num(A.orders)],[L.kUnits,num(A.units)]];
  $("kpis").innerHTML=items.map(function(r){return '<div class="kpi"><div class="kl">'+esc(r[0])+'</div><div class="kv">'+esc(r[1])+"</div></div>";}).join("");
}
function snapshot(){
  var L=t(),rg=A.topRegion,cg=A.topCat,pr=A.topProd,pc=A.topProfCat;
  var items=[[L.sRegion,dn("region",rg),money(A.region[rg])+" "+L.revenue.toLowerCase(),0],[L.sCat,dn("category",cg),money(A.cat[cg])+" "+L.revenue.toLowerCase(),0],
    [L.sProd,dn("product",pr),money(A.prodTop[0].v)+" "+L.revenue.toLowerCase(),0],[L.sProfCat,dn("category",pc),money(A.catProfit[pc])+" "+L.profit.toLowerCase(),0]];
  if(S.lang==="ja"){items[0][2]="売上高 "+money(A.region[rg]);items[1][2]="売上高 "+money(A.cat[cg]);items[2][2]="売上高 "+money(A.prodTop[0].v);items[3][2]="利益 "+money(A.catProfit[pc]);}
  $("snap").innerHTML=items.map(function(r){return '<div class="kpi"><div class="kl">'+esc(r[0])+'</div><div class="kv sm">'+esc(r[1])+'</div><div class="kd">▲ '+esc(r[2])+"</div></div>";}).join("");
}
function banner(){
  var L=t(),f=S.f,parts=[];
  if(f.d0!==0||f.d1!==D.maxDay)parts.push("<b>"+esc(L.fDate)+":</b> "+Core.dayToStr(D,f.d0)+" → "+Core.dayToStr(D,f.d1));
  [["region","fRegion"],["category","fCategory"],["sub","fSub"],["state","fState"],["city","fCity"]].forEach(function(p){if(f[p[0]]>=0)parts.push("<b>"+esc(L[p[1]])+":</b> "+esc(dn(p[0],f[p[0]])));});
  $("banner").innerHTML=parts.length?parts.join(" &nbsp;|&nbsp; "):esc(L.showingAll);
}

/* ---------- table ---------- */
var PS=50;
function table(){
  var L=t(),cols=L.cols,keys=["id","date","cust","city","state","region","cat","sub","prod","qty","price","rev","profit"];
  var numeric={id:1,qty:1,price:1,rev:1,profit:1};
  var rows=SORTED||SEL,total=rows.length,pages=Math.max(1,Math.ceil(total/PS));
  if(S.page>=pages)S.page=pages-1;if(S.page<0)S.page=0;
  var h="<thead><tr>"+keys.map(function(k){var arrow=S.sortKey===k?(S.sortDir>0?" ▲":" ▼"):"";return '<th data-k="'+k+'" class="'+(numeric[k]?"r":"")+'">'+esc(cols[k])+arrow+"</th>";}).join("")+"</tr></thead><tbody>";
  var s=S.page*PS,e=Math.min(total,s+PS);
  for(var j=s;j<e;j++){var i=rows[j];
    h+="<tr><td class='r'>"+D.order_id[i]+"</td><td>"+Core.dayToStr(D,D.date[i])+"</td><td>"+esc(D.customers[D.customer[i]])+"</td><td>"+esc(dn("city",D.city[i]))+"</td><td>"+esc(dn("state",D.state[i]))+"</td><td>"+esc(dn("region",D.region[i]))+"</td><td>"+esc(dn("category",D.category[i]))+"</td><td>"+esc(dn("sub",D.sub[i]))+"</td><td>"+esc(dn("product",D.product[i]))+"</td><td class='r'>"+D.qty[i]+"</td><td class='r'>"+money2(D.price[i]/100)+"</td><td class='r'>"+money2(D.revenue[i]/100)+"</td><td class='r'>"+money2(D.profit[i]/100)+"</td></tr>";}
  $("tbl").innerHTML=h+"</tbody>";
  $("tblCap").textContent=L.match(num(total));
  $("pgInfo").textContent=L.page+" "+(S.page+1)+" "+L.of+" "+pages;
  $("prev").textContent="‹ "+L.prev;$("next").textContent=L.next+" ›";
  $("prev").disabled=S.page<=0;$("next").disabled=S.page>=pages-1;
}

/* ---------- main render ---------- */
function compute(){SEL=Core.select(D,S.f);SORTED=null;if(S.sortKey)SORTED=Core.sortSel(D,SEL,S.sortKey,S.sortDir);A=SEL.length?Core.aggregate(D,SEL):null;}
function render(){
  var L=t();banner();
  var has=SEL.length>0;
  $("empty").style.display=has?"none":"block";$("empty").textContent=L.empty;
  $("content").style.display=has?"block":"none";
  if(!has){return;}
  kpis();snapshot();charts();table();
}
function refresh(resetPage){if(resetPage)S.page=0;compute();render();}
function schedule(resetPage){if(resetPage)S.page=0;if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;refresh(false);});}

/* ---------- boot ---------- */
async function gunzip(buf){
  var u=new Uint8Array(buf);
  if(!(u[0]===0x1f&&u[1]===0x8b))return buf;
  var ds=new DecompressionStream("gzip");
  return await new Response(new Blob([buf]).stream().pipeThrough(ds)).arrayBuffer();
}
async function load(path){var r=await fetch(path);if(!r.ok)throw new Error(path+" "+r.status);return gunzip(await r.arrayBuffer());}
function setLang(l){
  S.lang=l;try{localStorage.setItem("bilang",l);}catch(e){}
  applyStatic();if(D){fillFilters();setDateInputs();render();}else $("loadMsg").textContent=t().loading("191,809");
}
function setDateInputs(){$("fFrom").value=Core.dayToStr(D,S.f.d0);$("fTo").value=Core.dayToStr(D,S.f.d1);}
async function boot(){
  applyStatic();$("loadMsg").textContent=t().loading("191,809");
  $("langBtn").addEventListener("click",function(){setLang(S.lang==="en"?"ja":"en");});
  try{
    var res=await Promise.all([fetch("data/meta.json").then(function(r){return r.json();}),load("data/cols.bin.gz"),load("data/customers.txt.gz")]);
    var customers=new TextDecoder().decode(res[2]).split("\n");
    D=Core.buildData(res[0],res[1],customers);
  }catch(e){$("loadMsg").textContent=t().loadErr;console.error(e);return;}
  S.f.d0=0;S.f.d1=D.maxDay;
  var mn=Core.dayToStr(D,0),mx=Core.dayToStr(D,D.maxDay);
  ["fFrom","fTo"].forEach(function(id){$(id).min=mn;$(id).max=mx;});
  fillFilters();setDateInputs();
  [["fRegion","region"],["fCategory","category"],["fSub","sub"],["fState","state"],["fCity","city"]].forEach(function(p){$(p[0]).addEventListener("change",function(){S.f[p[1]]=+this.value;schedule(true);});});
  $("fFrom").addEventListener("change",function(){if(this.value){S.f.d0=Math.max(0,Core.strToDay(D,this.value));if(S.f.d0>S.f.d1){S.f.d1=S.f.d0;setDateInputs();}schedule(true);}});
  $("fTo").addEventListener("change",function(){if(this.value){S.f.d1=Math.min(D.maxDay,Core.strToDay(D,this.value));if(S.f.d1<S.f.d0){S.f.d0=S.f.d1;setDateInputs();}schedule(true);}});
  $("reset").addEventListener("click",function(){S.f={d0:0,d1:D.maxDay,region:-1,category:-1,sub:-1,state:-1,city:-1};fillFilters();setDateInputs();schedule(true);});
  $("prev").addEventListener("click",function(){S.page--;table();});
  $("next").addEventListener("click",function(){S.page++;table();});
  $("tbl").addEventListener("click",function(e){var th=e.target.closest("th");if(!th)return;var k=th.getAttribute("data-k");
    if(S.sortKey===k)S.sortDir=-S.sortDir;else{S.sortKey=k;S.sortDir=1;}
    SORTED=Core.sortSel(D,SEL,S.sortKey,S.sortDir);S.page=0;table();});
  $("loader").style.display="none";$("app").style.visibility="visible";
  compute();render();
}
boot();
})();
