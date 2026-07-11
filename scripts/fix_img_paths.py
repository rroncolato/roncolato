import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove os campos img: com caminho errado (sem /assets/)
bad_paths = [
    ",img:'IMG/site/post1-capa.jpg'",
    ",img:'IMG/site/post2-capa.jpg'",
    ",img:'IMG/site/post3-capa.jpg'",
    ",img:'IMG/site/post4-capa.jpg'",
    ",img:'IMG/site/post5-capa.jpg'",
    ",img:'IMG/site/post6-capa.jpg'",
    ",img:'IMG/site/post7-capa.jpg'",
    # sem virgula antes
    "img:'IMG/site/post1-capa.jpg',",
    "img:'IMG/site/post2-capa.jpg',",
    "img:'IMG/site/post3-capa.jpg',",
    "img:'IMG/site/post4-capa.jpg',",
    "img:'IMG/site/post5-capa.jpg',",
    "img:'IMG/site/post6-capa.jpg',",
    "img:'IMG/site/post7-capa.jpg',",
]
for bad in bad_paths:
    if bad in content:
        content = content.replace(bad, '')
        print(f'removed: {bad}')

# Verificar resultado final
matches = re.findall(r"img:'([^']+)'", content)
print('\nImg paths after fix:')
for m in matches:
    print(' ', m)

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('\ndone')
