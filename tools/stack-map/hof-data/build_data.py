import json
STD={'C':44.3,'1B':53.5,'2B':56.6,'3B':56.1,'SS':55.5,'LF':53.6,'CF':58.0,'RF':56.0,'SP':61.4,'RP':31.6}
d=json.load(open('jaws/jaws.json')); H=json.load(open('jaws/hofmap.json'))
BANNED={'rosepe01','jacksjo01'}
out=[]
for p in STD:
    r=[x for x in d[p] if not x['active'] and x['id']]
    pl=[]
    for x in r:
        h=H.get(x['id'])
        k='hof' if h and h['cat']=='Player' and h['by']!='Negro League' else 'nlg' if h and h['by']=='Negro League' else 'mgr' if h else 'out'
        if x['id'] in BANNED: k='ban'
        pl.append([x['n'],round(x['jaws']/STD[p]*100,1),k])
    N=sum(1 for q in pl if q[2]=='hof')
    out.append(dict(pos=p,std=STD[p],n=N,players=pl))
    ranked=[q for q in pl if q[2]!='nlg']
    print(p,N,'marginal:',ranked[N-1][0],ranked[N-1][1],'| above, not in:',[q[0] for q in ranked[:N] if q[2]!='hof'][:9])
json.dump(out,open('jaws/hof-line.json','w'),ensure_ascii=False,separators=(',',':'))
