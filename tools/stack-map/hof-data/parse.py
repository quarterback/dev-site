import re,html,json,statistics as st
out={}
for p in 'C 1B 2B 3B SS LF CF RF SP RP'.split():
    s=open(f'jaws/{p}.html').read().replace('<!--','').replace('-->','')
    t=re.search(r'<table[^>]*id="jaws"[^>]*>.*?</table>',s,re.S).group(0)
    rows=[]
    for r in re.findall(r'<tr[^>]*>(.*?)</tr>',t,re.S):
        m=re.search(r'data-stat="player"[^>]*>(.*?)</td>',r,re.S)
        if not m: continue
        cell=m.group(1)
        name=html.unescape(re.sub(r'<[^>]+>','',re.sub(r'<span class="hof_note">.*?</span>','',cell))).strip()
        g=lambda k: (re.search(rf'data-stat="{k}"[^>]*>([^<]*)<',r) or [None,''])[1]
        try: jaws=float(g('JAWS'))
        except: continue
        pid=(re.search(r"data-append-csv=\"(\w+)\"",r) or [None,""])[1]
        rows.append(dict(id=pid,n=name,hof='hof_note' in cell,active='<strong>' in cell,jaws=jaws,war=float(g('WAR_career') or 0),peak=float(g('WAR_peak7') or 0)))
    out[p]=rows
    h=[x['jaws'] for x in rows if x['hof']]
    print(p,len(rows),'hof',len(h),'mean',round(st.mean(h),1),'active',sum(x['active'] for x in rows))
json.dump(out,open('jaws/jaws.json','w'))
