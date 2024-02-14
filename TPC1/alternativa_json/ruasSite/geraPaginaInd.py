import json, os, re

f = open("../combined.json")
bd = json.load(f)
f.close()

dirFiles = os.listdir('../MapaRuas-materialBase/MapaRuas-materialBase/atual')

for r in bd:
    f = open(str(r['rua']['meta']['número']) + '.html','w')

    preHTML = f"""
    <!DOCTYPE html>
    <html>

    <head>
        <title>Ruas de Braga</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="w3.css">
        <meta charset="utf-8"/>
    </head>

    <body>

        <div class="w3-card-4">

            <header class="w3-container w3-green">
                <h3>Rua: {r['rua']['meta']['nome']}</h3>
            </header>
    """
    
    posHTML = f"""

            <footer class="w3-container w3-green">
                <h5>Generated by EMDApp::EngWeb2024::A96351</h5>
            </footer>

        </div>

    </body>

    </html>
    """
    conteudo = ""

    # Start the 'para' section
    conteudo += "<div class='w3-container'><h2>Descrição</h2>"
    for item in r['rua']['corpo']['para']:
        if isinstance(item, dict):
            text = item.get('#text', '')
            lugar = item.get('lugar', [])
            # Process each item in lugar to handle dictionaries
            lugares = []
            if isinstance(lugar, list):
                for l_item in lugar:
                    if isinstance(l_item, dict):
                        # Extracting string from dictionary; adjust 'keyName' as per your data structure
                        lugares.append(l_item.get('keyName', 'Unknown location'))
                    elif isinstance(l_item, str):
                        lugares.append(l_item)
                    else:
                        lugares.append('Unknown format')
                lugares_str = ', '.join(lugares)
            elif isinstance(lugar, str):
                lugares_str = lugar
            else:
                lugares_str = 'Unknown type for lugar'
            conteudo += f"<p>{text} {lugares_str}</p>"
        else:
            conteudo += f"<p>{item}</p>"
    conteudo += "</div>"

    conteudo += "<div class='w3-container'><h2>Lista de Casas</h2><table class='w3-table w3-striped'>"
    conteudo += "<tr><th>Número</th><th>Enfiteuta</th><th>Foro</th><th>Descrição</th></tr>"

    if 'lista-casas' in r['rua']['corpo'] and isinstance(r['rua']['corpo']['lista-casas'], dict) and 'casa' in r['rua']['corpo']['lista-casas']:
        casas = r['rua']['corpo']['lista-casas']['casa']
        # Ensure 'casas' is a list, even if it's a single dictionary
        if not isinstance(casas, list):
            casas = [casas]
        # Now iterate over 'casas', which is expected to be a list or a single dictionary
        for casa in casas:
            if isinstance(casa, dict):
                numero = casa.get('número', 'N/A')
                enfiteuta = casa.get('enfiteuta', 'N/A')
                foro = casa.get('foro', 'N/A')
                
                # Construct description text
                desc = casa.get('desc', 'N/A')
                if isinstance(desc, dict):
                    para = desc.get('para', {})
                    desc_text = para.get('#text', '') if isinstance(para, dict) else para
                    lugar = para.get('lugar', '') if isinstance(para, dict) else ''
                    if isinstance(lugar, list):
                        lugar_str = ', '.join([l.get('nome', 'Unknown') if isinstance(l, dict) else l for l in lugar])
                    elif isinstance(lugar, dict):
                        lugar_str = lugar.get('nome', 'Unknown')
                    else:
                        lugar_str = lugar
                    full_desc = f"{desc_text} {lugar_str}".strip() if desc_text or lugar_str else 'N/A'
                elif isinstance(desc, str):
                    full_desc = desc
                else:
                    full_desc = 'N/A'
                
                conteudo += f"<tr><td>{numero}</td><td>{enfiteuta}</td><td>{foro}</td><td>{full_desc}</td></tr>"
            else:
                # Handle the case where 'casa' is not a dictionary
                # You might just print a warning or handle it as you see fit
                print("Warning: Unexpected data format for 'casa'")
                
    conteudo += "</table></div>"
    imagens_antigas = []
    legendas = []
    figuras = r['rua']['corpo']['figura']
    if isinstance(figuras, dict):
        image_path = figuras['imagem']['@_path']
        legenda = figura['legenda']
        imagens_antigas.append(image_path)
        legendas.append(legenda)
    else:
        for figura in r['rua']['corpo']['figura']:
            image_path = figura['imagem']['@_path']
            legenda = figura['legenda']
            imagens_antigas.append(image_path)
            legendas.append(legenda)

    rua_index = r['rua']['meta']['número']
    rua_nome = r['rua']['meta']['nome']
    pattern = rf'^{rua_index}-.*$'
    imagens_novas = [file for file in dirFiles if re.match(pattern, file)]

    for img, legenda in zip(imagens_antigas, legendas):
        conteudo += f"""
            <div class="w3-container w3-teal">
                <h1>{rua_nome}</h1>
                <figcaption>{legenda}</figcaption>
            </div>

            <img src="{'../MapaRuas-materialBase/MapaRuas-materialBase/imagem/' + img}" alt="{legenda}" style="width:100%">  
        """

    for img, legenda in zip(imagens_novas, legendas):
        conteudo += f"""
            <div class="w3-container w3-teal">
                <h1>{rua_nome}</h1>
                <figcaption>{legenda}</figcaption>
            </div>

            <img src="{'../MapaRuas-materialBase/MapaRuas-materialBase/atual/' + img}" alt="{legenda}" style="width:100%">  
        """

    pagHTML = preHTML + conteudo + posHTML
    f.write(pagHTML)
    f.close