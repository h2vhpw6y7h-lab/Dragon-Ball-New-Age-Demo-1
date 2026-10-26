#!/usr/bin/env python3
"""Build real 3840x2160 (pixel-resolution) cinematic game assets from approved anime scenes.
The source is existing 920x592 upscaled art; this is not native 4K line detail.
Individual frames have newly rendered full-resolution energy, dust and speed effects.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageStat
from random import Random
from math import sin, cos, pi

W,H=3840,2160
OUT=Path("assets/4k")
OUT.mkdir(parents=True,exist_ok=True)
R=Random(20261027)
BATTLE=Path("assets/anime-scene-battle-hd.webp")
KI=Path("assets/anime-scene-ki-hd.webp")
assert BATTLE.exists() and KI.exists(), "Required source art missing"

def prepare(path):
    src=Image.open(path).convert("RGB")
    assert src.width>=900 and src.height>=580, "Must start from verified HD source, not thumbnail"
    bg=src.resize((W,round(src.height*W/src.width)),Image.Resampling.BICUBIC)
    bg=bg.crop((0,(bg.height-H)//2,W,(bg.height+H)//2))
    bg=bg.filter(ImageFilter.GaussianBlur(65))
    fw=round(H*src.width/src.height)
    fg=src.resize((fw,H),Image.Resampling.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2.2,percent=155,threshold=3))
    bg.paste(fg,((W-fw)//2,0))
    return ImageEnhance.Contrast(bg).enhance(1.07).convert("RGBA")

def apply_fx(base,kind):
    im=base.copy()
    fx=Image.new("RGBA",(W,H),(0,0,0,0))
    d=ImageDraw.Draw(fx,"RGBA")
    if kind=="battle":
        for i in range(85):
            x=R.randint(100,W-100);y=R.randint(140,H-180)
            rad=R.randint(2,7)
            d.ellipse((x-rad,y-rad,x+rad,y+rad),fill=(255,213,141,R.randint(25,95)))
    elif kind=="dash":
        for i in range(185):
            y=R.randrange(H);x=R.randrange(W)
            ln=R.randrange(250,980);dx=R.randrange(40,190)
            col=(180,231,255,R.randint(35,125)) if i%3 else (255,188,84,R.randint(40,115))
            d.line((x,y,x-ln,y+dx),fill=col,width=R.randint(2,12))
        for x,y in [(850,740),(1150,960),(1370,1170)]:
            for r in (160,245,320):
                d.arc((x-r,y-r,x+r,y+r),165,345,fill=(134,227,255,82),width=9)
    elif kind=="charge":
        x,y=1380,1010
        for r in range(110,800,95):
            d.arc((x-r,y-r,x+r,y+r),R.randrange(25,80),R.randrange(250,330),fill=(75,213,255,max(33,154-r//7)),width=max(3,26-r//48))
        for i in range(100):
            angle=R.random()*2*pi;rad=R.randrange(80,1000)
            a=x+rad*cos(angle);b=y+rad*sin(angle);radius=R.randint(2,11)
            d.ellipse((a-radius,b-radius,a+radius,b+radius),fill=(123,237,255,R.randint(45,180)))
    elif kind=="beam":
        p=(1300,1290);q=(3440,940)
        for width,c in [(300,(57,160,255,45)),(175,(45,210,255,90)),(80,(177,244,255,200)),(32,(255,255,255,245))]:
            d.line((p[0],p[1],q[0],q[1]),fill=c,width=width,joint="curve")
        for i in range(120):
            x=R.randrange(1480,3600);y=round(p[1]+(q[1]-p[1])*(x-p[0])/(q[0]-p[0])+R.randrange(-270,270))
            x2=x+R.randint(-70,70);y2=y+R.randint(-120,120)
            d.line((x,y,x2,y2),fill=(154,235,255,R.randint(70,210)),width=R.randint(2,13))
    elif kind=="impact":
        x,y=3000,1150
        for rad in range(140,990,115):
            d.ellipse((x-rad,y-rad,x+rad,y+rad),outline=(255,239,164,max(20,190-rad//7)),width=14)
        for i in range(175):
            a=R.random()*pi*2;rr=R.randint(95,1100)
            sx=x+rr*cos(a);sy=y+rr*sin(a)
            d.line((sx,sy,sx+R.randint(30,300)*cos(a),sy+R.randint(30,300)*sin(a)),fill=(255,210,120,R.randint(45,210)),width=R.randint(3,14))
    if kind in ("charge","beam","impact"):
        blurred=fx.filter(ImageFilter.GaussianBlur(24))
        im=Image.alpha_composite(im,blurred)
    im=Image.alpha_composite(im,fx)
    if kind=="impact":
        tint=Image.new("RGBA",(W,H),(255,230,180,30))
        im=Image.alpha_composite(im,tint)
    return im.convert("RGB")

kinds={"battle":BATTLE,"dash":BATTLE,"charge":KI,"beam":KI,"impact":KI}
for kind,src in kinds.items():
    art=apply_fx(prepare(src),kind)
    p=OUT/f"{kind}-3840x2160.webp"
    art.save(p,"WEBP",quality=88,method=5)
    check=Image.open(p)
    assert check.size==(3840,2160)
    assert p.stat().st_size>60000 and max(ImageStat.Stat(check.resize((40,24))).stddev)>10, "Blank/invalid image"
    print(f"4K OK: {p} {check.size} {p.stat().st_size:,} bytes")
