import json

def read_and_transform_filmes():
    filmes = []
    with open("filmes.json", 'r', encoding='utf-8') as jsonf:
        lines = jsonf.readlines()
        for line in lines:
            try:
                filme = json.loads(line.rstrip(',\n'))
                if '_id' in filme and '$oid' in filme['_id']:
                    # Create a new dictionary with 'id' at the beginning
                    new_filme = {'id': filme['_id']['$oid']}
                    # Remove the '_id' entry from the original dictionary
                    del filme['_id']
                    # Update the new dictionary with the remaining entries of the original dictionary
                    new_filme.update(filme)
                    filme = new_filme
                filmes.append(filme)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from line: {line} - {e}")
            except Exception as e:
                print(f"Error processing filme: {e}")
    return filmes

def generate_categories(films):
    # Use a dictionary to map genre names to their lists of movie IDs
    genres_dict = {}

    for f in films:
        try:
            for g in f['genres']:
                # Append the movie ID to the genre's list in genres_dict
                if g not in genres_dict:
                    genres_dict[g] = []
                genres_dict[g].append(f["id"])
        except KeyError:
            # Skip if the film doesn't have a 'genres' key
            pass

    # Convert genres_dict to the desired output format
    genres_list = [{"id": genre, "list": ids} for genre, ids in genres_dict.items()]

    return genres_list

def generate_actors(films):
    # Initialize a dictionary to map actors to their list of movie IDs
    actors_dict = {}

    for f in films:
        # Safely try to access the 'cast' key
        try:
            for actor in f['cast']:
                # Append the movie ID to the actor's list in actors_dict
                if actor not in actors_dict:
                    actors_dict[actor] = []
                actors_dict[actor].append(f["id"])
        except KeyError:
            # Skip if the film doesn't have a 'cast' key
            pass

    # Convert actors_dict to the desired output format
    actors_list = [{"id": actor, "list": ids} for actor, ids in actors_dict.items()]

    return actors_list


# Main execution
filmes = read_and_transform_filmes()
categories = generate_categories(filmes)
actors = generate_actors(filmes)

# Prepare the combined data structure
combined_data = {
    "filmes": filmes,
    "generos": categories,
    "atores": actors
}

# Write the combined data to the result file in JSON format
with open("result_file.json", "w", encoding='utf-8') as result_file:
    json.dump(combined_data, result_file, ensure_ascii=False, indent=4)
