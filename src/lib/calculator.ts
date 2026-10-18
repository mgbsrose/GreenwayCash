export type Item = {id:string;title:string;icon:string;priceCents:number;deposit:boolean;type:string;color:string;layout:Record<string,number[]>};
export type Counts = Record<string,number>;
export function calculate(items:Item[], counts:Counts, depositCents:number){
 const lines=items.filter(i=>(counts[i.id]||0)>0).map(i=>({...i,quantity:counts[i.id],lineCents:counts[i.id]*i.priceCents}));
 const goodsCents=lines.filter(i=>i.type==='product').reduce((s,i)=>s+i.lineCents,0);
 const depositQuantity=lines.filter(i=>i.deposit).reduce((s,i)=>s+i.quantity,0);
 const depositTotalCents=depositQuantity*depositCents;
 const returnsCents=lines.filter(i=>i.type==='return').reduce((s,i)=>s+i.lineCents,0);
 return {lines,goodsCents,depositQuantity,depositTotalCents,returnsCents,totalCents:goodsCents+depositTotalCents+returnsCents};
}
export const euro=(c:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(c/100);
