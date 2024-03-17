import json

def read_and_transform_compositores():
    cleaned_data = []  # Initialize an empty list to store composers with an 'id'
    with open("compositores.json", 'r', encoding='utf-8') as f:
        data = json.load(f)  # Load the JSON content into a Python object
        for composer in data['compositores']:  # Iterate over the list of composers
            # Check if 'id' exists for the composer
            if 'periodo' in composer:
                cleaned_data.append(composer)  # Add the composer to the cleaned list

    return cleaned_data  # Return the filtered list of composers

def read_and_transform_periodos():
    periodos_dict = {}
    with open("compositores.json", 'r', encoding='utf-8') as f:
        data = json.load(f)  # Load the JSON content into a Python object
        for composer in data['compositores']:  # Iterate over composers
            # Check if both 'id' and 'periodo' exist for the composer
            if 'id' in composer and 'periodo' in composer:
                periodo = composer['periodo']
                if periodo not in periodos_dict:
                    periodos_dict[periodo] = []
                periodos_dict[periodo].append(composer['id'])
                
    periodos_list = [{"id": periodo, "list": ids} for periodo, ids in periodos_dict.items()]

    return periodos_list


# Main execution
compositores = read_and_transform_compositores()
periodos = read_and_transform_periodos()
# Prepare the combined data structure
combined_data = {
    "compositores" : compositores,
    "periodos": periodos
}

# Write the combined data to the result file in JSON format
with open("result_file.json", "w", encoding='utf-8') as result_file:
    json.dump(combined_data, result_file, ensure_ascii=False, indent=4)
