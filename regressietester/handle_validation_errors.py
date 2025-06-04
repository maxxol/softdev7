import jsonschema


def print_topic_errors(schema, e, topic_name="tijd"):
    path_list = e.path

    match len(path_list):
        case 0:
            problem = get_problem_layer(e, None, schema)
        case 1:
            key_name = path_list[0]
            schema_key = schema["properties"][key_name]
            problem = get_problem_layer(e, key_name, schema_key)
        case _:
            problem = f"unknown problem: {e.message}"

    print(f"Topic '{topic_name}' | {problem}")


def print_topic_sensoren_id_errors(schema, e, topic_name="sensoren_rijbaan"):
    path_list = e.path

    match len(path_list):
        case 0:
            problem = get_problem_layer(e, None, schema)
        case 1:
            key_name = path_list[0]
            schema_key = schema["definitions"]["stoplicht"]
            problem = get_problem_layer(e, key_name, schema_key)
        case 2:
            key_name = path_list[1]
            schema_key = schema["definitions"]["stoplicht"]["properties"][key_name]
            problem = get_problem_layer(e, f"{path_list[0]}->{key_name}", schema_key)
        case _:
            problem = f"unknown problem: {e.message}"
    print(f"Topic '{topic_name}' | {problem}")


def print_topic_sensoren_bruggen_errors(schema, e: jsonschema.exceptions.ValidationError, topic_name="sensoren_bruggen"):
    path_list = e.path
    match len(path_list):
        case 0 | 1:
            print_topic_errors(schema, e, "sensoren_bruggen")
            return
        case 2:
            key_name = path_list[1]
            schema_key = schema["properties"][path_list[0]]["properties"][key_name]
            problem = get_problem_layer(e, f"{path_list[0]}->{key_name}", schema_key)
        case _:
            problem = f"unknown problem: {e.message}"

    print(f"Topic '{topic_name}' | {problem}")


def print_topic_voorrangsvoertuig_errors(schema, e: jsonschema.exceptions.ValidationError, topic_name="voorrangsvoertuig"):
    path_list = e.path
    match len(path_list):
        case 0:
            problem = get_problem_layer(e, None, schema)
        case 1:
            key_name = path_list[0]
            schema_key = schema["properties"][key_name]
            problem = get_problem_layer(e, key_name, schema_key)
        case 2:
            key_name = path_list[0]
            schema_key = schema["properties"][key_name]["items"]
            problem = get_problem_layer(e, key_name, schema_key)
        case 3:
            key_name = path_list[2]
            schema_key = schema["properties"][path_list[0]]["items"]["properties"][key_name]
            problem = get_problem_layer(e, f"{path_list[0]}[{path_list[1]}]->{key_name}", schema_key)
        case _:
            problem = f"unknown problem: {e.message}"

    print(f"Topic '{topic_name}' | {problem}")


def get_problem_layer(e, key_name, schema):
    if e.validator == "required":
        missing_properties_set = set(schema["required"]).difference(set(e.instance.keys()))
        problem = get_missing_prop_message(key_name, missing_properties_set)
    elif e.validator == "additionalProperties":
        to_many_properties_set = set(e.instance.keys()).symmetric_difference(
            set(schema["required"])
        )
        problem = get_add_prop_problem_message(
            key_name,
            to_many_properties_set
        )
    elif e.validator == "type":
        problem = get_type_problem_message(key_name, schema["type"])
    elif e.validator == "enum":
        problem = f"'{key_name}' must be one of the following: {schema['enum']}"
    elif e.validator == "minimum":
        problem = f"the value of 'simulatie_tijd_ms' must be higher than 0"
    else:
        problem = f"unknown problem: {e.message}"
    return problem


def get_missing_prop_message(key_name, correct_property_set):
    if key_name:
        return f"all these properties are missing: '{list(correct_property_set)}', in: {key_name}"
    else:
        return f"all these properties are missing: '{list(correct_property_set)}', in the json"


def get_add_prop_problem_message(key_name, correct_property_set):
    if key_name:
        return f"the property '{key_name}' cannot contain any additional properties, please remove the following: {list(correct_property_set)}"
    else:
        return f"the json cannot contain any additional properties, please remove the following: {list(correct_property_set)}"


def get_type_problem_message(key_name, correct_type_name):
    if key_name:
        return f"the value of '{key_name}' must be of type '{correct_type_name}'"
    else:
        return f"the json must be of type '{correct_type_name}'"