import requests
import json
import os

# Função para ler os datasets externos
def read_datasets():
    datasets = []
    # Diretório dos datasets
    datasets_dir = "../"  # Você precisa especificar o caminho correto do diretório aqui
    # Nomes dos arquivos de datasets
    filenames = ["dataset-extra1.json", "dataset-extra2.json", "dataset-extra3.json"]
    # Percorrer os arquivos no diretório
    for filename in filenames:
        # Construir o caminho completo para o arquivo
        file_path = os.path.join(datasets_dir, filename)
        # Verificar se é um arquivo
        if os.path.isfile(file_path):
            # Ler o conteúdo do arquivo
            with open(file_path, 'r') as file:
                data = json.load(file)
                # Adicionar o conteúdo do arquivo à lista de datasets
                datasets.extend(data['pessoas'])
    return datasets

# Função para fazer pedidos à API de dados
def make_api_requests(datasets):
    api_url = "http://localhost:7777/dataset"  # Corrigido o erro de digitação aqui
    counter = 0
    counter2 = 0
    for pessoa in datasets:
        response = requests.post(api_url, json=pessoa)
        if response.status_code == 200:
            print("Dados carregados com sucesso na base de dados para a pessoa")
            counter+=1
        else:
            print("Erro ao carregar os dados na base de dados para a pessoa:", pessoa, "- Status Code:", response.status_code)
            counter2+=1
    
    print("counter 1: "+ str(counter) + " counter 2:" + str(counter2), "registos enviados para a API de dados")

# Ler os datasets externos
datasets = read_datasets()

# Fazer pedidos à API de dados para carregar as informações
make_api_requests(datasets)