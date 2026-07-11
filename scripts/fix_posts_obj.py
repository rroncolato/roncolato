import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# O problema: posts fecha com }; e depois post7 fica solto
# Precisamos: remover o }; prematuro e colocar post7 dentro, depois fechar

bad = ",img:'IMG/site/post6-capa.jpg'},\n};\n\n  post7:"
good = ",img:'IMG/site/post6-capa.jpg'},\n  post7:"

if bad in content:
    content = content.replace(bad, good)
    print('Corrigido: post7 movido para dentro do objeto posts')
else:
    print('Padrao nao encontrado, verificando...')
    # Encontrar onde o objeto fecha
    idx = content.find('\n};\n\n  post7:')
    if idx > 0:
        content = content[:idx] + content[idx:].replace('\n};\n\n  post7:', ',\n  post7:', 1)
        print('Corrigido via idx')
    else:
        print('ERRO: nao encontrado')

# Verificar
idx_posts = content.find('const posts={')
idx_close = content.find('\n};', idx_posts)
section = content[idx_posts:idx_close+3]
print(f'\nposts: abre em {idx_posts}, fecha em {idx_close}')
print(f'post6 dentro: {"post6:" in section}')
print(f'post7 dentro: {"post7:" in section}')
print(f'Tamanho da secao: {len(section)} chars')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('\nSalvo!')
